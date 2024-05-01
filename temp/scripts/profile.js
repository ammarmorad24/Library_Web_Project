const profileElement = document.querySelector(".profile-details");

let data = `
    <h1 class="profile-header">Profile</h1>
    <div class="profile-info">
      <label for="username" class="data-titles">Username:</label>
      <p id="username" class="data">${user.userName}</p>
    </div>
    <div class="profile-info">
      <label for="email" class="data-titles">Email:</label>
      <p id="email" class="data">${user.email}</p>
    </div>
`;

if (user.role === "admin") {
  const linkElement = document.querySelector(".image-container a");
  linkElement.remove();
} else {
  data += `
    <div class="profile-info">
      <label class="data-titles" for="borrowed-books">Borrowed Books: ${user.borrowedBooks.length}</label>
    </div>`;
}

profileElement.innerHTML = data;
