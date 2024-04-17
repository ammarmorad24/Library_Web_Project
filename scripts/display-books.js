const books = document.querySelector(".books");

const sortByMenu = document.querySelector(".sort-by");
const categoriesMenu = document.querySelector(".category-menu");
const availabilityCheckbox = document.querySelector(".available input");

const pageNumber = document.querySelector(".page-number");
const nextButton = document.querySelector(".next-button");
const previousButton = document.querySelector(".previous-button");

const loadingSpinner = document.querySelector(".loading-spinner");

let bookCards;
let booksList;

const NONE = 0;
const FORWARD = 1;
const BACKWARD = -1;
let currentPageNumber = 1;
let pagesCount = 0;
let categoryAndAvailabilityCount = {};

const skipValue = 21;
let skip = 0;
let start = 0;
let isAvailabilityFilterOn = false;
let isCategroyFilterOn = false;


async function loadBooks() {
    const promise = await fetch("../assets/data/books.json");
    const response = promise.json();
    return response;
}
function clearBooks() {
    let children = books.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].className !== "filters"
            && children[i].className !== "next-previous-pages") {
            books.removeChild(children[i]);
            i--;
        }
    }
}
function fillWithCategories() {
    let children = categoriesMenu.children;
    for (let i = 0; i < children.length; i++) {
        categoryAndAvailabilityCount[children[i].value] = { "available-count": 0, "category-count": 0 };
    }
}
function populateCategoryAndAvailabilityCount(book) {
    categoryAndAvailabilityCount[book["category"]]["available-count"] += book["availability"];
    categoryAndAvailabilityCount[book["category"]]["category-count"]++;

    categoryAndAvailabilityCount["any-category"]["category-count"]++;
    categoryAndAvailabilityCount["any-category"]["available-count"] += book["availability"];
}
function displaySearchNotFound() {
    let notFound = document.createElement("p");
    notFound.innerHTML = "Woah...Seems you have reached the end"
    notFound.className = "not-found"
    books.appendChild(notFound);
}
function scrollUp() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}
function loadSpinner() {
    books.appendChild(loadingSpinner);
}

function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card"
    bookCard.innerHTML = `
        <a href="./book-page-admin" class="book-link">
            <div class="book">
                <img class="book-cover-image" src=${book["image"]} alt="Placeholder image" />
                <ul class="book-info">
                    <li>
                        <p>${book["title"]}</p>
                    </li> 
                    <li>
                        <p>${book["author"]}</p>
                    </li> 
                </ul>
                <p class="book-rating">rating: ${book["rating"]}/5</p>
            </div>
        <a>
    `
    return bookCard;
}

function compareByOldestDate(book1, book2) {
    if (book1["book"]["date"] > book2["book"]["date"]) {
        return -1;
    }
    return 1;
}

function compareByHighestRating(book1, book2) {
    if (book1["book"]["rating"] > book2["book"]["rating"]) {
        return -1;
    }
    return 1;
}

function compareByTitleAlphabetically(book1, book2) {
    if (book1["book"]["title"] > book2["book"]["title"]) {
        return 1;
    }
    return -1;
}



function sortBooks() {
    const sortByType = sortByMenu.value;

    switch (sortByType) {
        case "date-latest":
            bookCards.sort(compareByOldestDate);
            break;
        case "date-oldest":
            bookCards.sort((book1, book2) => -compareByOldestDate(book1, book2));
            break;
        case "rating-highest":
            bookCards.sort(compareByHighestRating);
            break;
        case "rating-lowest":
            bookCards.sort((book1, book2) => -compareByHighestRating(book1, book2));
            break;
        case "title-a-to-z":
            bookCards.sort(compareByTitleAlphabetically);
            break;
        case "title-z-to-a":
            bookCards.sort((book1, book2) => -compareByTitleAlphabetically(book1, book2));
            break;
    }
}

function enableButton(button) {
    button.style.backgroundColor = "#fae1ba";
    button.style.boxShadow = "0px 1px black";
}

function disableButton(button) {
    button.style.backgroundColor = "transparent";
    button.style.boxShadow = "none";
}

