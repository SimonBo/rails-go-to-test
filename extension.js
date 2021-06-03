const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

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

function getRelated(file) {
	if (isSpec(file)) {
		return specToCode(file);
	} else {
		return codeToSpec(file);
	}
}

function isSpec(file) {
	return file.indexOf('_test.rb') > -1;
}

function codeToSpec(file) {
	let viewRegex = /erb$|haml$|slim$/
	let isViewFile = file.match(viewRegex);

	if (isViewFile) {
		return file
			.replace('/app/', '/test/')
	}

	file = file.replace('.rb', '_test.rb');

	let isLibFile = file.indexOf('/lib/') > -1;
	if (isLibFile) {
		return file.replace('/lib/', '/test/lib/');
	}

	return file.replace('/app/', '/test/');
}

function specToCode(file) {
	let viewRegex = /(.erb|.haml|.slim)_test.rb$/;
  let isViewFile = file.match(viewRegex);

	if (isViewFile) {
		return file
			.replace('_test.rb', '')
			.replace('/test', '/app');
	}

	file = file.replace('_test.rb', '.rb');

	let isLibFile = file.indexOf('/test/lib/') > -1;
	if (isLibFile) {
		return file.replace('/test/lib/', '/lib/');
	}

	return file.replace('/test/', '/app/');
}

function snake2Pascal(str) {
  str +='';
  str = str.split('_');

  function upper( str ){
      return str.slice(0,1).toUpperCase() + str.slice(1,str.length);
  }


  for(var i=0;i<str.length;i++){
      var str2 = str[i].split('/');
      for(var j=0;j<str2.length;j++){
          str2[j] = upper(str2[j]);
      }
      str[i] = str2.join('');
  }
  return str.join('');
}

function testContent(file) {
	const split = file.split('/')
	const appIndex = split.indexOf('app')
	const startIndex = appIndex + 2
  const testTitle = split.slice(startIndex, split.length).map(x => snake2Pascal(x)).join('::').replace('.rb', 'Test')

	let testClass = 'ActiveSupport::TestCase'
	switch(split[appIndex + 1]) {
		case 'components':
			testClass = 'ViewComponent::TestCase'
			break
		case 'helpers':
			testClass = 'ActionView::TestCase'
			break
		case 'controllers':
			testClass = 'ActionDispatch::IntegrationTest'
			break
		default:
			break
	}


  const text = `require 'test_helper'

class ${testTitle} < ${testClass}
  test "" do

  end
end
`;

  return text;
}

function activate(context) {
	let disposable = vscode.commands.registerCommand('rails-go-to-test.goToTest', function () {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
		}

		const document = editor.document
		let fileName = document.fileName
		let related = getRelated(fileName)
		let relative = vscode.workspace.asRelativePath(related)
		let fileExists = fs.existsSync(related)
		let dirname = path.dirname(related)

		//console.log('fileExists', fileExists);

		if (fileExists) {
			openFile(related)
		} else {
			prompt(relative, function () {
				mkdirp.sync(dirname)
				fs.writeFile(related, testContent(fileName), function (err) {
					if (err) throw err
					openFile(related)
				})
			})
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
