<?php
/**
 * Link Group Block Template.
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

$url = get_field('url') ?: '';

?>
<div class="link-group-block-wrapper is-alignment-<?php echo $block['align']; ?> <?php echo esc_attr($classes); ?>">
    <?php
        if ( !is_admin() )
        {
            ?>
                <a href="<?php echo $url; ?>">
            <?php
        }
    ?>
        <div class="link-group-inner">
            <?php echo '<InnerBlocks />'; ?>  
        </div>
    <?php
        if ( !is_admin() )
        {
            ?>
                </a>
            <?php
        }
    ?>
</div>