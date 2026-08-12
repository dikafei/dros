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

<div class="progress-bar-wrapper">
	<div class="progress-bar">
	</div>
</div>

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

<div id="popup-overlay" style="display:none;">
	<div id="popup-modal">
		<div class="popup-chooser">
			<h3 class="popup-chooser-title">plan your stay at droshouse</h3>
			<p class="popup-chooser-subtitle">Experience a refined getaway tailored to you. Reach out to check availability, rates, and exclusive options.</p>
			<div class="popup-chooser-options">
				<a href="/booking/" class="popup-chooser-option popup-choice-email">
					<span class="popup-chooser-icon">
						<svg width="105" height="80" viewBox="0 0 105 80" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M54.8364 36.2165L67.2682 46.6348" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M2.74854 64.8511L36.7229 36.3793" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M2.74854 7.27742L28.5132 28.8677" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M77.8291 16.6436L89.0054 7.27808" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M34.0376 33.4971L44.3063 42.1021C45.2153 42.8638 46.5385 42.8638 47.4475 42.1021L72.3391 21.2434" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M89.7887 39.9058V9.07241C89.7887 8.36384 89.4877 7.72388 89.0055 7.27769C88.5698 6.86834 87.9849 6.62061 87.3411 6.62061H4.41311C3.76931 6.62061 3.18425 6.86834 2.74854 7.27769C2.2665 7.72388 1.96533 8.36384 1.96533 9.07241V63.0565C1.96533 63.7651 2.2665 64.405 2.74854 64.8512C3.18425 65.2606 3.76931 65.5083 4.41311 65.5083H64.2519" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M72.0141 75.1228C75.1985 77.3278 79.061 78.6206 83.2253 78.6206C94.1273 78.6206 102.965 69.7683 102.965 58.8483C102.965 47.9283 94.1273 39.0759 83.2253 39.0759C72.3232 39.0759 63.4854 47.9283 63.4854 58.8483C63.4854 62.9938 64.7602 66.8408 66.937 70.0193" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M88.1893 58.8481C88.1893 61.5943 85.9667 63.8203 83.2253 63.8203C80.4836 63.8203 78.2612 61.5943 78.2612 58.8481C78.2612 56.1022 80.4836 53.8759 83.2253 53.8759C85.9667 53.8759 88.1893 56.1022 88.1893 58.8481Z" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
							<path d="M88.1896 58.8481V59.6938C88.1896 61.4684 89.6258 62.9071 91.3976 62.9071C93.1695 62.9071 94.6059 61.4684 94.6059 59.6938V59.0345C94.6059 52.681 89.4977 47.41 83.1546 47.4489C76.731 47.4882 71.5699 52.8577 71.8566 59.3643C72.1149 65.2227 76.8711 69.982 82.7199 70.2356C85.5063 70.3563 88.0833 69.4731 90.1204 67.9172" stroke="#222222" stroke-width="2.4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</span>
					<span class="popup-chooser-label">book via email</span>
				</a>
				<a href="https://wa.me/6285719271097?text=Hi%20there!%20I%20came%20across%20Droshouse%20and%20I%E2%80%99m%20interested%20in%20your%20accommodation.%20Could%20you%20please%20share%20more%20details%20about%20availability,%20rates,%20and%20the%20types%20of%20villas%20you%20offer?%20Thank%20you!" target="_blank" rel="noopener" class="popup-chooser-option popup-choice-whatsapp">
					<span class="popup-chooser-icon">
						<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#popupWhatsappClip)">
								<path d="M68.2842 11.7158C60.7292 4.16078 50.6844 0 40 0C29.3156 0 19.2708 4.16078 11.7158 11.7158C4.16078 19.2708 0 29.3156 0 40C0 48.0597 2.37687 55.8009 6.88094 62.4347L0.10125 78.2539C-0.342969 79.2902 0.76875 80.3653 1.79109 79.8783L16.9228 72.6728C23.6966 77.4691 31.6591 80 40 80C50.6844 80 60.7292 75.8394 68.2842 68.2842C75.8394 60.7294 80 50.6844 80 40C80 29.3156 75.8394 19.2708 68.2842 11.7158ZM40 77.4948C31.9448 77.4948 24.2672 74.9773 17.7969 70.2142C17.4288 69.9431 16.9284 69.8956 16.5158 70.0922L3.71187 76.1891L9.45656 62.7853C9.62781 62.3856 9.57969 61.9258 9.32906 61.5705C4.86484 55.2344 2.50516 47.7756 2.50516 40C2.50516 19.3253 19.3253 2.50516 40 2.50516C60.6747 2.50516 77.4948 19.3253 77.4948 40C77.4948 60.6747 60.6747 77.4948 40 77.4948Z" fill="#222222"/>
								<path d="M62.0391 15.0104C61.5207 14.5524 60.7289 14.6021 60.2711 15.1207C59.8133 15.6393 59.8629 16.4308 60.3813 16.8886C67.0114 22.7404 70.8143 31.1641 70.8143 40C70.8143 56.9911 56.991 70.8143 40 70.8143C23.0089 70.8143 9.18582 56.9911 9.18582 40C9.18582 23.0089 23.0089 9.18582 40 9.18582C45.4177 9.18582 50.745 10.6111 55.4063 13.3075C56.0052 13.6541 56.7714 13.4493 57.1178 12.8504C57.4643 12.2514 57.2597 11.4854 56.661 11.1388C51.6186 8.22238 45.8574 6.68066 40 6.68066C21.6275 6.68066 6.68066 21.6275 6.68066 40C6.68066 58.3725 21.6275 73.3194 40 73.3194C58.3725 73.3194 73.3194 58.3725 73.3194 40C73.3194 30.4457 69.2078 21.3374 62.0391 15.0104Z" fill="#222222"/>
								<path d="M61.2734 53.5806L60.072 47.0733C59.979 46.5694 59.5883 46.173 59.0859 46.0723L49.6383 44.183C49.2276 44.1014 48.803 44.2297 48.5069 44.5258L44.6278 48.405C38.0897 45.4866 34.4769 41.8662 31.2945 35.0481L35.1619 31.1808C35.458 30.8847 35.5865 30.4601 35.5044 30.0494L33.615 20.6016C33.5145 20.0991 33.118 19.7084 32.614 19.6153L26.1067 18.4139C25.9395 18.383 25.7676 18.3866 25.6019 18.4242C23.899 18.8112 22.3451 19.6695 21.1087 20.9061C18.9676 23.0472 18.1498 26.1755 18.744 29.9525C19.2855 33.3947 20.3775 37.1384 21.8187 40.4942C22.0919 41.13 22.8286 41.4241 23.464 41.1508C24.0997 40.8776 24.3936 40.1412 24.1206 39.5055C22.7592 36.3361 21.7287 32.805 21.2187 29.5631C20.7476 26.5676 21.3065 24.2511 22.8801 22.6775C23.7237 21.8337 24.7694 21.2317 25.917 20.9264L31.3251 21.9248L32.9169 29.8833L28.9087 33.8914C28.5417 34.2584 28.4389 34.8137 28.6508 35.2878C32.2945 43.4478 36.569 47.7189 44.4222 51.0469C44.8925 51.2458 45.4358 51.14 45.7967 50.7792L49.8047 46.7711L57.763 48.3628L58.7615 53.7709C58.4564 54.9183 57.8542 55.9639 57.0106 56.8078C55.4369 58.3812 53.1198 58.9403 50.1248 58.4691C44.1372 57.527 35.8315 54.6201 30.4784 49.2883L30.4015 49.2112C28.9476 47.7517 27.594 45.9812 26.3781 43.9487C26.0233 43.3551 25.254 43.1617 24.6601 43.5169C24.0664 43.8719 23.8731 44.6412 24.2283 45.2348C25.5487 47.4423 27.0284 49.375 28.6311 50.9844L28.7086 51.0616C34.488 56.8181 43.3598 59.9409 49.7353 60.9437C52.2775 61.3437 55.0086 61.1562 57.2486 59.7872C57.8053 59.447 58.3205 59.0405 58.7817 58.5792C60.0184 57.3423 60.8767 55.7886 61.2634 54.0858C61.3009 53.9197 61.3044 53.7478 61.2734 53.5806Z" fill="#222222"/>
							</g>
							<defs>
								<clipPath id="popupWhatsappClip">
									<rect width="80" height="80" fill="white"/>
								</clipPath>
							</defs>
						</svg>
					</span>
					<span class="popup-chooser-label">chat on whatsapp</span>
				</a>
			</div>
		</div>
		<div class="popup-loader">Loading…</div>
		<div class="popup-content"></div>
		<button class="popup-close"></button>
	</div>
</div>

<?php
	if (is_page(377) )
	{
		?>
			<style>
				.console {
					position:fixed;
					bottom:0;
					right:0;
					font-size:15px;
					font-family:tahoma;
				}
			</style>
			<div class="console"></div>
		<?php
	}
?>
</body>
</html>
