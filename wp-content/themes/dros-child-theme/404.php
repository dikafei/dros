<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @link https://codex.wordpress.org/Creating_an_Error_404_Page
 *
 * @package Seedlet
 * @since 1.0.0
 */

get_header();
?>

	<div class="entry-content">
    	<div class="error-404 not-found"> 
        	<div class="error-404-content">
            	<h1>404</h1>
                <h2>Sorry, page not found</h2>                
                <a href="<?php echo site_url(); ?>" title="Go Home">
                	<button><?php _e( 'Go Home', 'generatepress' ); ?></button>
                </a>
            </div>
            <div class="error-404-thumb">
            	<img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/img/404.svg">
            </div>                      
        </div>
    </div>

<?php
get_footer();
