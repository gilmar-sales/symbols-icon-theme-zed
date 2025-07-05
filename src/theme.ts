import { exec } from "child_process";
import type { IconTheme } from "./types/icon-theme";
import fs from "fs";
import path from "path";

const symbolsRepository = "https://github.com/miguelsolorio/vscode-symbols.git";

const keyMapping: { [key: string]: string } = {
  git: "vcs",
  console: "terminal",
  code: "json",
  coffeescript: "coffee",
  default: "file",
  storage: "database",
  template: "templ",
};

export const getRepoDir = () => {
  const buildDir = path.join(__dirname, "../build");

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  const repoDir = path.join(buildDir, "./symbols");

  if (!fs.existsSync(repoDir)) {
    exec(`cd ${buildDir} && git clone ${symbolsRepository} symbols`);
  } else {
    exec(`cd build/symbols && git clone pull`);
  }

  return repoDir;
};

export const getTheme = (): IconTheme => {
  const data = fs.readFileSync(
    path.join(getRepoDir(), "./src/symbol-icon-theme.json"),
    "utf-8",
  );
  const symbolsIconTheme = JSON.parse(data);

  const transformedIconDefinitions = Object.fromEntries(
    Object.entries(symbolsIconTheme.iconDefinitions ?? {})
      .filter(([key]) => !key.startsWith("folder"))
      .map(([key, value]) => [
        keyMapping[key] || key, // Apply key renaming if a mapping exists
        {
          path: <string>value.iconPath,
        },
      ]),
  );

  /**
   * Transform fileNames object to be case-insensitive
   * This is necessary because ZED's API is case-sensitive but the manifest is not
   */
  const transformedFileNames = Object.entries(
    symbolsIconTheme.fileNames ?? {},
  ).reduce(
    (acc, [key, value]) => {
      acc[key.toLowerCase()] = <string>value;
      acc[key.toUpperCase()] = <string>value;
      return acc;
    },
    {} as { [key: string]: string },
  );

  return {
    name: "Symbols Icon Theme",
    appearance: "dark",
    file_icons: transformedIconDefinitions,
    directory_icons: {
      collapsed: "./icons/folders/folder.svg",
      expanded: "./icons/folders/folder-open.svg",
    },
    file_suffixes: symbolsIconTheme.fileExtensions ?? {},
    file_stems: transformedFileNames,
  };
};
