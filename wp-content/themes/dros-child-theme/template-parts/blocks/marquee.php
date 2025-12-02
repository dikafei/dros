<?php
/**
 * Marquee Block Template.
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

$words = get_field('words') ?: '';

?>
<div class="marquee-block-wrapper is-alignment-<?php echo $block['align']; ?> <?php echo esc_attr($classes); ?>">
    <?php
    /*
    <div class="marquee-background">
        <div class="marquee-block-inner">    
            <div class="marquee-block-words">
                <?php
                    $arrWords = explode( PHP_EOL, $words );            
                    foreach( $arrWords as $word ) 
                    {
                        ?>
                            <div class="word"><?php echo $word; ?></div>
                        <?php
                    }
                ?>
            </div>
        </div>
    </div>
    */
    ?>
    <div class="swiper">    
        <div class="swiper-wrapper">        
            <?php
                $arrWords = explode( PHP_EOL, $words );            
                foreach( $arrWords as $word ) 
                {
                    ?>
                        <div class="swiper-slide">
                            <div class="word">
                                <?php echo $word; ?>
                            </div>
                        </div>
                    <?php
                }
            ?>   
        </div>    
    </div>
</div>