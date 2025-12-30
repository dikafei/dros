<?php
/**
 * The template for displaying the header.
 *
 * @package GeneratePress
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<?php wp_head(); ?>

	<?php
		$header_style = get_post_meta( get_the_ID(), '_header_style_meta_key', true );
		$bodyClass = '';
		if ( $header_style == 'transparent' ) {
			$bodyClass = 'transparent-header';
		}
	?>

	<script>
		var ajaxUrl = "<?php echo admin_url('admin-ajax.php'); ?>";
	</script>
</head>

<body <?php body_class( $bodyClass ); ?> <?php generate_do_microdata( 'body' ); ?>>
	<?php
	/**
	 * wp_body_open hook.
	 *
	 * @since 2.3
	 */
	do_action( 'wp_body_open' ); // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedHooknameFound -- core WP hook.

	/**
	 * generate_before_header hook.
	 *
	 * @since 0.1
	 *
	 * @hooked generate_do_skip_to_content_link - 2
	 * @hooked generate_top_bar - 5
	 * @hooked generate_add_navigation_before_header - 5
	 */
	do_action( 'generate_before_header' );

	/**
	 * generate_header hook.
	 *
	 * @since 1.3.42
	 *
	 * @hooked generate_construct_header - 10
	 */
	//do_action( 'generate_header' );
	?>
		<header <?php generate_do_attr( 'header' ); ?>>
			<div <?php generate_do_attr( 'inside-header' ); ?>>
				<div class="floating-header">
					<?php
						do_action( 'generate_before_header_content' );

						if ( ! generate_is_using_flexbox() ) {
							generate_header_items();
						}

						do_action( 'generate_before_navigation' );
					?>
					<a href="#">Book</a>
				</div>
				
				<nav <?php generate_do_attr( 'navigation' ); ?>>
					<div <?php generate_do_attr( 'inside-navigation' ); ?>>
						<?php									
							// @hooked generate_navigation_search - 10
							// @hooked generate_mobile_menu_search_icon - 10									
							do_action( 'generate_inside_navigation' );
						?>
							<button <?php generate_do_attr( 'menu-toggle' ); ?>>
								<?php
									do_action( 'generate_inside_mobile_menu' );
									generate_do_svg_icon( 'menu-bars', true );
									$mobile_menu_label = apply_filters( 'generate_mobile_menu_label', __( 'Menu', 'generatepress' ) );

									if ( $mobile_menu_label ) {
										printf(
											'<span class="mobile-menu">%s</span>',
											$mobile_menu_label // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- HTML allowed in filter.
										);
									} else {
										printf(
											'<span class="screen-reader-text">%s</span>',
											esc_html__( 'Menu', 'generatepress' )
										);
									}
								?>
							</button>
						<?php
							do_action( 'generate_after_mobile_menu_button' );

							wp_nav_menu(
								array(
									'theme_location' => 'primary',
									'container' => 'div',
									'container_class' => 'main-nav',
									'container_id' => 'primary-menu',
									'menu_class' => '',
									'fallback_cb' => 'generate_menu_fallback',
									'items_wrap' => '<ul id="%1$s" class="%2$s ' . join( ' ', generate_get_element_classes( 'menu' ) ) . '">%3$s</ul>',
								)
							);

							do_action( 'generate_after_primary_menu' );
						?>
					</div>
				</nav>

				<?php 
					do_action( 'generate_after_navigation' ); 
				?>				

				<?php
					// @hooked generate_add_navigation_float_right - 5
					//do_action( 'generate_after_header_content' );
				?>				
			</div>
		</header>
	<?php

	/**
	 * generate_after_header hook.
	 *
	 * @since 0.1
	 *
	 * @hooked generate_featured_page_header - 10
	 */
	do_action( 'generate_after_header' );
	?>

	<div <?php generate_do_attr( 'page' ); ?>>
		<?php
		/**
		 * generate_inside_site_container hook.
		 *
		 * @since 2.4
		 */
		do_action( 'generate_inside_site_container' );
		?>
		<div <?php generate_do_attr( 'site-content' ); ?>>
			<?php
			/**
			 * generate_inside_container hook.
			 *
			 * @since 0.1
			 */
			do_action( 'generate_inside_container' );
