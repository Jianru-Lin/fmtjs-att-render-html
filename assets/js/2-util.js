function log(type, text) {
	var div = document.createElement('div')
	div.textContent = '[?1] ?2'.replace('?1', type).replace('?2', text)
	$('#log').append(div)
}