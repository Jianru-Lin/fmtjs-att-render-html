// $(function() {
window.onload = function() {
	var ast = window.ast
	try {
		// $('#ast').text(JSON.stringify(ast, null, 4))
		var vdom_item = process_ast(ast, {})
		// $('#vdom').text(JSON.stringify(vdom_item, null, 4))
		var dom = vdom_item.toDom()
		$('#content').append(dom)
	}
	catch (err) {
		log('error', err.toString())
		throw err
	}
}
// })