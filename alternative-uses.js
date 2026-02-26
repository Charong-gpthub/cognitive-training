const PROMPTS = ["砖头", "回形针", "塑料瓶"];
const ROUND_SECONDS = 60;

let round = 0;
let timeLeft = ROUND_SECONDS;
let timer = null;
let responses = [];
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("aut-panel");
const resultModal = document.getElementById("result-modal");
const promptText = document.getElementById("prompt-text");
const usesInput = document.getElementById("uses-input");

function parseLines(text) {
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
}

function tokenize(list) {
    return list
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9\u4e00-\u9fa5]+/)
        .filter(Boolean);
}

function currentUsesCount() {
    return parseLines(usesInput.value).length;
}

function updateBoard() {
    document.getElementById("round").textContent = String(round + 1);
    document.getElementById("time").textContent = `${timeLeft}s`;
    document.getElementById("uses-count").textContent = String(currentUsesCount());
}

function loadRound() {
    promptText.textContent = PROMPTS[round];
    usesInput.value = "";
    timeLeft = ROUND_SECONDS;
    updateBoard();
}

function nextRound() {
    const lines = parseLines(usesInput.value);
    responses.push({
        prompt: PROMPTS[round],
        uses: lines
    });

    round += 1;
    if (round >= PROMPTS.length) {
        finish();
        return;
    }
    loadRound();
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const allUses = responses.flatMap((item) => item.uses);
    const totalUses = allUses.length;
    const words = tokenize(allUses);
    const uniqueWords = new Set(words).size;
    const diversity = words.length === 0 ? 0 : Math.round((uniqueWords / words.length) * 100);
    const avgLength = totalUses === 0
        ? 0
        : Math.round(allUses.reduce((sum, use) => sum + use.length, 0) / totalUses);

    document.getElementById("result-fluency").textContent = String(totalUses);
    document.getElementById("result-diversity").textContent = `${diversity}%`;
    document.getElementById("result-length").textContent = String(avgLength);

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "alternative-uses",
            gameName: "替代用途测验",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: totalUses,
            metrics: {
                prompts: PROMPTS.length,
                fluency: totalUses,
                lexicalDiversity: diversity,
                avgUseLength: avgLength
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    round = 0;
    responses = [];
    sessionStartedAt = new Date();

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        timeLeft -= 1;
        updateBoard();
        if (timeLeft <= 0) {
            nextRound();
        }
    }, 1000);

    loadRound();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("next-btn").addEventListener("click", nextRound);
usesInput.addEventListener("input", () => {
    document.getElementById("uses-count").textContent = String(currentUsesCount());
});

window.startGame = startGame;
