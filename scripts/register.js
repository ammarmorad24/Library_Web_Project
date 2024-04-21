const userNameElement = document.getElementById("userName");
const ageElement = document.getElementById("age");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const confirmPasswordElement = document.getElementById("confirmPassword");
const roleElement = document.getElementById("role");
const submitButton = document.getElementById("submitButton");
const errorElement = document.getElementById("error");

document.getElementById("registerForm").onsubmit = async (event) => {
  event.preventDefault();

  userNameElement.disabled = true;
  ageElement.disabled = true;
  emailElement.disabled = true;
  passwordElement.disabled = true;
  confirmPasswordElement.disabled = true;
  roleElement.disabled = true;
  submitButton.disabled = true;

  const age = Number(ageElement.value);
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const existingUser = users.find((user) => user.email === emailElement.value);

  if (age === NaN || !Number.isInteger(age) || age < 4) {
    errorElement.innerText = "age is invalid";
    errorElement.style.display = "inline-block";
  } else if (existingUser) {
    errorElement.innerText = "user already exists";
    errorElement.style.display = "inline-block";
  } else if (passwordElement.value !== confirmPasswordElement.value) {
    errorElement.innerText = "passwords don't match";
    errorElement.style.display = "inline-block";
  } else {
    let users = [];
    if (localStorage.getItem("users")) {
      users = JSON.parse(localStorage.getItem("users"));
    }
    const user = {
      id: users.length + 1,
      userName: userNameElement.value,
      age: age,
      email: emailElement.value,
      password: passwordElement.value,
      role: roleElement.value,
      borrowedBooks: [],
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    sessionStorage.setItem("user", JSON.stringify(user));
    window.location.replace("/HTML-Pages/home.html");
  }

  userNameElement.disabled = false;
  ageElement.disabled = false;
  emailElement.disabled = false;
  passwordElement.disabled = false;
  confirmPasswordElement.disabled = false;
  roleElement.disabled = false;
  submitButton.disabled = false;
};
