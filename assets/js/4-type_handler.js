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

type_handler['EmptyStatement'] = function(ast, ctx) {
	// ignore
}

type_handler['DebuggerStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('debugger'),
			vsp(),
			vsemi()
		]
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
				// 支持默认参数
				var params_and_defaults = zip(ast.params, ast.defaults)
				return vbrace(
					vjoin(
						params_and_defaults.map(function(item) {
							var param = item[0]
							var deflt = item[1]
							return vdom(
								'span',
								'param',
								[
									vdom('span', 'name', process_ast(param, ctx)),
									function() {
										if (deflt) {
											return [
												vsp(),
												vdom('span', 'eq', '='),
												vsp(),
												vdom('span', 'default', process_ast(deflt, ctx))
											]
										}
									}
								]
							)
						}), 
						function() {
							return [vcomma(), vsp()]
						}
					)
				)
			}),
			vsp(),
			vdom('span', 'body', [process_ast(ast.body, ctx)])
		]
	)
}

// ccfg = {no_function_keyword: true|false} 可配置是否生成 function 关键词
// ObjectExpression 下的 Property 会使用这个配置
type_handler['FunctionExpression'] = function(ast, ctx, ccfg) {
	return vdom(
		'div',
		ast.type,
		[
			function() {
				if (ccfg && ccfg.no_function_keyword) {
					return null
				}
				else {
					return [
						vdom('span', 'keyword','function'),
						vsp()
					]
				}
			},
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
				// 支持默认参数
				var params_and_defaults = zip(ast.params, ast.defaults)
				return vbrace(
					vjoin(
						params_and_defaults.map(function(item) {
							var param = item[0]
							var deflt = item[1]
							return vdom(
								'span',
								'param',
								[
									vdom('span', 'name', process_ast(param, ctx)),
									function() {
										if (deflt) {
											return [
												vsp(),
												vdom('span', 'eq', '='),
												vsp(),
												vdom('span', 'default', process_ast(deflt, ctx))
											]
										}
									}
								]
							)
						}), 
						function() {
							return [vcomma(), vsp()]
						}
					)
				)
			}),
			vsp(),
			vdom('span', 'body', [process_ast(ast.body, ctx)])
		]
	)
}

type_handler['ArrowFunctionExpression'] = function(ast, ctx) {
	assert(ast.id === null)
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'params', function() {
				// 支持默认参数
				var params_and_defaults = zip(ast.params, ast.defaults)
				return vbrace(
					vjoin(
						params_and_defaults.map(function(item) {
							var param = item[0]
							var deflt = item[1]
							return vdom(
								'span',
								'param',
								[
									vdom('span', 'name', process_ast(param, ctx)),
									function() {
										if (deflt) {
											return [
												vsp(),
												vdom('span', 'eq', '='),
												vsp(),
												vdom('span', 'default', process_ast(deflt, ctx))
											]
										}
									}
								]
							)
						}),
						function() {
							return [vcomma(), vsp()]
						}
					)
				)
			}),
			vsp(),
			voperator('=>'),
			vsp(),
			vdom('span', 'body', function() {
				var body = ast.body
				if (body.type === 'ObjectExpression') {
					return v_exp_brace(process_ast(body, ctx))
				}
				else {
					return [process_ast(ast.body, ctx)]
				}
			})
		]
	)
}

type_handler['RestElement'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vkeyword('...'),
			vdom('span', 'argument', process_ast(ast.argument, ctx))
		]
	)
}

type_handler['ExpressionStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'expression', function() {
				// 如果是函数表达式或者对象的话，我们要给它补上括号，其他则没必要
				if (ast.expression.type === 'FunctionExpression' ||
					ast.expression.type === 'ObjectExpression') {
					return v_exp_brace(process_ast(ast.expression, ctx))
				}
				else {
					return process_ast(ast.expression, ctx)
				}
			}),
			vsp(),
			vsemi()
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

type_handler['ClassDeclaration'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('class'),
			vsp(),
			process_ast(ast.id, ctx),
			vsp(),
			function() {
				if (ast.superClass) {
					return [
						vkeyword('extends'),
						vsp(),
						vdom('span', 'superClass', process_ast(ast.superClass, ctx)),
						vsp()
					]
				}
			},
			vbracket(function() {
				vdom('span', 'body', process_ast(ast.body, ctx))
			})
		]
	)
}

