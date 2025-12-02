<?php
	$categories = get_the_category();
	
	if ( !empty( $categories ) )
	{
		$currentPost = get_the_ID();
		$arrAllCats = array();	
		
		foreach( $categories as $category ) {
			array_push( $arrAllCats, $category->cat_ID );
		}
		
		$args = array(
			'post__not_in' => array( $currentPost ),
			'category__in' => $arrAllCats,
			'posts_per_page' => 3
		);
		
		$query = new WP_Query( $args );
		
		if ( $query->have_posts() ) 
		{
			?>
            	<div class="relatedpost-wrapper">
                    <div class="container">
                        <div class="relatedpost-heading">
                            <h4><?php _e( 'You might also like...', 'generatepress' ); ?></h4>
                        </div>
                        <div class="relatedpost-list-wrapper">
                            <?php
                                while ( $query->have_posts() ) {
                                    $query->the_post();
                                    global $post;
                                    
                                    $postThumb = get_the_post_thumbnail_url( $post, 'post-thumb' );	
                                    
                                    // Title
                                    $titlecount = 8;
                                    $getTitle = get_the_title();
                                    
                                    if ( $titlecount != 'all' && str_word_count($getTitle, 0) > $titlecount ) {
                                        $words = str_word_count( $getTitle, 2 );
                                        $pos = array_keys( $words );
                                        $resultTitle = substr( $getTitle, 0, $pos[$titlecount] ) . '...';
                                    }
                                    else {
                                        $resultTitle = $getTitle;
                                    }					
                                    
                                    $titleEl = $resultTitle;
                                    
                                    ?>                                        
                                        <div class="relatedpost">
                                            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                                                <div class="relatedpost-thumb">
                                                    <img src="<?php echo $postThumb; ?>" title="<?php the_title(); ?>">                                                    
                                                </div>
                                            </a>
                                            <div class="relatedpost-title">
                                                <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                                                    <h5><?php echo $titleEl; ?></h5>
                                                </a>
                                            </div>
                                        </div>
                                    <?php
                                }
                            ?>
                        </div>
                    </div>
                </div>
            <?php
		}
		wp_reset_postdata();
	}	
?>