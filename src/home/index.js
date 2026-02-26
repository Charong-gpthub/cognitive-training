import { sections } from "./config.js";
import { renderSections } from "./render.js";
import { getValue, setValue } from "../shared/storage.js";

const LAST_VISIT_KEY = "last-visit";

function updateLastVisit() {
    const element = document.getElementById("last-visit");
    if (!element) {
        return;
    }

    const lastVisit = getValue(LAST_VISIT_KEY);
    if (!lastVisit) {
        element.textContent = "开始训练：选择一个任务进入。";
        return;
    }

    element.textContent = `上次访问：${lastVisit.title}（${lastVisit.time}）`;
}

function handleOpenTask(task) {
    const time = new Date().toLocaleString("zh-CN", { hour12: false });
    setValue(LAST_VISIT_KEY, { title: task.title, time });
}

function initHomePage() {
    const container = document.getElementById("sections-root");
    if (!container) {
        throw new Error("Missing #sections-root container in homepage.");
    }

    renderSections(container, sections, handleOpenTask);
    updateLastVisit();
}

window.addEventListener("DOMContentLoaded", initHomePage);
