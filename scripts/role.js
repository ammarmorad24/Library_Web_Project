if (sessionStorage.getItem("role") === "admin") {
  document.querySelectorAll(".user").forEach((element) => {
    element.style.display = "none";
  });
} else {
  document.querySelectorAll(".admin").forEach((element) => {
    element.style.display = "none";
  });
}
