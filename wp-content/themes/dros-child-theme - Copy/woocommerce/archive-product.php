<?php
	/**
	* The Template for displaying product archives, including the main shop page which is a post type archive
	*
	* This template can be overridden by copying it to yourtheme/woocommerce/archive-product.php.
	*
	* HOWEVER, on occasion WooCommerce will need to update template files and you
	* (the theme developer) will need to copy the new files to your theme to
	* maintain compatibility. We try to do this as little as possible, but it does
	* happen. When this occurs the version of the template file will be bumped and
	* the readme will list any important changes.
	*
	* @see https://docs.woocommerce.com/document/template-structure/
	* @package WooCommerce\Templates
	* @version 3.4.0
	*/

	defined( 'ABSPATH' ) || exit;

	get_header( 'shop' );
?>

	<div class="page-heading-wrapper">
		<div class="container">                                
			<?php 
				if ( apply_filters( 'woocommerce_show_page_title', true ) ) 
				{
					?>
						<h1 class="woocommerce-products-header__title page-title"><?php woocommerce_page_title(); ?></h1>
					<?php
				}

				// Breadcrumb
				add_action( 'woocommerce_breadcrumb_wrapper', 'woocommerce_breadcrumb', 20 );
				do_action( 'woocommerce_breadcrumb_wrapper' );			
				
				/**
				* Hook: woocommerce_archive_description.
				*
				* @hooked woocommerce_taxonomy_archive_description - 10
				* @hooked woocommerce_product_archive_description - 10
				*/
				do_action( 'woocommerce_archive_description' );
			?>                                
		</div>
	</div>

<?php
	/**
	* Hook: woocommerce_before_main_content.
	*
	* @hooked woocommerce_output_content_wrapper - 10 (outputs opening divs for the content)
	* @hooked woocommerce_breadcrumb - 20
	* @hooked WC_Structured_Data::generate_website_data() - 30
	*/
	
	// Remove Breadcrumb
	remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );

	do_action( 'woocommerce_before_main_content' );
?>



<?php
	if ( woocommerce_product_loop() ) 
	{
		/**
		* Hook: woocommerce_before_shop_loop.
		*
		* @hooked woocommerce_output_all_notices - 10
		* @hooked woocommerce_result_count - 20
		* @hooked woocommerce_catalog_ordering - 30
		*/
		// Remove result count and ordering
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );

		do_action( 'woocommerce_before_shop_loop' );

		// Create new result count and ordering hook
		add_action( 'shop_meta_wrapper', 'woocommerce_result_count', 20 );
		add_action( 'shop_meta_wrapper', 'woocommerce_catalog_ordering', 30 );

		$classShopWrapper = '';
		if ( is_active_sidebar( 'shop-sidebar' ) )
		{
			$classShopWrapper = 'has-sidebar';
		}

		?>
			<div class="shop-wrapper <?php echo $classShopWrapper; ?>">		

				<?php
					if ( is_active_sidebar( 'shop-sidebar' ) )
					{
						?>
							<div class="shop-sidebar">
								<?php dynamic_sidebar( 'shop-sidebar' ); ?>
							</div>
						<?php
					}
				?>
				
				<div class="shop-content-wrapper">
					<div class="shop-meta-wrapper">
						<?php do_action( 'shop_meta_wrapper' ); ?>
					</div>

					<div class="shop-loop-wrapper">
						<?php
							woocommerce_product_loop_start();

							if ( wc_get_loop_prop( 'total' ) ) 
							{
								while ( have_posts() ) 
								{
									the_post();

									/**
									* Hook: woocommerce_shop_loop.
									*/
									do_action( 'woocommerce_shop_loop' );

									wc_get_template_part( 'content', 'product' );
								}
							}
						?>		

						<div class="shop-pagination">
							<?php
								do_action( 'woocommerce_after_shop_loop' )
							?>
						</div>		
					</div>
				</div>

			</div>
		<?php

		woocommerce_product_loop_end();

		/**
		* Hook: woocommerce_after_shop_loop.
		*
		* @hooked woocommerce_pagination - 10
		*/
		//do_action( 'woocommerce_after_shop_loop' );
	} 
	else 
	{
		/**
		* Hook: woocommerce_no_products_found.
		*
		* @hooked wc_no_products_found - 10
		*/
		do_action( 'woocommerce_no_products_found' );
	}

	/**
	* Hook: woocommerce_after_main_content.
	*
	* @hooked woocommerce_output_content_wrapper_end - 10 (outputs closing divs for the content)
	*/
	do_action( 'woocommerce_after_main_content' );

	/**
	* Hook: woocommerce_sidebar.
	*
	* @hooked woocommerce_get_sidebar - 10
	*/
	//do_action( 'woocommerce_sidebar' );

	get_footer( 'shop' );
