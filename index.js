var pkg = require('./package.json')
var path = require('path')
var fs = require('fs')
var web = require('fmtjs-web')
var web_cache = require('fmtjs-web/cache')

// start web server in background
web.start_bg()

module.exports = render

function render(att, options) {
	var id = hash(JSON.stringify(att))
	var filename = options.filename || 'unknown'
	var version = options.version || pkg.version
	// generate index data
	index_data(version, id, filename, att).save()
	// ok, return dummy html content
	var html_path = web.lv_url(id)
	return '<script>location.href="' + html_path + '"</script>'
}

function index_data(version, id, filename, att) {
	return {
		id: id,
		filename: filename,
		version: version,
		att: att,
		save: function() {
			web_cache.add(id, this)
		}
	}
}

function hash(text) {
	var algorithm = require('crypto').createHash('sha256')
	algorithm.update(text)
	return algorithm.digest('hex')
}
