var pkg = require('./package.json')
var jade = require('jade')
var assets = require('./lib/assets')

module.exports = render

function render(att, options) {
	var filename = options.filename || 'unknown'
	var version = options.version || pkg.version
	var a = assets.load()
	var fn = jade.compile(a.template, {})
	return fn({
		filename: filename,
		version: version,
		style: a.css,
		script: a.js,
		init: gen_init_code(att)
	})

	function gen_init_code(att) {
		var code = 'window.ast=JSON.parse(Base64.decode("?"));'.replace('?', base64(json(att)))
		return code

		function json(obj) {
			return JSON.stringify(obj)
		}

		function base64(text) {
			return new Buffer(text).toString('base64')
		}
	}
}
