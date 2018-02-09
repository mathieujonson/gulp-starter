 (function() {
	// Charlie is for templating
	require('./components/charlie.js')

	// Elements that are always on the page
	var eles = {
		body:        $('body'),
	}

	// vars that will get passed around
	var vars = {
		fireConfig:  {
			apiKey: "",
			authDomain: "",
			databaseURL: "",
			storageBucket: "",
			messagingSenderId: ""
		}
	}

	var tmpls = {
		helloWorld:       require('./templates/hello-world'),
	}

	// functions...all the functions...
	var funcs = {
		init: () => {
            // Get firebase rolling
            // firebase.initializeApp(vars.fireConfig);

			//Bring in the components
			const goodbyeWorld = require('./components/goodbye-world')

			eles.body.append(tmpls.helloWorld)
			$('button').on('click', goodbyeWorld.funcs.goodbye())
		}
	}

	// Aaaaaaand GO!
	funcs.init()
})()