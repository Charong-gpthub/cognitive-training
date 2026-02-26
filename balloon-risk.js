const TOTAL_BALLOONS = 20;

let round = 1;
let bank = 0;
let temp = 0;
let pumpsThisBalloon = 0;
let popThreshold = 0;
let poppedCount = 0;
let totalPumps = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("bart-panel");
const balloon = document.getElementById("balloon");
const hint = document.getElementById("hint");
const resultModal = document.getElementById("result-modal");

function randomThreshold() {
    return Math.floor(Math.random() * 9) + 4; // 4..12
}

function updateBoard() {
    document.getElementById("round").textContent = String(round);
    document.getElementById("temp-points").textContent = String(temp);
    document.getElementById("bank-points").textContent = String(bank);

    const scale = 1 + pumpsThisBalloon * 0.08;
    balloon.style.transform = `scale(${Math.min(scale, 2.2)})`;
}

function startBalloon() {
    temp = 0;
    pumpsThisBalloon = 0;
    popThreshold = randomThreshold();
    balloon.classList.remove("popped");
    hint.textContent = "继续充气，或选择收手入账。";
    updateBoard();
}

function startGame() {
    round = 1;
    bank = 0;
    temp = 0;
    pumpsThisBalloon = 0;
    popThreshold = 0;
    poppedCount = 0;
    totalPumps = 0;
    sessionStartedAt = new Date();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    startBalloon();
}

function nextRound() {
    round += 1;
    if (round > TOTAL_BALLOONS) {
        finish();
        return;
    }
    startBalloon();
}

function onPump() {
    pumpsThisBalloon += 1;
    totalPumps += 1;
    temp += 5;
    updateBoard();

    if (pumpsThisBalloon >= popThreshold) {
        poppedCount += 1;
        temp = 0;
        balloon.classList.add("popped");
        hint.textContent = "气球爆炸！本轮临时分清零。";
        updateBoard();
        setTimeout(nextRound, 700);
    }
}

function onBank() {
    bank += temp;
    hint.textContent = `入账成功：+${temp}`;
    temp = 0;
    updateBoard();
    setTimeout(nextRound, 450);
}

function finish() {
    const avgPumps = Math.round(totalPumps / TOTAL_BALLOONS);
    const popRate = Math.round((poppedCount / TOTAL_BALLOONS) * 100);

    document.getElementById("result-bank").textContent = String(bank);
    document.getElementById("result-avg-pumps").textContent = String(avgPumps);
    document.getElementById("result-pop-rate").textContent = `${popRate}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "balloon-risk",
            gameName: "气球风险任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: bank,
            metrics: {
                bank,
                avgPumps,
                popRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

document.getElementById("pump-btn").addEventListener("click", onPump);
document.getElementById("bank-btn").addEventListener("click", onBank);

window.startGame = startGame;
