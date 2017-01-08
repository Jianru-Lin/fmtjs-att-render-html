var assert = require('assert')
var pkg = require('./package.json')
var dmgr = require('./dmgr')

module.exports = render

function render(att, options) {
	// generate index data
	var url = dmgr.save({
		filename: options.filename || 'unknown',
		version: options.version || pkg.version,
		att: att
	})
	assert(typeof url === 'string')
	assert(/^http(s)?:\/\//.test(url))
	return '<script>location.href=' + JSON.stringify(url) + '</script>'
}
