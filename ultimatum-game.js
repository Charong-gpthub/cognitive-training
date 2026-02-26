const TOTAL_ROUNDS = 20;
const TOTAL_PIE = 10;

let offers = [];
let round = 0;
let earnings = 0;
let acceptedCount = 0;
let fairAccepted = 0;
let fairTotal = 0;
let unfairAccepted = 0;
let unfairTotal = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("ug-panel");
const resultModal = document.getElementById("result-modal");
const offerText = document.getElementById("offer-text");
const logEl = document.getElementById("log");

function shuffledOffers() {
    const base = [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 2, 3, 4, 5, 1, 6, 7, 3, 4];
    const arr = [...base];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function appendLog(text) {
    const p = document.createElement("p");
    p.textContent = text;
    logEl.prepend(p);
}

function updateBoard() {
    const rate = round === 0 ? 0 : Math.round((acceptedCount / round) * 100);
    document.getElementById("round").textContent = String(round);
    document.getElementById("earnings").textContent = String(earnings);
    document.getElementById("accept-rate").textContent = `${rate}%`;
}

function renderOffer() {
    if (round >= TOTAL_ROUNDS) {
        return;
    }
    const offer = offers[round];
    offerText.textContent = `对方给你 ${offer} / ${TOTAL_PIE}`;
}

function decide(accept) {
    if (round >= TOTAL_ROUNDS) {
        return;
    }

    const offer = offers[round];
    const fair = offer >= 4;
    if (fair) {
        fairTotal += 1;
    } else {
        unfairTotal += 1;
    }

    let gain = 0;
    if (accept) {
        gain = offer;
        earnings += gain;
        acceptedCount += 1;
        if (fair) {
            fairAccepted += 1;
        } else {
            unfairAccepted += 1;
        }
    }

    round += 1;
    appendLog(`第 ${round} 回合：提议 ${offer}/${TOTAL_PIE}，你${accept ? "接受" : "拒绝"}，收益 +${gain}`);
    updateBoard();

    if (round >= TOTAL_ROUNDS) {
        finish();
        return;
    }
    renderOffer();
}

function finish() {
    const fairRate = fairTotal === 0 ? 0 : Math.round((fairAccepted / fairTotal) * 100);
    const unfairRate = unfairTotal === 0 ? 0 : Math.round((unfairAccepted / unfairTotal) * 100);

    document.getElementById("result-earnings").textContent = String(earnings);
    document.getElementById("result-fair-rate").textContent = `${fairRate}%`;
    document.getElementById("result-unfair-rate").textContent = `${unfairRate}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "ultimatum-game",
            gameName: "最后通牒博弈",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: earnings,
            metrics: {
                rounds: TOTAL_ROUNDS,
                earnings,
                fairAcceptanceRate: fairRate,
                unfairAcceptanceRate: unfairRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    offers = shuffledOffers();
    round = 0;
    earnings = 0;
    acceptedCount = 0;
    fairAccepted = 0;
    fairTotal = 0;
    unfairAccepted = 0;
    unfairTotal = 0;
    sessionStartedAt = new Date();

    logEl.innerHTML = "";
    updateBoard();
    renderOffer();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("accept-btn").addEventListener("click", () => decide(true));
document.getElementById("reject-btn").addEventListener("click", () => decide(false));

window.startGame = startGame;
