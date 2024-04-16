const users = [
  { id: "1", userName: "ahmed", email: "user@example.com", password: "12345678", role: "user", },
  { id: "2", userName: "george", email: "admin@example.com", password: "12345678", role: "admin", },
];

const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const errorElement = document.getElementById("error");
const submitButton = document.getElementById("submitButton");

document.getElementById("loginForm").onsubmit = async (event) => {
  event.preventDefault();

  emailElement.disabled = true;
  passwordElement.disabled = true;
  submitButton.disabled = true;

  const user = users.find((user) => user.email === emailElement.value);

  if (!user) {
    errorElement.innerText = "this user doesn't exist";
    errorElement.style.display = "inline-block";
  } else if (user.password !== passwordElement.value) {
    errorElement.innerText = "wrong password";
    errorElement.style.display = "inline-block";
  } else {
    sessionStorage.setItem("id", user.id);
    sessionStorage.setItem("userName", user.userName);
    sessionStorage.setItem("role", user.role);
    wwindow.location.replace("/HTML-Pages/home.html");
  }

  emailElement.disabled = false;
  passwordElement.disabled = false;
  submitButton.disabled = false;
};
