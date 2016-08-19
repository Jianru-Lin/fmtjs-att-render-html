module.exports = render

function render(att, options) {
	return '<div id="ast">' + JSON.stringify(att) + '</div>'
}