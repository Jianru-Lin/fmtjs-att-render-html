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

	// 按钮功能
	
	$('button#col-all').click(function() {
		$('.collapsable.bracket').addClass('hidden')
		$('.collapsable-switcher.bracket').removeClass('hidden')
	})
	
	$('button#exp-all').click(function() {
		$('.collapsable-switcher.bracket').addClass('hidden')
		$('.collapsable.bracket').removeClass('hidden')
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
// })