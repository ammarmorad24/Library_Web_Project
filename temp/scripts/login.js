const users = JSON.parse(localStorage.getItem("users")) || [];

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
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location.replace("/HTML-Pages/home.html");
  }

  emailElement.disabled = false;
  passwordElement.disabled = false;
  submitButton.disabled = false;
};
