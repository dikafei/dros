<?php
/**
 * Tab Item Block Template.
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

/*$template = array(
    array( 'core/paragraph', array(
        'placeholder' => 'Add Title',
        'className' => 'tab-item-title',
        'lock' => array(
            'move'   => true,
            'remove' => true,
        ),        
    ) )
);*/

$title = get_field('title') ?: '';
?>
<div class="tab-item-wrapper <?php echo esc_attr($classes); ?>" data-id="<?php echo uniqid(); ?>" data-title="<?php echo $title; ?>">            
    <?php echo '<InnerBlocks />'; ?>      
</div>