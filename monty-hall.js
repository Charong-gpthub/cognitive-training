let gameState = null;
let stats = {
    rounds: 0,
    switchWins: 0,
    switchTotal: 0,
    stayWins: 0,
    stayTotal: 0
};

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("mh-panel");
const doorsContainer = document.getElementById("doors");
const hintText = document.getElementById("hint-text");
const stayBtn = document.getElementById("stay-btn");
const switchBtn = document.getElementById("switch-btn");
const nextBtn = document.getElementById("next-btn");

function createRound() {
    const prizeDoor = Math.floor(Math.random() * 3);
    return {
        stage: "pick",
        selectedDoor: null,
        prizeDoor,
        revealedDoor: null,
        completed: false,
        startedAt: new Date().toISOString()
    };
}

function startGame() {
    startScreen.style.display = "none";
    panel.style.display = "block";
    gameState = createRound();
    renderRound();
}

function getHostRevealDoor(selectedDoor, prizeDoor) {
    const candidates = [0, 1, 2].filter((door) => door !== selectedDoor && door !== prizeDoor);
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function updateStatsView() {
    const switchRate = stats.switchTotal === 0 ? 0 : Math.round((stats.switchWins / stats.switchTotal) * 100);
    const stayRate = stats.stayTotal === 0 ? 0 : Math.round((stats.stayWins / stats.stayTotal) * 100);

    document.getElementById("switch-rate").textContent = `${switchRate}%`;
    document.getElementById("stay-rate").textContent = `${stayRate}%`;
    document.getElementById("round-count").textContent = String(stats.rounds);
}

function renderRound() {
    doorsContainer.innerHTML = "";

    for (let i = 0; i < 3; i += 1) {
        const door = document.createElement("button");
        door.className = "mh-door";
        door.type = "button";
        door.textContent = `门 ${i + 1}`;

        if (gameState.selectedDoor === i) {
            door.classList.add("selected");
        }

        if (gameState.revealedDoor === i) {
            door.classList.add("revealed");
            door.textContent = `门 ${i + 1}（羊）`;
        }

        if (gameState.completed && gameState.prizeDoor === i) {
            door.classList.add("winner");
            door.textContent = `门 ${i + 1}（汽车）`;
        }

        door.disabled = gameState.stage !== "pick";
        door.addEventListener("click", () => selectDoor(i));
        doorsContainer.appendChild(door);
    }

    stayBtn.disabled = gameState.stage !== "decision";
    switchBtn.disabled = gameState.stage !== "decision";
    nextBtn.style.display = gameState.completed ? "inline-flex" : "none";

    if (gameState.stage === "pick") {
        hintText.textContent = "请选择一扇门。";
    } else if (gameState.stage === "decision") {
        hintText.textContent = `主持人打开了门 ${gameState.revealedDoor + 1}（山羊），请选择“坚持”或“切换”。`;
    }
}

function selectDoor(index) {
    if (gameState.stage !== "pick") {
        return;
    }
    gameState.selectedDoor = index;
    gameState.revealedDoor = getHostRevealDoor(index, gameState.prizeDoor);
    gameState.stage = "decision";
    renderRound();
}

function resolveRound(strategy) {
    if (gameState.stage !== "decision") {
        return;
    }

    let finalDoor = gameState.selectedDoor;
    if (strategy === "switch") {
        finalDoor = [0, 1, 2].find((door) => door !== gameState.selectedDoor && door !== gameState.revealedDoor);
    }

    const isWin = finalDoor === gameState.prizeDoor;
    gameState.selectedDoor = finalDoor;
    gameState.stage = "result";
    gameState.completed = true;

    stats.rounds += 1;
    if (strategy === "switch") {
        stats.switchTotal += 1;
        if (isWin) {
            stats.switchWins += 1;
        }
    } else {
        stats.stayTotal += 1;
        if (isWin) {
            stats.stayWins += 1;
        }
    }
    updateStatsView();

    hintText.textContent = isWin
        ? `你${strategy === "switch" ? "选择了切换" : "选择了坚持"}，恭喜获得汽车！`
        : `你${strategy === "switch" ? "选择了切换" : "选择了坚持"}，结果是山羊。`;

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "monty-hall",
            gameName: "蒙提霍尔问题",
            startedAt: gameState.startedAt,
            finishedAt: new Date(),
            score: isWin ? 1 : 0,
            metrics: {
                strategy,
                isWin: isWin ? 1 : 0,
                switchRate: stats.switchTotal === 0 ? 0 : Math.round((stats.switchWins / stats.switchTotal) * 100),
                stayRate: stats.stayTotal === 0 ? 0 : Math.round((stats.stayWins / stats.stayTotal) * 100)
            }
        });
    }

    renderRound();
}

function nextRound() {
    gameState = createRound();
    renderRound();
}

stayBtn.addEventListener("click", () => resolveRound("stay"));
switchBtn.addEventListener("click", () => resolveRound("switch"));
nextBtn.addEventListener("click", nextRound);

window.startGame = startGame;
