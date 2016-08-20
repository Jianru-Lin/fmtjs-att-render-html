var config = {}
var type_handler = {}

type_handler['Program'] = function(ast, ctx) {
	ctx = ctx || {}
	return vdom(
		'div', 
		ast.type,
		function() {
			return ast.body.map(function(child) {
				return process_ast(child, ctx)
			})
		}
	)
}

type_handler['FunctionDeclaration'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'keyword','function'),
			vdom('span', ['identifier', 'name'].join(' '), ast.id.name),
			vdom('div', 'args', function() {
				// TODO
			})
		]
	)
}

type_handler['FunctionExpression'] = function(ast, ctx) {
	assert(!ast.id)
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'keyword', 'function'),
			vdom('span', 'params', process_ast_list(ast.params)),
			vdom('span', 'body', [process_ast(ast.body)])
		]
	)
}

type_handler['ExpressionStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			process_ast(ast.expression)
		]
	)
}

type_handler['CallExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'callee', [process_ast(ast.callee, ctx)]),
			vdom('span', 'arguments', process_ast_list(ast.arguments, ctx).map(wrap_vdom('span', 'argument')))
		]
	)
}

type_handler['ThisExpression'] = function(ast, ctx) {
	return vdom('span', [ast.type, 'keyword'], 'this')
}

// 这个是用来和 [].map() 函数配合，进行节点包装的
function wrap_vdom(name, attrs) {
	return function(vdom_item) {
		return vdom(name, attrs, [vdom_item])
	}
}

function process_ast_list(ast_list, ctx) {
	return ast_list.map(function(ast) {
		return process_ast(ast, ctx)
	})
}

function process_ast(ast, ctx) {
	if (type_handler[ast.type]) {
		log('info', 'processing type' + ast.type)
		return type_handler[ast.type](ast, ctx)
	}
	else {
		log('warning', 'unknown type: ' + ast.type)
	}
}

function assert(v) {
	if (!v) {
		debugger
		throw new Error('assert failed')
	}
}