var fs = require('fs')
var path = require('path')

exports.load = function() {
	return {
		template: load_template(),
		js: load_js(),
		css: load_css(),
		// 填充模版并生成结果
		fill: function(content_html_str, filename) {
			var result = this.template
							.replace('${filename}', filename)
							.replace('${style}', this.css.join('\n'))
							.replace('${script}', this.js.join('\n'))
							.replace('${content}', content_html_str)
			return result
		}
	}
}

function load_template() {
	return fs.readFileSync(assets_sub_path('template.html'), 'utf8')
}

function load_js() {
	return fs.readdirSync(assets_sub_path('js'))
			.sort()
			.map(function(file) {
				return fs.readFileSync(assets_sub_path('js/' + file), 'utf8')
			})
}

function load_css() {
	return fs.readdirSync(assets_sub_path('css'))
			.sort()
			.map(function(file) {
				return fs.readFileSync(assets_sub_path('css/' + file), 'utf8')
			})
}

function assets_sub_path(x) {
	return path.resolve(__dirname, '../assets/', x)
}
