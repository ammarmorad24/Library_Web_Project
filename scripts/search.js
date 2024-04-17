const books = document.querySelector(".books");

const searchButton = document.querySelector(".fa-magnifying-glass")
const searchBar = document.querySelector(".search-bar");

const nextButton = document.querySelector(".next-button");
const previousButton = document.querySelector(".previous-button");
const pageNumber = document.querySelector(".page-number");

const sortByMenu = document.querySelector(".sort-by");
const categoriesMenu = document.querySelector(".category-menu");
const availabilityCheckbox = document.querySelector(".available input");

const NONE = 0;
const FORWARD = 1;
const BACKWARD = -1;
let currentPageNumber = 1;
let pagesCount = 0;
let categoryAndAvailabilityCount = {};

const loadingSpinner = document.querySelector(".loading-spinner");


const skipValue = 10;
let skip = 0;
let start = 0;
let lastViewableBookPosition = 0;

let isAvailabilityFilterOn = false;
let isCategroyFilterOn = false;


let bookList;
let bookCards;

let searchQuery = new URLSearchParams(window.location.search.toString());
searchBar.value = searchQuery.get("q");

async function loadBooksData() {
    const promise = await fetch("../assets/data/books.json");
    const response = promise.json();
    return response;
}
async function loadBooks() {
    const booksData = await loadBooksData();
    bookList = booksData["books"];
}
function clearBooks() {
    let children = books.children;
    for (let i = 0; i < children.length; i++) {
        if (children[i].className !== "filters" && children[i].className !== "next-previous-pages") {
            books.removeChild(children[i]);
            i--;
        }
    }
}
function displaySearchNotFound() {
    let notFound = document.createElement("p");
    notFound.innerHTML = "Oops... We don't seem to have your book"
    notFound.className = "not-found"
    books.appendChild(notFound);
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
function scrollUp() {
    document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}
function loadSpinner() {
    books.appendChild(loadingSpinner);
}

function compareByOldestDate(book1, book2) {
    if (book1["book"]["date"] > book2["book"]["date"]) {
        return 1;
    }
    return -1;
}
function getTrimmedQuery() {
    let newQuery = searchBar.value.toLowerCase();
    newQuery = newQuery.trim().replace(/ +(?= )/g, '');
    searchBar.value = newQuery;
    return newQuery;
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



async function sortBooks() {
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


function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.innerHTML = `
            <div class="book-item">
                <div class="book">
                    <img src=${book["image"]} alt="book cover" />
                    <div class="book-info">
                        <h2>${book["title"]}</h2>
                        <p>Author: ${book["author"]}</p>
                        <p>rating: ${book["rating"]}/5</p>
                    </div>
                </div>
                <button class="quick-borrow-button">Borrow</button>
            </div>
    `;
    return bookCard;
}

function search(newQuery) {
    let searchResultsList = [];

    let isValidSearch = newQuery !== null && newQuery !== '';
    if (isValidSearch) {
        searchQuery = newQuery;
        let pattern = new RegExp(`${newQuery}+`);
        for (let book of bookList) {
            if (book["title"].match(pattern) || book["author"].match(pattern)) {
                searchResultsList.push(book);
            }
        }
    }
    return searchResultsList;
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


function displaySearchResults(newQuery) {
    let searchResultsList = search(newQuery);
    fillWithCategories();
    bookCards = searchResultsList.map(function (book) {
        populateCategoryAndAvailabilityCount(book);

        return { "card": createBookCard(book), "book": book }
    });
    loadingAndPagination(NONE);
}

function changeURLWithNewQuery(newQuery) {
    let url = new URL(window.location.href);
    url.searchParams.set("q", newQuery);
    window.history.pushState(null, '', url.href);
}


async function initialSearchResultsDisplay() {
    await loadBooks();
    displaySearchResults(searchBar.value);
}

function startSearch() {
    let newQuery = getTrimmedQuery();

    changeURLWithNewQuery(newQuery);

    start = 0;
    skip = 0;
    currentPageNumber = 1;
    displaySearchResults(newQuery);
}

initialSearchResultsDisplay();


searchButton.addEventListener("click", function () {
    startSearch();
});

searchBar.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        startSearch();
    }
})

sortByMenu.addEventListener("change", function () {
    sortBooks();
    loadingAndPagination(NONE);
});
categoriesMenu.addEventListener("change", function () {
    start = 0;
    skip = 0;
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
    start = 0;
    skip = 0;
    currentPageNumber = 1;
    loadingAndPagination(NONE);
})

nextButton.addEventListener("click", function () {
    if (currentPageNumber < pagesCount) {
        scrollUp();
        loadingAndPagination(FORWARD);
    }
});
nextButton.addEventListener("mousedown", function () {
    nextButton.style.boxShadow = "none";
})

previousButton.addEventListener("click", function () {
    if (currentPageNumber !== 1) {
        scrollUp();
        loadingAndPagination(BACKWARD);
    }
});
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


window.addEventListener("popstate", function () {
    let url = new URL(window.location.href);
    let previousQuery = url.searchParams.get("q");

    start = 0;
    skip = 0;
    currentPageNumber = 1;
    searchBar.value = previousQuery;
    displaySearchResults(previousQuery);
});
