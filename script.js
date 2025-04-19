const play_button = document.getElementById("play");
const player_selected = document.getElementById("player_choice");
const ai_deck = document.getElementById("ai_deck");
const player_deck = document.getElementById("player_deck");
const table = document.getElementById("table");
const message = document.getElementById("status_message");
const ai_score_container = document.getElementById("ai_score");
const player_score_container = document.getElementById("player_score");
const reset_button = document.getElementById("reset_button");
const get_start_button = document.getElementById("get_start");
const info_word = document.getElementById("info");
const shuffle_button = document.getElementById("shuffle");
const player_card_on_deck = document.getElementById("player_card");
const ai_card_on_deck = document.getElementById("ai_card");

let rock,
  paper,
  scissors = [1, 2, 3];

let ai_score = 0;
let player_score = 0;

shuffle_button.style.display = "none";
table.style.backgroundImage = "url('img/table.jpg')";

function init() {
  info_word.style.display = "none";
  get_start_button.style.display = "none";
  shuffle_button.style.display = "block";
  get_ai_card();
  get_player_card();
}

function get_ai_card() {
  const old_card = ai_deck.querySelectorAll("img");
  old_card.forEach((card) => {
    card.remove();
  });
  //   remove old cards
  for (let i = 0; i < 4; i++) {
    const card = document.createElement("img");
    card.src = "img/card_back.jpg";
    card.className = "card";
    ai_deck.appendChild(card);
  }
}

function get_player_card() {
  const old_card = player_deck.querySelectorAll("img");
  old_card.forEach((card) => {
    card.remove();
  });
  //   remove old cards
  for (let i = 0; i < 4; i++) {
    const card = document.createElement("img");
    let card_value = Math.floor(Math.random() * 3 + 1);
    if (card_value == 1) {
      card.src = "img/rock.webp";
    }
    if (card_value == 2) {
      card.src = "img/paper.jpeg";
    }
    if (card_value == 3) {
      card.src = "img/scissors.png";
    }
    card.value = card_value;
    card.id = "player_card_" + i;
    card.className = "card";
    player_deck.appendChild(card);
  }
}
function get_result() {
  if (player_deck.querySelectorAll("img").length == 0) {
    gameover();
    return;
  }
  shuffle_button.style.display = "none";
  const ai_card_value = Math.floor(Math.random() * 3 + 1);

  let selected_card =
    player_deck.querySelectorAll("img")[player_selected.value - 1];
  let player_card_value = selected_card.value;
  selected_card.remove(); // Remove the selected card from the deck
  ai_deck.removeChild(ai_deck.lastChild); // Remove the last card from the AI deck

  ai_card_on_deck.innerHTML = ""; // Clear previous AI card
  player_card_on_deck.innerHTML = ""; // Clear previous player card

  let ai_card = document.createElement("img");
  ai_card.src = "img/card_back.jpg";
  ai_card.className = "card";
  ai_card_on_deck.appendChild(ai_card);

  // Delay the flip animation slightly so the back is visible first
  setTimeout(() => {
    ai_card.classList.add("flip");

    // Change the image midway through the flip
    setTimeout(() => {
      if (ai_card_value == 1) {
        ai_card.src = "img/rock.webp";
      } else if (ai_card_value == 2) {
        ai_card.src = "img/paper.jpeg";
      } else if (ai_card_value == 3) {
        ai_card.src = "img/scissors.png";
      }
    }, 300); // Halfway point of the flip animation
  }, 100); // Initial delay to show the back

  let player_card = document.createElement("img");
  if (player_card_value == 1) {
    player_card.src = "img/rock.webp";
  } else if (player_card_value == 2) {
    player_card.src = "img/paper.jpeg";
  } else if (player_card_value == 3) {
    player_card.src = "img/scissors.png";
  }
  player_card_on_deck.appendChild(player_card);
  player_card.className = "card";

  if (ai_card_value == player_card_value) {
    message.textContent = "It's a tie!";
  } else if (ai_card_value > player_card_value) {
    message.textContent = "AI wins!";
    ai_score++;
  } else if (ai_card_value == 1 && player_card_value == 3) {
    message.textContent = "AI wins!";
    ai_score++;
  } else if (player_card_value > ai_card_value) {
    message.textContent = "player wins!";
    player_score++;
  } else if (player_card_value == 1 && ai_card_value == 3) {
    message.textContent = "player wins!";
    player_score++;
  }

  ai_score_container.textContent = "AI Score: " + ai_score;
  player_score_container.textContent = "Player Score: " + player_score;
}

function reset_game() {
  ai_card_on_deck.innerHTML = ""; // Clear previous AI card
  player_card_on_deck.innerHTML = ""; // Clear previous player card
  message.textContent = "Choose a card!";
  shuffle_button.style.display = "none";
  get_start_button.style.display = "block";
  let old_card = ai_deck.querySelectorAll("img");
  old_card.forEach((card) => {
    card.remove();
  });
  let old_card2 = player_deck.querySelectorAll("img");
  old_card2.forEach((card) => {
    card.remove();
  });
  ai_score = 0;
  player_score = 0;
  ai_score_container.textContent = "AI Score: " + ai_score;
  player_score_container.textContent = "Player Score: " + player_score;
}

function gameover() {
  if (player_score > ai_score) {
    alert("Player wins the game!");
  } else if (player_score < ai_score) {
    alert("AI wins the game!");
  } else {
    alert("It's a tie!");
  }
}
