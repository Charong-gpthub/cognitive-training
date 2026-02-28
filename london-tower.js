const PEG_CAPACITY = [3, 2, 1];
const ALL_PROBLEMS = [
    { id: "tol-1", start: [["red", "blue"], ["green"], []], goal: [["green"], ["red"], ["blue"]], optimal: 3 },
    { id: "tol-2", start: [["red", "green"], ["blue"], []], goal: [["blue"], ["green"], ["red"]], optimal: 4 },
    { id: "tol-3", start: [["blue", "green"], ["red"], []], goal: [["red", "blue"], ["green"], []], optimal: 3 },
    { id: "tol-4", start: [["red"], ["green", "blue"], []], goal: [["blue"], ["red"], ["green"]], optimal: 4 },
    { id: "tol-5", start: [["green"], ["red"], ["blue"]], goal: [["red", "green"], [], ["blue"]], optimal: 3 }
];
const CONTENT_VERSION = "london-tower-v2-seeded";

let problemIndex = 0;
let playerState = null;
let selectedPeg = null;
let moves = 0;
let solvedMoves = [];
let optimalSolved = 0;
let timer = null;
let elapsed = 0;
let sessionStartedAt = null;
let sessionSeed = "";
let sessionProblems = [];
let problemOrder = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("tol-panel");
const resultModal = document.getElementById("result-modal");
const playerPegsEl = document.getElementById("player-pegs");
const goalPegsEl = document.getElementById("goal-pegs");
const hint = document.getElementById("hint");

function cloneState(state) {
    return state.map((peg) => [...peg]);
}

function buildSessionProblems() {
    const seeded = window.SeededRandom;
    sessionSeed = seeded ? seeded.createSessionSeed("london-tower") : `london-tower-${Date.now()}`;
    const rng = seeded ? seeded.createRngFromSeed(sessionSeed) : Math.random;
    const ordered = seeded
        ? seeded.pickShuffled(ALL_PROBLEMS, rng, ALL_PROBLEMS.length)
        : ALL_PROBLEMS.slice();

    problemOrder = ordered.map((item) => item.id);
    sessionProblems = ordered.map((item) => ({ ...item }));
}

function getCurrentProblem() {
    return sessionProblems[problemIndex];
}

function equalState(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function topBall(peg) {
    if (peg.length === 0) {
        return null;
    }
    return peg[peg.length - 1];
}

function updateBoard() {
    document.getElementById("problem").textContent = String(problemIndex + 1);
    document.getElementById("moves").textContent = String(moves);
    document.getElementById("time").textContent = `${elapsed}s`;
}

function createPegElement(pegBalls, index, interactive) {
    const peg = document.createElement("button");
    peg.type = "button";
    peg.className = "tol-peg";
    if (interactive && selectedPeg === index) {
        peg.classList.add("selected");
    }

    pegBalls.forEach((color) => {
        const ball = document.createElement("div");
        ball.className = `tol-ball ${color}`;
        peg.appendChild(ball);
    });

    if (interactive) {
        peg.addEventListener("click", () => onPegClick(index));
    } else {
        peg.disabled = true;
    }
    return peg;
}

function render() {
    const problem = getCurrentProblem();
    if (!problem) {
        return;
    }

    playerPegsEl.innerHTML = "";
    goalPegsEl.innerHTML = "";

    playerState.forEach((pegBalls, index) => {
        playerPegsEl.appendChild(createPegElement(pegBalls, index, true));
    });
    problem.goal.forEach((pegBalls, index) => {
        goalPegsEl.appendChild(createPegElement(pegBalls, index, false));
    });
    updateBoard();
}

function moveBall(from, to) {
    const fromPeg = playerState[from];
    const toPeg = playerState[to];
    const ball = topBall(fromPeg);
    if (!ball) {
        hint.textContent = "起始柱没有可移动球。";
        return false;
    }
    if (toPeg.length >= PEG_CAPACITY[to]) {
        hint.textContent = "目标柱容量已满。";
        return false;
    }

    fromPeg.pop();
    toPeg.push(ball);
    moves += 1;
    hint.textContent = "移动成功。";
    return true;
}

function onPegClick(index) {
    const problem = getCurrentProblem();
    if (!problem) {
        return;
    }

    if (selectedPeg === null) {
        selectedPeg = index;
        render();
        return;
    }
    if (selectedPeg === index) {
        selectedPeg = null;
        render();
        return;
    }

    const moved = moveBall(selectedPeg, index);
    selectedPeg = null;
    render();
    if (!moved) {
        return;
    }

    const solved = equalState(playerState, problem.goal);
    if (solved) {
        onSolvedProblem();
    }
}

function onSolvedProblem() {
    const problem = getCurrentProblem();
    if (!problem) {
        return;
    }

    solvedMoves.push(moves);
    if (moves <= problem.optimal) {
        optimalSolved += 1;
    }

    problemIndex += 1;
    if (problemIndex >= sessionProblems.length) {
        finish();
        return;
    }

    playerState = cloneState(getCurrentProblem().start);
    moves = 0;
    selectedPeg = null;
    hint.textContent = "下一题开始。";
    render();
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const totalProblems = sessionProblems.length || ALL_PROBLEMS.length;
    const avgMoves = (solvedMoves.reduce((sum, value) => sum + value, 0) / totalProblems).toFixed(1);
    const optimalRate = Math.round((optimalSolved / totalProblems) * 100);

    document.getElementById("result-avg-moves").textContent = String(avgMoves);
    document.getElementById("result-optimal").textContent = `${optimalRate}%`;
    document.getElementById("result-time").textContent = `${elapsed}s`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "london-tower",
            gameName: "伦敦塔",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                problems: totalProblems,
                avgMoves: Number(avgMoves),
                optimalRate,
                timeSec: elapsed,
                seed: sessionSeed,
                contentVersion: CONTENT_VERSION,
                problemOrder
            }
        });
    }

    panel.style.display = "none";
    resultModal.style.display = "flex";
}

function startGame() {
    problemIndex = 0;
    moves = 0;
    solvedMoves = [];
    optimalSolved = 0;
    selectedPeg = null;
    elapsed = 0;
    sessionStartedAt = new Date();
    buildSessionProblems();

    playerState = cloneState(sessionProblems[0].start);
    hint.textContent = "点击一个柱子选择球，再点击目标柱移动。";

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        elapsed += 1;
        document.getElementById("time").textContent = `${elapsed}s`;
    }, 1000);

    render();
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
}

window.startGame = startGame;
