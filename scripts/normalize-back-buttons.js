const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const STANDARD_BACK = '<a href="index.html" class="back-btn"><span aria-hidden="true">←</span><span>返回主页</span></a>';
const LEGACY_BACK = '<a href="index.html" class="back-btn page-header-back"><span aria-hidden="true">←</span><span>返回主页</span></a>';

function listRootHtmlFiles() {
    return fs
        .readdirSync(ROOT, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
        .map((entry) => path.join(ROOT, entry.name));
}

function ensureHeaderClass(attrs, className) {
    const classMatch = attrs.match(/\sclass="([^"]*)"/i);
    if (!classMatch) {
        return `${attrs} class="${className}"`;
    }
    const current = classMatch[1].split(/\s+/).filter(Boolean);
    if (!current.includes(className)) {
        current.push(className);
    }
    return attrs.replace(/\sclass="([^"]*)"/i, ` class="${current.join(" ")}"`);
}

function normalizeFile(filePath) {
    const original = fs.readFileSync(filePath, "utf8");
    let next = original;
    let removedLegacyWrapper = false;

    next = next.replace(/返回大厅/g, "返回主页");

    // Normalize existing back-btn contents.
    next = next.replace(
        /<a href="index\.html" class="back-btn">[\s\S]*?<\/a>/g,
        STANDARD_BACK
    );

    // Replace old top-left button style anchors.
    next = next.replace(
        /<a href="index\.html" class="btn secondary"[^>]*>\s*(?:&larr;|←)\s*返回(?:主页|大厅)?\s*<\/a>/g,
        STANDARD_BACK
    );

    // Remove legacy wrapper divs around top back link.
    next = next.replace(
        /<div style="position:\s*fixed;[^"]*">\s*<a href="index\.html" class="back-btn">[\s\S]*?<\/a>\s*<\/div>\s*/g,
        () => {
            removedLegacyWrapper = true;
            return "";
        }
    );
    next = next.replace(
        /<div style="position:\s*absolute;[^"]*">\s*<a href="index\.html" class="back-btn">[\s\S]*?<\/a>\s*<\/div>\s*/g,
        () => {
            removedLegacyWrapper = true;
            return "";
        }
    );

    if (removedLegacyWrapper) {
        next = next.replace(/<header([^>]*)>/, (full, attrs) => {
            const newAttrs = ensureHeaderClass(attrs, "with-back-link");
            return `<header${newAttrs}>\n            ${LEGACY_BACK}`;
        });
    }

    if (next !== original) {
        fs.writeFileSync(filePath, next, "utf8");
        return true;
    }
    return false;
}

function main() {
    const files = listRootHtmlFiles();
    const changed = [];
    for (const filePath of files) {
        const didChange = normalizeFile(filePath);
        if (didChange) {
            changed.push(path.basename(filePath));
        }
    }

    console.log(`HTML files scanned: ${files.length}`);
    console.log(`Updated files: ${changed.length}`);
    if (changed.length) {
        console.log(changed.join("\n"));
    }
}

main();
