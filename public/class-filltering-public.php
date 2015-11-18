<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://www.peterjohnhunt.com
 * @since      1.0.0
 *
 * @package    Filltering
 * @subpackage Filltering/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * @package    Filltering
 * @subpackage Filltering/public
 * @author     PeterJohn Hunt <info@peterjohnhunt.com>
 */
class Filltering_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/filltering-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/min/filltering-public-min.js', array( 'jquery' ), $this->version, true );
		wp_localize_script( $this->plugin_name, 'filltering_ajax_vars', array('url' => admin_url( 'admin-ajax.php' ),'nonce' => wp_create_nonce( 'ajax-nonce' )));

	}

	/**
	 * ajax form submission argument handler
	 *
	 * @since    1.0.0
	 */
	public function filltering_args_parser($serialized, $page, $formname){

		$types = array(
			'post_type' 	=> 'array',
			'paged' 		=> 'integer',
			'posts_per_page' => 'integer',
		);

		$query_args = array(
			'paged'			=> $page,
			'post_type'		=> 'post',
			'order'			=> 'ASC',
			'orderby'		=> 'menu_order title',
			'tax_query' 	=> array('relation' => 'AND'),
			'meta_query' 	=> array('relation' => 'AND'),
		);
		$form_args = array();
		parse_str($serialized, $form_args);

		foreach ($form_args as $form_key => $form_values) {
			$form_key = explode('-', $form_key);
			if (count($form_key) > 1) {
				$arg_type = $form_key[0];

				if ($arg_type == 'na' || !$form_values || empty($form_values)) {
					continue;
				} elseif ($arg_type == 'query') {
					$arg_name = $form_key[1];
					if (isset($types[$arg_name])) {
						if ($types[$arg_name] == 'string') {
							$form_values = strval($form_values);
						} elseif ($types[$arg_name] == 'integer') {
							$form_values = intval($form_values);
						} elseif ($types[$arg_name] == 'array') {
							$form_values = explode(' ', $form_values);
						}
					}
					$query_args[$arg_name] = $form_values;
				} elseif ($arg_type == 'tax') {
					$taxonomy = $form_key[1];
					$field = $form_key[2];
					if ($field == 'term_id') {
						$form_values = implode(',', $form_values);
						$form_values = json_decode('[' . $form_values . ']', true);
					}
					$query_args['tax_query'][] = array(
						'taxonomy' => $taxonomy,
						'field'    => $field,
						'terms'    => $form_values
					);
				} elseif ($arg_type == 'meta') {
					$meta_key = $form_key[1];
					$meta_relation = isset($form_key[2]) ? $form_key[2] : 'AND';
					$meta_type = isset($form_key[3]) ? $form_key[3] : 'CHAR';
					$meta_compare = isset($form_key[4]) ? $form_key[4] : '=';
					$query_args['meta_query'][$meta_key] = array();
					$query_args['meta_query'][$meta_key]['relation'] = $meta_relation;
					foreach ($form_values as $values) {
						$values = explode('+', $values);
						if ($meta_type == 'numeric') {
							$values = implode(',', $values);
							$values = json_decode('[' . $values . ']', true);
						}
						$query_args['meta_query'][$meta_key][] = array(
							'key'     => $meta_key,
							'value'   => $values,
							'type'    => $meta_type,
							'compare' => $meta_compare,
						);
					}
				}
			}
		}

		$query_args = apply_filters('fillter_post_args'.$formname, $query_args);

		return $query_args;
	}

	/**
	 * ajax request handler
	 *
	 * @since    1.0.0
	 */
	public function filltering() {
		$success = true;
		$posts_remaining = true;
		$nonce = $_POST['nonce'];
		if ( ! wp_verify_nonce( $nonce, 'ajax-nonce' ) ){
			die ( 'Nope!' );
		}

		$formname = ((isset($_REQUEST['name']) && $_REQUEST['name']) ? '_'.$_REQUEST['name'] : '');

		$query_args = $this->filltering_args_parser($_REQUEST['values'], $_REQUEST['page'], $formname);

		$the_query = new WP_Query( $query_args );

		if ($the_query->max_num_pages <= $query_args['paged']) {
			$posts_remaining = false;
		}

		ob_start();
		if ( $the_query->have_posts() ){
			while ( $the_query->have_posts() ) { $the_query->the_post();
				do_action('fillter_post_content'.$formname);
			}
		} else {
			do_action('fillter_post_no_content'.$formname);
		}
		$posts_html = ob_get_clean();

		$response = array(
			'posts_html' 		=> $posts_html,
			'success'			=> $success,
			'posts_remaining'	=> $posts_remaining,
		);

		echo json_encode($response);

		exit;
	}

}
