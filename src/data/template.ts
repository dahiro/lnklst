import { LinkListTreeItem } from "../types";

export const lnkLstTemplate: LinkListTreeItem[] = [
  {
    icon: "rocket",
    name: "deployments",
    group: "xy/sk8s",
    children: [
      {
        url: "ssh://git@git.host.com/project/argocd-apps-dev-xy-kustomize.git",
        icon: "send",
        name: "argocd prod",
      },
      {
        url: "ssh://git@git.host.com/project/xy-dev-kustomize.git",
        icon: "send",
        name: "dev",
      },
    ],
  },
  {
    icon: "source-control",
    name: "project x",
    url: "git@github.com:organization/repository-x.git",
  },
  {
    icon: "source-control",
    name: "projext y",
    url: "git@github.com:organization/repository-y.git",
  },
  {
    icon: "book",
    name: "Documentation",
    url: "https://some.site.to.visit/interesting",
  },
];
