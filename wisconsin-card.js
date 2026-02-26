const TOTAL_TRIALS = 36;
const SWITCH_STREAK = 6;
const RULES = ["color", "shape", "count"];
const COLORS = ["red", "green", "blue", "yellow"];
const SHAPES = ["circle", "triangle", "square", "star"];
const COUNTS = [1, 2, 3, 4];

const TARGET_CARDS = [
    { color: "red", shape: "circle", count: 1 },
    { color: "green", shape: "triangle", count: 2 },
    { color: "blue", shape: "square", count: 3 },
    { color: "yellow", shape: "star", count: 4 }
];

let currentRule = "color";
let previousRule = null;
let trial = 0;
let correctCount = 0;
let errorCount = 0;
let streak = 0;
let categories = 0;
let perseverativeErrors = 0;
let stimulus = null;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("wcst-panel");
const resultModal = document.getElementById("result-modal");
const stimulusCard = document.getElementById("stimulus-card");
const targetGrid = document.getElementById("target-grid");
const feedback = document.getElementById("feedback");

function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function shapeChar(shape) {
    if (shape === "circle") {
        return "●";
    }
    if (shape === "triangle") {
        return "▲";
    }
    if (shape === "square") {
        return "■";
    }
    return "★";
}

function colorLabel(color) {
    if (color === "red") {
        return "红";
    }
    if (color === "green") {
        return "绿";
    }
    if (color === "blue") {
        return "蓝";
    }
    return "黄";
}

function cardHtml(card) {
    const symbols = Array.from({ length: card.count }, () => shapeChar(card.shape))
        .map((symbol) => `<span style="color:${card.color};">${symbol}</span>`)
        .join("");
    return `
        <div class="wcst-symbols">${symbols}</div>
        <div style="font-size:0.9rem;color:#7f8c8d;">${colorLabel(card.color)} | ${card.shape} | ${card.count}</div>
    `;
}

function isMatch(cardA, cardB, rule) {
    return cardA[rule] === cardB[rule];
}

function randomStimulus() {
    return {
        color: pick(COLORS),
        shape: pick(SHAPES),
        count: pick(COUNTS)
    };
}

function rotateRule() {
    const index = RULES.indexOf(currentRule);
    const next = (index + 1) % RULES.length;
    previousRule = currentRule;
    currentRule = RULES[next];
}

function updateBoard() {
    const acc = trial === 0 ? 0 : Math.round((correctCount / trial) * 100);
    document.getElementById("trial").textContent = String(trial);
    document.getElementById("acc").textContent = `${acc}%`;
    document.getElementById("categories").textContent = String(categories);
}

function renderStimulus() {
    stimulusCard.innerHTML = cardHtml(stimulus);
}

function renderTargets() {
    targetGrid.innerHTML = "";
    TARGET_CARDS.forEach((card, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "wcst-target";
        button.innerHTML = cardHtml(card);
        button.addEventListener("click", () => onChoose(index));
        targetGrid.appendChild(button);
    });
}

function onChoose(targetIndex) {
    if (trial >= TOTAL_TRIALS) {
        return;
    }

    const target = TARGET_CARDS[targetIndex];
    const correct = isMatch(target, stimulus, currentRule);
    const oldRuleMatched = previousRule !== null && isMatch(target, stimulus, previousRule);

    trial += 1;
    if (correct) {
        correctCount += 1;
        streak += 1;
        feedback.textContent = "正确";
    } else {
        errorCount += 1;
        streak = 0;
        feedback.textContent = "错误";
        if (oldRuleMatched) {
            perseverativeErrors += 1;
        }
    }

    if (streak >= SWITCH_STREAK && trial < TOTAL_TRIALS) {
        categories += 1;
        streak = 0;
        rotateRule();
        feedback.textContent = "正确，规则已变化";
    }

    updateBoard();
    if (trial >= TOTAL_TRIALS) {
        finish();
        return;
    }

    stimulus = randomStimulus();
    renderStimulus();
}

function finish() {
    const acc = Math.round((correctCount / TOTAL_TRIALS) * 100);
    const perseverativeRate = errorCount === 0 ? 0 : Math.round((perseverativeErrors / errorCount) * 100);

    document.getElementById("result-acc").textContent = `${acc}%`;
    document.getElementById("result-categories").textContent = String(categories);
    document.getElementById("result-persev").textContent = `${perseverativeErrors} (${perseverativeRate}%)`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "wisconsin-card",
            gameName: "威斯康星卡片分类",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: correctCount,
            metrics: {
                totalTrials: TOTAL_TRIALS,
                accuracy: acc,
                categoriesCompleted: categories,
                errors: errorCount,
                perseverativeErrors
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    currentRule = "color";
    previousRule = null;
    trial = 0;
    correctCount = 0;
    errorCount = 0;
    streak = 0;
    categories = 0;
    perseverativeErrors = 0;
    sessionStartedAt = new Date();

    feedback.textContent = "根据反馈寻找当前规则。";
    stimulus = randomStimulus();
    renderStimulus();
    renderTargets();
    updateBoard();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

window.startGame = startGame;
