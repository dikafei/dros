		<?php
			if ( ! defined( 'ABSPATH' ) ) {
				exit; // Exit if accessed directly.
			}
		?>

	</div>
</div>

<h2 class="screen-reader-text">Footer</h2>

<?php
	// HOOK generate_before_footer @since 0.1	
	do_action( 'generate_before_footer' );
?>

<?php
	if ( is_front_page() )
	{
		?>
			<div class="progress-bar-wrapper">
				<div class="progress-bar">
				</div>
			</div>
		<?php	
	}
?>

<div <?php generate_do_attr( 'footer' ); ?>>
	<?php	
		// HOOK generate_before_footer_content @since 0.1
		do_action( 'generate_before_footer_content' );
		
		// HOOK generate_footer @since 1.3.42	
		// @hooked generate_construct_footer_widgets - 5
		// @hooked generate_construct_footer - 10
			
			// Remove Footer Widgets
				remove_action( 'generate_footer', 'generate_construct_footer_widgets', 5 );
			// Remove Copyright Bar
				remove_action( 'generate_footer', 'generate_construct_footer', 10 );

			// Reconstruct Footer Widgets
				$widgets = generate_get_footer_widgets();

				if ( ! empty( $widgets ) && 0 !== $widgets )
				{
					// If no footer widgets exist, we don't need to continue.
					if ( ! is_active_sidebar( 'footer-1' ) && ! is_active_sidebar( 'footer-2' ) && ! is_active_sidebar( 'footer-3' ) && ! is_active_sidebar( 'footer-4' ) && ! is_active_sidebar( 'footer-5' ) ) {
						// do nothing
					}
					else 
					{
						// Set up the widget width.
						$widget_width = '';

						if ( 1 === (int) $widgets ) {
							$widget_width = '100';
						}

						if ( 2 === (int) $widgets ) {
							$widget_width = '50';
						}

						if ( 3 === (int) $widgets ) {
							$widget_width = '33';
						}

						if ( 4 === (int) $widgets ) {
							$widget_width = '25';
						}

						if ( 5 === (int) $widgets ) {
							$widget_width = '20';
						}
						?>
							<div id="footer-widgets" class="site footer-widgets">
								<div <?php generate_do_attr( 'footer-widgets-container' ); ?>>
									<div class="inside-footer-widgets">
										<?php
										if ( $widgets >= 1 ) {
											generate_do_footer_widget( $widget_width, 1 );
										}

										if ( $widgets >= 2 ) {
											generate_do_footer_widget( $widget_width, 2 );
										}

										if ( $widgets >= 3 ) {
											generate_do_footer_widget( $widget_width, 3 );
										}

										if ( $widgets >= 4 ) {
											generate_do_footer_widget( $widget_width, 4 );
										}

										if ( $widgets >= 5 ) {
											generate_do_footer_widget( $widget_width, 5 );
										}
										?>
									</div>
								</div>
							</div>					
						<?php
					}
				}
				do_action( 'generate_after_footer_widgets' );

			// EXEC HOOK Generate Footer
			do_action( 'generate_footer' );

		// HOOK generate_after_footer_content @since 0.1		
			do_action( 'generate_after_footer_content' );
	?>
</div>

<?php
/**
 * generate_after_footer hook.
 *
 * @since 2.1
 */
do_action( 'generate_after_footer' );

wp_footer();
?>

<div id="toTop">
</div>

</body>
</html>
