const books = document.querySelector(".books");

const isAdmin = document.querySelector("script[is-admin]").getAttribute("is-admin") === "True";

const sortByMenu = document.querySelector(".sort-by");
const categoriesMenu = document.querySelector(".category-menu");
const availabilityCheckbox = document.querySelector(".available input");

const pageNumber = document.querySelector(".page-number");
const nextButton = document.querySelector(".next-button");
const previousButton = document.querySelector(".previous-button");

let data = null;
let currentPageNumber = 1;
let numberOfPages = 0;

if (sessionStorage.getItem("checked") === "true") {
    availabilityCheckbox.checked = true;
}

function clearBooks() {
    let children = books.children;
    for (let i = 2; i < children.length; i++) {
        books.removeChild(children[i]);
        i--;
    }
}

const divToAddMargin = document.createElement("div");
const loadingSpinner = document.createElement("div");
loadingSpinner.className = "loading-spinner";

function loadSpinner() {
    books.appendChild(divToAddMargin);
    books.appendChild(loadingSpinner);
}

function deleteBook() {
    document.addEventListener("submit", (event) => {
        event.target = document.getElementById("delete-form");
        event.preventDefault();
        if (window.confirm("Are you sure you want to delete this book?")) {
            event.target.submit();
        }
    })
}

function createDeleteButton(book) {
    let deleteButton = "";
    if (book.isAvailable) {
        deleteButton = `<form id="delete-form" action="/delete/${book.id}" onsubmit='deleteBook()' method='DELETE'>
                            <button class="book-button delete-button">Delete</button> 
                        </form >`;
    }
    else {
        deleteButton = `<button class="book-button disabled-delete-button">Delete</button>`;
    }
    return deleteButton;
}

function createBookCard(book) {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    const deleteButton = createDeleteButton(book);
    if (!isAdmin) {
        bookCard.innerHTML = `
        <a href="/book/${book.id}" class="book-link">
            <div class="book">
                <img class="book-cover-image" src=${book.cover} alt="book cover" />
                <ul class="book-info">
                    <li>
                        <h3>${book.title}</h3>
                    </li> 
                    <li>
                        <p>${book.author}</p>
                    </li> 
                    <li>
                        <p>Date Published: ${book.datePublished}</p>
                    </li>
                </ul>
                <p class="book-rating">rating: ${book.rating}/5</p>
            </div>
        <a>
    `;
    }
    else {
        bookCard.innerHTML = `
            <div class="book">
                <ul class="book-info">
                    <li>
                        <a href="/book/${book.id}" class="book-link">
                            <h3>${book.title}</h3>
                        </a>
                    </li> 
                    <li>
                        <p>${book.author}</p>
                    </li> 
                    <li>
                        <p>${book.datePublished}</p>
                    </li>
                    <li>
                        <p class="book-rating">${book.rating}/5</p>
                    </li>
                    <li>
                        <a href="/edit-book/${book.id}">
                            <button class="book-button edit-button">Edit</button>
                        </a>
                    </li>
                    <li>
                        ${deleteButton}
                    </li>
                </ul>
            </div>
    `;
    }
    return bookCard;
}

function enableButton(button) {
    button.style.backgroundColor = "#fae1ba";
    button.style.boxShadow = "0px 1px black";
    button.disabled = false;
}

function disableButton(button) {
    button.style.backgroundColor = "transparent";
    button.style.boxShadow = "none";
    button.disabled = true;
    button.style.color = "black";
}

function handleButtonsAvailability() {
    if (currentPageNumber === numberOfPages) {
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

function displayBooks(bookList) {
    clearBooks();
    bookList.forEach(book => {
        const bookCard = createBookCard(book);
        books.appendChild(bookCard);
    });
    handleButtonsAvailability();
}

function displaySearchNotFound() {
    clearBooks();
    let notFound = document.createElement("p");
    notFound.innerHTML = "Woah...Seems you have reached the end"
    notFound.className = "not-found"
    books.appendChild(notFound);
    handleButtonsAvailability();
}

async function fetchData() {
    clearBooks();
    loadSpinner();

    const baseUrl = 'http://127.0.0.1:8000/api/books/';

    let queryString = `?ordering=${sortByMenu.value}&isAvailable=${availabilityCheckbox.checked}`;
    if (categoriesMenu.value !== "any-category") queryString += `&categories__name=${categoriesMenu.value}`;

    try {
        const response = await fetch(baseUrl + queryString);

        if (!response.ok) {
            console.log('There was a problem with the fetch operation:', response);
            return null;
        }

        data = await response.json();
        currentPageNumber = 1;
        if (data.count === 0) {
            numberOfPages = 1;
            pageNumber.innerHTML = `${currentPageNumber}/${numberOfPages}`;
            displaySearchNotFound();
            return;
        }
        numberOfPages = Math.ceil(data.count / 21);
        pageNumber.innerHTML = `${currentPageNumber}/${numberOfPages}`;
        displayBooks(data.results);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

fetchData();

sortByMenu.addEventListener("change", function () {
    fetchData();
});

categoriesMenu.addEventListener("change", function () {
    fetchData();
});

availabilityCheckbox.addEventListener("change", function () {
    sessionStorage.setItem("checked", availabilityCheckbox.checked);
    fetchData();
})

async function handleNextPrev(motion) {
    clearBooks();
    loadSpinner();
    if (motion === 1) {
        data = await fetch(data.next).then(response => response.json());
    }
    else {
        data = await fetch(data.previous).then(response => response.json());
    }
    currentPageNumber += motion;
    pageNumber.innerHTML = `${currentPageNumber}/${numberOfPages}`;
    displayBooks(data.results);
}

nextButton.addEventListener("click", function () {
    handleNextPrev(1);
});

previousButton.addEventListener("click", function () {
    handleNextPrev(-1);
});

nextButton.addEventListener("mousedown", function () {
    nextButton.style.boxShadow = "none";
})

previousButton.addEventListener("mousedown", function () {
    previousButton.style.boxShadow = "none";
})

document.documentElement.addEventListener("mouseup", function () {
    if (currentPageNumber != numberOfPages) {
        nextButton.style.boxShadow = "0px 1px black";
    }
    if (currentPageNumber !== 1) {
        previousButton.style.boxShadow = "0px 1px black";
    }
})

