// 用于支持多语言（中文／英文）
var translator = (function() {
	var lang_table = {
		'en-us': {
			'fold-all': 'Fold All',
			'unfold-all': 'Unfold All'
		},
		'zh-cn': {
			'fold-all': '折叠全部',
			'unfold-all': '展开全部'
		}
	}

	return {
		run: function() {
			var lang = navigator.language || navigator.browserLanguage || 'en-us'
			return this.convert_to(lang)
		},
		convert_to: function(lang) {
			lang = lang.toLowerCase()
			if (!lang_table[lang]) return false
			$('[x-t]').each(function(i, item) {
				$item = $(item)
				var v = $item.attr('x-t')
				if (lang_table[lang][v]) {
					$item.text(lang_table[lang][v])
				}
			})
			return true
		}
	}
})();

// 一些工具函数
var util = (function() {
	var obj = {}

	obj.mouse_enter_leave = function(selector, enter_cb, leave_cb) {
		if (Array.isArray(selector)) {
			selector.forEach(function(s) {
				obj.mouse_enter_leave(s, enter_cb, leave_cb)
			})
			return
		}

		enter_cb = enter_cb || function() {}
		leave_cb = leave_cb || function() {}

		$(selector).on('mouseenter', function() {
			enter_cb.apply(this, arguments)
		})
		$(selector).on('mouseleave', function() {
			leave_cb.apply(this, arguments)
		})
	}

	return obj
})();

// 允许用户对某些结构进行水平／垂直布局切换
function can_switch_horizontal_vertical_layout() {
	// SequenceExpression 的垂直布局与水平布局切换实现
	$('#content').on('click', '.SequenceExpression > .expressions > .operator', function() {
		$this = $(this)
		$SequenceExpression = $this.parent().parent()
		$SequenceExpression.toggleClass('vertical-layout')
		$SequenceExpression.toggleClass('area')
	})

	// ArrayExpression 的垂直布局与水平布局切换实现
	$('#content').on('click', '.ArrayExpression > .elements > .collapsable.square-bracket > .comma', function() {
		$this = $(this)
		$collapsable = $this.parent()
		$collapsable.toggleClass('vertical-layout')
		$collapsable.toggleClass('area')
	})
}

// 允许用户折叠／展开代码块
function can_collapse_expand() {
	// 可折叠特性实现
	$('#content').on('mouseenter', '.left-coll', function() {
		$this = $(this)
		$this.addClass('hover')
		$this.nextAll('.collapsable').addClass('hover')
		$this.nextAll('.right-coll').addClass('hover')
	})

	$('#content').on('mouseenter', '.right-coll', function() {
		$this = $(this)
		$this.addClass('hover')
		$this.prevAll('.collapsable').addClass('hover')
		$this.prevAll('.left-coll').addClass('hover')
	})

	$('#content').on('mouseleave', '.left-coll', function() {
		$this = $(this)
		$this.removeClass('hover')
		$this.nextAll('.collapsable').removeClass('hover')
		$this.nextAll('.right-coll').removeClass('hover')
	})

	$('#content').on('mouseleave', '.right-coll', function() {
		$this = $(this)
		$this.removeClass('hover')
		$this.prevAll('.collapsable').removeClass('hover')
		$this.prevAll('.left-coll').removeClass('hover')
	})

	$('#content').on('click', '.left-coll', function() {
		$this = $(this)
		toggle($this.nextAll('.collapsable'))
	})

	$('#content').on('click', '.right-coll', function() {
		$this = $(this)
		toggle($this.prevAll('.collapsable'))
	})

	$('#content').on('click', '.collapsable-switcher', function() {
		$this = $(this)
		expand($this.prevAll('.collapsable'))
	})

	function toggle($collapsable) {
		if ($collapsable.hasClass('hidden')) {
			expand($collapsable)
		}
		else {
			collapse($collapsable)
		}
	}

	function collapse($collapsable) {
		$collapsable.addClass('hidden')
		$collapsable.nextAll('.collapsable-switcher').removeClass('hidden')
	}

	function expand($collapsable) {
		$collapsable.removeClass('hidden')
		$collapsable.nextAll('.collapsable-switcher').addClass('hidden')
	}
}

// 允许用户在运算符上悬停查看操作数
function can_highlight_operator() {
	util.mouse_enter_leave(
		[
			'.BinaryExpression > .operator',
			'.LogicalExpression > .operator',
			'.UnaryExpression > .operator',
			'.UpdateExpression > .operator'
		],
		function() {
			$(this).parent().addClass('highlight-operator')
		},
		function() {
			$(this).parent().removeClass('highlight-operator')
		}
	)

	util.mouse_enter_leave(
		[
			'.SequenceExpression > .expressions > .operator'
		],
		function() {
			$(this).parent().parent().addClass('highlight-operator')
		},
		function() {
			$(this).parent().parent().removeClass('highlight-operator')
		}
	)
}

// 允许用户使用工具栏功能
function can_use_toolbar() {
	// 工具栏按钮功能
	$('button#col-all').click(function() {
		$('.collapsable.bracket').addClass('hidden')
		$('.collapsable-switcher.bracket').removeClass('hidden')
	})
	
	$('button#exp-all').click(function() {
		$('.collapsable-switcher.bracket').addClass('hidden')
		$('.collapsable.bracket').removeClass('hidden')
	})
}

// 隐藏部分表达式括号，不要让程序看起来太复杂
function hide_unnecessary_exp_brace() {
	$('.exp-brace > .collapsable > .Identifier').parent().parent().addClass('unnecessary')
	$('.exp-brace > .collapsable > .Literal').parent().parent().addClass('unnecessary')
	$('.exp-brace > .collapsable > .TaggedTemplateExpression').parent().parent().addClass('unnecessary')
	$('.exp-brace > .collapsable > .TemplateLiteral').parent().parent().addClass('unnecessary')
	$('.exp-brace > .collapsable > .ThisExpression').parent().parent().addClass('unnecessary')
	$('.exp-brace > .collapsable > .MemberExpression').parent().parent().addClass('unnecessary')
}

// $(function() {
window.onload = function() {
	translator.run()

	var ast = window.ast
	try {
		// $('#ast').text(JSON.stringify(ast, null, 4))
		var vdom_item = process_ast(ast, {})
		// $('#vdom').text(JSON.stringify(vdom_item, null, 4))
		var dom = vdom_item.toDom()
		$('#content').append(dom)
		setTimeout(function() {
			$('#col-all')[0].click()
		}, 0)
	}
	catch (err) {
		log('error', err.toString())
		debugger
		throw err
	}

	can_switch_horizontal_vertical_layout()
	can_collapse_expand()
	can_highlight_operator()
	hide_unnecessary_exp_brace()
	can_use_toolbar()
}
// })