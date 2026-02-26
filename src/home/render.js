function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (text) {
        element.textContent = text;
    }
    return element;
}

function createCustomIcon(iconClass) {
    const wrapper = createElement("span", "custom-icon-wrapper");

    if (iconClass === "fas fa-balloon") {
        wrapper.innerHTML = `
            <svg class="custom-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
                <path fill="currentColor" d="M32 8c-10.5 0-19 8.5-19 19 0 8.2 5.1 15.1 12.2 17.9.6.2 1 .8 1 1.4V51h11.6v-4.7c0-.6.4-1.2 1-1.4C45.9 42.1 51 35.2 51 27c0-10.5-8.5-19-19-19z"/>
                <path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M28 55h8M32 51v9m0 0-3 3m3-3 3 3"/>
            </svg>
        `;
        return wrapper;
    }

    if (iconClass === "fas fa-handcuffs") {
        wrapper.innerHTML = `
            <svg class="custom-icon-svg" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="20" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="5"/>
                <circle cx="44" cy="40" r="10" fill="none" stroke="currentColor" stroke-width="5"/>
                <path fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" d="M27 30L37 34M14 17h12M38 33h12"/>
            </svg>
        `;
        return wrapper;
    }

    return null;
}

function createTaskCard(task, onOpenTask) {
    const isActive = task.status === "active" && task.href;
    const card = createElement(isActive ? "a" : "div");
    const classNames = ["game-card", task.cardClass || "", isActive ? "" : "card-locked"]
        .join(" ")
        .trim();
    card.className = classNames;

    if (isActive) {
        card.href = task.href;
        card.addEventListener("click", () => onOpenTask(task));
    }

    const iconContainer = createElement("div", "card-icon");
    const iconClass = task.icon || "fas fa-brain";
    const icon = createCustomIcon(iconClass) || createElement("i", iconClass);
    iconContainer.appendChild(icon);

    const content = createElement("div", "card-content");
    const title = createElement("h2", null, task.title);
    const tag = createElement("p", "tag", task.tag || "待定义");
    const desc = createElement("p", "desc", task.desc || "");
    content.append(title, tag, desc);

    card.append(iconContainer, content);
    return card;
}

export function renderSections(container, sections, onOpenTask) {
    const fragment = document.createDocumentFragment();

    sections.forEach((section) => {
        const sectionElement = createElement("section", "system-section");
        const title = createElement("h2", "section-title");
        const sectionIcon = createElement("i", section.icon || "fas fa-folder");
        title.append(sectionIcon, document.createTextNode(` ${section.title}`));

        const grid = createElement("div", "games-grid");
        section.tasks.forEach((task) => {
            grid.appendChild(createTaskCard(task, onOpenTask));
        });

        sectionElement.append(title, grid);
        fragment.appendChild(sectionElement);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
}
