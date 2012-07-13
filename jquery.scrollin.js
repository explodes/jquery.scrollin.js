/*
 * Fade elements in as the user scrolls or resizes content into view.
 * Unbinds itself when all elements have been displayed.
 * Can be used multiple times safely.
 *
 * By Evan Leis
 *
 * Copyright (c) 2012 Evan Leis
 *
 * Project Home:
 *   https://github.com/explodes/jquery.scrollin.js
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * example:
 *
 * $( '#content' ).children().not('article').ScrollIn({
 *     offset:40,
 *     fadeSpeed:1500
 * });
 *
 * $( '#content article' ).ScrollIn({
 *     fadeSpeed:600
 * });
 *
 * complex example:
 *
 * $( '#content' ).children().ScrollIn({
 *
 *     // Fade in an increase padding from 0 to 10, impractical, but this is a working example.
 *     handler: function($el, top, limit) {
 *         $el.fadeIn( 1000 ).animate({
 *             padding: 10
 *         }, 10000 );
 *     },
 *
 *     initial: function( $el, top, limit ) {
 *         if ( top <= limit ) {
 *             return; // Do nothing for elements already in view
 *         } else {
 *             $el.hide().css({
 *                 padding: 0
 *             });
 *         }
 *     },
 *     offset: 100
 * });
 *
 */

(function(window, $, undefined) {
	"use strict";

	var pluginName = "ScrollIn";

	var pluginDefaults = {
		//Custom handler. function( $el, top, limit )
		handler: undefined,
		// Without a custom handler,  Use either fade speed or you own custom handler.
		fadeSpeed: 2500,
		// Without a custom handler, use this easing equation
		handlerEasing: "swing",
		// Without a custom handler, use this as a callback
		handlerCallback: undefined,
		// Fade in when the element is X pixels below the bottom
		offset: 40,
		// Handle elements within bounds immediately.
		handleAtStart: true,
		// Function to apply to all elements after the top position has been calculated
		initial: function( $el, top, limit ) {
			if ( top > limit ) {
				$el.hide();
			}
		}
	};

	var document = window.document;

	function Fader(element, options) {
		this._id = UUID();
		this._defaults = pluginDefaults;
		this._name = pluginName;
		this.element = element;
		this.init( options );
	}

	Fader.prototype.init = function( options ) {
		this.options = this.makeOptions( options );
		this.mappedElements = this.prepareElements();
		if ( this.options.handleAtStart ) {
			this.handleScroll();
		}
		this.bindScroll();
	}

	Fader.prototype.makeOptions = function( options ) {
		options = $.extend( true, {}, pluginDefaults, options );
		if ( options.handler === undefined ) {
			options.handler = this.makeDefaultHandler( options );
		}
		return options;
	}

	Fader.prototype.makeDefaultHandler = function( options ) {
		return function( $el, top, limit ) {
			$el.fadeIn( options.fadeSpeed, options.handlerEasing, options.handlerCallback );
		}
	}

	Fader.prototype.prepareElements = function() {
		var self = this;
		var map = {};
		self.element.each(function( index, value ) {
			var $el = $( value );
			var top = $el.position().top;
			if (map[top] === undefined) {
				map[top] = [$el];
			} else {
				map[top].push( $el );
			}
		});
		var limit = self.getLimit();
		for (var top in map) {
			$(map[top]).each(function( index, el ) {
				self.options.initial( $(el), top, limit );
			});
		}
		return map;
	}

	Fader.prototype.getLimit = function() {
		var win = $( window );
		var wHeight = win.height();
		var wTop = win.scrollTop();
		var bottom = wTop + wHeight;
		var result = bottom + this.options.offset;
		return result;
	}

	Fader.prototype.getEventName = function () {
		var scroll = "scroll.fader-" + this._id;
		var resize = "resize.fader-" + this._id;
		return [scroll, resize].join(' ');
	}

	Fader.prototype.bindScroll = function () {
		var self = this;
		var eventName = self.getEventName();
		$( window ).bind( eventName, function() {
			self.handleScroll();
		});
	}

	Fader.prototype.unbindScroll = function () {
		var eventName = this.getEventName();
		$( window ).unbind( eventName );
	}

	Fader.prototype.handleScroll = function() {
		var self = this;
		var limit = self.getLimit();
		var map = {};
		var hasElements = false;
		for ( var top in self.mappedElements ) {
			var mappedElements = self.mappedElements[top];
			if ( top <= limit ) {
				$( mappedElements ).each(function(index, value) {
					var $el = $( value );
					self.options.handler( $el, top, limit );
				});
			} else {
				map[top] = mappedElements;
				hasElements = true;
			}
		}
		this.mappedElements = map;
		if ( !hasElements ) {
			this.unbindScroll();
		}
	}

	$.fn[pluginName] = function( options ) {
		new Fader(this, options);
	}

	function UUID() {
		var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return ( S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4() );
	}

})( window, jQuery );
