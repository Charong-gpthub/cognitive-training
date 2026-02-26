const ITEMS = [
    {
        q: "小明把玩具放进蓝盒子后离开。小红把玩具移到红盒子。小明回来后会先找哪里？",
        options: ["蓝盒子", "红盒子"],
        answer: 0
    },
    {
        q: "老师把钥匙放在抽屉。学生离开后同学把钥匙放到书包。老师回来会先找哪里？",
        options: ["抽屉", "书包"],
        answer: 0
    },
    {
        q: "妈妈把蛋糕放在冰箱。爸爸趁她不在放到餐桌。妈妈回来会先看哪里？",
        options: ["冰箱", "餐桌"],
        answer: 0
    },
    {
        q: "阿强看见篮球在柜子里。阿丽偷偷挪到门后。阿强会先找哪里？",
        options: ["柜子", "门后"],
        answer: 0
    },
    {
        q: "小李把伞放在门边。朋友移到阳台。小李回来会先去哪里找？",
        options: ["门边", "阳台"],
        answer: 0
    },
    {
        q: "管理员把卡片放进文件夹。实习生改放到信封。管理员会先找哪里？",
        options: ["文件夹", "信封"],
        answer: 0
    },
    {
        q: "小周把耳机放在书架。弟弟挪到床头。小周回来会先找哪里？",
        options: ["书架", "床头"],
        answer: 0
    },
    {
        q: "队长把哨子放在背包。队员改放口袋。队长会先找哪里？",
        options: ["背包", "口袋"],
        answer: 0
    },
    {
        q: "工程师把U盘放在左抽屉。同事挪到右抽屉。工程师会先找哪里？",
        options: ["左抽屉", "右抽屉"],
        answer: 0
    },
    {
        q: "店员把零钱放收银盒。老板换到保险柜。店员回来会先找哪里？",
        options: ["收银盒", "保险柜"],
        answer: 0
    }
];

let index = 0;
let correctCount = 0;
let totalRt = 0;
let shownAt = 0;
let sessionStartedAt = null;

const startScreen = document.getElementById("start-screen");
const panel = document.getElementById("sa-panel");
const resultModal = document.getElementById("result-modal");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const feedback = document.getElementById("feedback");

function updateBoard() {
    const answered = index;
    const avgRt = answered === 0 ? 0 : Math.round(totalRt / answered);
    document.getElementById("progress").textContent = String(index + 1);
    document.getElementById("correct").textContent = String(correctCount);
    document.getElementById("avg-rt").textContent = `${avgRt}ms`;
}

function renderQuestion() {
    const item = ITEMS[index];
    questionEl.textContent = item.q;
    optionsEl.innerHTML = "";
    item.options.forEach((text, optionIndex) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn secondary";
        btn.textContent = text;
        btn.addEventListener("click", () => choose(optionIndex));
        optionsEl.appendChild(btn);
    });
    shownAt = performance.now();
    updateBoard();
}

function choose(optionIndex) {
    if (index >= ITEMS.length) {
        return;
    }
    const rt = Math.round(performance.now() - shownAt);
    totalRt += rt;

    const item = ITEMS[index];
    const correct = optionIndex === item.answer;
    if (correct) {
        correctCount += 1;
        feedback.textContent = `正确（${rt}ms）`;
    } else {
        feedback.textContent = `错误（${rt}ms）`;
    }

    index += 1;
    if (index >= ITEMS.length) {
        finish();
        return;
    }
    setTimeout(() => {
        feedback.textContent = "";
        renderQuestion();
    }, 400);
}

function finish() {
    const total = ITEMS.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const avgRt = Math.round(totalRt / total);
    const errors = total - correctCount;

    document.getElementById("result-acc").textContent = `${accuracy}%`;
    document.getElementById("result-rt").textContent = `${avgRt}ms`;
    document.getElementById("result-errors").textContent = String(errors);

    if (window.TrainingResults) {
        window.TrainingResults.saveSession({
            gameId: "sally-anne",
            gameName: "萨莉-安妮任务",
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
