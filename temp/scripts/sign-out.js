const signOutButton = document.getElementById("sign-out");
signOutButton.onclick = () => {
  sessionStorage.removeItem("user");
};
