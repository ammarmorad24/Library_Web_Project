const allBooks = JSON.parse(localStorage.getItem("books"));
const newId = allBooks.reduce((max, book) => Math.max(max, book.id), 0) + 1;

const normalInputs = document.querySelectorAll(".normal-input");

document.getElementById("add-book-form").onsubmit = (event) => {
  event.preventDefault();
  const book = { id: newId };
  normalInputs.forEach((input) => {
    book[input.name] = input.value;
  });
  book.story = document.querySelector(".book-desc").value;
  book.image = "https://placehold.co/100x150";
  book.availability = true;
  book.reviews = [];
  book["date-added"] = Date.now();
  const categoryElments = document.querySelectorAll(
    'input[name="options"]:checked'
  );
  let categories = [];
  categoryElments.forEach((category) => {
    categories.push(category.value);
  });
  book.categories = categories;
  allBooks.push(book);
  localStorage.setItem("books", JSON.stringify(allBooks));
  window.location.href = "/HTML-Pages/home.html";
};
