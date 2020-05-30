
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
			.replace('.haml', '.haml_test.rb')
			.replace('.erb', '.erb_test.rb')
			.replace('.slim', '.slim_test.rb');
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

function testContent() {
  const text = `require 'test_helper'

class  < ActiveSupport::TestCase
  test "" do

  end
end
  `;

  return text;
}

module.exports = { getRelated, isSpec, codeToSpec, specToCode, testContent }