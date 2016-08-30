function log(type, text) {
	if (!log.enabled) return
	var div = document.createElement('div')
	div.setAttribute('class', type)
	div.textContent = '[?1] ?2'.replace('?1', type).replace('?2', text)
	$('#log').append(div)
}

log.enabled = false