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
const CARDBACK_PATH = './img/card_back.jpg';
const PLACEHOLDER_PATH = './img/placeholder_card.png';

const CARDFRONT_PATHS = [
    "./img/rock.webp",
    "./img/paper.jpeg",
    "./img/scissors.png",
];

let rock,
  paper,
  scissors = [1, 2, 3];

let ai_score = 0;
let player_score = 0;

shuffle_button.style.display = "none";
table.style.backgroundImage = "url('img/table.jpg')";

class Card extends HTMLElement {
  static get observedAttributes() {
    return ["src", "class"];
  }
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.img = document.createElement("img");
    this.shadow.appendChild(this.img);
    this.img.style.width = "12vw";
  }

  connectedCallback() {
    this.img.src = this.getAttribute("src") || "";
    this.img.className = this.getAttribute("class") || "";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") {
      this.img.src = newValue;
    } else if (name === "class") {
      this.img.className = newValue;
    }
  }
  get src() {
    return this.getAttribute("src");
  }

  set src(value) {
    this.setAttribute("src", value);
  }

  get className() {
    return this.getAttribute("class");
  }

  set className(value) {
    this.setAttribute("class", value);
  }
}
customElements.define("play-card", Card);

function init() {
  info_word.style.display = "none";
  get_start_button.style.display = "none";
  shuffle_button.style.display = "block";
  player_card_on_deck.appendChild(getPlaceholderCard())
  ai_card_on_deck.appendChild(getPlaceholderCard())
  get_ai_card();
  get_player_card();
}

function getPlaceholderCard() {
  const placeholder = document.createElement("play-card");
  placeholder.src = PLACEHOLDER_PATH;
  placeholder.className = "card placeholder-card";
  return placeholder
}

function get_ai_card() {
  const old_card = ai_deck.querySelectorAll("play-card");
  old_card.forEach((card) => {
    card.remove();
  });
  //   remove old cards
  for (let i = 0; i < 4; i++) {
    const card = document.createElement("play-card");
    card.src = CARDBACK_PATH;
    card.className = "card";
    ai_deck.appendChild(card);
  }
}

function get_player_card() {
  const old_card = player_deck.querySelectorAll("play-card");
  old_card.forEach((card) => {
    card.remove();
  });
  //   remove old cards
  for (let i = 0; i < 4; i++) {
    const card = document.createElement("play-card");
    let card_value = Math.floor(Math.random() * 3 + 1);
    card.src = CARDFRONT_PATHS[card_value - 1]
    card.value = card_value;
    card.id = "player_card_" + i;
    card.className = "card player-card";
    card.addEventListener('click', () => get_result(card));
    player_deck.appendChild(card);
  }
}

// full disclore: completely vibecoded this
function animateCardMove(card, targetEl){
  return new Promise(res=>{
    const start = card.getBoundingClientRect();
    const end   = targetEl.getBoundingClientRect();

    const ghost = card.cloneNode(true);
    ghost.style.position='fixed';
    ghost.style.top =  start.top  +'px';
    ghost.style.left = start.left +'px';
    ghost.style.width= start.width+'px';
    ghost.style.transition='transform .4s ease-out';
    document.body.appendChild(ghost);

    card.style.visibility='hidden';                 // hide original
    requestAnimationFrame(()=>{
      ghost.style.transform =
        `translate(${end.left-start.left}px,${end.top-start.top}px)`;
    });

    ghost.addEventListener('transitionend',()=>{
      targetEl.innerHTML='';        // clear any previous card there
      targetEl.appendChild(card);   // park real card
      card.style.visibility='visible';
      ghost.remove();
      res();
    },{once:true});
  });
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function get_result(selected_card) {
  shuffle_button.style.display = "none";
  const ai_card_value = Math.floor(Math.random() * 3 + 1);

  let player_card_value = selected_card.value;
  await animateCardMove(selected_card, player_card_on_deck);
  selected_card.remove(); // Remove the selected card from the deck
  ai_deck.removeChild(ai_deck.lastElementChild); // Remove the last card from the AI deck

  ai_card_on_deck.innerHTML = ""; // Clear previous AI card
  player_card_on_deck.innerHTML = ""; // Clear previous player card

  let player_card = document.createElement("play-card");
  player_card.src = CARDFRONT_PATHS[player_card_value - 1];
  player_card_on_deck.appendChild(player_card);
  player_card.className = "card";

  let ai_card = document.createElement("play-card");
  ai_card.src = CARDBACK_PATH
  ai_card.className = "card";
  ai_card_on_deck.appendChild(ai_card);

  // Delay the flip animation slightly so the back is visible first
  await delay(100);          // show back first
  ai_card.classList.add("flip");
  await delay(300);          // halfway through the flip
  ai_card.src = CARDFRONT_PATHS[ai_card_value - 1];
  await delay(300); 

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

  if (player_deck.querySelectorAll("play-card").length == 0) {
    gameover();
  }
}

function reset_game() {
  ai_card_on_deck.innerHTML = ""; // Clear previous AI card
  player_card_on_deck.innerHTML = ""; // Clear previous player card
  message.textContent = "Choose a card!";
  shuffle_button.style.display = "none";
  get_start_button.style.display = "block";
  let old_card = ai_deck.querySelectorAll("play-card");
  old_card.forEach((card) => {
    card.remove();
  });
  let old_card2 = player_deck.querySelectorAll("play-card");
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
// Helper to create a card element (Rock/Paper/Scissors)
function createCard(type, owner) {
    const card = document.createElement('play-card');
    card.classList.add('card');

    const src = CARDFRONT_PATHS[type];
    if(owner == 'ai') card.src = CARDBACK_PATH; // Make sure these images exist
    else {
      card.src = src
      card.classList.add('player-card')
      card.addEventListener('click', () => get_result(card));
    }
    card.alt = src;
    card.value = type+1;
    // You can add event listeners or metadata if needed
    return card;
}

function pullCard() {

    const maxHandSize = 4;
    if (player_deck.children.length >= maxHandSize) {
        player_deck.removeChild(player_deck.firstElementChild);
    }
    if (ai_deck.children.length >= maxHandSize) {
        ai_deck.removeChild(ai_deck.firstElementChild);
    }
    const playerCardType = Math.floor(Math.random() * 3);
    const aiCardType = Math.floor(Math.random() * 3);

    const playerCard = createCard(playerCardType, 'player');
    const aiCard = createCard(aiCardType, 'ai');

    playerCard.id = "player_card_"+ player_deck.children.length;
    player_deck.appendChild(playerCard);
    ai_deck.appendChild(aiCard);
    
}