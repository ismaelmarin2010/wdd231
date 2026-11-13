// HAMBURGUER MENU

// Store the selected elements that we are going to use.
const navbutton = document.querySelector('#hamburger-id');
const navlinks = document.querySelector('#nav-bar');

// Toggle the show class off and on
navbutton.addEventListener('click', () => {
    navbutton.classList.toggle('show');
    navlinks.classList.toggle('show');
});


// FOOTER

// Use of date in the footer..
const currentYear = new Date().getFullYear();
document.querySelector("#currentyear").textContent = currentYear;

const lastModified = new Date(document.lastModified);
document.querySelector("#lastModified").textContent = lastModified;


// CARDS

// const named "url" contains the URL string of the JSON resource provided.
const url = './scripts/cordoba-businesses.json';

// const named "cards" selects the HTML div element with an id value of "cards".
const cards = document.querySelector('#cards');

async function getCompaniesData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }
        const data = await response.json();
        displayCompanies(data.companies); // note that you reference the prophets array of the JSON data object, not just the object
    } catch (error) {
        console.error(error);
    }
}

getCompaniesData();

const displayCompanies = (companies) => {
    companies.forEach((company) => {
        // Create elements to add to the div.cards element
        const card = document.createElement('section'); // Create the card
        const companyName = document.createElement('h2'); // Business name
        const tagLine = document.createElement('p'); // Business tag line
        const email = document.createElement('p'); // Email
        const phone = document.createElement('p'); // Phone
        const url = document.createElement('p'); // URL
        const portrait = document.createElement('img'); // Image

        // Need to add classes to the tags for better CSS...
        tagLine.classList.add('tagline');
        email.classList.add('email');
        phone.classList.add('phone');
        url.classList.add('url');

        // Build the card content
        companyName.textContent = `${company.businessName}`;
        tagLine.textContent = `${company.businessTagLine}`;
        email.textContent = `EMAIL: ${company.email}`;
        phone.textContent = `PHONE: ${company.phone}`;
        url.textContent = `URL: ${company.url}`;

        // Build the image portrait by setting all the relevant attributes
        portrait.setAttribute('src', company.img);
        portrait.setAttribute('alt', `Portrait of ${company.businessName}`); // fill in the blank
        portrait.setAttribute('loading', 'lazy');
        portrait.setAttribute('width', '150');
        portrait.setAttribute('height', 'auto');

        // Append the section(card) with the created elements
        card.appendChild(companyName); // fill in the blank
        card.appendChild(tagLine);
        card.appendChild(email);
        card.appendChild(phone);
        card.appendChild(url);
        card.appendChild(portrait);
        cards.appendChild(card);
    }); // end of arrow function and forEach loop
}


// SORT CARDS
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");

gridButton.addEventListener("click", () => {
    cards.classList.remove("list");
});

listButton.addEventListener("click", () => {
    cards.classList.add("list");
});

