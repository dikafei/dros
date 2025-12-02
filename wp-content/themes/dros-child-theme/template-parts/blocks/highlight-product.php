<?php
/**
 * Highlight Product Block Template.
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

$product = get_field('product') ?: '';
$slogan = get_field('slogan') ?: '';
$dark_theme = get_field('theme') ?: false;
$alignment = get_field('alignment') ?: 'left';
$gradient_start = get_field('gradient_start') ?: '#B490CA';
$gradient_end = get_field('gradient_end') ?: '#99BBD4';


if ( $dark_theme ) {
    $classes .= sprintf( ' %s', 'is-dark' );
}

$id = $product->ID;
$title = $product->post_title;
$thumb = get_the_post_thumbnail_url( $product );
?>
<div class="highlight-product-wrapper is-alignment-<?php echo $alignment; ?> <?php echo esc_attr($classes); ?>">    
    <div class="highlight-product-content-wrapper">        
        <div class="highlight-product-content">        
            <?php
                if ( !empty( $slogan ) && $dark_theme )
                {
                    ?>
                        <div class="highlight-product-slogan">
                            <?php echo $slogan; ?>
                        </div>
                    <?php
                }
            ?>
            <div class="highlight-product-title" style="background: -webkit-linear-gradient(0deg, <?php echo $gradient_start; ?>, <?php echo $gradient_end; ?>) text;">
                <?php echo $title ?>
            </div>
            <?php
                if ( !empty( $slogan ) && !$dark_theme )
                {
                    ?>
                        <div class="highlight-product-slogan">
                            <?php echo $slogan; ?>
                        </div>
                    <?php
                }
            ?>
            <div class="highlight-product-action">
                <a href="<?php the_permalink( $id ); ?>" title="<?php echo $title ?>">
                    <div class="std-button">
                        <?php esc_html_e( '詳細を見る', 'ambientlounge' ); ?>
                    </div>                
                </a>
                <a href="?add-to-cart=<?php echo $id ?>" class="link-arrow">
                    <?php esc_html_e( ' 購入', 'ambientlounge' ); ?>
                </a>
            </div>
        </div>
    </div>
    <div class="highlight-product-bg" style="background-image:url(<?php echo $thumb; ?>);">
    </div>
</div>