let url = new URL(window.location.href);
let bookId = url.searchParams.get("id");
const allBooks = JSON.parse(localStorage.getItem("books"));
const book = allBooks.find((book) => book.id == bookId);

const coverElement = document.querySelector(".image");
coverElement.src = book.image;
const titleElement = document.querySelector(".title");
titleElement.innerText = book.title;

const scoreElement = document.getElementById("score");
const reviewContentElement = document.getElementById("review-content");

document.getElementById("reviewForm").onsubmit = (event) => {
  event.preventDefault();
  const review = {
    userName: user.userName,
    score: scoreElement.value,
    reviewContent: reviewContentElement.value,
  };

  book.reviews.push(review);

  localStorage.setItem("books", JSON.stringify(allBooks));
  window.location.href = `/HTML-Pages/book-page.html?id=${book.id}`;
};
