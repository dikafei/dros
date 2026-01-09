<?php

// Function to recursively include PHP files from a directory and its subdirectories
function include_php_files($dir) {
    // Loop through each file and folder in the directory
    foreach (glob($dir . '/*') as $file) {
        // If it's a directory, recurse into it
        if (is_dir($file)) {
            include_php_files($file);
        } 
        // If it's a PHP file, include it
        elseif (pathinfo($file, PATHINFO_EXTENSION) === 'php') {
            include_once $file;
        }
    }
}

// Start the inclusion from the 'inc' folder in the stylesheet directory
include_php_files(get_stylesheet_directory() . '/inc');

add_shortcode( 'get_longest_wait', 'get_longest_wait_shortcode' );

function get_longest_wait_shortcode( $atts ) {        
    $atts = shortcode_atts(
        ['interval' => 15],
        $atts,
        'get_longest_wait'
    );
    
    $refresh_interval = max( 1, intval( $atts['interval'] ) );

    // Language
    $lang = 'EN';
    if ( $lang == 'EN' ) {
        $filePath = 'https://tadh.com/sites/default/files/tadh-upload/longestwait.txt';
    }
    else if ( $lag == 'FR' ) {
        $filePath = 'https://tadh.com/sites/default/files/tadh-upload/longestwait-fra.txt';
    }

    ob_start();
    ?>
        <div id="longest-wait">Loading...</div>
        <script>                
            document.addEventListener( 'DOMContentLoaded', function () {
                const textContainer = document.getElementById( 'longest-wait' );

                const fetchText = () => {
                    fetch( "<?php echo $filePath; ?>" )
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.text();
                        })
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, "text/html");

                            const preElement = doc.querySelector("pre");
                            textContainer.textContent = preElement ? preElement.textContent : "No content found.";
                        })
                        .catch(err => {
                            textContainer.textContent = "Failed to load text.";
                            console.error("Error fetching text:", err);
                        });
                };


                fetchText();
                setInterval( fetchText, <?php echo $refresh_interval * 60 * 1000; ?> );
            });
        </script>
    <?php
    return ob_get_clean();
}