<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://www.peterjohnhunt.com
 * @since             1.0.0
 * @package           Filltering
 *
 * @wordpress-plugin
 * Plugin Name:       FiLLTering
 * Plugin URI:        https://github.com/peterjohnhunt/FiLLTering
 * Description:       This is a short description of what the plugin does. It's displayed in the WordPress admin area.
 * Version:           1.0.0
 * Author:            PeterJohn Hunt
 * Author URI:        http://www.peterjohnhunt.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       filltering
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-filltering-activator.php
 */
function activate_filltering() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-filltering-activator.php';
	Filltering_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-filltering-deactivator.php
 */
function deactivate_filltering() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-filltering-deactivator.php';
	Filltering_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_filltering' );
register_deactivation_hook( __FILE__, 'deactivate_filltering' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-filltering.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_filltering() {

	$plugin = new Filltering();
	$plugin->run();

}
run_filltering();