type_handler['ClassBody'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		process_ast_list(ast.body, ctx).map(wrap_vdom('div', 'body-item'))
	)
}

// type_handler['MethodDefinition'] = function(ast, ctx) {
// 	return vdom(
// 		'span',
		
// 	)
// }

// ccfg = {nosemi: true|false} 可配置是否生成末尾分号
// ForStatement 和 ForInStatement 会使用这个配置
type_handler['VariableDeclaration'] = function(ast, ctx, ccfg) {
	// console.log(ast)
	assert(ast.kind === 'var' || ast.kind === 'const' || ast.kind === 'let')
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', ['kind', ast.kind], vkeyword(ast.kind)),
			vsp(),
			vdom('span', 'declarations', function() {
				return process_ast_list(ast.declarations, ctx).map(function(declaration, i) {
					return vdom('div', 'declaration', function() {
						return [
							declaration,
							function() {
								if (i === (ast.declarations.length - 1)) {
									if (ccfg && ccfg.nosemi) return undefined
									return [vsp(), vsemi()]
								}
								else {
									return [vcomma()]
								}
							}
						]
					})
				})
			})
		]
	)
}

type_handler['VariableDeclarator'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'span',
		ast.type,
		[
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
			}
		]
	)
}

type_handler['ReturnStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
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

type_handler['WhileStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('while'),
			vsp(),
			vdom('span', 'test', vbrace(process_ast(ast.test, ctx))),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ctx))
		]
	)
}

type_handler['DoWhileStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('do'),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ctx)),
			vsp(),
			vkeyword('while'),
			vsp(),
			vdom('span', 'test', vbrace(process_ast(ast.test, ctx)))
		]
	)
}

type_handler['TryStatement'] = function(ast, ctx) {
	// console.log(ast)
	assert(ast.guardedHandlers.length === 0)
	assert(ast.handlers.length === 0 || ast.handlers.length === 1)
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('try'),
			vsp(),
			vdom('span', 'block', process_ast(ast.block, ctx)),
			function() {
				if (ast.handler) {
					return [
						vsp(),
						vdom('span', 'handler', process_ast(ast.handler, ctx)) // CatchClause
					]
				}
			},
			function() {
				if (ast.finalizer) {
					return [
						vsp(),
						vkeyword('finally'),
						vsp(),
						vdom('span', 'finalizer', process_ast(ast.finalizer, ctx))
					]
				}
			}
		]
	)
}

type_handler['CatchClause'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vkeyword('catch'),
			vsp(),
			vdom('span', 'param', vbrace(process_ast(ast.param, ctx))),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ctx))
		]
	)
}

type_handler['ForStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		'ast.type',
		[
			vkeyword('for'),
			vsp(),
			// 少见的括号在结构之上的例外
			vbrace([
				vdom('span', 'init', function() {
					// init 部分为 null 是可能的
					if (!ast.init) return
					// 命令 VariableDeclaration 不要生成末尾分号，因为这里会生成
					if (ast.init.type === 'VariableDeclaration') {
						return process_ast(ast.init, ctx, {nosemi: true})
					}
					else {
						return process_ast(ast.init, ctx)
					}
				}),
				vsp(), 
				vsemi(),
				function() {
					if (ast.test) {
						return [
							vsp(),
							vdom('span', 'test', process_ast(ast.test, ctx)),
						]
					}
				},
				vsp(),
				vsemi(),
				vsp(),
				function() {
					if (ast.update) {
						return vdom('span', 'update', process_ast(ast.update, ctx))
					}
				}
			]),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ctx))
		]
	)
}

type_handler['ForInStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('for'),
			vsp(),
			// 少见的括号在结构之上的例外
			vbrace([
				vdom('span', 'left', function() {
					// 命令 VariableDeclaration 不要生成末尾分号，因为这里会生成
					if (ast.left && ast.left.type === 'VariableDeclaration') {
						return process_ast(ast.left, ctx, {nosemi: true})
					}
					else {
						return process_ast(ast.left, ctx)
					}
				}),
				vsp(),
				vkeyword('in'),
				vsp(),
				vdom('span', 'right', process_ast(ast.right, ctx))
			]),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ast))
		]
	)
}

