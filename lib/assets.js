var fs = require('fs')
var path = require('path')

exports.load = function() {
	return {
		template: load_template(),
		js: load_js(),
		css: load_css()
	}
}

function load_template() {
	return fs.readFileSync(assets_sub_path('template.jade'), 'utf8')
}

function load_js() {
	return fs.readdirSync(assets_sub_path('js'))
			.filter(function(file) {
				return /\.js$/i.test(file)
			})
			.sort()
			.map(function(file) {
				return fs.readFileSync(assets_sub_path('js/' + file), 'utf8')
			})
			.join('\n;\n')
}

function load_css() {
	return fs.readdirSync(assets_sub_path('css'))
			.filter(function(file) {
				return /\.css$/i.test(file)
			})
			.sort()
			.map(function(file) {
				return fs.readFileSync(assets_sub_path('css/' + file), 'utf8')
			})
			.join('\n\n')
}

function assets_sub_path(x) {
	return path.resolve(__dirname, '../assets/', x)
}
