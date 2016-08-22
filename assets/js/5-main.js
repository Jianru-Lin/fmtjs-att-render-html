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

	// 可折叠特性实现
	$('#content').on('mouseenter', '.left-coll', function() {
		$this = $(this)
		$this.addClass('hover').next().next().addClass('hover')
	})

	$('#content').on('mouseenter', '.right-coll', function() {
		$this = $(this)
		$this.addClass('hover').prev().prev().addClass('hover')
	})

	$('#content').on('mouseleave', '.left-coll', function() {
		$this = $(this)
		$this.removeClass('hover').next().next().removeClass('hover')
	})

	$('#content').on('mouseleave', '.right-coll', function() {
		$this = $(this)
		$this.removeClass('hover').prev().prev().removeClass('hover')
	})

	$('#content').on('click', '.left-coll', function() {
		$this = $(this)
		$this.next().toggleClass('hidden')
	})

	$('#content').on('click', '.right-coll', function() {
		$this = $(this)
		$this.prev().toggleClass('hidden')
	})
}
// })