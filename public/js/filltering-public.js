/*░░░░░░░░░░░░░░░░░░░░░░░░

  STYLE DIRECTORY

	_Variable_Declarations

  ░░░░░░░░░░░░░░░░░░░░░░░░*/
(function($) {
	'use strict';

	//▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
	// _Variable_Declarations
	//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

	/**
	* Form Variables and Elements
	**/
	var $allForms 			= $('form.filltering'),
		ajaxAsyncRunning	= 0;

	$allForms.each(function() {
		var $form 			= $(this),
			$formElements	= $form.find('*'),
			$submit 		= $form.find('input[type="submit"]'),
			$page			= $form.find('input[name="query-paged"]'),
			formValues		= $form.serialize(),
			names 			= $form.attr('action').split(" ");

		$.each(names, function(index, el) {
			var name = el;

			/**
			* Link Container and Button if action is specified
			**/
			var dataName = (name ? '[data-action="'+name+'"]' : ':not([data-action])');

			/**
			* Trigger Name if specified
			**/
			var triggerName	= (name ? '-' + name : '');

			/**
			* Container and Loadmore Button Elements
			**/
			var $container 		= $('div.filltering'+dataName+', tbody.filltering'+dataName+''),
				$loadmore 		= $('a.filltering'+dataName);

			/**
			* Runtime Variables
			**/
			var page 			= 1,
				ajaxRunning		= false;


			/**
			* Since the form is the default state,
			* disable submit till the form has changed
			**/
			$submit.attr('disabled', true);
			$loadmore.hide();
			if( triggerName ){
				$form.trigger('fillter-initialized' + triggerName, [$form, $container, $loadmore]);
			}
			$form.trigger('fillter-initialized', [$form, $container, $loadmore]);

			/**
			* if query-paged input is on the page,
			* sync the value with our pagenumber variable
			**/
			if ($page[0]) {
				page = parseInt($page.val(), 10);
			}

			/**
			* If the container is not empty,
			* get whether we have additional posts
			* and show or hide loadmore button accordingly
			**/
			if ($container.children()[0]) {
				$.ajax({
					type: 'POST',
					url: filltering_ajax_vars.url,
					data: {
						action: 'filltering',
						nonce: filltering_ajax_vars.nonce,
						values: formValues,
						name: name,
						page: page,
					},
					dataType: 'json',
					success: function( result ) {
						if (result.success) {
							if( result.posts_remaining ){
								$loadmore.show();
							} else {
								$loadmore.hide();
							}
						}
					},
				});
			}
			/**
			* Otherwise, do an inital ajax request
			**/
			else {
				sendAjax({reload: true});
			}

			/**
			* when the filtering form is submitted,
			* disable normal submission and send ajax request
			* pass in reload so that the container will be emptied
			* prior to new data being appended
			**/
			$form.submit(function(event) {
				event.preventDefault();
				if( !ajaxRunning ){
					sendAjax({reload: true});
				}
			});

			/**
			* when load more button is clicked
			* load more posts without clearing
			* the current contents of the container
			**/
			$loadmore.click(function(event) {
				event.preventDefault();
				if( !ajaxRunning ){
					sendAjax({reload: false});
				}
			});

			/**
			* on any element in the form that is altered
			* check to see if we have new form data
			* and enable or disable the submit button accordingly
			**/
			$formElements.on('change keyup paste', function() {
				if (formValues === $form.serialize()) {
					$submit.attr('disabled', true);
				} else {
					$submit.removeAttr('disabled');
				}
		    });

			/**
			* this is our primary ajax sender
			**/
			function sendAjax(options){
				// save as current form data for checking against
				formValues = $form.serialize();

				// form is being submitted and shouldn't be submitted again unless changed are made so disable submit button
				$submit.attr('disabled', true);

				// if data is not being cleared, increment page we are on, otherwise reset
				page = (options.reload ? 1 : page + 1);

				// sync our current page with paged input if it exists
				if ($page[0]) {
					$page.val(page);
				}

				// start ajax call
				$.ajax({
					type: 'POST',
					url: filltering_ajax_vars.url,
					data: {
						action: 'filltering',
						nonce: filltering_ajax_vars.nonce,
						values: formValues,
						name: name,
						page: page,
					},
					dataType: 'json',
					beforeSend: function( xhr ) {
						// append our loading animation
						ajaxRunning = true;
						ajaxAsyncRunning++;

						// fire a trigger on ajax started
						if( triggerName ){
							$form.trigger('fillter-started' + triggerName, [$form, $container, $loadmore]);
						}
						$form.trigger('fillter-started', [$form, $container, $loadmore]);

						// Append the loading animation
						$container.append('<span class="filltering"><i class="filltering"></i></span>');
					},
					success: function( result ) {
						if (result.success) {
							// if data should be cleared, empty our container
							if (options.reload) {
								$container.empty();
							}

							if( result.posts_returned === 0 ){
								if( triggerName ){
									$form.trigger('fillter-no-posts' + triggerName, [$form, $container, $loadmore]);
								}
								$form.trigger('fillter-no-posts', [$form, $container, $loadmore]);
							} else {
								if( triggerName ){
									$form.trigger('fillter-has-posts' + triggerName, [$form, $container, $loadmore]);
								}
								$form.trigger('fillter-has-posts', [$form, $container, $loadmore]);
							}

							// append all returned data
							$container.append(result.posts_html);

							// if more posts remain, show or hide loadmore button accordingly
							if( result.posts_remaining ){
								$loadmore.show();
							} else {
								$loadmore.hide();
							}
						}
					},
					complete: function( xhr, status ) {
						ajaxRunning = false;
						ajaxAsyncRunning--;
						// now that we are complete, remove loading animation
						$container.find('span.filltering').remove();

						// fire a trigger to be tapped into to modify or interact with ajax pulled in content
						if( triggerName ){
							$form.trigger('fillter-successful' + triggerName, [$form, $container, $loadmore, ajaxRunning]);
						}
						$form.trigger('fillter-successful', [$form, $container, $loadmore, ajaxAsyncRunning]);
					}
				});
			}
		});
	});

})(jQuery);
