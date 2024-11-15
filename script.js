const startButton = document.getElementById("startButton");
const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
let cards = [];
let flippedCards = [];
let matchesFound = 0;
let isBoardLocked = false;
let startTime;
let timerInterval;

// 색상 배열 (25개의 고유 색상)
const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#FFD133", "#33FFF6", "#FF5733", "#5733FF", "#33FF8A",
    "#FF3385", "#3385FF", "#A1FF33", "#FF5733", "#D133FF",
    "#FF3357", "#FF8A33", "#33A1FF", "#5733A1", "#85FF33",
    "#33FF85", "#FF33D1", "#33FFD1", "#D1FF33", "#FF3385"
];

function initializeGame() {
    message.textContent = "";
    gameBoard.innerHTML = "";
    matchesFound = 0;
    flippedCards = [];
    isBoardLocked = false;

    // 타이머 초기화 및 시작
    clearInterval(timerInterval);
    timerDisplay.textContent = "0.00초";
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 10);

    // 25개의 색상 쌍을 준비하여 50개의 카드 생성
    const colorPairs = [...colors, ...colors];
    shuffleArray(colorPairs);

    colorPairs.forEach(color => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.color = color;
        card.style.backgroundColor = "#888"; // 뒷면 색상
        card.addEventListener("click", handleCardClick);
        gameBoard.appendChild(card);
    });

    cards = document.querySelectorAll(".card");
}

function handleCardClick(event) {
    if (isBoardLocked) return;

    const card = event.target;

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
    card.style.backgroundColor = card.dataset.color;
    flippedCards.push(card);
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchesFound++;
        flippedCards = [];

        if (matchesFound === 25) {
            clearInterval(timerInterval);
            const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
            message.textContent = `축하합니다! ${elapsedTime}초가 걸렸습니다!`;
        }
    } else {
        isBoardLocked = true;
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.style.backgroundColor = "#888";
            card2.style.backgroundColor = "#888";
            flippedCards = [];
            isBoardLocked = false;
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
