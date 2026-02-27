let pegs = [[], [], []];
let selectedPeg = null;
let diskCount = 4;
let moves = 0;
let timer = null;
let elapsed = 0;
let sessionStartedAt = null;
let moveHistory = [];
let redoHistory = [];

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("hanoi-panel");
const resultModal = document.getElementById("result-modal");
const hint = document.getElementById("hint");
const diskCountSelect = document.getElementById("disk-count");
const undoBtn = document.getElementById("undo-btn");
const redoBtn = document.getElementById("redo-btn");

function optimalMoves(n) {
    return Math.pow(2, n) - 1;
}

function updateBoard() {
    document.getElementById("moves").textContent = String(moves);
    document.getElementById("optimal").textContent = String(optimalMoves(diskCount));
    document.getElementById("time").textContent = `${elapsed}s`;
    undoBtn.disabled = moveHistory.length === 0;
    redoBtn.disabled = redoHistory.length === 0;

    const pegEls = document.querySelectorAll(".peg");
    pegEls.forEach((pegEl, idx) => {
        pegEl.innerHTML = "";
        pegEl.classList.toggle("selected", selectedPeg === idx);

        pegs[idx].forEach((size) => {
            const disk = document.createElement("div");
            disk.className = "disk";
            disk.style.width = `${40 + size * 18}px`;
            disk.style.background = `hsl(${20 + size * 32}, 70%, 55%)`;
            pegEl.appendChild(disk);
        });
    });
}

function resetGame() {
    diskCount = Number(diskCountSelect.value);
    pegs = [[], [], []];
    for (let i = diskCount; i >= 1; i -= 1) {
        pegs[0].push(i);
    }
    selectedPeg = null;
    moves = 0;
    elapsed = 0;
    moveHistory = [];
    redoHistory = [];
    sessionStartedAt = new Date();
    hint.textContent = "点击起始柱，再点击目标柱。";
    resultModal.style.display = "none";

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        elapsed += 1;
        document.getElementById("time").textContent = `${elapsed}s`;
    }, 1000);

    updateBoard();
}

function topDisk(pegIndex) {
    const peg = pegs[pegIndex];
    if (peg.length === 0) {
        return null;
    }
    return peg[peg.length - 1];
}

function tryMove(from, to, trackHistory = true) {
    const fromDisk = topDisk(from);
    if (fromDisk === null) {
        hint.textContent = "起始柱没有可移动的圆盘。";
        return false;
    }
    const toDisk = topDisk(to);
    if (toDisk !== null && toDisk < fromDisk) {
        hint.textContent = "不能把大盘放在小盘上。";
        return false;
    }
    pegs[from].pop();
    pegs[to].push(fromDisk);
    if (trackHistory) {
        moveHistory.push({ from, to, disk: fromDisk });
        redoHistory = [];
    }
    moves += 1;
    hint.textContent = "移动成功。";
    return true;
}

function undoMove() {
    if (moveHistory.length === 0) {
        hint.textContent = "没有可撤销的步骤。";
        return;
    }

    const lastMove = moveHistory.pop();
    const topOnTo = topDisk(lastMove.to);
    if (topOnTo !== lastMove.disk) {
        hint.textContent = "当前状态无法执行撤销。";
        moveHistory.push(lastMove);
        return;
    }

    pegs[lastMove.to].pop();
    pegs[lastMove.from].push(lastMove.disk);
    moves = Math.max(0, moves - 1);
    redoHistory.push(lastMove);
    selectedPeg = null;
    resultModal.style.display = "none";
    hint.textContent = "已撤销一步。";
    updateBoard();
}

function redoMove() {
    if (redoHistory.length === 0) {
        hint.textContent = "没有可重做的步骤。";
        return;
    }

    const move = redoHistory.pop();
    const moved = tryMove(move.from, move.to, false);
    if (!moved) {
        redoHistory.push(move);
        hint.textContent = "当前状态无法执行重做。";
        updateBoard();
        return;
    }

    moveHistory.push(move);
    selectedPeg = null;
    hint.textContent = "已重做一步。";
    updateBoard();

    if (pegs[2].length === diskCount) {
        finish();
    }
}

function onPegClick(pegIndex) {
    if (selectedPeg === null) {
        selectedPeg = pegIndex;
        updateBoard();
        return;
    }
    if (selectedPeg === pegIndex) {
        selectedPeg = null;
        updateBoard();
        return;
    }

    const moved = tryMove(selectedPeg, pegIndex);
    selectedPeg = null;
    updateBoard();

    if (moved && pegs[2].length === diskCount) {
        finish();
    }
}

function finish() {
    if (timer) {
        clearInterval(timer);
    }
    const optimal = optimalMoves(diskCount);
    const efficiency = Math.round((optimal / Math.max(moves, 1)) * 100);

    document.getElementById("result-moves").textContent = String(moves);
    document.getElementById("result-optimal").textContent = String(optimal);
    document.getElementById("result-efficiency").textContent = `${Math.min(efficiency, 100)}%`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "hanoi",
            gameName: "河内塔",
            startedAt: sessionStartedAt || new Date(),
            finishedAt: new Date(),
            metrics: {
                disks: diskCount,
                moves,
                optimal,
                efficiency: Math.min(efficiency, 100)
            }
        });
    }

    resultModal.style.display = "flex";
}

function startGame() {
    startScreen.style.display = "none";
    panel.style.display = "block";
    resultModal.style.display = "none";
    resetGame();
}

document.querySelectorAll(".peg").forEach((pegEl) => {
    pegEl.addEventListener("click", () => onPegClick(Number(pegEl.dataset.peg)));
});
diskCountSelect.addEventListener("change", resetGame);
document.getElementById("restart-btn").addEventListener("click", resetGame);
undoBtn.addEventListener("click", undoMove);
redoBtn.addEventListener("click", redoMove);

window.startGame = startGame;
