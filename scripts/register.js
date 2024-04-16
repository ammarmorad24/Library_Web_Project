const userNameElement = document.getElementById("userName");
const ageElement = document.getElementById("age");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const roleElement = document.getElementById("role");
const submitButton = document.getElementById("submitButton");

document.getElementById("registerForm").onsubmit = async (event) => {
  event.preventDefault();

  userNameElement.disabled = true;
  ageElement.disabled = true;
  emailElement.disabled = true;
  passwordElement.disabled = true;
  roleElement.disabled = true;
  submitButton.disabled = true;

  sessionStorage.setItem("id", "1");
  sessionStorage.setItem("userName", userNameElement.value);
  sessionStorage.setItem("role", roleElement.value);
  window.location.replace("/HTML-Pages/home.html");

  userNameElement.disabled = false;
  ageElement.disabled = false;
  emailElement.disabled = false;
  passwordElement.disabled = false;
  roleElement.disabled = false;
  submitButton.disabled = false;
};
