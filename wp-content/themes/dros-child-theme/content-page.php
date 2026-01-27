<?php
/**
 * The template used for displaying page content in page.php
 *
 * @package GeneratePress
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> <?php generate_do_microdata( 'article' ); ?>>
	<div class="inside-article">
		<?php
		/**
		 * generate_before_content hook.
		 *
		 * @since 0.1
		 *
		 * @hooked generate_featured_page_header_inside_single - 10
		 */
		do_action( 'generate_before_content' );

		/*if ( generate_show_entry_header() ) :
			?>

			<header <?php generate_do_attr( 'entry-header' ); ?>>
				<?php				
				// generate_before_page_title hook.				
				// @since 2.4				
				do_action( 'generate_before_page_title' );

				if ( generate_show_title() ) {
					$params = generate_get_the_title_parameters();

					the_title( $params['before'], $params['after'] );
				}

				
				// generate_after_page_title hook.
				// @since 2.4				 
				do_action( 'generate_after_page_title' );
				?>
			</header>

			<?php
		endif;*/

		/**
		 * generate_after_entry_header hook.
		 *
		 * @since 0.1
		 *
		 * @hooked generate_post_image - 10
		 */
		do_action( 'generate_after_entry_header' );

		$itemprop = '';

		if ( 'microdata' === generate_get_schema_type() ) {
			$itemprop = ' itemprop="text"';
		}
		?>

		<div class="entry-content"<?php echo $itemprop; // phpcs:ignore -- No escaping needed. ?>>
			<div class="check">
			</div>

			<?php
				if (is_page(377) )
				{
					?>
						<style>
							.check {
								position:absolute;
								top:0;
								left:0;
								width: 25000px;
								height:100px;
								z-index: 9999;
								background-color: #fff;
								background-image:
									linear-gradient(45deg, #000 25%, transparent 25%),
									linear-gradient(-45deg, #000 25%, transparent 25%),
									linear-gradient(45deg, transparent 75%, #000 75%),
									linear-gradient(-45deg, transparent 75%, #000 75%);
								background-size: 200px 200px;
								background-position:
									0 0,
									0 100px,
									100px -100px,
									-100px 0;
								opacity:0.1;
							}				

							.box-wrapper {
								display: flex;
								position:absolute;
								top:0;
								left:0;
								width: 25000px;
								z-index: 9999;
							}

							.box {
								width: 100px;
								height: 100px;
								border-right: 1px solid #ccc;
								box-sizing: border-box;

								display: flex;
								align-items: center;
								justify-content: center;

								font-family: monospace;
								font-size: 14px;
								
								position: relative;
							}			

							.inner-box {
								position:absolute;
								left:100px;
								top:40px;
							}
						</style>
						<script>
							const totalWidth = 10000;
							const step = 100;

							var $j = jQuery.noConflict();

							$j(function(){	
								for (let i = step; i <= totalWidth; i += step) {
									$j('.box-wrapper').append(
										`<div class="box"><div class="inner-box">${i}</div></div>`
									);
								}
							});

						</script>
						<div class="box-wrapper"></div>					
					<?php
				}
			?>

			
			<?php
				the_content();

				wp_link_pages(
					array(
						'before' => '<div class="page-links">' . __( 'Pages:', 'generatepress' ),
						'after'  => '</div>',
					)
				);
			?>
		</div>

		<?php
		/**
		 * generate_after_content hook.
		 *
		 * @since 0.1
		 */
		do_action( 'generate_after_content' );
		?>
	</div>
</article>
