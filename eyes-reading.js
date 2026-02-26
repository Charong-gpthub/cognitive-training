const ITEMS = [
    { emotion: "警惕", leftBrow: -18, rightBrow: 18, pupilX: 36, options: ["平静", "警惕", "悲伤", "困惑"] },
    { emotion: "愤怒", leftBrow: -25, rightBrow: 25, pupilX: 30, options: ["兴奋", "愤怒", "放松", "尴尬"] },
    { emotion: "悲伤", leftBrow: 20, rightBrow: -20, pupilX: 30, options: ["悲伤", "惊讶", "专注", "高兴"] },
    { emotion: "惊讶", leftBrow: 0, rightBrow: 0, pupilX: 30, options: ["惊讶", "怀疑", "厌烦", "羞愧"] },
    { emotion: "怀疑", leftBrow: -8, rightBrow: 8, pupilX: 24, options: ["怀疑", "满足", "悲伤", "自豪"] },
    { emotion: "专注", leftBrow: -6, rightBrow: 6, pupilX: 32, options: ["专注", "沮丧", "紧张", "疲惫"] },
    { emotion: "困惑", leftBrow: 15, rightBrow: 15, pupilX: 26, options: ["轻松", "困惑", "冷漠", "坚定"] },
    { emotion: "紧张", leftBrow: -16, rightBrow: 16, pupilX: 28, options: ["愉快", "紧张", "平静", "困倦"] },
    { emotion: "冷漠", leftBrow: 2, rightBrow: -2, pupilX: 30, options: ["惊喜", "冷漠", "恐惧", "兴奋"] },
    { emotion: "坚定", leftBrow: -12, rightBrow: 12, pupilX: 34, options: ["害怕", "坚定", "悲伤", "尴尬"] },
    { emotion: "疲惫", leftBrow: 12, rightBrow: -12, pupilX: 32, options: ["活跃", "疲惫", "得意", "挑衅"] },
    { emotion: "平静", leftBrow: 0, rightBrow: 0, pupilX: 30, options: ["平静", "愤怒", "惊慌", "厌恶"] }
];

let index = 0;
let correctCount = 0;
let totalRt = 0;
let shownAt = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("eyes-panel");
const resultModal = document.getElementById("result-modal");
const optionsEl = document.getElementById("options");
const feedback = document.getElementById("feedback");

function updateBoard() {
    const answered = index;
    const acc = answered === 0 ? 0 : Math.round((correctCount / answered) * 100);
    const avgRt = answered === 0 ? 0 : Math.round(totalRt / answered);
    document.getElementById("progress").textContent = String(index + 1);
    document.getElementById("acc").textContent = `${acc}%`;
    document.getElementById("avg-rt").textContent = `${avgRt}ms`;
}

function applyFace(item) {
    const left = document.getElementById("brow-left");
    const right = document.getElementById("brow-right");
    const pupilLeft = document.getElementById("pupil-left");
    const pupilRight = document.getElementById("pupil-right");

    left.style.transform = `rotate(${item.leftBrow}deg)`;
    right.style.transform = `rotate(${item.rightBrow}deg)`;
    pupilLeft.style.left = `${item.pupilX}px`;
    pupilRight.style.left = `${item.pupilX}px`;
}

function renderQuestion() {
    const item = ITEMS[index];
    applyFace(item);
    optionsEl.innerHTML = "";
    item.options.forEach((option) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = option;
        btn.addEventListener("click", () => choose(option));
        optionsEl.appendChild(btn);
    });
    shownAt = performance.now();
    updateBoard();
}

function choose(option) {
    if (index >= ITEMS.length) {
        return;
    }
    const item = ITEMS[index];
    const rt = Math.round(performance.now() - shownAt);
    totalRt += rt;

    const correct = option === item.emotion;
    if (correct) {
        correctCount += 1;
        feedback.textContent = `正确（${rt}ms）`;
    } else {
        feedback.textContent = `不正确，答案是“${item.emotion}”（${rt}ms）`;
    }

    index += 1;
    if (index >= ITEMS.length) {
        finish();
        return;
    }
    setTimeout(() => {
        feedback.textContent = "";
        renderQuestion();
    }, 380);
}

function finish() {
    const total = ITEMS.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const avgRt = Math.round(totalRt / total);

    document.getElementById("result-acc").textContent = `${accuracy}%`;
    document.getElementById("result-rt").textContent = `${avgRt}ms`;
    document.getElementById("result-correct").textContent = String(correctCount);

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "eyes-reading",
            gameName: "眼神读心测验",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: correctCount,
            metrics: {
                total,
                correct: correctCount,
                accuracy,
                avgReactionMs: avgRt
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    index = 0;
    correctCount = 0;
    totalRt = 0;
    sessionStartedAt = new Date();

    feedback.textContent = "";
    renderQuestion();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

window.startGame = startGame;
