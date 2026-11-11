// Store the selected elements that we are going to use.
const navbutton = document.querySelector('#hamburger-id');
const navlinks = document.querySelector('#nav-bar');


// Toggle the show class off and on
navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    navlinks.classList.toggle('show');
});

// Use of date in the footer..
const currentYear = new Date().getFullYear();
document.querySelector("#currentyear").textContent = currentYear;

const lastModified = new Date(document.lastModified);
document.querySelector("#lastModified").textContent = lastModified;

