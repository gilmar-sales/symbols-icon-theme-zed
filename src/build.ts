import fs, { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getTheme, repositoryDir } from "./theme";

const zedIconTheme = await getTheme();

const zedManifest = {
	$schema: "https://zed.dev/schema/icon_themes/v0.2.0.json",
	name: "Symbols Icon Theme",
	author: "Zed Industries",
	themes: [zedIconTheme],
};

var iconThemesDir = join(import.meta.dirname, "../icon_themes");

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
	join(repositoryDir, "./src/icons/files"),
	join(import.meta.dirname, "../icons/files"),
);

copyIcons(
	join(repositoryDir, "./src/icons/folders"),
	join(import.meta.dirname, "../icons/folders"),
);

console.log("Symbols Icon Theme icons copied successfuly.");
