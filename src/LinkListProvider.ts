import * as vscode from "vscode";
let fs = require("fs");
import { readFileSync, lstatSync } from "node:fs";
import { join } from "node:path";

import { LinkListTreeItem } from "./types";

export class LinkListProvider implements vscode.TreeDataProvider<Item> {
  constructor(private rootPath: string) {}

  getTreeItem(element: Item): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Item): Thenable<Item[]> {
    if (!element) {
      return Promise.resolve(
        this._loadData().map((item) => new Item(item)) ?? []
      );
    } else {
      return Promise.resolve(
        element.item.children?.map(
          (item) => new Item(item, element.item.group)
        ) ?? []
      );
    }
  }

  private _loadData(): LinkListTreeItem[] {
    const lnklstFilePath = join(this.rootPath, ".vscode", "lnklst.json");
    const stat = lstatSync(lnklstFilePath, {
      throwIfNoEntry: false,
    });
    if (stat?.isFile()) {
      let rawdata = readFileSync(lnklstFilePath);
      return JSON.parse(rawdata.toString());
    } else {
      return [];
    }
  }

  private _onDidChangeTreeData: vscode.EventEmitter<
    Item | undefined | null | void
  > = new vscode.EventEmitter<Item | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<Item | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class Item extends vscode.TreeItem {
  constructor(
    public readonly item: LinkListTreeItem,
    public readonly parentGroup?: string
  ) {
    if (!item.group && parentGroup) {
      item.group = parentGroup;
    }
    if (!item.url && item.group) {
      item.url = item.group;
    }

    super(
      item.name,
      item.children?.length ?? 0 > 1
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None
    );

    if (item.icon) {
      this.iconPath = new vscode.ThemeIcon(item.icon);
    }

    if (item.url) {
      this.command = {
        command: "lnklst.openItem",
        arguments: [item],
        title: "some command",
      };
    }
  }
}
