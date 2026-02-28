const ALL_FIGURES = [
    { id: "ttct-1", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><circle cx='90' cy='55' r='28' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" },
    { id: "ttct-2", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><path d='M30 70 L90 20 L150 70 Z' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" },
    { id: "ttct-3", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><rect x='45' y='28' width='90' height='54' rx='8' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" },
    { id: "ttct-4", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><path d='M40 75 C70 20,110 20,140 75' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" },
    { id: "ttct-5", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><path d='M40 55 H140 M90 20 V90' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" },
    { id: "ttct-6", svg: "<svg width='180' height='110' viewBox='0 0 180 110'><path d='M50 30 L130 80 M130 30 L50 80' fill='none' stroke='#2c3e50' stroke-width='4'/></svg>" }
];
const CONTENT_VERSION = "torrance-creative-v2-seeded";

let index = 0;
let responses = [];
let elapsed = 0;
let timer = null;
let sessionStartedAt = null;
let sessionSeed = "";
let sessionFigures = [];
let figureOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("ttct-panel");
const resultModal = document.getElementById("result-modal");
const figureEl = document.getElementById("figure");
const titleInput = document.getElementById("title-input");
const descInput = document.getElementById("desc-input");

function buildSessionFigures() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("torrance-creative") : `torrance-creative-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    const ordered = seeded
        ? seeded.pickShuffled(ALL_FIGURES, rng, ALL_FIGURES.length)
        : ALL_FIGURES.slice();

    sessionFigures = ordered.map((item) => ({ ...item }));
    figureOrder = ordered.map((item) => item.id);
}

function words(text) {
    return String(text || "")
        .toLowerCase()
        .split(/[^a-z0-9\u4e00-\u9fa5]+/)
        .filter(Boolean);
}

function updateBoard() {
    document.getElementById("progress").textContent = String(index + 1);
    document.getElementById("time").textContent = `${elapsed}s`;
    document.getElementById("done").textContent = String(responses.length);
}

function renderFigure() {
    const figure = sessionFigures[index];
    if (!figure) {
        return;
    }

    figureEl.innerHTML = figure.svg;
    titleInput.value = "";
    descInput.value = "";
    updateBoard();
}

function nextFigure() {
    const currentFigure = sessionFigures[index];
    if (!currentFigure) {
        return;
    }

    responses.push({
        figureId: currentFigure.id,
        title: titleInput.value.trim(),
        desc: descInput.value.trim()
    });

    index += 1;
    if (index >= sessionFigures.length) {
        finish();
        return;
    }
    renderFigure();
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const total = sessionFigures.length || ALL_FIGURES.length;
    const completed = responses.filter((item) => item.title && item.desc).length;
    const completionRate = Math.round((completed / total) * 100);
    const avgDescLength = completed === 0
        ? 0
        : Math.round(
            responses
                .filter((item) => item.desc)
                .reduce((sum, item) => sum + item.desc.length, 0) / responses.filter((item) => item.desc).length
        );
    const titleTokens = responses.flatMap((item) => words(item.title));
    const titleDiversity = titleTokens.length === 0
        ? 0
        : Math.round((new Set(titleTokens).size / titleTokens.length) * 100);

    document.getElementById("result-completion").textContent = `${completionRate}%`;
    document.getElementById("result-length").textContent = String(avgDescLength);
    document.getElementById("result-diversity").textContent = `${titleDiversity}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "torrance-creative",
            gameName: "托兰斯创造力测验",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: completionRate,
            metrics: {
                items: total,
                completionRate,
                avgDescriptionLength: avgDescLength,
                titleDiversity,
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                figureOrder
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    responses = [];
    elapsed = 0;
    sessionStartedAt = new Date();
    buildSessionFigures();

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        elapsed += 1;
        document.getElementById("time").textContent = `${elapsed}s`;
    }, 1000);

    renderFigure();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("next-btn").addEventListener("click", nextFigure);

window.startGame = startGame;
