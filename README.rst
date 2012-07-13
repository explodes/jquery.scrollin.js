jquery.scrollin.js
==================


Fade in content as you scroll down.


Fade elements in as the user scrolls or resizes content into view.
Unbinds itself when all elements have been displayed.
Can be used multiple times safely.


By Evan Leis
July 12, 2012


example:


```
$('#content').children().not('article').ScrollIn({offset:40, fadeSpeed:1500});
$('#content article').ScrollIn({fadeSpeed:600});
```

complex example:

```
$('#content').children().ScrollIn({
    // Fade in an increase padding from 0 to 10
    handler: function($el, top, limit) {
     $el.fadeIn(1000).animate({padding: 10}, 10000);
    },
    initial: function($el, top, limit) {
        if (top <= limit) return; // Do nothing for elements in view
        $el.hide().css({padding: 0});
    },
    offset: 100
});
```

