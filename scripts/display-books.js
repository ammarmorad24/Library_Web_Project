const booksList = document.querySelector(".books");
const sortByMenu = document.querySelector(".sort-by");
const categoriesMenu = document.querySelector(".category-menu");
const availabilityCheckbox = document.querySelector(".available input");
const searchBar = document.querySelector(".search-bar");
const searchForm = document.getElementsByTagName("form")[0];
const pageNumber = document.querySelector(".page-number");
const nextButton = document.querySelector(".next-button");
const previousButton = document.querySelector(".previous-button");

let bookCards;
let books;

const NONE = 0;
const FORWARD = 1;
const BACKWARD = -1;
let currentPageNumber = 1;
let pagesCount = 0;
let categoryAndAvailabilityCount = {};

const skipValue = 20;
let skip = 0;
let lastViewableBookPosition = 0;
let isAvailabilityFilterOn = false;
let isCategroyFilterOn = false;


async function loadBooks() {
    const promise = await fetch("../assets/data/books.json");
    const response = promise.json();
    return response;
}
function clearBooks() {
    let children = booksList.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].className === "book-card") {
            booksList.removeChild(children[i]);
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
        return 1;
    }
    return -1;
}

function compareByTitleAlphabetically(book1, book2) {
    if (book1["book"]["title"] > book2["book"]["title2"]) {
        return -1;
    }
    return 1;
}



async function displaySortedBooks() {
    const processedBookCards = await bookCards;
    const sortByType = sortByMenu.value;

    switch (sortByType) {
        case "date-latest":
            processedBookCards.sort(compareByOldestDate);
            break;
        case "date-oldest":
            processedBookCards.sort((book1, book2) => -compareByOldestDate(book1, book2));
            break;
        case "rating-highest":
            processedBookCards.sort(compareByHighestRating);
            break;
        case "rating-lowest":
            processedBookCards.sort((book1, book2) => -compareByHighestRating(book1, book2));
            break;
        case "title-a-to-z":
            processedBookCards.sort(compareByTitleAlphabetically);
            break;
        case "title-z-to-a":
            processedBookCards.sort((book1, book2) => -compareByTitleAlphabetically(book1, book2));
            break;
    }
    processedBookCards.forEach(processedBookCard => booksList.prepend(processedBookCard["card"]));
}

function addBooksBasedOnCategory(processedBookCards, selectedCategory) {
    for (let processedBookCard of processedBookCards) {
        if (processedBookCard["book"]["category"] !== selectedCategory) {
            booksList.removeChild(processedBookCard["card"]);
        }
    }
}


async function displayBasedOnCategory() {
    const processedBookCards = await bookCards;
    const selectedCategory = categoriesMenu.value;

    if (selectedCategory === "any-category") {
        processedBookCards.forEach(processedBookCard => booksList.prepend(processedBookCard["card"]));
    } else {
        addBooksBasedOnCategory(processedBookCards, selectedCategory);
    }
}

function addBooksBasedOnAvailability(processedBookCards) {
    for (let processedBookCard of processedBookCards) {
        if (processedBookCard["book"]["availability"] === false) {
            booksList.removeChild(processedBookCard["card"]);
        }
    }
}

async function displayBasedOnAvailability(isChecked) {
    const processedBookCards = await bookCards;

    if (isChecked === false) {
        processedBookCards.forEach(processedBookCard => booksList.prepend(processedBookCard["card"]));
    } else {
        addBooksBasedOnAvailability(processedBookCards);
    }
}


async function displayBooks() {
    books = await loadBooks();

    fillWithCategories();

    bookCards = books["books"].map(function (book) {
        populateCategoryAndAvailabilityCount(book);
        return { "card": createBookCard(book), "book": book }
    });
    pagination(NONE);
}

function enableButton(button) {
    button.style.backgroundColor = "#fae1ba";
    button.style.boxShadow = "0px 1px black";
}

function disableButton(button) {
    button.style.backgroundColor = "transparent";
    button.style.boxShadow = "none";
}
function pagination(motion) {
    clearBooks();

    if (motion === FORWARD) {
        skip = Math.min(skip + skipValue, bookCards.length);
        currentPageNumber++;
    }
    else if (motion === BACKWARD) {
        skip = Math.max(skip - skipValue, 0);
        currentPageNumber--;
    }

    lastViewableBookPosition = Math.min(skipValue + skip, bookCards.length);
    const selectedCategory = categoriesMenu.value;

    let start = skip;
    if (isAvailabilityFilterOn) {
        pagesCount = Math.max(Math.ceil(categoryAndAvailabilityCount[selectedCategory]["available-count"] / skipValue),
            1);
        pageNumber.innerHTML = `${currentPageNumber}/${pagesCount}`;
    } else {
        pagesCount = Math.max(Math.ceil(categoryAndAvailabilityCount[selectedCategory]["category-count"] / skipValue),
            1);
        pageNumber.innerHTML = `${currentPageNumber}/${pagesCount}`;
    }
    while (start < lastViewableBookPosition) {
        const isAvailabilityMatching = isAvailabilityFilterOn === false ||
            bookCards[start]["book"]["availability"] === true;

        const isCategroyMatching = selectedCategory === "any-category" ||
            bookCards[start]["book"]["category"] === selectedCategory;

        if (isAvailabilityMatching && isCategroyMatching) {
            booksList.appendChild(bookCards[start]["card"]);
        }
        start++;
    }

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


displayBooks();
sortByMenu.addEventListener("change", displaySortedBooks);
categoriesMenu.addEventListener("change", function () {
    skip = 0;
    currentPageNumber = 1;
    pagination(NONE);
});
availabilityCheckbox.addEventListener("change", function (event) {
    const checkbox = event.target;
    if (checkbox.checked) {
        isAvailabilityFilterOn = true;
    } else {
        isAvailabilityFilterOn = false;
    }
    skip = 0;
    currentPageNumber = 1;
    pagination(NONE);
})

nextButton.addEventListener("mousedown", function() {
    nextButton.style.boxShadow = "none";
})

previousButton.addEventListener("mousedown", function() {
    previousButton.style.boxShadow = "none";
})

document.documentElement.addEventListener("mouseup", function() {
    if(currentPageNumber != pagesCount){
        nextButton.style.boxShadow = "0px 1px black";
    }
    if(currentPageNumber !== 1) {
        previousButton.style.boxShadow = "0px 1px black";
    }
})

searchForm.addEventListener("submit", function () {
    searchBar.value = searchBar.value.trim().replace(/\s+/g, " ");
})
