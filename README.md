angular-sockets
===============

Easy to use sockets module for angularjs.


#### A. Usage
It's pretty straight forward, just include the version you want, import it in your app module definition and inside the app config method define the server's ip. Take a look inside the demo folder as well.

Example:
```javascript
app.config(["$socketsProvider", function($socketsProvider) {

	/* Store the server ip */
	$socketsProvider.setup({
		server: 'ws://127.0.0.1:8080',
		handlers: {
			/* Just needs to be a refference there */
			customSocketCallback: null
		}
	});
}]);


/* Main controller */
function MainCtrl($scope, $sockets) {
	/* Register handlers for events */
	$sockets.setup({
		handlers: {
			onopen: function() {
				console.log("onopen");
			},

			/* Listens for incomming messages */
			onmessage: function(a) {
				console.log("onmessage", a);
				if (a && a.type !== "greet") {
					$scope.messages.push(a);
					$scope.$digest();
				}
			},

			/* On close */
			onclose: function() {
				console.log("onclose");
			},

			customSocketCallback: function() {
				//magical stuff
			}
		}
	});

	/*
		Then when you're ready, call: $sockets.send(<string>);
	*/
}
```

#### B. Feedback
I need feedback :)