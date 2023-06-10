import * as vscode from "vscode";
import { LinkListProvider } from "./LinkListProvider";
import { LinkListTreeItem } from "./types";
import { openItem } from "./OpenService";
import { join } from "node:path";
import { lstatSync, mkdirSync, writeFileSync } from "node:fs";
import { lnkLstTemplate } from "./data/template";

const newWindowKey = "lnklst.newWindow";

export function getNewWindowParam(context: vscode.ExtensionContext): boolean {
  return context.globalState.get(newWindowKey) || true;
}

async function changeParam(
  context: vscode.ExtensionContext,
  key: string,
  newState: boolean
) {
  await vscode.commands.executeCommand("setContext", key, newState);
  return context.globalState.update(key, newState);
}

function getRootPath() {
  return vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : ".";
}

async function openConfig() {
  console.log("Opening config file");
  const folderPath = join(getRootPath(), ".vscode");
  const filepath = join(folderPath, "lnklst.json");

  const stat = lstatSync(filepath, {
    throwIfNoEntry: false,
  });

  if (!stat?.isFile()) {
    const dirstat = lstatSync(folderPath, {
      throwIfNoEntry: false,
    });
    if (!dirstat?.isDirectory()) {
      console.log("folder does not exist, creating folder", folderPath);
      mkdirSync(folderPath, { recursive: true });
    }
    console.log("file does not exist, creating file from template", filepath);
    writeFileSync(filepath, JSON.stringify(lnkLstTemplate, undefined, 2));
  }

  console.log("opening", filepath);
  await vscode.commands.executeCommand(
    "vscode.open",
    vscode.Uri.file(filepath)
  );
}

function changeNewWindowParam(
  context: vscode.ExtensionContext,
  newState: boolean
) {
  return changeParam(context, newWindowKey, newState);
}

export async function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "lnklst" is now active!');
  context.globalState.setKeysForSync([newWindowKey]);
  await vscode.commands.executeCommand(
    "setContext",
    newWindowKey,
    context.globalState.get(newWindowKey)
  );

  const rootPath = getRootPath();

  const linkListProvider = new LinkListProvider(rootPath);

  vscode.window.createTreeView("lnklst", {
    treeDataProvider: linkListProvider,
  });

  vscode.window.registerTreeDataProvider("lnklst", linkListProvider);

  vscode.commands.registerCommand("lnklst.refreshEntry", () =>
    linkListProvider.refresh()
  );

  vscode.commands.registerCommand("lnklst.newWindow", () => {
    return changeNewWindowParam(context, true);
  });

  vscode.commands.registerCommand("lnklst.openConfig", () => {
    return openConfig();
  });

  vscode.commands.registerCommand("lnklst.sameWindow", () => {
    return changeNewWindowParam(context, false);
  });

  vscode.commands.registerCommand(
    "lnklst.openItem",
    (item: LinkListTreeItem) => {
      return openItem(context, item);
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
