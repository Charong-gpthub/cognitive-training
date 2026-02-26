const TOTAL_TRIALS = 40;
const STOP_PROBABILITY = 0.25;
const RESPONSE_WINDOW = 1200;
const INTER_TRIAL = 700;
const SSD_STEP = 50;
const SSD_MIN = 50;
const SSD_MAX = 900;

let isGameActive = false;
let trialIndex = 0;
let ssd = 250;
let currentTrial = null;
let trialStartTime = 0;
let awaitingResponse = false;
let stopActive = false;
let timerIds = [];
let sessionStartedAt = null;

const results = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("sst-panel");
const stimulus = document.getElementById("stimulus");
const trialInfo = document.getElementById("trial-info");
const resultModal = document.getElementById("result-modal");
const goAccEl = document.getElementById("go-acc");
const stopAccEl = document.getElementById("stop-acc");
const ssdLiveEl = document.getElementById("ssd-live");

function randomDirection() {
    return Math.random() < 0.5 ? "left" : "right";
}

function schedule(callback, delay) {
    const id = setTimeout(callback, delay);
    timerIds.push(id);
}

function clearAllTimers() {
    timerIds.forEach((id) => clearTimeout(id));
    timerIds = [];
}

function startGame() {
    isGameActive = true;
    trialIndex = 0;
    ssd = 250;
    results.length = 0;
    sessionStartedAt = new Date();

    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";

    updateLiveBoard();
    runTrial();
}

function runTrial() {
    if (!isGameActive) {
        return;
    }

    if (trialIndex >= TOTAL_TRIALS) {
        endGame();
        return;
    }

    const isStopTrial = Math.random() < STOP_PROBABILITY;
    const direction = randomDirection();

    currentTrial = {
        isStopTrial,
        direction,
        responded: false
    };
    trialStartTime = Date.now();
    awaitingResponse = true;
    stopActive = false;

    stimulus.classList.remove("stop");
    stimulus.textContent = direction === "left" ? "←" : "→";
    trialInfo.textContent = `试次 ${trialIndex + 1} / ${TOTAL_TRIALS}`;

    if (isStopTrial) {
        schedule(() => {
            if (!awaitingResponse) {
                return;
            }
            stopActive = true;
            stimulus.classList.add("stop");
        }, ssd);
    }

    schedule(() => finalizeTrial(), RESPONSE_WINDOW);
}

function keyToDirection(code) {
    if (code === "ArrowLeft") {
        return "left";
    }
    if (code === "ArrowRight") {
        return "right";
    }
    return null;
}

function handleResponse(direction) {
    if (!isGameActive || !awaitingResponse || currentTrial.responded) {
        return;
    }

    currentTrial.responded = true;
    const rt = Date.now() - trialStartTime;

    if (currentTrial.isStopTrial) {
        results.push({
            trialType: "stop",
            success: false,
            rt,
            ssd
        });
        ssd = Math.max(SSD_MIN, ssd - SSD_STEP);
    } else {
        const correct = direction === currentTrial.direction;
        results.push({
            trialType: "go",
            success: correct,
            rt: correct ? rt : null
        });
    }

    finalizeTrial();
}

function finalizeTrial() {
    if (!awaitingResponse) {
        return;
    }

    awaitingResponse = false;
    clearAllTimers();

    if (!currentTrial.responded) {
        if (currentTrial.isStopTrial) {
            results.push({
                trialType: "stop",
                success: true,
                rt: null,
                ssd
            });
            ssd = Math.min(SSD_MAX, ssd + SSD_STEP);
        } else {
            results.push({
                trialType: "go",
                success: false,
                rt: null
            });
        }
    }

    updateLiveBoard();
    stimulus.classList.remove("stop");
    stimulus.textContent = "+";
    trialIndex += 1;
    schedule(runTrial, INTER_TRIAL);
}

function ratio(success, total) {
    return total > 0 ? Math.round((success / total) * 100) : 0;
}

function average(values) {
    if (values.length === 0) {
        return 0;
    }
    const sum = values.reduce((acc, value) => acc + value, 0);
    return Math.round(sum / values.length);
}

function updateLiveBoard() {
    const goTrials = results.filter((item) => item.trialType === "go");
    const goSuccess = goTrials.filter((item) => item.success).length;
    const stopTrials = results.filter((item) => item.trialType === "stop");
    const stopSuccess = stopTrials.filter((item) => item.success).length;

    goAccEl.textContent = `${ratio(goSuccess, goTrials.length)}%`;
    stopAccEl.textContent = `${ratio(stopSuccess, stopTrials.length)}%`;
    ssdLiveEl.textContent = String(ssd);
}

function endGame() {
    isGameActive = false;
    awaitingResponse = false;
    clearAllTimers();

    const goTrials = results.filter((item) => item.trialType === "go");
    const goSuccessTrials = goTrials.filter((item) => item.success);
    const stopTrials = results.filter((item) => item.trialType === "stop");
    const stopSuccessTrials = stopTrials.filter((item) => item.success);
    const stopSsdSamples = stopTrials.map((item) => item.ssd);

    const goAcc = ratio(goSuccessTrials.length, goTrials.length);
    const stopAcc = ratio(stopSuccessTrials.length, stopTrials.length);
    const goRt = average(goSuccessTrials.map((item) => item.rt).filter((v) => Number.isFinite(v)));
    const meanSsd = average(stopSsdSamples);
    const ssrt = Math.max(0, goRt - meanSsd);

    document.getElementById("result-go-acc").textContent = `${goAcc}%`;
    document.getElementById("result-stop-acc").textContent = `${stopAcc}%`;
    document.getElementById("result-go-rt").textContent = `${goRt}ms`;
    document.getElementById("result-ssrt").textContent = `${ssrt}ms`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "stop-signal",
            gameName: "停止信号任务",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                goAcc,
                stopAcc,
                goRt,
                ssrt
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

document.addEventListener("keydown", (event) => {
    const direction = keyToDirection(event.code);
    if (!direction) {
        return;
    }
    event.preventDefault();
    handleResponse(direction);
});

window.startGame = startGame;
