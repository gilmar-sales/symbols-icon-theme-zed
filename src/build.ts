import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getRepoDir, getTheme } from "./theme";
import fs from "node:fs";

const zedIconTheme = getTheme();

const zedManifest = {
  $schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
  name: "Symbols Icon Theme",
  author: "Zed Industries",
  themes: [zedIconTheme],
};

var iconThemesDir = join(__dirname, "../icon_themes");

if (!fs.existsSync(iconThemesDir)) {
  fs.mkdirSync(iconThemesDir, { recursive: true });
}

writeFileSync(
  join(iconThemesDir, "symbols-icon-theme.json"),
  JSON.stringify(zedManifest, null, 2),
);

const copyIcons = (sourceDir: string, destDir: string) => {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.readdirSync(sourceDir).forEach((file) => {
    const sourceFile = join(sourceDir, file);
    const destFile = join(destDir, file);
    fs.copyFileSync(sourceFile, destFile);
  });
};

// Copy icons from repo to the icons directory
copyIcons(
  join(getRepoDir(), "./src/icons/files"),
  join(__dirname, "../icons/files"),
);
copyIcons(
  join(getRepoDir(), "./src/icons/folders"),
  join(__dirname, "../icons/folders"),
);

console.log("Symbols Icon Theme icons copied successfuly.");
