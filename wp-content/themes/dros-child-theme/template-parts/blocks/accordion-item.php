<?php
/**
 * Accordion Item Block Template.
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

$template = array(
    array( 'core/paragraph', array(
        'placeholder' => 'Add Title',
        'className' => 'accordion-item-title',
        'lock' => array(
            'move'   => true,
            'remove' => true,
        ),        
    ) )
);

$title = get_field('title') ?: '';
$uniqid_button = uniqid();
$uniqid_content = uniqid();
?>
<div class="accordion-item-wrapper <?php echo esc_attr($classes); ?>">    
    <button id="<?php echo $uniqid_button; ?>" class="accordion-item-title" aria-expanded="false" aria-controls="<?php echo $uniqid_content; ?>">
        <?php echo $title; ?>
        <div class="accordion-plusminus">
        </div>
    </button>
    <div id="<?php echo $uniqid_content; ?>" class="accordion-item-content" aria-labelledby="<?php echo $uniqid_button; ?>" role="region">
        <?php echo '<InnerBlocks />'; ?>  
    </div>  
</div>