# LnkLst

An opiniated git project and link manager for vscode workspaces

## Features

Place a file `.vscode/lnklst.json` in your workspace folder following the schema described below.

The items can be a:

- **git URL**: The git repository will be opened from or cloned into the `lnklst.baseFolder` (configured in the settings)
- **group**: the subpath described in the group will be opened (makes sense if childrens of the group item are git URLs)
- **parseable URI**: will be opened by `vscode.env.openExternal`

## Documentation

### `lnklist.json` Schema

Schema described in [doc/lnklst-schema.json](doc/lnklst-schema.json) or Basically an array of objects of the following type:

```typescript
export interface LinkListTreeItem {
  icon?: string;
  name: string;
  group?: string;
  url?: string;
  children?: LinkListTreeItem[];
}
```

| Property | Description                                                                                                                      |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| name     | Name (as shown in Tree View)                                                                                                     |
| icon     | The id of the icon. The available icons are listed in https://code.visualstudio.com/api/references/icons-in-labels#icon-listing. |
| children | Array of LinkListTreeItem                                                                                                        |
| url      | Url that get's cloned or opened                                                                                                  |
| group    | path where git repository gets cloned to (passed to children)                                                                    |

An example is provided in [doc/lnklst.json](doc/lnklst.json)

## Requirements

- None yet

## Extension Settings

This extension contributes the following settings:

- `lnklst.baseFolder`: Base folder where your sources get cloned to. Defaults to `~/src`. Make sure `#git.openAfterClone#` is set appropriately.

## Known Issues

- None yet

## Open Tasks

- versioning
- CI/CD Pipeline with publishing, workaround:
  1. `vsce package`
  2. install by \*.vsix
- json editabibilty (edit and add items)

## Release Notes

- see [CHANGELOG.md](CHANGELOG.md)
