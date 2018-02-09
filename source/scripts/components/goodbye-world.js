// Elements that are always on the page
var eles = {

}

// vars that will get passed around
var vars = {

}

// funcs...all the funcs...
var funcs = {
	goodbye: () => {
    	alert(tmpls.goodbyeWorld())
    }
}

var tmpls = {
	goodbyeWorld: () => {
		return `Goodbye`;
	}
}

module.exports = {funcs};
