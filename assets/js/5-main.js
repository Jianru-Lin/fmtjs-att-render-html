$(function() {
	var ast = window.ast
	try {
		$('#ast').text(JSON.stringify(ast, null, 4))
		$('#content').append(process_ast(ast).toDom())
	}
	catch (err) {
		log('error', err.toString())
		throw err
	}
})