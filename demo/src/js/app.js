/**
  * Main app file
  */

window.app = angular.module("app", ["ngSockets"]);

app.config(["$socketsProvider", function($socketsProvider) {

	/* Store the server ip */
	$socketsProvider.setup({
		server: 'ws://127.0.0.1:8080'
	});
}]);

app.controller("AppController", function($scope, $sockets) {

	$scope.messages = [];

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
			}
		}
	});


	/* Sends the message through the pipe */
	$scope.sendMessage = function() {
		var msg = document.querySelector("input").value;
		document.querySelector("input").value = "";
		$scope.messages.push($sockets.send(msg));
	}
});