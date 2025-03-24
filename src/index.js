// Your code here
// Base URL for the API
const BASE_URL = "http://localhost:3000/characters";

// DOM Elements
const characterBar = document.getElementById("character-bar");
const detailedInfo = document.getElementById("detailed-info");
const votesForm = document.getElementById("votes-form");
const votesInput = document.getElementById("votes");
const resetButton = document.getElementById("reset-btn");
const characterForm = document.getElementById("character-form");

// Track the currently selected character
let currentCharacter = null;

// Fetch all characters and populate the character bar
function fetchCharacters() {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((characters) => {
      characters.forEach((character) => {
        const span = document.createElement("span");
        span.textContent = character.name;
        span.addEventListener("click", () => displayCharacterDetails(character));
        characterBar.appendChild(span);
      });
    });
}

// Display character details in the detailed-info div
function displayCharacterDetails(character) {
  currentCharacter = character; // Set the current character
  detailedInfo.innerHTML = `
    <h2>${character.name}</h2>
    <img src="${character.image}" alt="${character.name}">
    <p>Votes: <span id="vote-count">${character.votes}</span></p>
  `;
}

// Handle votes form submission
votesForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentCharacter) return;

  const voteCountElement = document.getElementById("vote-count");
  const additionalVotes = parseInt(votesInput.value || "0");
  const newVotes = currentCharacter.votes + additionalVotes;

  // Update the votes in the UI and on the server
  voteCountElement.textContent = newVotes;
  currentCharacter.votes = newVotes;

  fetch(`${BASE_URL}/${currentCharacter.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: newVotes }),
  });

  votesInput.value = ""; // Clear the input field
});

// Handle reset votes button click
resetButton.addEventListener("click", () => {
  if (!currentCharacter) return;

  const voteCountElement = document.getElementById("vote-count");
  voteCountElement.textContent = "0";
  currentCharacter.votes = 0;

  // Update the votes on the server
  fetch(`${BASE_URL}/${currentCharacter.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ votes: 0 }),
  });
});

// Handle new character form submission
characterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = event.target.name.value;
  const image = event.target.image.value;

  const newCharacter = {
    name,
    image,
    votes: 0,
  };

  // Add character to the server
  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCharacter),
  })
    .then((response) => response.json())
    .then((character) => {
      // Add character to the character bar
      const span = document.createElement("span");
      span.textContent = character.name;
      span.addEventListener("click", () => displayCharacterDetails(character));
      characterBar.appendChild(span);

      // Display character details immediately
      displayCharacterDetails(character);
    });

  // Clear the form
  event.target.reset();
});

// Initialize the app
fetchCharacters();



