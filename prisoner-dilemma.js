const TOTAL_ROUNDS = 20;

let round = 0;
let myScore = 0;
let opponentScore = 0;
let cooperateCount = 0;
let myLastChoice = "C";
let sessionStartedAt = null;

const PAYOFF = {
    CC: [3, 3],
    CD: [0, 5],
    DC: [5, 0],
    DD: [1, 1]
};

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("pd-panel");
const resultModal = document.getElementById("result-modal");
const logEl = document.getElementById("log");
const lastRow = document.getElementById("last-row");

function updateBoard() {
    document.getElementById("round").textContent = String(round);
    document.getElementById("my-score").textContent = String(myScore);
    document.getElementById("op-score").textContent = String(opponentScore);
}

function choiceLabel(choice) {
    return choice === "C" ? "合作" : "背叛";
}

function opponentChoice() {
    if (round === 0) {
        return Math.random() < 0.7 ? "C" : "D";
    }
    // Tit-for-tat + small noise, prevents trivial exploitation.
    if (Math.random() < 0.15) {
        return Math.random() < 0.5 ? "C" : "D";
    }
    return myLastChoice;
}

function appendLog(text) {
    const p = document.createElement("p");
    p.textContent = text;
    logEl.prepend(p);
}

function updateLastRow(myChoice, opChoice, myGain, opGain) {
    lastRow.innerHTML = `<tr><td>${choiceLabel(myChoice)}</td><td>${choiceLabel(opChoice)}</td><td>${myGain}</td><td>${opGain}</td></tr>`;
}

function finish() {
    const coopRate = Math.round((cooperateCount / TOTAL_ROUNDS) * 100);
    const avgPerRound = Number((myScore / TOTAL_ROUNDS).toFixed(2));

    document.getElementById("result-my").textContent = String(myScore);
    document.getElementById("result-coop-rate").textContent = `${coopRate}%`;
    document.getElementById("result-avg").textContent = String(avgPerRound);

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "prisoner-dilemma",
            gameName: "囚徒困境",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: myScore,
            metrics: {
                rounds: TOTAL_ROUNDS,
                myScore,
                opponentScore,
                cooperationRate: coopRate,
                averagePerRound: avgPerRound
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function playRound(myChoice) {
    if (round >= TOTAL_ROUNDS) {
        return;
    }
    const opChoice = opponentChoice();
    const key = `${myChoice}${opChoice}`;
    const [myGain, opGain] = PAYOFF[key];

    round += 1;
    myScore += myGain;
    opponentScore += opGain;
    if (myChoice === "C") {
        cooperateCount += 1;
    }
    myLastChoice = myChoice;

    updateLastRow(myChoice, opChoice, myGain, opGain);
    appendLog(`第 ${round} 回合：你${choiceLabel(myChoice)}，对手${choiceLabel(opChoice)}，得分 ${myGain}:${opGain}`);
    updateBoard();

    if (round >= TOTAL_ROUNDS) {
        finish();
    }
}

function startGame() {
    round = 0;
    myScore = 0;
    opponentScore = 0;
    cooperateCount = 0;
    myLastChoice = "C";
    sessionStartedAt = new Date();

    logEl.innerHTML = "";
    lastRow.innerHTML = "<tr><td>--</td><td>--</td><td>--</td><td>--</td></tr>";
    updateBoard();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("cooperate-btn").addEventListener("click", () => playRound("C"));
document.getElementById("defect-btn").addEventListener("click", () => playRound("D"));

document.addEventListener("keydown", (event) => {
    if (panel.style.display !== "block") {
        return;
    }
    const key = event.key.toLowerCase();
    if (key === "c") {
        playRound("C");
    } else if (key === "d") {
        playRound("D");
    }
});

window.startGame = startGame;
