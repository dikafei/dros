<?php
/**
 * Accordion Group Block Template.
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

$allowed_blocks = array( 'acf/accordion-item' );
?>
<div class="accordion-block-wrapper <?php echo esc_attr($classes); ?>">
    <?php echo '<InnerBlocks allowedBlocks="' . esc_attr( wp_json_encode( $allowed_blocks ) ) . '" />'; ?>
</div>