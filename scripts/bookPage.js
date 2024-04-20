const borrowButton = document.getElementById("borrow-button");
const editButton = document.getElementById("edit-button");
if (user.role === "admin") {
    borrowButton.innerText = "Delete";
    borrowButton.className = "delete-button";
} else {
    editButton.remove();
}

//TODO: retrieve reviews from the database and display them on the page
