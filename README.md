# rails-go-to-test extension for VSCODE

This extension was HEAVILY inspired by this https://github.com/sporto/rails-go-to-spec-vscode.

Jump between code and test file in Rails projects.
Newly created files will be populated with test boilerplate.

Enjoy!

## Default keybinding:

- Ctrl + Shift + t
- Cmd + Shift + t (Mac)

## Change keybinding:

Within VSCode (last tested in v1.56.1):
1. Open _Keyboard Shortcuts_ menu (`ctrl+k ctrl+s` for windows, `cmd+k cmd+s` for mac)
2. Search for `Go to test`
3. Hover over this extension's shortcut (identified by `extension.goToTest`) and click on the edit icon to the left (looks like a pencil)
4. Press a key combination and save to overwrite the default keybinding

Alternatively,

In `keybindings.json`:

```
[
	...
	{
		"key": "alt+cmd+t", // Your chosen combination
		"command": "extension.goToTest",
		"when": "editorTextFocus"
	},
	...
]
```

Shortcuts defined here will work in-addition-to whatever keybinding is specified in the _Keyboard Shortcuts_ menu.
If you wish to **replace** the default keybinding, add the following to `keybindings.json`:

```
[
	...
	{
		"key": "shift+cmd+t",
		"command": "-extension.goToTest", // Notice the `-` sign
		"when": "editorTextFocus"
	},
	...
]
```
