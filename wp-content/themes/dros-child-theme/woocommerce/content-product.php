<?php
	/**
	* The template for displaying product content within loops
	*
	* This template can be overridden by copying it to yourtheme/woocommerce/content-product.php.
	*
	* HOWEVER, on occasion WooCommerce will need to update template files and you
	* (the theme developer) will need to copy the new files to your theme to
	* maintain compatibility. We try to do this as little as possible, but it does
	* happen. When this occurs the version of the template file will be bumped and
	* the readme will list any important changes.
	*
	* @see     https://docs.woocommerce.com/document/template-structure/
	* @package WooCommerce\Templates
	* @version 3.6.0
	*/

	defined( 'ABSPATH' ) || exit;

	global $product;

	// Ensure visibility.
	if ( empty( $product ) || ! $product->is_visible() ) {
		return;
	}
?>

	<li <?php wc_product_class( '', $product ); ?>>
		<div class="product-wrapper">
			<?php
				/**
				* Hook: woocommerce_before_shop_loop_item.
				* @hooked woocommerce_template_loop_product_link_open - 10
				*/
				do_action( 'woocommerce_before_shop_loop_item' );	

				// Add Sale
				add_action( 'sale_wrapper', 'woocommerce_show_product_loop_sale_flash', 10 );
				do_action( 'sale_wrapper' );
			?>

				<div class="product-thumb-wrapper">					
					<?php
						/**
						* Hook: woocommerce_before_shop_loop_item_title.
						* @hooked woocommerce_show_product_loop_sale_flash - 10
						* @hooked woocommerce_template_loop_product_thumbnail - 10
						*/
						// Remove Sale
						remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );

						do_action( 'woocommerce_before_shop_loop_item_title' );
					?>
				</div>

				<div class="product-content-wrapper">
					<?php
						/**
						* Hook: woocommerce_shop_loop_item_title.
						* @hooked woocommerce_template_loop_product_title - 10
						*/
						do_action( 'woocommerce_shop_loop_item_title' );

						/**
						* Hook: woocommerce_after_shop_loop_item_title.
						* @hooked woocommerce_template_loop_rating - 5
						* @hooked woocommerce_template_loop_price - 10
						*/
						do_action( 'woocommerce_after_shop_loop_item_title' );						

						// Add to cart
						//add_action( 'shop_addtocart', 'woocommerce_template_loop_add_to_cart', 10 );

						//do_action( 'shop_addtocart' );					
					?>
				</div>

				<div class="product-action">
					<?php
						/**
						* Hook: woocommerce_after_shop_loop_item.
						* @hooked woocommerce_template_loop_product_link_close - 5
						* @hooked woocommerce_template_loop_add_to_cart - 10
						*/

						// Remove Add to Cart
						//remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );				

						do_action( 'woocommerce_after_shop_loop_item' );
					?>
				</div>
		</div>
	</li>
