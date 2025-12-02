<?php
	/**
	* The template for displaying single posts.
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

		$disable_footer = get_post_meta( get_the_ID(), '_generate-disable-footer', true );
		$disable_content_title = get_post_meta( get_the_ID(), '_generate-disable-headline', true );
		$disable_secondary_navigation = get_post_meta( get_the_ID(), '_generate-disable-secondary-nav', true );
		$disable_primary_navigation = get_post_meta( get_the_ID(), '_generate-disable-nav', true );
		$disable_top_bar = get_post_meta( get_the_ID(), '_generate-disable-top-bar', true );
		$disable_site_header = get_post_meta( get_the_ID(), '_generate-disable-header', true ) ;

	// Default
    if ( empty( $gp_blog_settings ) ) {
        $use_infinite_scroll = $display_archive_post_thumb = $display_date = $display_author = $display_categories = $display_tags = $display_comments_count = $display_single_post_thumb = $display_single_date = $display_single_author = $display_single_categories = $display_single_tags = $single_post_thumb_padding = $display_page_post_image = true;
    }
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?> <?php generate_do_microdata( 'article' ); ?>>
	<div class="inside-article">	

		<?php
			// Header - Cat, Title, Thumb, Meta
			if ( generate_show_entry_header() ) 
			{
				?>
					<header <?php generate_do_attr( 'entry-header' ); ?>>
						<?php
							// Breadcrumb
							if ( function_exists('yoast_breadcrumb') ) 
							{
								yoast_breadcrumb( '<div class="yoast-breadcrumbs">','</div>' );
							}							

							//HOOK generate_before_entry_title @since 0.1
							do_action( 'generate_before_entry_title' );

							if ( generate_show_title() ) {
								$params = generate_get_the_title_parameters();

								the_title( $params['before'], $params['after'] );
							}				
							
							// HOOK generate_post_meta - 10
							//do_action( 'generate_after_entry_title' );							

							// Cat
							$news_url = get_permalink( get_option( 'page_for_posts' ) );									

							$catEl = $catLink = '';
							$primary_term_id = yoast_get_primary_term_id( 'category', $post );
							$cat_id = '';
							if ( $primary_term_id ) {										
								$catName = get_term( $primary_term_id )->name;
								$catLink = get_term_link( $primary_term_id );	
								$cat_id = $primary_term_id;
								
								$catEl = '<a href="' . $catLink . '" title="' . $catName . '">' . $catName . '</a>';
							}      
							else 
							{                                                               
								$cats = get_the_category();
								$i = 0;
								
								foreach( $cats as $cat ) 
								{
									$catName = $cat->name;
									$catLink = get_term_link( $cat );
									$cat_id = $cat->term_id;

									if ( $i == 0 )
									{
										$catEl = '<a href="' . $catLink . '" title="' . $catName . '">' . $catName . '</a>';  
										break;
									}
									$i++;                                                                    
								}  
							}

							// META - Date/Author/Cat
							if ( $display_single_date || $display_single_author || $display_single_categories )
							{
								?>	
									<div class="singlepost-meta">
										<?php
											if ( $display_single_date )
											{
												$dateLink = get_month_link( get_the_time('Y'), get_the_time('n') );
												?>
													<div class="singlepost-meta-date">                                        
														<a href="<?php echo esc_url( $dateLink ); ?>" title="<?php the_date(); ?>" rel="bookmark">
															<time class="entry-date" datetime="<?php echo esc_attr(get_the_date('Y-m-j')); ?>">
																<?php echo esc_html( get_the_date( 'M j, Y' ) ); ?>
															</time>
														</a>
													</div>
												<?php
											}

											if ( $display_single_author )
											{
												?>
													<div class="singlepost-meta-author ">
														by <?php the_author_posts_link();  ?>
													</div>
												<?php
											}

											if ( $display_single_categories )
											{
												?>
													<div class="singlepost-meta-cat">
														<?php echo $catEl; ?>
													</div>
												<?php
											}
										?>
									</div>
								<?php
							}

							// Reconstruct Post Thumbnail
							do_action( 'generate_before_content' );		
						?>
					</header>
				<?php
			}
		?>

		<?php				
			// HOOK generate_featured_page_header_inside_single - 10				
			// Remove Post Thumbnail				
			// do_action( 'generate_before_content' );					
			
			// HOOK generate_post_image - 10					
			do_action( 'generate_after_entry_header' );					
		?>

		<?php
			$itemprop = '';
			if ( 'microdata' === generate_get_schema_type() ) 
			{
				$itemprop = ' itemprop="text"';
			}
		?>

		<div class="entry-content"<?php echo $itemprop; // phpcs:ignore -- No escaping needed. ?>>
			<div class="singlepost-content-wrapper">
				<div class="singlepost-content">
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
					generate_construct_sidebars();
				?>
			</div>
 		</div>

		<div class="single-meta-bottom">
			<div class="entry-content">
				<?php
				/**
				* generate_after_entry_content hook.
				*
				* @since 0.1
				*
				* @hooked generate_footer_meta - 10
				*/
				//do_action( 'generate_after_entry_content' );

				/**
				* generate_after_content hook.
				*
				* @since 0.1
				*/
				//do_action( 'generate_after_content' );
				?>
			</div>
		</div>

		<div class="singlepost-footer">
			<?php
				$prevPost = get_adjacent_post( false, '', true);
				$nextPost = get_adjacent_post( false, '', false);				

				$arrPrevNextPostID = array();
				$prevnextWrapperClass = '';

				if ( !empty( $prevPost ) ) { 
					$prevPostID = $prevPost->ID;
					array_push( $arrPrevNextPostID, $prevPostID ); 
				}
				if ( !empty( $nextPost ) ) { 
					$nextPostID = $nextPost->ID;
					array_push( $arrPrevNextPostID, $nextPostID );
				}							

				if ( empty( $nextPost ) ) { $prevnextWrapperClass = 'onlyprev'; }
				if ( empty( $prevPost ) ) { $prevnextWrapperClass = 'onlynext'; }
			?>

			<div class="prevnextpost-wrapper <?php echo $prevnextWrapperClass; ?>">
				<div class="slim-container">				
					<?php						
						if ( !empty( $arrPrevNextPostID ) ) 
						{					
							$args = array(
								'post__in' => $arrPrevNextPostID,
								'order' => 'ASC'
							);

							$query = new WP_Query( $args );

							if ( $query->have_posts() ) 
							{
								while ( $query->have_posts() ) 
								{
									$query->the_post();

									global $post;
									$postThumb = get_the_post_thumbnail_url( $post, 'thumb' );	
									?>
										<div class="prevnextpost">																							
											<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
												<div class="prevnextpost-thumb">
												<?php
													if ( !empty( $postThumb ) )
													{
														?>															
															<img src="<?php echo $postThumb; ?>" title="<?php the_title(); ?>">															
														<?php
													}
												?>
												</div>
											</a>
											<div class="prevnextpost-description-wrapper">
												<div class="prevnextpost-caption">
													<?php														
														if ( $post->ID == $prevPostID ) 
														{															
															_e( 'Prev', 'generatepress' );
														}
														else if ( $post->ID == $nextPostID ) 
														{														
															_e( 'Next', 'generatepress' );
														}
													?>
												</div>
												<div class="prevnextpost-description">
													<div class="prevnextpost-title">
														<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
															<h3><?php the_title(); ?></h3>
														</a>
													</div>
													<div class="prevnextpost-content">
														<?php 
															/*$excerpt = get_the_excerpt(); 

															$limitChar = 100;
															$excerpt = mb_substr( $excerpt, 0, $limitChar );

															echo $excerpt . '...';*/
															//the_excerpt();
														?>
													</div>
												</div>
											</div>
										</div>
									<?php
								}
							} 
							wp_reset_postdata();
						}
					?>
				</div>
			</div>

			<?php
				// Related
				get_template_part( 'section', 'related' ); 
			?>

		</div>
	</div>	
</article>