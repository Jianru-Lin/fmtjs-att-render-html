var config = {}
var type_handler = {}

type_handler['Program'] = function(ast, ctx) {
	ctx = ctx || {}
	return vdom(
		'div', 
		ast.type,
		vdom('span', 'body', process_ast_list(ast.body, ctx))
	)
}

type_handler['FunctionDeclaration'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'keyword','function'),
			vsp(),
			vdom('span', 'id', process_ast(ast.id, ctx)),
			vsp(),
			vdom('span', 'params', function() {
				return vbrace(vjoin(process_ast_list(ast.params, ctx).map(wrap_vdom('span', 'param')), function() {
					return [vcomma(), vsp()]
				}))
			}),
			vsp(),
			vdom('span', 'body', [process_ast(ast.body, ctx)])
		]
	)
}

type_handler['FunctionExpression'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'keyword','function'),
			vsp(),
			// id 部分不一定存在，可有可无
			function() {
				if (ast.id) {
					return [
						vdom('span', ['name'], process_ast(ast.id, ctx)),
						vsp()
					]
				}
			},
			vdom('span', 'params', function() {
				return vbrace(vjoin(process_ast_list(ast.params, ctx).map(wrap_vdom('span', 'param')), function() {
					return [vcomma(), vsp()]
				}))
			}),
			vsp(),
			vdom('span', 'body', [process_ast(ast.body, ctx)])
		]
	)
}

type_handler['ExpressionStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'expression', process_ast(ast.expression, ctx)),
			vsp(),
			vsemi()
		]
	)
}

type_handler['CallExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'callee', vbrace(process_ast(ast.callee, ctx))),
			vdom('span', 'arguments', function() {
				return vbrace(vjoin(process_ast_list(ast.arguments, ctx).map(wrap_vdom('span', 'argument')), function() {
					return [vcomma(), vsp()]
				}))
			})
		]
	)
}

type_handler['BlockStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		vdom('span', 'body', vbracket(process_ast_list(ast.body, ctx)))
	)
}

type_handler['VariableDeclaration'] = function(ast, ctx) {
	// console.log(ast)
	assert(ast.kind === 'var' || ast.kind === 'const')
	ctx['VariableDeclarator'] = {
		kind: ast.kind
	}
	return vdom(
		'div',
		ast.type,
		vdom('span', 'declarations', process_ast_list(ast.declarations, ctx))
	)
}

type_handler['VariableDeclarator'] = function(ast, ctx) {
	// console.log(ast)
	assert(ctx['VariableDeclarator'].kind === 'var' || ctx['VariableDeclarator'].kind === 'const')
	var kind = ctx['VariableDeclarator'].kind
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'kind', vdom('span', 'keyword', kind)),
			vsp(),
			vdom('span', 'id', process_ast(ast.id, ctx)),
			function() {
				if (ast.init) {
					return vdom(
						'span',
						'init',
						[
							vsp(),
							vdom('span', 'eq', '='),
							vsp(),
							vdom('span', 'init', process_ast(ast.init, ctx))
						]
					)
				}
			},
			vsp(),
			vsemi()
		]
	)
}

type_handler['AssignmentExpression'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'span',
		ast.type,
		// vbrace([
		[
			vdom('span', 'left', process_ast(ast.left, ctx)),
			vsp(),
			vdom('span', 'eq', '='),
			vsp(),
			vdom('span', 'right', process_ast(ast.right, ctx))
		]
		// ])
	)
}

type_handler['ReturnStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'keyword', 'return'),
			function() {
				if (ast.argument) {
					return [
						vsp(),
						vdom('span', 'argument', process_ast(ast.argument, ctx))
					]
				}
			},
			vsp(),
			vsemi()
		]
	)
}

type_handler['MemberExpression'] = function(ast, ctx) {
	// console.log(ast)
	if (ast.computed) {
		return vdom(
			'span',
			ast.type,
			[
				vdom('span', 'object', process_ast(ast.object, ctx)),
				vdom('span', 'property', vsqbracket(process_ast(ast.property, ctx)))
			]
		)
	}
	else {
		return vdom(
			'span',
			ast.type,
			[
				vdom('span', 'object', process_ast(ast.object, ctx)),
				vdom('span', 'dot', '.'),
				vdom('span', 'property', process_ast(ast.property, ctx))
			]
		)
	}
}

type_handler['IfStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'keyword', 'if'),
			vsp(),
			vdom('span', 'test', vbrace(process_ast(ast.test, ctx))),
			vsp(),
			vdom('span', 'consequent', process_ast(ast.consequent, ctx)),
			function() {
				if (ast.alternate) {
					return [
						vsp(),
						vdom('span', 'keyword', 'else'),
						vsp(),
						vdom('span', 'alternate', process_ast(ast.alternate, ctx))
					]
				}
			}
		]
	)
}

// TODO 参数列表中的逗号间隔未解决 
type_handler['NewExpression'] = function(ast, ctx) {
	console.log(ast)
	assert(ast.callee)
	assert(ast.arguments)
	return vdom(
		'span',
		ast.type,
		[
			vkeyword('new'),
			vsp(),
			vdom('span', 'callee', process_ast(ast.callee, ctx)),
			vsp(),
			vdom('span', 'arguments', [
				vbrace(process_ast_list(ast.arguments, ctx).map(wrap_vdom('span', 'argument')))
			]),
		]
	)
}

type_handler['ThisExpression'] = function(ast, ctx) {
	return vdom('span', [ast.type, 'keyword'], 'this')
}

type_handler['Identifier'] = function(ast, ctx) {
	return vdom('span', [ast.type, 'identifier'], ast.name)
}

type_handler['Literal'] = function(ast, ctx) {
	// console.log(ast)
	if (ast.regex) {
		return vdom('span', [ast.type, 'regex'], ast.raw)
	}

	var value = ast.value
	var value_type = typeof value
	switch (value_type) {
		case 'number':
			return vdom('span', [ast.type, value_type], value.toString())
		case 'boolean':
			return vdom('span', [ast.type, value_type], value.toString())
		case 'object':
			assert(value === null)
			return vdom('span', [ast.type, value_type], 'null')
		case 'undefined':
			return vdom('span', [ast.type, value_type], 'undefined')
		case 'string':
			return vdom('span', [ast.type, value_type], JSON.stringify(value))
		default:
			throw new Error('not implemented')
	}
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
	assert(ctx && true)
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