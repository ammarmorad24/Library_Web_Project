let url = new URL(window.location.href);
let bookId = url.searchParams.get("id");
const allBooks = JSON.parse(localStorage.getItem("books"));
const book = allBooks.find((book) => book.id == bookId);

const normalInputs = document.querySelectorAll(".normal-input");
const storyInput = document.querySelector(".book-desc");
normalInputs.forEach((input) => {
  input.value = book[input.name];
});
storyInput.value = book.story;

document.getElementById("add-book-form").onsubmit = (event) => {
  event.preventDefault();
  normalInputs.forEach((input) => {
    book[input.name] = input.value;
  });
  book.story = storyInput.value;
  const categoryElments = document.querySelectorAll(
    'input[name="options"]:checked'
  );
  let categories = [];
  categoryElments.forEach((category) => {
    categories.push(category.value);
  });
  book.categories = categories;
  const reader = new FileReader();
  reader.onload = () => {
      const imageUrl = reader.result;
      book.image = imageUrl;
      localStorage.setItem("books", JSON.stringify(allBooks));
      window.location.href = `/HTML-Pages/book-page.html?id=${book.id}`;
  };
  reader.readAsDataURL(document.getElementById("book-cover-input").files[0]);
};
