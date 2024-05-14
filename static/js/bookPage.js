document.getElementById('delete-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (window.confirm("Are you sure you want to delete this book?")) {
        event.target.submit();
    }

});