type_handler['ContinueStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('continue'),
			function() {
				if (ast.label) {
					return [
						vsp(),
						vdom('span', 'label', process_ast(ast.label, ctx))
					]
				}
			},
			vsp(),
			vsemi()
		]
	)
}

type_handler['BreakStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('break'),
			function() {
				if (ast.label) {
					return [
						vsp(),
						vdom('span', 'label', process_ast(ast.label, ctx))
					]
				}
			},
			vsp(),
			vsemi()
		]
	)
}

type_handler['LabeledStatement'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'div',
		ast.type,
		[
			vdom('span', 'label', process_ast(ast.label, ctx)),
			vcolon(),
			vsp(),
			vdom('span', 'body', process_ast(ast.body, ctx))
		]
	)
}

type_handler['ThrowStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('throw'),
			vsp(),
			vdom('span', 'argument', process_ast(ast.argument, ctx)),
			vsp(),
			vsemi()
		]
	)
}

type_handler['SwitchStatement'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			vkeyword('switch'),
			vsp(),
			vdom('span', 'discriminant', function() {
				return vbrace(process_ast(ast.discriminant, ctx))
			}),
			vsp(),
			// 少见的括号在结构之上的例外
			vbracket(function() {
				return vdom('span', 'cases', function() {
					return process_ast_list(ast.cases, ctx).map(wrap_vdom('div', 'case'))
				})
			})
		]
	)
}

type_handler['SwitchCase'] = function(ast, ctx) {
	return vdom(
		'div',
		ast.type,
		[
			function() {
				// 一般的 case
				if (ast.test) {
					return [
						vkeyword('case'),
						vsp(),
						vdom('span', 'test', process_ast(ast.test, ctx))
					]
				}
				// 没有 test 部分的是 default 分句
				else {
					return [
						vkeyword('default')
					]
				}
			},
			vcolon(),
			vsp(),
			vdom('span', 'consequent', process_ast_list(ast.consequent, ctx))
		]
	)
}

type_handler['CallExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'callee', function() {
				if (ast.callee.type === 'FunctionExpression') {
					return v_exp_brace(process_ast(ast.callee, ctx))
				}
				else {
					return process_ast(ast.callee, ctx)
				}
			}),
			vsp(),
			vdom('span', 'arguments', function() {
				return vbrace(vjoin(process_ast_list(ast.arguments, ctx).map(wrap_vdom('span', 'argument')), function() {
					return [vcomma(), vsp()]
				}))
			})
		]
	)
}

type_handler['AssignmentExpression'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'span',
		ast.type,
		[
			// vdom('span', 'left', v_exp_brace(process_ast(ast.left, ctx))),
			vdom('span', 'left', process_ast(ast.left, ctx)),
			vsp(),
			voperator('='),
			vsp(),
			// vdom('span', 'right', v_exp_brace(process_ast(ast.right, ctx)))
			vdom('span', 'right', process_ast(ast.right, ctx))
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

type_handler['NewExpression'] = function(ast, ctx) {
	// console.log(ast)
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
				vbrace(function() {
					return vjoin(process_ast_list(ast.arguments, ctx).map(wrap_vdom('span', 'argument')), function() {
						return [vcomma(), vsp()]
					})
				})
			]),
		]
	)
}

type_handler['ConditionalExpression'] = function(ast, ctx) {
	// return vdom(
	// 	'span',
	// 	ast.type,
	// 	[
	// 		vdom('span', 'test', v_exp_brace(process_ast(ast.test, ctx))),
	// 		vsp(),
	// 		voperator('?'),
	// 		vsp(),
	// 		vdom('span', 'consequent', v_exp_brace(process_ast(ast.consequent, ctx))),
	// 		vsp(),
	// 		voperator(':'),
	// 		vsp(),
	// 		vdom('span', 'alternate', v_exp_brace(process_ast(ast.alternate, ctx)))
	// 	]
	// )

	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'test', v_exp_brace(process_ast(ast.test, ctx))),
			vsp(),
			vdom('span', '_align', [
				vdom('div', '_align', [
					voperator('?'),
					vsp(),
					vdom('span', 'consequent', v_exp_brace(process_ast(ast.consequent, ctx))),
					// vsp()
				]),
				vdom('div', '_align', [
					voperator(':'),
					vsp(),
					vdom('span', 'alternate', v_exp_brace(process_ast(ast.alternate, ctx)))
				])
			])
		]
	)
}

