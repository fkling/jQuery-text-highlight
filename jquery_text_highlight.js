/**
 * @fileoverview A jQuery plugin to highlight text.
 * @author Felix Kling
 *
 * License: GPLv2
 *
 *
 * This plugin highlights certain text without
 * breaking any existing event handlers on DOM nodes.
 *
 * Configuration:
 *
 * - cls: The CSS class to use for the highlight
 * - getReplacement: A function accepting two inputs:
 *      - the text to search for
 *      - the CSS class that should be applied 
 *
 *   The function should return an HTML string.
 *
 *
 * Usage:
 *
 * // Searches all divs and replaces all occurences `foo`
 * // with <span class="text_highlight">foo</foo>
 * $('div').text_highlight('foo');
 *
 *
 * // Same as above but searches for `foo` and `bar`
 * $('div').text_highlight(['foo', 'bar']);
 *
 *
 */




(function($) {

    /**
     * Default configuration
     * 
     * @type {Object}
     * @private
     */ 
    var config = {
        /** @type {string} */
        cls: 'text_highlight',

        /** 
         * A function accepting two parameters: the text to search for
         * and the CSS class that should be applied to the element
         *
         * Has to return an HTML string.
         * 
         * @type {function(string, string):string}
         */
        getReplacement: null
    };


    /**
     * Regex escape expression
     * @const
     */
     var escape_pattern = /([[\](){}.*+?])/g;

    /**
     * Sets the default configuration for this plugin
     *
     * @param {{cls: string, getReplacement: function(string, string):string}} options
     *
     */ 
    $.text_highlight = function(options) {
        $.extends(config, options);
    };


    /**
     * Searches {@param text} inside the selected elements
     * and wraps the text in a {@code span} with CSS class
     * {@param cls}.
     *
     * @param {string|Array.<string>} text(s) to wrap
     * @param {string} cls CSS class to apply on the text
     *
     */ 
    $.fn.text_highlight = function(text, cls) {
        
        // Apply function to every text if we get an array
        if($.isArray(text)) {
            for(var i = text.length; i--; ) {
                this.text_highlight(text[i], cls);
            }
            return this;
        }

        cls = cls || config.cls;

        // we need a string here (makes it easier to replace the searched text later)
        var replacement = $.isFunction(config.getReplacement) ?  
            config.getReplacement(text, cls) : '<span class="' + cls + '">' + text + '</span>';

        // escape regular expression characters
        var pattern = new RegExp(text.replace(escape_pattern, '\\$1'), 'g');

        return this.each(function() {

            // get all elements (includes text nodes)
            $(this).contents().each(function() {

                // only replace text nodes
                if(this.nodeType === 3 && pattern.test(this.nodeValue)) {
                    $(this).replaceWith(this.nodeValue.replace(pattern, replacement));
                }

                // only inspect element nodes that are not wrappers
                else if(!$(this).hasClass(cls)) {
                    $(this).highlight(word);
                }
            });
        });
    };
}(jQuery));
