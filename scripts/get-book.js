let url = new URL(window.location.href);
let bookId = url.searchParams.get("id");
console.log(bookId);
console.log(typeof bookId);
const allBooks = JSON.parse(localStorage.getItem("books"));
console.log(allBooks);
const book = allBooks.find((book) => book.id == bookId);
console.log(book);

let categories = "";
book.categories.forEach((category) => {
  categories += `<li>${category}</li>`;
});

const bookDetails = document.querySelector(".book-details");
const data = `
<div class="book-name-rating">
<span style="margin-left: 12px" class="book-name"><b>${book.title}</b></span><span
  style="margin-left: 28px" class="rating">Rating: ${book.rating}</span>
</div>
<div class="author">
<span style="margin-left: 12px"><b>Author : </b></span>
<span>${book.author}</span>
</div>

<div class="story-description">
<span style="margin-left: 12px"><b>Story: </b></span>

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
