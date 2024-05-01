const user = JSON.parse(sessionStorage.getItem("user"));
const link = document.getElementById("add-borrowed");
if (!user) {
  const logoLink = document.querySelector(".logo");
  const home = document.getElementById("home");
  const search = document.getElementById("search-container");
  const profile = document.querySelector(".profile-section");
  logoLink.href = "/index.html";
  home.remove();
  link.remove();
  search.remove();
  profile.remove();
} else if (user.role === "admin") {
  link.innerText = "Add Book";
  link.href = "./add-book.html";
}
