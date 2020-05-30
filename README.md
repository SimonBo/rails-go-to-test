# rails-go-to-test extension for VSCODE

This extension was HEAVILY inspired by this https://github.com/sporto/rails-go-to-spec-vscode.

Jump between code and test file in Rails projects.
Newly created files will be populated with test boilerplate.

Enjoy!

## Default keybinding:

- Ctrl + Shift + t
- Cmd + Shift + t (Mac)

## Redine shortcuts:


In keybindings.json

```
  ...
	{
		"key": "shift-cmd-t",
		"command": "rails-go-to-test.railsGoToTest",
		"when": "editorFocus"
	}
	...
```
