const TOTAL_ROUNDS = 20;
const HISTORY_SIZE = 6;
const STREAK_THRESHOLD = 3;

let history = [];
let round = 0;
let correct = 0;
let streakContextCount = 0;
let antiStreakChoiceCount = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("gf-panel");
const historyEl = document.getElementById("history");
const feedbackEl = document.getElementById("feedback");
const resultModal = document.getElementById("result-modal");

function randomCoin() {
    return Math.random() < 0.5 ? "H" : "T";
}

function initHistory() {
    history = [];
    for (let i = 0; i < HISTORY_SIZE; i += 1) {
        history.push(randomCoin());
    }
}

function getTailStreak() {
    const last = history[history.length - 1];
    let streak = 1;
    for (let i = history.length - 2; i >= 0; i -= 1) {
        if (history[i] !== last) {
            break;
        }
        streak += 1;
    }
    return { last, streak };
}

function renderHistory() {
    historyEl.innerHTML = "";
    history.slice(-HISTORY_SIZE).forEach((item) => {
        const chip = document.createElement("div");
        chip.className = `gf-chip ${item.toLowerCase()}`;
        chip.textContent = item;
        historyEl.appendChild(chip);
    });
}

function updateStats() {
    const acc = round === 0 ? 0 : Math.round((correct / round) * 100);
    const antiRate = streakContextCount === 0 ? 0 : Math.round((antiStreakChoiceCount / streakContextCount) * 100);

    document.getElementById("round").textContent = String(round);
    document.getElementById("acc").textContent = `${acc}%`;
    document.getElementById("anti-rate").textContent = `${antiRate}%`;
}

function startGame() {
    round = 0;
    correct = 0;
    streakContextCount = 0;
    antiStreakChoiceCount = 0;
    sessionStartedAt = new Date();
    initHistory();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";

    feedbackEl.textContent = "请选择下一次抛硬币结果。";
    renderHistory();
    updateStats();
}

function choose(prediction) {
    if (round >= TOTAL_ROUNDS) {
        return;
    }

    const { last, streak } = getTailStreak();
    if (streak >= STREAK_THRESHOLD) {
        streakContextCount += 1;
        const opposite = last === "H" ? "T" : "H";
        if (prediction === opposite) {
            antiStreakChoiceCount += 1;
        }
    }

    const outcome = randomCoin();
    if (prediction === outcome) {
        correct += 1;
        feedbackEl.textContent = `本轮结果: ${outcome}，预测正确。`;
    } else {
        feedbackEl.textContent = `本轮结果: ${outcome}，预测错误。`;
    }

    history.push(outcome);
    round += 1;
    renderHistory();
    updateStats();

    if (round >= TOTAL_ROUNDS) {
        finish();
    }
}

function finish() {
    const acc = Math.round((correct / TOTAL_ROUNDS) * 100);
    const antiRate = streakContextCount === 0 ? 0 : Math.round((antiStreakChoiceCount / streakContextCount) * 100);

    document.getElementById("result-acc").textContent = `${acc}%`;
    document.getElementById("result-anti").textContent = `${antiRate}%`;

    let message = "随机事件彼此独立，下一次并不会“补偿”前面的连串。";
    if (antiRate >= 70) {
        message = "你在连串后经常做反向预测，存在较明显“赌徒谬误”倾向。";
    } else if (antiRate >= 40) {
        message = "你有一定连串后反向预测倾向，建议继续训练随机性直觉。";
    }
    document.getElementById("result-text").textContent = message;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "gambler-fallacy",
            gameName: "赌徒谬误任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                accuracy: acc,
                antiRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

document.getElementById("pick-h").addEventListener("click", () => choose("H"));
document.getElementById("pick-t").addEventListener("click", () => choose("T"));

window.startGame = startGame;
