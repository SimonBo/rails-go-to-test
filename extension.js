// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const resolver = require('./src/resolver');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
* @param {vscode.ExtensionContext} context
*/
function openFile(fileName) {
	vscode.workspace
	.openTextDocument(fileName)
	.then(vscode.window.showTextDocument);
}

function prompt(fileName, cb) {
	let options = {
		placeHolder: `Create ${fileName}?`
	}
	vscode.window.showQuickPick(["Yes", "No"], options)
	.then(function(answer) {
		if (answer === "Yes") {
			cb();
		}
	});
}

function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rails-go-to-test" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.goToTest', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		let document = editor.document;
		let fileName = document.fileName;
		let related = resolver.getRelated(fileName);
		let relative = vscode.workspace.asRelativePath(related);
		let fileExists = fs.existsSync(related);
		let dirname = path.dirname(related);

		//console.log('fileExists', fileExists);

		if (fileExists) {
			openFile(related);
		} else {
			prompt(relative, function() {
				mkdirp.sync(dirname);
				fs.writeFile(related, resolver.testContent(fileName), function (err) {
					if (err) throw err;
					openFile(related);
				})
			});
		}

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
