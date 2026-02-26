const TOTAL_TRIALS = 40;
const REVERSAL_TRIAL = 20;

let trial = 0;
let reward = 0;
let optimalChoices = 0;
let preOptimal = 0;
let postOptimal = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("rl-panel");
const resultModal = document.getElementById("result-modal");
const feedback = document.getElementById("feedback");
const phaseHint = document.getElementById("phase-hint");

function currentOptimal() {
    return trial < REVERSAL_TRIAL ? "A" : "B";
}

function rewardProbability(choice) {
    if (trial < REVERSAL_TRIAL) {
        return choice === "A" ? 0.8 : 0.2;
    }
    return choice === "B" ? 0.8 : 0.2;
}

function updateBoard() {
    const optimalRate = trial === 0 ? 0 : Math.round((optimalChoices / trial) * 100);
    document.getElementById("trial").textContent = String(trial);
    document.getElementById("reward").textContent = String(reward);
    document.getElementById("optimal-rate").textContent = `${optimalRate}%`;
    phaseHint.textContent = trial < REVERSAL_TRIAL ? "阶段：学习阶段" : "阶段：反转阶段";
}

function choose(option) {
    if (trial >= TOTAL_TRIALS) {
        return;
    }

    const optimal = currentOptimal();
    if (option === optimal) {
        optimalChoices += 1;
        if (trial < REVERSAL_TRIAL) {
            preOptimal += 1;
        } else {
            postOptimal += 1;
        }
    }

    const rewarded = Math.random() < rewardProbability(option);
    const gain = rewarded ? 10 : 0;
    reward += gain;
    trial += 1;

    feedback.textContent = `你选择 ${option}，${rewarded ? "获得 +10" : "未获得奖励"}`;
    if (trial === REVERSAL_TRIAL) {
        feedback.textContent += "。环境规则已变化";
    }

    updateBoard();
    if (trial >= TOTAL_TRIALS) {
        finish();
    }
}

function finish() {
    const preRate = Math.round((preOptimal / REVERSAL_TRIAL) * 100);
    const postTrials = TOTAL_TRIALS - REVERSAL_TRIAL;
    const postRate = Math.round((postOptimal / postTrials) * 100);

    document.getElementById("result-reward").textContent = String(reward);
    document.getElementById("result-pre").textContent = `${preRate}%`;
    document.getElementById("result-post").textContent = `${postRate}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "reversal-learning",
            gameName: "反转学习任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            score: reward,
            metrics: {
                totalTrials: TOTAL_TRIALS,
                reward,
                preOptimalRate: preRate,
                postOptimalRate: postRate
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    trial = 0;
    reward = 0;
    optimalChoices = 0;
    preOptimal = 0;
    postOptimal = 0;
    sessionStartedAt = new Date();

    feedback.textContent = "请选择 A 或 B。";
    updateBoard();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

document.getElementById("choose-a").addEventListener("click", () => choose("A"));
document.getElementById("choose-b").addEventListener("click", () => choose("B"));

window.startGame = startGame;