type_handler['BinaryExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'left', v_exp_brace(process_ast(ast.left, ctx))),
			vsp(),
			voperator(ast.operator),
			vsp(),
			vdom('span', 'right', v_exp_brace(process_ast(ast.right, ctx))),
		]
	)
}

type_handler['UpdateExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		function() {
			if (ast.prefix) {
				return [
					voperator(ast.operator),
					vsp(),
					vdom('span', 'argument', v_exp_brace(process_ast(ast.argument, ctx)))
				]
			}
			else {
				return [
					vdom('span', 'argument', v_exp_brace(process_ast(ast.argument, ctx))),
					vsp(),
					voperator(ast.operator)
				]
			}
		}
	)
}

type_handler['LogicalExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'left', v_exp_brace(process_ast(ast.left, ctx))),
			vsp(),
			voperator(ast.operator),
			vsp(),
			vdom('span', 'right', v_exp_brace(process_ast(ast.right, ctx))),			
		]
	)
}

type_handler['UnaryExpression'] = function(ast, ctx) {
	assert(ast.prefix === true)
	return vdom(
		'span',
		ast.type,
		[
			voperator(ast.operator),
			vsp(),
			vdom('span', 'argument', v_exp_brace(process_ast(ast.argument, ctx)))
		]
	)
}

type_handler['SequenceExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		vdom('span', 'expressions', function() {
			return vjoin(process_ast_list(ast.expressions, ctx).map(v_exp_brace), function() {
				return [voperator(','), vsp()]
			})
		})
	)
}

type_handler['ArrayExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		vdom('span', 'elements', vsqbracket(function() {
			if (!ast.elements || ast.elements.length < 1) return
			return vjoin(process_ast_list(ast.elements, ctx).map(wrap_vdom('span', 'element')), function() {
				return [vcomma(), vsp()]
			})
		}))
	)
}

type_handler['ObjectExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		vdom('span', 'properties', vbracket(function() {
			if (!ast.properties || ast.properties.length < 1) return
			return process_ast_list(ast.properties, ctx).map(wrap_vdom('div', 'property'))
		}))
	)
}

type_handler['Property'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		function() {
			// ES6 属性简写？
			if (ast.shorthand) {
				assert(ast.method === false)
				assert(ast.computed === false)
				assert(ast.kind === 'init')
				assert(ast.key && ast.key.type === 'Identifier')
				assert(ast.key.type === ast.value.type)
				assert(ast.key.name === ast.value.name)
				return vdom('span', ['key', 'shorthand'], process_ast(ast.key, ctx))
			}
			// get/set ？
			else if (ast.kind === 'get' || ast.kind === 'set') {
				assert(ast.method === false)
				return [
					vkeyword(ast.kind),
					vsp(),
					function() {
						if (ast.computed) {
							return vdom('span', 'key', vsqbracket(process_ast(ast.key, ctx)))
						}
						else {
							return vdom('span', 'key', process_ast(ast.key, ctx))
						}
					},
					vdom('span', 'value', process_ast(ast.value, ctx, {no_function_keyword: true})) // 注意传递了信息给 FunctionExpression 让它不要生成 function 关键字
				]
			}
			else {
				// ES6 方法？
				if (ast.method) {
					assert(ast.shorthand === false)
					assert(ast.kind === 'init')
					return [
						function() {
							if (ast.computed) {
								return vdom('span', 'key', vsqbracket(process_ast(ast.key, ctx)))
							}
							else {
								return vdom('span', 'key', process_ast(ast.key, ctx))
							}
						},
						vsp(),
						vdom('span', 'value', process_ast(ast.value, ctx, {no_function_keyword: true})) // 注意传递了信息给 FunctionExpression 让它不要生成 function 关键字
					]
				}
				// 老的属性表达方式
				else {
					return [
						function() {
							if (ast.computed) {
								return vdom('span', 'key', vsqbracket(process_ast(ast.key, ctx)))
							}
							else {
								return vdom('span', 'key', process_ast(ast.key, ctx))
							}
						},
						vcolon(),
						vsp(),
						vdom('span', 'value', process_ast(ast.value, ctx))
					]
				}
			}
		}
	)
}

