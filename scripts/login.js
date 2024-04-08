document.getElementById("loginForm").onsubmit = async (event) => {
  event.preventDefault();

  const emailElement = document.getElementById("email");
  const passwordElement = document.getElementById("password");
  const errorElement = document.getElementById("error");

  emailElement.disabled = true;
  passwordElement.disabled = true;
  document.getElementById("submitButton").disabled = true;

  if (emailElement.value !== "test@test.com") {
    errorElement.innerText = "this user doesn't exist";
    errorElement.style.display = "inline-block";
  } else if (passwordElement.value !== "123456") {
    errorElement.innerText = "wrong password";
    errorElement.style.display = "inline-block";
  } else {
    sessionStorage.setItem("id", "1");
    sessionStorage.setItem("role", "ADMIN");
    window.location.href = "/index.html";
  }
  emailElement.disabled = false;
  passwordElement.disabled = false;
  document.getElementById("submitButton").disabled = false;
};
