import * as vscode from "vscode";
import { LinkListProvider } from "./LinkListProvider";
import { LinkListTreeItem } from "./types";
import { openItem } from "./OpenService";

const newWindowKey = "lnklst.newWindow";

export function getNewWindowParam(context: vscode.ExtensionContext): boolean {
  return context.globalState.get(newWindowKey) || true;
}

function changeParam(
  context: vscode.ExtensionContext,
  key: string,
  newState: boolean
) {
  vscode.commands.executeCommand("setContext", key, newState);
  context.globalState.update(key, newState);
}

function changeNewWindowParam(
  context: vscode.ExtensionContext,
  newState: boolean
) {
  changeParam(context, newWindowKey, newState);
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "lnklst" is now active!');
  context.globalState.setKeysForSync([newWindowKey]);
  vscode.commands.executeCommand(
    "setContext",
    newWindowKey,
    context.globalState.get(newWindowKey)
  );

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : ".";

  const linkListProvider = new LinkListProvider(rootPath);

  vscode.window.createTreeView("lnklst", {
    treeDataProvider: linkListProvider,
  });

  vscode.window.registerTreeDataProvider("lnklst", linkListProvider);

  vscode.commands.registerCommand("lnklst.refreshEntry", () =>
    linkListProvider.refresh()
  );

  vscode.commands.registerCommand("lnklst.newWindow", () => {
    changeNewWindowParam(context, true);
  });
  vscode.commands.registerCommand("lnklst.sameWindow", () => {
    changeNewWindowParam(context, false);
  });

  vscode.commands.registerCommand(
    "lnklst.openItem",
    (item: LinkListTreeItem) => {
      openItem(context, item);
    }
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
