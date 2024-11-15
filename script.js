const startButton = document.getElementById("startButton");
const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
let cards = [];
let flippedCards = [];
let matchesFound = 0;
let isBoardLocked = true; // 초기 잠금
let startTime;
let timerInterval;

// 포켓몬 이미지 URL 배열 (10개의 포켓몬 쌍)
const pokemonImages = [
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", // Bulbasaur
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", // Charmander
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png", // Squirtle
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png", // Pikachu
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png", // Jigglypuff
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png", // Meowth
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png", // Eevee
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png", // Mewtwo
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png", // Mew
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/175.png"  // Togepi
];

function initializeGame() {
    message.textContent = "";
    gameBoard.innerHTML = "";
    matchesFound = 0;
    flippedCards = [];
    isBoardLocked = true; // 초기에는 모든 카드를 잠금
    clearInterval(timerInterval);
    timerDisplay.textContent = "0.00초";

    // 10개의 포켓몬 이미지 쌍을 준비하여 20개의 카드 생성
    const imagePairs = [...pokemonImages, ...pokemonImages];
    shuffleArray(imagePairs);

    imagePairs.forEach(imageSrc => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.image = imageSrc;

        const img = document.createElement("img");
        img.src = imageSrc;
        card.appendChild(img);

        card.classList.add("flipped"); // 초기에는 모든 카드를 뒤집어 포켓몬을 보여줌
        gameBoard.appendChild(card);

        // 클릭 이벤트 리스너 추가
        card.addEventListener("click", handleCardClick);
    });

    cards = document.querySelectorAll(".card");

    // 2초 후 모든 카드를 원래 상태로 숨기고 게임 시작
    setTimeout(() => {
        cards.forEach(card => card.classList.remove("flipped"));
        isBoardLocked = false; // 게임 시작 가능하게 잠금 해제
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);
    }, 2000);
}

function handleCardClick(event) {
    if (isBoardLocked) return; // 보드가 잠겨 있으면 클릭 불가

    const card = event.currentTarget; // 클릭된 카드 요소를 가져옴

    if (card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
    }

    flipCard(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function flipCard(card) {
    card.classList.add("flipped");
    flippedCards.push(card);
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.image === card2.dataset.image) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchesFound++;
        flippedCards = [];

        if (matchesFound === 10) {
            clearInterval(timerInterval);
            const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            message.textContent = `축하합니다! ${elapsedTime}초가 걸렸습니다!`;
        }
    } else {
        isBoardLocked = true;
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
            isBoardLocked = false; // 다시 잠금 해제
        }, 1000);
    }
}

function updateTimer() {
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timerDisplay.textContent = `${elapsedTime}초`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startButton.addEventListener("click", initializeGame);
