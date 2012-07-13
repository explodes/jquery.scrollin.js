==================
jquery.scrollin.js
==================

* Fade elements in as the user scrolls or resizes content into view.
* Unbinds itself when all elements have been displayed.
* Can be used multiple times safely.

options
-------

You can use either the default handler which fades in using the options *fadeSpeed, handlerEasing,* and *handlerCallback* options or you can supply your own handler.

**handler** : *undefined*
    Custom handler of type function( $el, top, limit )
**fadeSpeed** : *2500*
    Without a custom handler,  Use either fade speed or you own custom handler.
**handlerEasing** : *"swing"*
    Without a custom handler, use this easing equation.
**handlerCallback** : *undefined*
    Without a custom handler, use this as a callback.
**offset** : *40*
    Fade in when the element is X pixels below the bottom .
**handleAtStart** : *true*
    Handle elements within bounds immediately.
**initial** : fn($el, top, limit)
    Function to apply to all elements after the top position has been calculated when the plugin is started (called).
    Default function hides elements that fall below the limit (bottom of window + offset)

-------
example
-------

::

    $( '#content' ).children().not('article').ScrollIn({
        offset:40,
        fadeSpeed:1500
    });

    $( '#content article' ).ScrollIn({
        fadeSpeed:600
    });

---------------
complex example
---------------

::

    $( '#content' ).children().ScrollIn({

        // Fade in an increase padding from 0 to 10, impractical, but this is a working example.
        handler: function($el, top, limit) {
            $el.fadeIn( 1000 ).animate({
                padding: 10
            }, 10000 );
        },

        initial: function( $el, top, limit ) {
            if ( top <= limit ) {
                return; // Do nothing for elements already in view
            } else {
                $el.hide().css({
                    padding: 0
                });
            }
        },
        offset: 100
    });


