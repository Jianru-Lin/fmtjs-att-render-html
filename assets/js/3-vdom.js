function VDom(name, attrs, children) {
	this.name = name
	this.attrs = attrs
	this.children = children
}

VDom.prototype.toDom = function() {
	var e = document.createElement(this.name)
	var final_attrs = normalize_attrs(this.attrs)
	var final_children = normalize_children(this.children)
	for (var attr_name in final_attrs) {
		var attr_value = final_attrs[attr_name]
		e.setAttribute(attr_name, attr_value)
	}
	if (typeof final_children === 'string') {
		e.textContent = final_children
	}
	else {
		final_children.map(function(child) {
			return child.toDom()
		}).forEach(function(child_e) {
			e.appendChild(child_e)
		})		
	}
	return e

	function normalize_attrs(attrs) {
		if (attrs === null || attrs === undefined) return {}
		switch (typeof attrs) {
			case 'function':
				return normalize_attrs(attrs())
			case 'object':
				var o = {}
				for (var k in attrs) {
					o[k] = normalize_attr_value(attrs[k])
				}
				return o
			default:
				throw new Error('invalid attributes: ' + attrs)
		}

		function normalize_attr_value(attr_value) {
			if (attr_value === null || attr_value === undefined) return ''
			switch (typeof attr_value) {
				case 'function':
					return normalize_attr_value(attr_value())
				case 'string':
					return attr_value
				default:
					throw new Error('invalid attribute value: ' + attr_value)
			}
		}
	}

	function normalize_children(children) {
		if (children === null || children === undefined) return []
		switch (typeof children) {
			case 'function':
				return normalize_children(children())
			case 'object': // Array
				if (!Array.isArray(children)) {
					throw new Error('invalid children: ' + children)
				}
				return children.map(normalize_child).filter(ok_child)
			case 'string':
				return children
			default:
				throw new Error('invalid children: ' + children)
		}

		function ok_child(child) {
			return child && true
		}

		function normalize_child(child) {
			if (child === null || child === undefined) return child
			switch (typeof child) {
				case 'function':
					return normalize_child(child())
				case 'object':
					return child
				default:
					throw new Error('invalid child: ' + child)
			}
		}
	}
}

function vdom(name, attrs, children) {
	if (typeof attrs === 'string') {
		attrs = {
			'class': attrs
		}
	}
	else if (Array.isArray(attrs)) {
		attrs = {
			'class': attrs.join(' ')
		}
	}
	return new VDom(name, attrs, children)
}