function handleButtonsAvailability() {
    if (currentPageNumber === pagesCount) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
    if (currentPageNumber === 1) {
        disableButton(previousButton);
    } else {
        enableButton(previousButton);
    }
}

function displayPageCount() {
    const selectedCategory = categoriesMenu.value;
    if (isAvailabilityFilterOn) {
        pagesCount = Math.max(Math.ceil(categoryAndAvailabilityCount[selectedCategory]["available-count"] / skipValue),
            1);
        pageNumber.innerHTML = `${currentPageNumber}/${pagesCount}`;
    } else {
        pagesCount = Math.max(Math.ceil(categoryAndAvailabilityCount[selectedCategory]["category-count"] / skipValue),
            1);
        pageNumber.innerHTML = `${currentPageNumber}/${pagesCount}`;
    }

}

function paginate(motion) {
    clearBooks();

    let bookCount = 0;
    const selectedCategory = categoriesMenu.value;
    while (start >= 0 && skip < bookCards.length) {
        const isAvailabilityMatching = isAvailabilityFilterOn === false ||
            bookCards[skip]["book"]["availability"] === true;

        const isCategroyMatching = selectedCategory === "any-category" ||
            bookCards[skip]["book"]["category"] === selectedCategory;

        if (bookCount === skipValue) {
            break;
        }

        if (motion === BACKWARD) {
            if (isAvailabilityMatching && isCategroyMatching) {
                books.prepend(bookCards[skip]["card"]);
                bookCount++;
            }
            skip--;
        } else {
            if (isAvailabilityMatching && isCategroyMatching) {
                books.appendChild(bookCards[skip]["card"]);
                bookCount++;
            }
            skip++;
        }
    }

    if (motion === BACKWARD) {
        let tmp = Math.max(skip, 0);
        skip = ++start;
        start = tmp;
    }

    if (bookCount === 0) {
        displaySearchNotFound();
    }

}

function pagination(motion) {
    if (motion === FORWARD) {
        start = skip;
        currentPageNumber++;
    }
    else if (motion === BACKWARD) {
        start--;
        currentPageNumber--;
    }

    skip = start;

    displayPageCount();

    setTimeout(() => paginate(motion), 1000);

    handleButtonsAvailability();
}

function loadingAndPagination(motion) {
    clearBooks();
    loadSpinner();
    pagination(motion);
}

async function displayBooks() {
    booksList = await loadBooks();

    fillWithCategories();

    bookCards = booksList["books"].map(function (book) {
        populateCategoryAndAvailabilityCount(book);
        return { "card": createBookCard(book), "book": book }
    });
    loadingAndPagination(NONE);
}


displayBooks();

sortByMenu.addEventListener("change", function () {
    sortBooks();
    loadingAndPagination(NONE);
});
categoriesMenu.addEventListener("change", function () {
    skip = 0;
    start = 0;
    currentPageNumber = 1;
    loadingAndPagination(NONE);
});
availabilityCheckbox.addEventListener("change", function (event) {
    const checkbox = event.target;
    if (checkbox.checked) {
        isAvailabilityFilterOn = true;
    } else {
        isAvailabilityFilterOn = false;
    }
    skip = 0;
    start = 0;
    currentPageNumber = 1;
    loadingAndPagination(NONE);
})

nextButton.addEventListener("click", function () {
    if (currentPageNumber < pagesCount) {
        scrollUp();
        loadingAndPagination(FORWARD);
    }
});
previousButton.addEventListener("click", function () {
    if (currentPageNumber !== 1) {
        scrollUp();
        loadingAndPagination(BACKWARD);
    }
});

nextButton.addEventListener("mousedown", function () {
    nextButton.style.boxShadow = "none";
})

previousButton.addEventListener("mousedown", function () {
    previousButton.style.boxShadow = "none";
})

document.documentElement.addEventListener("mouseup", function () {
    if (currentPageNumber != pagesCount) {
        nextButton.style.boxShadow = "0px 1px black";
    }
    if (currentPageNumber !== 1) {
        previousButton.style.boxShadow = "0px 1px black";
    }
})