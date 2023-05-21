import { ThemeIcon } from "vscode";

export interface LinkListTreeItem {
  icon?: string;
  name: string;
  group?: string;
  test: ThemeIcon;
  url?: string;
  children?: LinkListTreeItem[];
}
