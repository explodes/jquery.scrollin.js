/**
 * Fade elements in as the user scrolls or resizes content into view.
 * Unbinds itself when all elements have been displayed.
 * Can be used multiple times safely.
 * 
 * By Evan Leis
 * July 12, 2012
 * 
 * example:
 * 
 * $('#content').children().not('article').ScrollIn({offset:40, fadeSpeed:1500});
 * $('#content article').ScrollIn({fadeSpeed:600});
 * 
 * complex example:
 * 
 * $('#content').children().ScrollIn({
 *     // Fade in an increase padding from 0 to 10
 *     handler: function($el, top, limit) {
 *     	$el.fadeIn(1000).animate({padding: 10}, 10000);
 *     },
 *     initial: function($el, top, limit) {
 *         if (top <= limit) return; // Do nothing for elements in view
 *         $el.hide().css({padding: 0});
 *     },
 *     offset: 100
 * });
 * 
 */

(function(window, document, $, undefined) {
	"use strict";
	
	function makeGuid() {
		var S4 = function() {
		   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		};
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}
	
	var pluginName = 'ScrollIn';
	var pluginDefaults = {
		handler : undefined, // Custom handler. function($el, top, limit)
		fadeSpeed: 2500, // Without a custom handler,  Use either fade speed or you own custom handler.
		handlerEasing: 'swing', // Without a custom handler, use this easing equation
		handlerCallback: undefined, // Without a custom handler, use this as a callback
		offset: 40, // Fade in when the element is X pixels below the bottom
		handleAtStart: true, // Handle elements within bounds immediately.
		initial : function($el, top, limit) { // Function to apply to all elements after the top position has been calculated
			if (top > limit) {
				$el.hide();
			}
		}
	};

	function Fader(element, options) {
		this._id = makeGuid();
		this._defaults = pluginDefaults;
		this._name = pluginName;
		this.element = element;
		this.init(options);
	}
	
	Fader.prototype.init = function(options) {
		this.options = this.makeOptions(options);
		this.mappedElements = this.prepareElements();
		if (this.options.handleAtStart) {
			this.handleScroll();
		}
		this.bindScroll();
	}
	
	Fader.prototype.makeOptions = function(options) {
		options = $.extend(true, {}, pluginDefaults, options);
		if (options.handler === undefined) {
			options.handler = this.makeDefaultHandler(options);
		}
		return options;
	}
	
	Fader.prototype.makeDefaultHandler = function(options) {
		return function($el, top, limit) {
			$el.fadeIn(options.fadeSpeed, options.handlerEasing, options.handlerCallback);
		}
	}

	Fader.prototype.prepareElements = function() {
		var self = this;
		var map = {};
		self.element.each(function(index, value) {
			var $el = $(value);
			var top = $el.position().top;
			if (map[top] === undefined) {
				map[top] = [$el];
			} else {
				map[top].push($el);
			}
		});
		var limit = self.getLimit();
		for (var top in map) {
			$(map[top]).each(function(index, el) {
				self.options.initial($(el), top, limit);
			});
		}
		return map;
	}
	
	Fader.prototype.getLimit = function() {
		var win = $(window);
		var wHeight = win.height();
		var wTop = win.scrollTop();
		var bottom = wTop + wHeight;
		var result = bottom + this.options.offset;
		return result;
	}
	
	Fader.prototype.getEventName = function () {
		var scroll = 'scroll.fader-' + this._id;
		var resize = 'resize.fader-' + this._id;
		return [scroll, resize].join(' ');
	}
	
	Fader.prototype.bindScroll = function () {
		var self = this;
		var eventName = self.getEventName();
		$(window).bind(eventName, function() {
			self.handleScroll();
		});
	}
	
	Fader.prototype.unbindScroll = function () {
		var eventName = this.getEventName();
		$(window).unbind(eventName);
	}

	Fader.prototype.handleScroll = function() {
		var self = this;
		var limit = self.getLimit();
		var map = {};
		var hasElements = false;
		for (var top in self.mappedElements) {
			var mappedElements = self.mappedElements[top];
			if (top <= limit) {
				$(mappedElements).each(function(index, value) {
					var $el = $(value);
					self.options.handler($el, top, limit);
				});
			} else {
				map[top] = mappedElements;
				hasElements = true;
			}
		}
		this.mappedElements = map;
		if (!hasElements) {
			this.unbindScroll();
		}
	}
	
	$.fn[pluginName] = function(options) {
		var fader = new Fader(this, options);
	}
})(window, document, jQuery);