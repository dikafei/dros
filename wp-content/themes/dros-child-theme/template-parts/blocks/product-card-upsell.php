<?php
/**
 * Product Card Upsell Block Template.
 *
 * @param   array $block The block settings and attributes.
 * @param   string $content The block inner HTML (empty).
 * @param   bool $is_preview True during AJAX preview.
 * @param   (int|string) $post_id The post ID this block is saved to.
 */

// Create class attribute allowing for custom "className" and "align" values.
$classes = '';
if( !empty($block['className']) ) {
    $classes .= sprintf( ' %s', $block['className'] );
}
if( !empty($block['align']) ) {
    $classes .= sprintf( ' align%s', $block['align'] );
}

$product_postobject = get_field( 'product' ) ?: '';
$variation_id = get_field( 'variation' ) ?: '';
$variation_description = get_field( 'variation_description' ) ?: '';
$image_only = get_field( 'image_only' ) ? : false;

if ( !empty( $product_postobject ) )
{
    $id = $product_postobject->ID;
    $product = wc_get_product( $id );
    $title = $product_postobject->post_title;
    $product_description = $product_postobject->post_content;

    if ( $product->is_type( 'variable' ) ) 
    {
        // Product has variation
        $variations = $product->get_available_variations();    

        foreach( $variations as $variation ) 
        {

            /*var_dump( $variation );    
            echo '<br><br><br>';
            echo $variation['variation_id'];*/    
        
            if ( $variation_id == $variation['variation_id'] )
            {   
                $thumb = $variation['image']['url'];
                $price = $variation['price_html'];        

                break;
            }
            else 
            {
                // Can't find variation ID or empty input             
                $thumb = $variation['image']['url'];
                $price = $variation['price_html'];      
            }
        }
    }
    else 
    {
        // Product has no variation        
        $thumb = get_the_post_thumbnail_url( $product_postobject );    
    }
    ?>

    <div class="product-card-wrapper product-card-upsell">
        <?php
            if ( !empty( $variation_description ) ) 
            {
                ?>
                    <div class="product-card-variation">
                        <?php echo $variation_description; ?>
                    </div>
                <?php  
            }
        ?>
        
        <div class="product-card-image">    
            <?php
                if ( !empty( $thumb ) ) 
                {
                    ?>
                        <img src="<?php echo $thumb; ?>" alt="<?php echo $title; ?>">
                    <?php            
                }
            ?>
        </div>

        <div class="product-card-title">
            <?php echo $title; ?>
        </div>  

        <?php
            if ( !empty( $product_description ) )
            {
                ?>
                    <div class="product-card-description">
                        <?php echo $product_description; ?>
                    </div> 
                <?php  
            }
        ?>        
           
        <?php
            if ( !empty( $price ) ) 
            {
                ?>
                    <div class="product-card-price">
                        <?php echo $price; ?>
                    </div>
                <?php  
            }
        ?>

        <div class="product-card-action">
            <a href="#" title="">
                <div class="std-button">
                    <?php _e( 'カートに追加', 'ambientlounge' ); ?>                    
                </div>
            </a>
        </div>
    </div>

    <?php    
}
?>