/*░░░░░░░░░░░░░░░░░░░░░░░░

  JavaScript DIRECTORY

    _functions
        _container
            _containerEmpty
            _containerAppend
        _overlay
            _overlayShow
            _overlayHide
        _ajax
            _ajaxLoad
            _ajaxLoadShow
            _ajaxLoadHide
            _ajaxNextPage
            _ajaxResetPage
    _runtime
        _onFormSubmit
        _onLoadClick

  ░░░░░░░░░░░░░░░░░░░░░░░░*/

/* global filltering_ajax_vars */
/* global console */

(function($) {
    'use strict';

    //▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    // _functions
    //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

        // _container
        //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

            // _containerEmpty
            function containerEmpty() {
                $('div.fillter-ajax-container').empty();
            }

            // _containerAppend
            function containerAppend(html) {
                $('div.fillter-ajax-container').append(html);
            }

        // _overlay
        //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

            // _overlayShow
            function overlayShow() {
                $('div.fillter-ajax-overlay').show();
            }

            // _overlayHide
            function overlayHide() {
                $('div.fillter-ajax-overlay').hide();
            }

        // _ajax
        //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

            // _ajaxLoad
            function ajaxLoad(emptyFirst) {
                emptyFirst = typeof emptyFirst !== 'undefined' ? emptyFirst : false;

                $.ajax({
                    type: "post",
                    url: filltering_ajax_vars.url,
                    data: {
                        action: 'load-posts',
                        nonce: filltering_ajax_vars.nonce,
                        fillter: $('form.fillter-ajax-form').serialize(),
                        name: $('form.fillter-ajax-form').attr('action'),
                    },
                    dataType: 'json',
                    beforeSend: function() {
                        overlayShow();
                    },
                    success: function(result) {
                        if (result.success) {
                            if (emptyFirst) {
                                containerEmpty();
                            }
                            containerAppend(result.posts_html);
                            if (result.posts_remaining) {
                                ajaxLoadShow();
                            } else {
                                ajaxLoadHide();
                            }
                        } else {
                            console.log('Fillter - Error Calling AJAX Function');
                        }
                    },
                    complete: function() {
                        var name = 'fillter-successful';
                        if ($('form.fillter-ajax-form').attr('action')) {
                            name += '-'+$('form.fillter-ajax-form').attr('action');
                        }
                        $('div.fillter-ajax-container').trigger(name);
                        overlayHide();
                    }
                });
            }

            // _ajaxLoadShow
            function ajaxLoadShow() {
                $('a.fillter-ajax-load').show();
            }

            // _ajaxLoadHide
            function ajaxLoadHide() {
                $('a.fillter-ajax-load').hide();
            }

            // _ajaxNextPage
            function ajaxNextPage() {
                if ($('form.fillter-ajax-form input[name="query-paged"]').length > 0) {
                    var current_val = parseInt($('form.fillter-ajax-form input[name="query-paged"]').val(), 10);
                    $('form.fillter-ajax-form input[name="query-paged"]').val(current_val+1);
                } else {
                    $('form.fillter-ajax-form').prepend('<input type="hidden" name="query-paged" value="2">');
                }
            }

            // _ajaxResetPage
            function ajaxResetPage() {
                if ($('form.fillter-ajax-form input[name="query-paged"]').length > 0) {
                    $('form.fillter-ajax-form input[name="query-paged"]').val(1);
                } else {
                    $('form.fillter-ajax-form').prepend('<input type="hidden" name="query-paged" value="1">');
                }
            }

    //▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
    // _runtime
    //▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    $(function() {
        ajaxLoad();

        // _onFormSubmit
    	$('form.fillter-ajax-form').submit(function(event) {
    		event.preventDefault();
            ajaxResetPage();
    		ajaxLoad(true);
    	});

        // _onLoadClick
    	$('a.fillter-ajax-load').click(function(event) {
    		event.preventDefault();
            ajaxNextPage();
    		ajaxLoad();
    	});

    });

})(jQuery);
