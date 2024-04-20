let url = new URL(window.location.href);
let bookId = url.searchParams.get("id");
const allBooks = JSON.parse(localStorage.getItem("books"));
const book = allBooks.find((book) => book.id == bookId);

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
