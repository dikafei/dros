<?php
/**
 * Testimonial Item Block Template.
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

$name = get_field('name') ?: '';
$testimonial = get_field('testimonial') ?: '';
$company = get_field('company') ?: '';
?>
<div class="swiper-slide">
    <div class="testimonial-item-wrapper <?php echo esc_attr($classes); ?>">        
        <div class="testimonial-item-content">
            “<?php echo $testimonial; ?>”
        </div>  
        <div class="testimonial-item-meta">
            <div class="testimonial-item-name">
                <span class="testimonial-item-name-inner"><?php echo $name; ?></span>
            </div>
            <div class="testimonial-item-company">
                <?php echo $company; ?>
            </div>        
        </div>    
    </div>
</div>