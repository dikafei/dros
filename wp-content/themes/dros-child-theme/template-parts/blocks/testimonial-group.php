<?php
/**
 * Testimonial Group Block Template.
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

$allowed_blocks = array( 'acf/testimonial-item' );
?>
<div class="testimonial-block-wrapper <?php echo esc_attr($classes); ?>">
    <div class="swiper-outer">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <?php echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $allowed_blocks ) ) . '" />'; ?>
            </div>    

            <div class="navigation-wrapper">  
                <div class="swiper-button-prev">
                    <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="1.45703" width="49" height="49" rx="24.5" stroke="#232D68"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M30.2574 33.8425L22.3719 25.957L30.2574 18.0715C30.7406 17.5883 30.7406 16.8027 30.2574 16.3195C29.7729 15.8362 28.9886 15.8362 28.5041 16.3195L19.7426 25.081C19.2593 25.5642 19.2593 26.3498 19.7426 26.8331L28.5041 35.5946C28.9886 36.0778 29.7729 36.0778 30.2574 35.5946C30.7406 35.1114 30.7406 34.3258 30.2574 33.8425Z" fill="#232D68"/>
                    </svg>

                </div>
                <div class="swiper-pagination <?php echo $classPagination; ?>"></div>
                <div class="swiper-button-next">
                    <svg width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="-0.5" y="0.5" width="49" height="49" rx="24.5" transform="matrix(-1 0 0 1 49 0.957031)" stroke="#232D68"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7426 33.8425L27.6281 25.957L19.7426 18.0715C19.2594 17.5883 19.2594 16.8027 19.7426 16.3195C20.2271 15.8362 21.0114 15.8362 21.4959 16.3195L30.2574 25.081C30.7407 25.5642 30.7407 26.3498 30.2574 26.8331L21.4959 35.5946C21.0114 36.0778 20.2271 36.0778 19.7426 35.5946C19.2594 35.1114 19.2594 34.3258 19.7426 33.8425Z" fill="#232D68"/>
                    </svg>
                </div>
            </div>        
        </div>        
    </div>

    <div class="thumbswiper-container">
        <div class="swiper-wrapper">
        </div>
    </div>
</div>