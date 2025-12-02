<?php
	/**
	* The template for displaying posts within the loop.
	*
	* @package GeneratePress
	*/

	if ( ! defined( 'ABSPATH' ) ) {
		exit; // Exit if accessed directly.
	}

	/* GP Global Blog Settings */
		$gp_blog_settings = get_option( 'generate_blog_settings' );

		// Archive
		$use_infinite_scroll = $gp_blog_settings['masonry'];
		$display_archive_post_thumb = $gp_blog_settings['post_image'];
		$display_date = $gp_blog_settings['date'];
		$display_author = $gp_blog_settings['author'];
		$display_categories = $gp_blog_settings['categories'];
		$display_tags = $gp_blog_settings['tags'];
		$display_comments_count = $gp_blog_settings['comments'];

		// Single Post
		$display_single_post_thumb = $gp_blog_settings['single_post_image'];
		$display_single_date = $gp_blog_settings['single_date'];
		$display_single_author = $gp_blog_settings['single_author'];
		$display_single_categories = $gp_blog_settings['single_categories'];
		$display_single_tags = $gp_blog_settings['single_tags'];
		$single_post_thumb_padding  = $gp_blog_settings['single_post_image_padding'];

		// Page
		$display_page_post_image = $gp_blog_settings['page_post_image'];

	/* GP Individual Post Settings */		
		if ( !empty( get_post_meta( get_the_ID(), '_generate-disable-post-image', true ) ) ) {
			$display_single_post_thumb = false;
		}

		$disable_footer = get_post_meta( $post_id, '_generate-disable-footer', true );
		$disable_content_title = get_post_meta( $post_id, '_generate-disable-headline', true );
		$disable_secondary_navigation = get_post_meta( $post_id, '_generate-disable-secondary-nav', true );
		$disable_primary_navigation = get_post_meta( $post_id, '_generate-disable-nav', true );
		$disable_top_bar = get_post_meta( $post_id, '_generate-disable-top-bar', true );
		$disable_site_header = get_post_meta( $post_id, '_generate-disable-header', true ) ;	
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> <?php generate_do_microdata( 'article' ); ?>>
	<div class="inside-article">		
		<div class="searchresult">
			<?php
				if ( $display_archive_post_thumb )
				{
					?>
						<div class="searchresult-thumb-wrapper">
							<?php
								// Post Thumb
								/**
								* generate_after_entry_header hook.
								*
								* @since 0.1
								*
								* @hooked generate_post_image - 10
								*/
								do_action( 'generate_after_entry_header' );
							?>
						</div>
					<?php
				}
			?>

			<div class="searchresult-content-wrapper">		
				<?php
					/**
					* generate_before_content hook.
					*
					* @since 0.1
					*
					* @hooked generate_featured_page_header_inside_single - 10
					*/
					do_action( 'generate_before_content' );			

					if ( generate_show_entry_header() ) 
					{
						?>
						<header <?php generate_do_attr( 'entry-header' ); ?>>
							<?php
							/**
							* generate_before_entry_title hook.
							*
							* @since 0.1
							*/
							do_action( 'generate_before_entry_title' );

							?>
								<div class="page-heading-wrapper">
									<div class="entry-container">
										<?php
											if ( generate_show_title() ) {
												$params = generate_get_the_title_parameters();

												the_title( $params['before'], $params['after'] );
											}
										?>
									</div>
								</div>
							<?php	

							/**
							* generate_after_entry_title hook.
							*
							* @since 0.1
							*
							* @hooked generate_post_meta - 10
							*/
							do_action( 'generate_after_entry_title' );
							?>
						</header>
						<?php
					}
				?>

				<div class="searchresult-content">
					<?php
						$itemprop = '';

						if ( 'microdata' === generate_get_schema_type() ) {
							$itemprop = ' itemprop="text"';
						}

						if ( generate_show_excerpt() ) :
							?>

							<div class="entry-summary"<?php echo $itemprop; // phpcs:ignore -- No escaping needed. ?>>
								<?php the_excerpt(); ?>
							</div>

						<?php else : ?>

							<div class="entry-content"<?php echo $itemprop; // phpcs:ignore -- No escaping needed. ?>>
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
						endif;

						/**
						* generate_after_entry_content hook.
						*
						* @since 0.1
						*
						* @hooked generate_footer_meta - 10
						*/
						do_action( 'generate_after_entry_content' );

						/**
						* generate_after_content hook.
						*
						* @since 0.1
						*/
						do_action( 'generate_after_content' );
					?>
				</div>
			</div>
		</div>
	</div>
</article>
