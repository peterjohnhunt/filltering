# FiLLTering Plugin
Wordpress Ajax Filtering Plugin - Version 3

New:
* Works for multiple separate forms on the same page


## HTML
### Classes Needed

|Classes					|    																		|
|---------------------------|---------------------------------------------------------------------------|
|div.filltering	            | This is the container that will hold the posts and the loading overlay    |
|a.filltering	            | This is the button that will load more posts                              |
|form.filltering		    | This is the form that holds all the parameters to filter by		        |

#### Examples

AJAX HTML Form to customize WP Query
```
<form class="filltering" action="unique_action_name" method="post">
	<input type="hidden" name="query-post_type" value="custom_post_type">
	<input type="hidden" name="query-post_status" value="publish">
	<input type="hidden" name="query-posts_per_page" value="6">
	<input type="hidden" name="query-paged" value="1">
	<input type="hidden" name="query-orderby" value="menu_order title">
	<input type="hidden" name="query-order" value="DESC">
</form>
```

AJAX HTML Container
```
<div class="filltering" data-action="unique_action_name">
</div>
```

AJAX HTML Load More Button
```
<a href="#" class="filltering" data-action="unique_action_name">
</a>
```
***

Form input name Examples
```
<input type="hidden" name="query-post_type" value="post">
<input type="text" name="query-s" value="">
<input type="checkbox" name="tax-category-slug" value="uncategorized">
<input type="checkbox" name="meta_query-color" value="blue">
<select name="tax-category-term_id">
	<option value="1">Category 1</option>
	<option value="2">Category 2</option>
	<option value="3">Category 3</option>
</select>
```
***

## PHP
|Hooks					|								|
|-----------------------|-------------------------------|
|fillter_post_content	| Ajax Loop Post Content Action |
|fillter_post_no_content| Ajax Loop No Posts Content 	|

#### Examples

fillter_post_content
```
add_action('fillter_post_content_unique_action_name', 'post_type_content');
function post_type_content() {
	get_template_part('content', 'post-type');
}
```

fillter_post_no_content
```
add_action('fillter_post_no_content_unique_action_name', 'post_type_no_content');
function post_type_no_content() {
	echo '<p>No Posts To Display</p>';
}
```

|Filters			|						|
|-------------------|-----------------------|
|fillter_post_args  | Modify WP Query Args  |

#### Examples

fillter_post_args
```
add_filter( 'fillter_post_args_unique_action_name', 'post_type_query_args', 10, 1);
function post_type_query_args($args){

	// Modify query args

	return $args;
}
```

***

## JavaScript

|Events				|				|
|-------------------|---------------|
|fillter-successful |On Ajax Appended|

#### Examples
```
$('div.filltering').on('fillter-successful-unique-action-name', function(){

	// Manipulate Appended Items, or bind JS to items

});
```

***
