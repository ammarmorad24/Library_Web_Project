const borrowButton = document.getElementById("borrow-button");
const editButton = document.getElementById("edit-button");
if (user.role === "admin") {
    borrowButton.innerText = "Delete";
    borrowButton.style.backgroundColor = '#d62727'; // Red color
    borrowButton.style.transition = "background-color 0.3s ease"; // Smooth transition
    borrowButton.addEventListener("mouseenter", function() {
        // Change background color on hover
        borrowButton.style.backgroundColor = '#b62020'; // Darker red on hover
    });
    borrowButton.addEventListener("mouseleave", function() {
        // Revert background color on mouse leave
        borrowButton.style.backgroundColor = '#d62727'; // Original red color
    });
} else {
    editButton.remove();
}

//TODO: retrieve reviews from the database and display them on the page
