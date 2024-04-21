const allBooks = JSON.parse(localStorage.getItem("books"));
const borrowedBooks = allBooks.filter((book) =>
  user.borrowedBooks.some((bookObj) => bookObj.id === book.id)
);

const booksContainer = document.querySelector(".borrowed-books-container");
borrowedBooks.forEach((book) => {
  let categories = "";
  book.categories.forEach((category) => {
    categories += `<li>${category}</li>`;
  });
  const deadLine = user.borrowedBooks.find(
    (borrowedBook) => borrowedBook.id === book.id
  ).date;
  const data = `
  <div class="book-card">
    <div class="book-item">
      <div class="book">
        <a href="./book-page.html?id=${book.id}">
          <img src="${book.image}" alt="book cover" />
        </a>
        <div class="book-info">
          <a href="./book-page.html?id=${book.id}">
            <h2>${book.title}</h2>
          </a>
          <p>Author: ${book.author}</p>
          <p>Rating: ${book.rating}/5</p>
          <p>Data Published: ${book["date-published"]}</p>
          <ul class="book-categories-list">
            Genre:
            ${categories}
          </ul>
        </div>
      </div>
      <div class="return">
        <button class="return-button" onclick="handleReturn(${book.id})">Return</button>
        <p>Return Deadline: ${deadLine}</p>
      </div>
    </div>
  </div>
`;
  booksContainer.innerHTML += data;
});

function handleReturn(bookId) {
  const NewborrowedBooks = user.borrowedBooks.filter(
    (borrowedBook) => borrowedBook.id !== bookId
  );
  user.borrowedBooks = NewborrowedBooks;
  sessionStorage.setItem("user", JSON.stringify(user));
  const users = JSON.parse(localStorage.getItem("users"));
  const newUser = users.find((userObj) => userObj.id === user.id);
  newUser.borrowedBooks = NewborrowedBooks;
  localStorage.setItem("users", JSON.stringify(users));
  location.reload();
}