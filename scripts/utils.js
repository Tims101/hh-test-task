var addClass = function(element, className){
	element.className += " " + className;
};

var removeClass = function(element, className) {
	if (element == null){
		element = null;
	}
	element.className = element.className.replace( new RegExp('(?:^|\\s)'+ className+ '(?!\\S)', 'g') , '' );
};
