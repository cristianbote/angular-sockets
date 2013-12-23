/**
  * Angular sockets module
  * This module helps bringing in the sockets, as a native extension of angularjs.
  * @author: Cristian Bote
  *
  * License: MIT, 2014
  */

(function(window, angular, undefined) {'use strict';

	/**
	  * Defining the module name to import. I followed the angularjs naming conventions like 'ng' + ModuleName;
	  */

	angular.module("ngSockets", [])
		.provider("$sockets", function() {

			/**
			  * Data object that holds the properties and event handlers.
			  * Everything here can be define calling the setup() method
			  */
			var _data = {
				server: null,
				scope: null,
				started: false,

				/* Event handlers */
				handlers: {
					onopen: null,
					onmessage: null,
					onclose: null
				},

				/* Holds the data model */
				model: {
					type: "message",
					ip: null,
					data: null
				},

				/* Cross-browser socket refference */
				ws: window.WebSocket || window.MozWebSocket
			}, _this = this, socket_ip = null;

			/**
			   * Socket setup method
			   * 
			   * @param <Object> data The config _data_ object, which holds the server ip, handlers and if there's a scope
			   */
			this.setup = function(data) {
				_data.handlers = data.handlers || _data.handlers;
				_data.scope = data.scope || _data.scope;
				_data.server = data.server || _data.server;

				if (_data.server && !_data.started) {
					_this.init();
				}
			}

			/**
			  * Returns the data based on the model
			  *
			  * @param <Any> data The data that needs to be sent. This could be a string or object type.
			  * @param <String> type The type of message. This is useful if you wanna define your own type of message.
			  *
			  * @return <String> The stringified mesasge ready to be sent.
			  */

			this.getModel = function(data, type) {

				_data.model.type = type || _data.model.type;
				_data.model.ip = socket_ip;
				_data.model.data = data;

				return JSON.stringify(_data.model);
			}


			/**
			  * Initialize the server connection and register the handlers
			  */
			this.init = function() {
				/* Initialize the connection */
				_data.connection = new _data.ws(_data.server);

				for (var e in _data.handlers) {
					(function(e) {

						
						_data.connection[e] = function(a, b) {

							/* Parsing the response */
							var payload = a.data && a.data.indexOf("{") !== -1 ? JSON.parse(a.data) : a.data;

							/* If there's a scope broadcast the event */
							if (_data.scope) {
								_data.scope.$broadcast("$sockets:" + e, payload);
							}

							/* If there is a handler for the current event call it */
							if (typeof _data.handlers[e] === "function") {
								_data.handlers[e](payload);
							}

							/* If the socket_ip property is not defined, define it */
							if (payload && payload.ip && !socket_ip) {
								socket_ip = payload.ip;
							}
						}

					}(e));
				}

				_data.started = true;
			}

			this.$get = function() {
				return {

					/**
					  * Expose the setupd method
					  *
					  * Usage example:
					  * 	.config(["$socketsProvider", function($socketsProvider) {
					  *			$socketsProvider.setup({
					  *				server: 'ws://127.0.0.1:8080'
					  *			});
					  *		}]);
					  * 
					  * Usually this is used just to set the ip of the server
					  */
					setup: _this.setup,

					/**
					  * Sends the message through the current socket connection
					  *
					  * @param <String> m The message data that needs to be sent
					  * @param <String> t The type of the message patload
					  *
					  * @return <Object> Returns the object message that has been sent
					  */
					send: function(m, t) {

						if (_data.connection && _data.connection.readyState === 1) {
							var _tempMessage = _this.getModel(m, t);
							/* Send the stringified message object */
							_data.connection.send(_tempMessage);
							/* Return the parsed message object */
							return JSON.parse(_tempMessage);
						}
					}
				}
			};
		});

}(window, window.angular));