type_handler['ThisExpression'] = function(ast, ctx) {
	return vdom('span', [ast.type, 'keyword'], 'this')
}

type_handler['Identifier'] = function(ast, ctx) {
	return vdom('span', [ast.type, 'identifier'], ast.name)
}

type_handler['TemplateElement'] = function(ast, ctx) {
	// assert(ast.value.raw === ast.value.cooked)
	return vdom(
		'span',
		ast.type,
		ast.value.raw // 这里没有使用 ast.value.cooked，以后研究清楚后再重新考虑下
	)
}

type_handler['TemplateLiteral'] = function(ast, ctx) {
	// console.log(ast)
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', '', '`'),
			function() {
				var children = []
				var quasis = ast.quasis
				var expressions = ast.expressions
				// 即使对于空模版字符串 `` 下面的条件也成立
				// 而且对于 `${e}` 这样只有表达式的空模版字符串也是成立的
				assert(quasis.length === (expressions.length + 1))
				for (var i = 0; i < quasis.length; ++i) {
					var q = quasis[i]
					var e = expressions[i]
					// 注意包装在 q 元素中
					children.push(vdom('span', 'q', process_ast(q, ctx)))
					// 当 q 是尾元素时，e 必然不存在
					if (q.tail === true) assert(e === undefined)
					if (e) {
						// 注意包装在 e 元素中
						children.push(vdom('span', 'e', v_texp(process_ast(e, ctx))))
					}
				}
				return children
			},
			vdom('span', '', '`')
		]
	)
}

type_handler['TaggedTemplateExpression'] = function(ast, ctx) {
	return vdom(
		'span',
		ast.type,
		[
			vdom('span', 'tag', process_ast(ast.tag, ctx)),
			vdom('span', 'quasi', process_ast(ast.quasi, ctx))
		]
	)
}

type_handler['Literal'] = function(ast, ctx) {
	// console.log(ast)
	if (ast.regex) {
		return vdom('span', [ast.type, 'regex'], ast.raw)
	}

	var value = ast.value
	var raw = ast.raw
	var value_type = typeof value
	switch (value_type) {
		case 'number':
			// 优先按照原始数值显示（维持进制）注意字母强制转为小写
			return vdom('span', [ast.type, value_type], [
				vdom('span', 'raw', raw.toLowerCase()),
				vdom('span', 'value', value.toString())
			])
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

function zip(list_a, list_b) {
	assert(Array.isArray(list_a))
	assert(Array.isArray(list_b))
	// assert(list_a.length === list_b.length)
	var new_list = []
	for (var i = 0; i < list_a.length; ++i) {
		new_list.push([list_a[i], list_b[i]])
	}
	return new_list
}

function process_ast_list(ast_list, ctx) {
	return ast_list.map(function(ast) {
		return process_ast(ast, ctx)
	})
}

// 对指定的 AST 节点进行处理
// 参数：
// - ast: 目标 AST 节点（必填）
// - ctx: 上下文对象（必填），层层传递，自动进行节点栈追逐
// - ccfg: Child Config 子节点配置（必填）,这一参数只会传给直接下级节点，不会层层传递
function process_ast(ast, ctx, ccfg) {
	assert(ast && true)
	assert(ctx && true)
	// 必须要有 stack 属性，用于记录层次栈
	ctx.stack = ctx.stack || []
	// 支持 parent 方法，这样可以用于查询上级节点
	ctx.parent = ctx.parent || function() {
		var st = this.stack
		var len = st.length
		if (len >= 2) {
			return st[len-2]
		}
		else {
			return null
		}
	}
	// 调用 type_handler 上对应的处理函数
	if (type_handler[ast.type]) {
		log('info', 'processing type' + ast.type)
		// 调用前把当前节点入栈
		ctx.stack.push(ast)
		try {
			return type_handler[ast.type](ast, ctx, ccfg)
		}
		finally {
			// 调用后弹出当前节点
			ctx.stack.pop()
		}
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