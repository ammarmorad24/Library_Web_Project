const link = document.getElementById("add-borrowed");
if (user.role === "admin") {
  link.innerText = "Add Book";
  link.href = "./add-book.html";
}
