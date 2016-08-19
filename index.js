var assets = require('./lib/assets')
var html_render = require('./lib/html_render')

module.exports = render

function render(att, options) {
	var filename = options.filename || 'unknown'
	var html_content_str = html_render(att, options)
	var result = assets.load().fill(html_content_str, filename)
	return result
}
