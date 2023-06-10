import * as vscode from "vscode";
import { join, dirname } from "node:path";
import { lstatSync } from "node:fs";
import { LinkListTreeItem } from "./types";
import { getNewWindowParam } from "./extension";

function deriveGroupAndProjectFromGitUrl(url: string) {
  console.debug("url", url);
  if (url.startsWith("ssh://git@")) {
    return join(
      ...url.replace(/.git$/, "").split("//").slice(-1)[0].split("/").slice(1)
    );
  } else if (url.startsWith("git@")) {
    return join(...url.replace(/.git$/, "").split(":").slice(-1)[0].split("/"));
  }
  return "";
}

function deriveProjectFromGitUrl(url: string) {
  return url.replace(/.git$/, "").split("/").slice(-1)[0];
}

function deriveGroupAndProjectFromItem(url: string, group?: string) {
  if (group) {
    return join(group, deriveProjectFromGitUrl(url));
  }
  if (url?.endsWith(".git")) {
    return deriveGroupAndProjectFromGitUrl(url);
  }
  return "";
}

export function openItem(
  context: vscode.ExtensionContext,
  item: LinkListTreeItem
) {
  const baseFolder =
    vscode.workspace.getConfiguration("lnklst").get<string>("baseFolder") ||
    "~/src";

  if (!item.url) {
    console.error("unable to open item", item);
  } else if (item.url.endsWith(".git")) {
    console.log("checking", item.group, item.url);
    const projectFolder = deriveGroupAndProjectFromItem(item.url, item.group);
    console.log("checking", projectFolder);

    const targetFolder = join(baseFolder, projectFolder);

    const stat = lstatSync(targetFolder, {
      throwIfNoEntry: false,
    });

    if (stat?.isDirectory()) {
      console.log("opening", targetFolder);
      return vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(targetFolder),
        {
          forceNewWindow: getNewWindowParam(context),
        }
      );
    } else {
      console.log("cloning", item.url, targetFolder);
      return vscode.commands.executeCommand(
        "git.clone",
        item.url,
        dirname(targetFolder)
      );
    }
  } else if (item.url.startsWith("http")) {
    console.log("opening", item.url);
    return vscode.env.openExternal(vscode.Uri.parse(item.url, true));
  } else {
    const targetFolder = join(baseFolder, item.url);
    const stat = lstatSync(targetFolder, {
      throwIfNoEntry: false,
    });
    if (stat?.isDirectory()) {
      console.log("opening", targetFolder);
      return vscode.commands.executeCommand(
        "vscode.openFolder",
        vscode.Uri.file(targetFolder),
        {
          forceNewWindow: getNewWindowParam(context),
        }
      );
    }
  }
}
