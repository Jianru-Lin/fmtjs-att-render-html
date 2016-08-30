var encodeEntities = require('./helper').encodeEntities

module.exports = render

function render(att, options) {
	var tag = '<script type="text/javascript">?</script>'
	var code = 'window.ast=JSON.parse(Base64.decode("?"));'.replace('?', base64(json(att)))
	// code = encodeEntities(code)
	return tag.replace('?', code)

	function json(obj) {
		return JSON.stringify(obj)
	}
}

function base64(text) {
	return new Buffer(text).toString('base64')
}