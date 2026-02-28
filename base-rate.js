const ALL_QUESTIONS = [
    { id: "br-1", baseRate: 1, sensitivity: 95, specificity: 90 },
    { id: "br-2", baseRate: 2, sensitivity: 92, specificity: 88 },
    { id: "br-3", baseRate: 5, sensitivity: 90, specificity: 90 },
    { id: "br-4", baseRate: 10, sensitivity: 85, specificity: 85 },
    { id: "br-5", baseRate: 20, sensitivity: 90, specificity: 80 },
    { id: "br-6", baseRate: 30, sensitivity: 88, specificity: 75 }
];
const CONTENT_VERSION = "base-rate-v2-seeded";

let index = 0;
let correctCount = 0;
let neglectCount = 0;
let sessionStartedAt = null;
let sessionSeed = "";
let sessionQuestions = [];
let questionOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("br-panel");
const questionCard = document.getElementById("question-card");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const resultModal = document.getElementById("result-modal");

function posterior(baseRate, sensitivity, specificity) {
    const pD = baseRate / 100;
    const pNotD = 1 - pD;
    const pPosGivenD = sensitivity / 100;
    const pPosGivenNotD = 1 - specificity / 100;
    const numerator = pPosGivenD * pD;
    const denominator = numerator + pPosGivenNotD * pNotD;
    return Math.round((numerator / denominator) * 100);
}

function buildOptions(correctValue, heuristicValue, rng) {
    const set = new Set([correctValue, heuristicValue]);
    const candidates = [1, 3, 5, 8, 12, 15, 20, 25, 35, 45, 55, 65, 75, 85, 95];

    for (const candidate of candidates) {
        if (set.size >= 4) {
            break;
        }
        set.add(candidate);
    }

    const options = Array.from(set);
    if (window.SeededRandom) {
        return window.SeededRandom.shuffleInPlace(options, rng);
    }
    return options.sort((a, b) => a - b);
}

function buildSessionQuestions() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("base-rate") : `base-rate-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    const ordered = seeded
        ? seeded.pickShuffled(ALL_QUESTIONS, rng, ALL_QUESTIONS.length)
        : ALL_QUESTIONS.slice();

    questionOrder = ordered.map((item) => item.id);
    sessionQuestions = ordered.map((item) => {
        const correctValue = posterior(item.baseRate, item.sensitivity, item.specificity);
        const heuristicValue = item.sensitivity;
        return {
            ...item,
            correctValue,
            heuristicValue,
            options: buildOptions(correctValue, heuristicValue, rng)
        };
    });
}

function updateBoard() {
    const answered = index;
    const acc = answered === 0 ? 0 : Math.round((correctCount / answered) * 100);
    const neglectRate = answered === 0 ? 0 : Math.round((neglectCount / answered) * 100);
    const total = sessionQuestions.length || ALL_QUESTIONS.length;

    document.getElementById("progress").textContent = `${answered}/${total}`;
    document.getElementById("accuracy").textContent = `${acc}%`;
    document.getElementById("neglect-rate").textContent = `${neglectRate}%`;
}

function renderQuestion() {
    const q = sessionQuestions[index];

    questionCard.innerHTML = `
        <p><strong>场景 ${index + 1}</strong></p>
        <p>某疾病患病率（基率）为 <strong>${q.baseRate}%</strong>。</p>
        <p>检测灵敏度为 <strong>${q.sensitivity}%</strong>，特异度为 <strong>${q.specificity}%</strong>。</p>
        <p>若某人检测结果为阳性，其真实患病概率最接近以下哪项？</p>
    `;

    optionsEl.innerHTML = "";
    q.options.forEach((value) => {
        const btn = document.createElement("button");
        btn.className = "btn primary";
        btn.type = "button";
        btn.textContent = `${value}%`;
        btn.addEventListener("click", () => answer(value));
        optionsEl.appendChild(btn);
    });

    feedbackEl.textContent = "";
}

function answer(chosen) {
    const q = sessionQuestions[index];
    const correctValue = q.correctValue;
    const heuristicValue = q.heuristicValue;
    const isCorrect = chosen === correctValue;
    if (isCorrect) {
        correctCount += 1;
        feedbackEl.textContent = `正确。后验概率约为 ${correctValue}%。`;
    } else {
        if (chosen === heuristicValue) {
            neglectCount += 1;
        }
        feedbackEl.textContent = `不正确。正确值约为 ${correctValue}%（不能只看灵敏度）。`;
    }

    index += 1;
    updateBoard();

    if (index >= sessionQuestions.length) {
        finish();
        return;
    }

    setTimeout(renderQuestion, 700);
}

function finish() {
    const total = sessionQuestions.length;
    const acc = Math.round((correctCount / total) * 100);
    const neglectRate = Math.round((neglectCount / total) * 100);

    document.getElementById("result-acc").textContent = `${acc}%`;
    document.getElementById("result-neglect").textContent = `${neglectRate}%`;

    let message = "表现稳定，继续保持把“基率+检测性能”一起纳入判断。";
    if (neglectRate >= 50) {
        message = "你较常只看检测命中率，忽略了基率。建议重点训练贝叶斯思维。";
    } else if (neglectRate >= 20) {
        message = "存在一定基率忽略倾向，继续训练可明显改善。";
    }

    document.getElementById("result-text").textContent = message;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "base-rate",
            gameName: "基率忽略任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                accuracy: acc,
                neglectRate,
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                questionOrder,
                optionOrder: sessionQuestions.map((item) => ({ id: item.id, options: item.options }))
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    correctCount = 0;
    neglectCount = 0;
    sessionStartedAt = new Date();
    buildSessionQuestions();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    updateBoard();
    renderQuestion();
}

window.startGame = startGame;
