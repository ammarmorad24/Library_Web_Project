const searchBar = document.querySelector(".search-bar");
const searchForm = document.getElementsByTagName("form")[0];

searchForm.addEventListener("submit", function () {
    searchBar.value = searchBar.value.trim().replace(/\s+/g, " ");
})