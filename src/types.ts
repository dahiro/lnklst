import { ThemeIcon } from "vscode";

export interface LinkListTreeItem {
  icon?: string;
  name: string;
  group?: string;
  url?: string;
  children?: LinkListTreeItem[];
}
