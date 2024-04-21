let url = new URL(window.location.href);
let bookId = url.searchParams.get("id");
const allBooks = JSON.parse(localStorage.getItem("books"));
const book = allBooks.find((book) => book.id == bookId);

const borrowButton = document.getElementById("borrow-button");
const editButton = document.getElementById("edit-button");
if (user.role === "admin") {
  borrowButton.innerText = "Delete";
  borrowButton.className = "delete-button";
} else {
  editButton.remove();
  if (!book.availability) {
    borrowButton.innerText = "Unavailable";
    borrowButton.disabled = true;
    borrowButton.style.backgroundColor = "gray";
    borrowButton.style.cursor = "auto";
  }
}

const addReviewElement = document.querySelector(".add-review a");
addReviewElement.href = `/HTML-Pages/review-book.html?id=${book.id}`;

let categories = "";
book.categories.forEach((category) => {
  categories += `<li>${category}</li>`;
});

const bookDetails = document.querySelector(".book-details");
const bookCover = document.querySelector(".book-cover img");
bookCover.src = book.image;

const data = `
<div class="book-name-rating">
<span class="book-name"><b>${book.title}</b></span><span
  style="margin-left: 28px" class="rating">Rating: ${book.rating}</span>
</div>
<div class="author">
<b>Author : </b>
${book.author}
</div>

<div class="story-description">
<b>Story: </b>

<p class="story-paragraph">
    ${book.story}
</p>
</div>
<div class="category">
<p>Categories:</p>
<ul>
    ${categories}
</ul>
</div>
`;

bookDetails.innerHTML = data;

const reviewsElement = document.querySelector(".reviews");

let reviews = "";
book.reviews.forEach((review) => {
  reviews += `
    <div class="review">
        <span class="username">${review.userName}:</span>
        <span class="rating">Rating: ${review.score}/5</span>
        <p class="review-content">${review.reviewContent}</p>
    </div>
    `;
});
reviewsElement.innerHTML = reviews;

const errorElement = document.getElementById("error");
borrowButton.onclick = () => {
  if (user.role === "admin") {
    const newBooks = allBooks.filter((book) => book.id != bookId);
    localStorage.setItem("books", JSON.stringify(newBooks));
    window.location.href = "/HTML-Pages/home.html";
  } else if (user.borrowedBooks.some((bookObj) => bookObj.id === book.id)) {
    errorElement.innerText = "You already borrowed this book";
    errorElement.style.display = "inline-block";
  } else if (user.borrowedBooks.length === 5) {
    errorElement.innerText = "You can't borrow more than 5 books";
    errorElement.style.display = "inline-block";
  } else {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 30);
    const borrowedBook = {
      id: book.id,
      date: currentDate.toISOString().slice(0, 10),
    };
    user.borrowedBooks.push(borrowedBook);
    sessionStorage.setItem("user", JSON.stringify(user));
    const users = JSON.parse(localStorage.getItem("users"));
    const userObj = users.find((u) => u.id === user.id);
    userObj.borrowedBooks.push(borrowedBook);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "/HTML-Pages/borrowed-books.html";
  }
};
