function formatDuration(ms) {
    const seconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(seconds / 60);
    const remain = seconds % 60;
    if (minutes === 0) {
        return `${remain}s`;
    }
    return `${minutes}m ${remain}s`;
}

function todayDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function toLocaleTime(isoString) {
    return new Date(isoString).toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

function metricsText(session) {
    const metrics = session.metrics || {};
    const entries = Object.entries(metrics).filter(([, value]) => value !== null && value !== undefined);
    if (entries.length === 0) {
        return "--";
    }
    return entries
        .slice(0, 3)
        .map(([key, value]) => `${key}:${value}`)
        .join(" | ");
}

function renderSummary(dateKey) {
    const overview = window.TrainingResults.getDailyOverview(dateKey);
    document.getElementById("selected-date-text").textContent = dateKey;
    document.getElementById("total-sessions").textContent = String(overview.totalSessions);
    document.getElementById("unique-games").textContent = String(overview.uniqueGames);
    document.getElementById("total-duration").textContent = formatDuration(overview.totalDurationMs);
    document.getElementById("avg-duration").textContent = formatDuration(overview.averageDurationMs);
}

function renderTable(dateKey) {
    const sessions = window.TrainingResults.getSessionsByDate(dateKey);
    const body = document.getElementById("sessions-body");
    const emptyHint = document.getElementById("empty-hint");
    body.innerHTML = "";

    if (sessions.length === 0) {
        emptyHint.textContent = "当天暂无训练记录。";
        return;
    }

    emptyHint.textContent = "";
    sessions.forEach((session) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${toLocaleTime(session.finishedAt)}</td>
            <td>${session.gameName}</td>
            <td>${formatDuration(session.durationMs || 0)}</td>
            <td>${metricsText(session)}</td>
        `;
        body.appendChild(row);
    });
}

function render(dateKey) {
    renderSummary(dateKey);
    renderTable(dateKey);
}

function init() {
    const picker = document.getElementById("date-picker");
    const todayBtn = document.getElementById("today-btn");
    const clearBtn = document.getElementById("clear-btn");

    const initialDate = todayDateKey();
    picker.value = initialDate;
    render(initialDate);

    picker.addEventListener("change", () => {
        if (!picker.value) {
            return;
        }
        render(picker.value);
    });

    todayBtn.addEventListener("click", () => {
        const today = todayDateKey();
        picker.value = today;
        render(today);
    });

    clearBtn.addEventListener("click", () => {
        const confirmed = window.confirm("确定清空全部训练记录？此操作不可撤销。");
        if (!confirmed) {
            return;
        }
        window.TrainingResults.clearAllSessions();
        render(picker.value || todayDateKey());
    });
}

window.addEventListener("DOMContentLoaded", init);
