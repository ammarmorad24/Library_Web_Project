const borrowButton = document.getElementById("borrow-button");
const editButton = document.getElementById("edit-button");
if (user.role === "admin") {
    borrowButton.innerText = "Delete";
    borrowButton.style.backgroundColor = '#d62727';
    //TODO: add a style for hover color too - #b62020
}
else {
    editButton.remove();
}
