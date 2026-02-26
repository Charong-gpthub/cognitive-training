const cases = [
    { priorA: 10, pEgivenA: 80, pEgivenB: 20 },
    { priorA: 20, pEgivenA: 70, pEgivenB: 30 },
    { priorA: 40, pEgivenA: 85, pEgivenB: 40 },
    { priorA: 30, pEgivenA: 60, pEgivenB: 20 },
    { priorA: 50, pEgivenA: 75, pEgivenB: 35 },
    { priorA: 15, pEgivenA: 90, pEgivenB: 45 },
    { priorA: 35, pEgivenA: 65, pEgivenB: 25 },
    { priorA: 60, pEgivenA: 55, pEgivenB: 15 }
];

let index = 0;
let approxCorrect = 0;
let totalAbsError = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("bayes-panel");
const questionEl = document.getElementById("question");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const feedbackEl = document.getElementById("feedback");
const resultModal = document.getElementById("result-modal");

function calcPosterior(priorA, pEgivenA, pEgivenB) {
    const pA = priorA / 100;
    const pB = 1 - pA;
    const numerator = pEgivenA / 100 * pA;
    const denominator = numerator + (pEgivenB / 100) * pB;
    return Math.round((numerator / denominator) * 100);
}

function updateLiveBoard() {
    const answered = index;
    const acc = answered === 0 ? 0 : Math.round((approxCorrect / answered) * 100);
    const mae = answered === 0 ? 0 : Math.round(totalAbsError / answered);

    document.getElementById("progress").textContent = `${answered}/${cases.length}`;
    document.getElementById("accuracy").textContent = `${acc}%`;
    document.getElementById("mae").textContent = `${mae}%`;
}

function renderCase() {
    const item = cases[index];
    const priorB = 100 - item.priorA;
    questionEl.innerHTML = `
        <p><strong>题目 ${index + 1}</strong></p>
        <p>先验：P(A) = <strong>${item.priorA}%</strong>，P(B) = <strong>${priorB}%</strong></p>
        <p>证据强度：P(E|A) = <strong>${item.pEgivenA}%</strong>，P(E|B) = <strong>${item.pEgivenB}%</strong></p>
        <p>已观察到证据 E，估计后验 P(A|E)。</p>
    `;
    answerInput.value = "";
    feedbackEl.textContent = "";
}

function submitAnswer() {
    const raw = Number(answerInput.value);
    if (!Number.isFinite(raw) || raw < 0 || raw > 100) {
        feedbackEl.textContent = "请输入 0-100 的数值。";
        return;
    }

    const item = cases[index];
    const correct = calcPosterior(item.priorA, item.pEgivenA, item.pEgivenB);
    const error = Math.abs(raw - correct);
    totalAbsError += error;
    if (error <= 5) {
        approxCorrect += 1;
    }

    feedbackEl.textContent = `正确值约为 ${correct}%，你的误差为 ${Math.round(error)}%。`;
    index += 1;
    updateLiveBoard();

    if (index >= cases.length) {
        finish();
        return;
    }

    setTimeout(renderCase, 700);
}

function finish() {
    const acc = Math.round((approxCorrect / cases.length) * 100);
    const mae = Math.round(totalAbsError / cases.length);

    document.getElementById("result-acc").textContent = `${acc}%`;
    document.getElementById("result-mae").textContent = `${mae}%`;

    let message = "你已具备不错的后验更新能力。";
    if (mae > 20) {
        message = "后验估计偏差较大，建议先写出分子/分母再计算。";
    } else if (mae > 10) {
        message = "整体可用，但在先验与证据冲突时仍有偏差。";
    }
    document.getElementById("result-text").textContent = message;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "bayes-update",
            gameName: "贝叶斯更新任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                approxAccuracy: acc,
                mae
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    approxCorrect = 0;
    totalAbsError = 0;
    sessionStartedAt = new Date();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    updateLiveBoard();
    renderCase();
}

submitBtn.addEventListener("click", submitAnswer);
answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        submitAnswer();
    }
});

window.startGame = startGame;
