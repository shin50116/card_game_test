const startButton = document.getElementById("startButton");
const gameBoard = document.getElementById("gameBoard");
const message = document.getElementById("message");
let cards = [];
let flippedCards = [];
let matchesFound = 0;
let isBoardLocked = false; // 새 변수 추가하여 클릭 잠금 제어

function initializeGame() {
    message.textContent = "";
    gameBoard.innerHTML = "";
    matchesFound = 0;
    flippedCards = [];
    isBoardLocked = false;

    const cardValues = Array.from({ length: 10 }, (_, i) => i + 1);
    const cardSet = [...cardValues, ...cardValues];
    shuffleArray(cardSet);

    cardSet.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;
        card.textContent = "?";
        card.addEventListener("click", handleCardClick);
        gameBoard.appendChild(card);
    });

    cards = document.querySelectorAll(".card");
}

function handleCardClick(event) {
    if (isBoardLocked) return; // 클릭 잠금이 활성화된 경우 실행 중지

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
    card.textContent = card.dataset.value;
    flippedCards.push(card);
}

function checkForMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add("matched");
        card2.classList.add("matched");
        matchesFound++;
        flippedCards = [];

        if (matchesFound === 10) {
            message.textContent = "축하합니다! 모든 카드를 맞추셨습니다!";
        }
    } else {
        isBoardLocked = true; // 매칭 실패 시 클릭 잠금 활성화
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "?";
            card2.textContent = "?";
            flippedCards = [];
            isBoardLocked = false; // 카드가 원래 상태로 돌아간 후 클릭 잠금 해제
        }, 1000);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

startButton.addEventListener("click", initializeGame);
