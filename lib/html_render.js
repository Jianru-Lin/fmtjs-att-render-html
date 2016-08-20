module.exports = render

function render(att, options) {
	var tag = '<script type="text/javascript">?</script>'
	var code = 'window.ast=JSON.parse(?);'.replace('?', json(json(att)))
	return tag.replace('?', code)

	function json(obj) {
		return JSON.stringify(obj)
	}
}