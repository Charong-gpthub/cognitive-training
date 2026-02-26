const TOTAL_ROUNDS = 20;
const ENDOWMENT = 10;

let round = 0;
let totalEarnings = 0;
let totalInvest = 0;
let totalReturned = 0;
let returnRateState = 0.42;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("tg-panel");
const resultModal = document.getElementById("result-modal");
const investInput = document.getElementById("invest-input");
const investValue = document.getElementById("invest-value");
const feedback = document.getElementById("feedback");
const logEl = document.getElementById("log");

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function nextReturnRate(invest) {
    const trustDrift = invest >= 6 ? 0.04 : -0.02;
    const noise = (Math.random() - 0.5) * 0.16;
    returnRateState = clamp(returnRateState + trustDrift + noise, 0.15, 0.75);
    return returnRateState;
}

function updateBoard() {
    const avgInvest = round === 0 ? 0 : (totalInvest / round).toFixed(1);
    document.getElementById("round").textContent = String(round);
    document.getElementById("total").textContent = String(totalEarnings);
    document.getElementById("avg-invest").textContent = String(avgInvest);
}

function appendLog(text) {
    const p = document.createElement("p");
    p.textContent = text;
    logEl.prepend(p);
}

function playRound() {
    if (round >= TOTAL_ROUNDS) {
        return;
    }

    const invest = Number(investInput.value);
    const multiplied = invest * 3;
    const rate = nextReturnRate(invest);
    const returned = Math.round(multiplied * rate);
    const gain = (ENDOWMENT - invest) + returned;

    round += 1;
    totalInvest += invest;
    totalReturned += returned;
    totalEarnings += gain;

    feedback.textContent = `投入 ${invest}，对方返还 ${returned}，本轮收益 ${gain}`;
    appendLog(`第 ${round} 回合：投入 ${invest} -> 变为 ${multiplied} -> 返还 ${returned}，收益 ${gain}`);
    updateBoard();

    if (round >= TOTAL_ROUNDS) {
        finish();
    }
}

function finish() {
    const avgInvest = (totalInvest / TOTAL_ROUNDS).toFixed(1);
    const returnRate = totalInvest === 0
        ? 0
        : Math.round((totalReturned / (totalInvest * 3)) * 100);

    document.getElementById("result-total").textContent = String(totalEarnings);
    document.getElementById("result-invest").textContent = String(avgInvest);
    document.getElementById("result-return-rate").textContent = `${returnRate}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "trust-game",
            gameName: "信任博弈",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: totalEarnings,
            metrics: {
                rounds: TOTAL_ROUNDS,
                totalEarnings,
                avgInvestment: Number(avgInvest),
                averageReturnRate: returnRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    round = 0;
    totalEarnings = 0;
    totalInvest = 0;
    totalReturned = 0;
    returnRateState = 0.42;
    sessionStartedAt = new Date();

    logEl.innerHTML = "";
    feedback.textContent = "调整滑杆后点击确认投入。";
    investInput.value = "5";
    investValue.textContent = "5";
    updateBoard();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

investInput.addEventListener("input", () => {
    investValue.textContent = investInput.value;
});
document.getElementById("invest-btn").addEventListener("click", playRound);

window.startGame = startGame;
