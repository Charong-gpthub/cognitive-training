const TOTAL_TRIALS = 60;
const INITIAL_BALANCE = 2000;

const DECK_TEMPLATE = {
    A: { gain: 100, losses: [0, -150, 0, -300, -200, 0, -250, 0, -350, -200], advantageous: false },
    B: { gain: 100, losses: [0, 0, 0, -1250, 0, 0, 0, 0, 0, 0], advantageous: false },
    C: { gain: 50, losses: [0, -25, -50, 0, -75, 0, -25, -50, 0, -75], advantageous: true },
    D: { gain: 50, losses: [0, 0, -250, 0, 0, 0, -250, 0, 0, 0], advantageous: true }
};

let trial = 0;
let balance = INITIAL_BALANCE;
let advantageousChoices = 0;
let sessionStartedAt = null;
let deckState = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("igt-panel");
const resultModal = document.getElementById("result-modal");
const feedback = document.getElementById("feedback");
const logEl = document.getElementById("log");

function cloneDeckState() {
    const state = {};
    Object.keys(DECK_TEMPLATE).forEach((key) => {
        state[key] = {
            gain: DECK_TEMPLATE[key].gain,
            losses: [...DECK_TEMPLATE[key].losses],
            advantageous: DECK_TEMPLATE[key].advantageous,
            index: 0
        };
    });
    return state;
}

function updateBoard() {
    const advRate = trial === 0 ? 0 : Math.round((advantageousChoices / trial) * 100);
    document.getElementById("trial").textContent = String(trial);
    document.getElementById("balance").textContent = String(balance);
    document.getElementById("adv-rate").textContent = `${advRate}%`;
}

function appendLog(text) {
    const p = document.createElement("p");
    p.textContent = text;
    logEl.prepend(p);
}

function chooseDeck(name) {
    if (trial >= TOTAL_TRIALS) {
        return;
    }

    const deck = deckState[name];
    const loss = deck.losses[deck.index % deck.losses.length];
    const delta = deck.gain + loss;
    deck.index += 1;

    trial += 1;
    balance += delta;
    if (deck.advantageous) {
        advantageousChoices += 1;
    }

    const deltaText = delta >= 0 ? `+${delta}` : String(delta);
    feedback.textContent = `选择牌堆 ${name}，本轮变化 ${deltaText}`;
    appendLog(`第 ${trial} 轮：${name} 堆 -> ${deltaText}，余额 ${balance}`);
    updateBoard();

    if (trial >= TOTAL_TRIALS) {
        finish();
    }
}

function finish() {
    const net = balance - INITIAL_BALANCE;
    const advRate = Math.round((advantageousChoices / TOTAL_TRIALS) * 100);

    document.getElementById("result-balance").textContent = String(balance);
    document.getElementById("result-net").textContent = net >= 0 ? `+${net}` : String(net);
    document.getElementById("result-adv-rate").textContent = `${advRate}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "iowa-gambling",
            gameName: "爱荷华赌博任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: balance,
            metrics: {
                totalTrials: TOTAL_TRIALS,
                finalBalance: balance,
                netChange: net,
                advantageousRate: advRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    trial = 0;
    balance = INITIAL_BALANCE;
    advantageousChoices = 0;
    sessionStartedAt = new Date();
    deckState = cloneDeckState();

    logEl.innerHTML = "";
    feedback.textContent = "请选择一个牌堆。";
    updateBoard();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.querySelectorAll(".deck-btn").forEach((button) => {
    button.addEventListener("click", () => chooseDeck(button.dataset.deck));
});

window.startGame = startGame;
