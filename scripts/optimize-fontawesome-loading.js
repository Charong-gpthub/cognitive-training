const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FA_HREF = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";
const BLOCKING_LINK = `<link rel="stylesheet" href="${FA_HREF}">`;
const PRELOAD_MARKER = `rel="preload" href="${FA_HREF}"`;
const NON_BLOCKING_BLOCK = [
    `<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>`,
    `<link rel="preload" href="${FA_HREF}" as="style" onload="this.onload=null;this.rel='stylesheet'">`,
    `<noscript><link rel="stylesheet" href="${FA_HREF}"></noscript>`
].join("\n    ");

function listRootHtmlFiles() {
    return fs
        .readdirSync(ROOT, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
        .map((entry) => path.join(ROOT, entry.name));
}

function main() {
    const files = listRootHtmlFiles();
    const updated = [];
    const skipped = [];

    for (const filePath of files) {
        const original = fs.readFileSync(filePath, "utf8");
        if (!original.includes(FA_HREF)) {
            skipped.push({ file: path.basename(filePath), reason: "no_fontawesome" });
            continue;
        }
        if (original.includes(PRELOAD_MARKER)) {
            skipped.push({ file: path.basename(filePath), reason: "already_optimized" });
            continue;
        }
        if (!original.includes(BLOCKING_LINK)) {
            skipped.push({ file: path.basename(filePath), reason: "non_standard_link" });
            continue;
        }

        const next = original.replace(BLOCKING_LINK, NON_BLOCKING_BLOCK);
        fs.writeFileSync(filePath, next, "utf8");
        updated.push(path.basename(filePath));
    }

    console.log(`HTML files scanned: ${files.length}`);
    console.log(`Updated files: ${updated.length}`);
    if (updated.length > 0) {
        console.log(updated.join("\n"));
    }
    if (skipped.length > 0) {
        console.log(`Skipped files: ${skipped.length}`);
    }
}

main();
