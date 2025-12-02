<div class="sharer-wrapper">
	<div class="sharer-title">
    	<?php _e( 'Share', 'harvard' ); ?>
    </div>
    <div class="sharer-list">
        <?php
			$permalink = get_permalink();
			$title = htmlentities( get_the_title() );
			$excerpt = htmlentities( get_the_excerpt() );
			$postThumb = get_the_post_thumbnail_url( $post, 'full' );
			
			$facebookURL = "https://www.facebook.com/sharer/sharer.php?u=" . urlencode($permalink);
			$twitterURL = "http://twitter.com/share?text=" . urlencode($title) . "&amp;url=" . urlencode($permalink);	
			$pinterestURL = "https://www.pinterest.com/pin/create/button/?url=" . urlencode( $permalink ) . "&media=" . urlencode( $postThumb ) . "&description=" . urlencode( $excerpt );
			$linkedinURL = "https://www.linkedin.com/shareArticle?mini=true&url=" . urlencode($permalink) . "&title=" . urlencode($title) . "&summary=" . urlencode( $excerpt ) . "&source=LinkedIn";			
			$emailURL = "mailto:?subject=" . $title . "&body=" . $permalink;
		?>
    
        <a id="fb-share" href="<?php echo $facebookURL; ?>"  class="sharer-link sharer-facebook" title="Share to Facebook" onclick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=500,width=600');return false;" target="_blank">
            <svg width="100%" height="100%" viewBox="0 0 160 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <g id="Artboard1" transform="matrix(0.0833333,0,0,0.277778,0,0)">
                    <rect x="0" y="0" width="1920" height="1080" style="fill:none;"/>
                    <g transform="matrix(4.36893,0,0,1.31068,-1319.42,-262.136)">
                        <path d="M711.3,660L734,512L592,512L592,415.957C592,375.467 611.835,336 675.438,336L740,336L740,210C740,210 681.407,200 625.39,200C508.438,200 432,270.88 432,399.2L432,512L302,512L302,660L432,660L432,1017.78C458.067,1021.87 484.784,1024 512,1024C539.216,1024 565.933,1021.87 592,1017.78L592,660L711.3,660Z" style="fill-rule:nonzero;"/>
                    </g>
                </g>
            </svg>
        	<span class="screen-reader-text">Facebook</span>            
        </a>			
        
        <a href="<?php echo $twitterURL; ?>" class="sharer-link sharer-twitter" title="Share to Twitter" target="_blank">
        	<svg width="100%" height="100%" viewBox="0 0 300 244" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <rect id="Artboard1" x="0" y="0" width="300" height="244" style="fill:none;"/>
                <g id="Artboard11" serif:id="Artboard1">
                    <g transform="matrix(0.585937,0,0,0.585937,0.000128,-27.9999)">
                        <path d="M512,97.248C492.96,105.6 472.672,111.136 451.52,113.824C473.28,100.832 489.888,80.416 497.696,55.808C477.408,67.904 455.008,76.448 431.136,81.216C411.872,60.704 384.416,48 354.464,48C296.352,48 249.568,95.168 249.568,152.992C249.568,161.312 250.272,169.312 252,176.928C164.736,172.672 87.52,130.848 35.648,67.136C26.592,82.848 21.28,100.832 21.28,120.192C21.28,156.544 40,188.768 67.904,207.424C51.04,207.104 34.496,202.208 20.48,194.496L20.48,195.648C20.48,246.656 56.864,289.024 104.576,298.784C96.032,301.12 86.72,302.24 77.056,302.24C70.336,302.24 63.552,301.856 57.184,300.448C70.784,342.016 109.376,372.576 155.264,373.568C119.552,401.504 74.208,418.336 25.12,418.336C16.512,418.336 8.256,417.952 -0,416.896C46.496,446.88 101.6,464 161.024,464C354.176,464 459.776,304 459.776,165.312C459.776,160.672 459.616,156.192 459.392,151.744C480.224,136.96 497.728,118.496 512,97.248Z" style="fill-rule:nonzero;"/>
                    </g>
                </g>
            </svg>


        
            <span class="screen-reader-text">Twitter</span> 
        </a>
        
        <a href="<?php echo $linkedinURL; ?>" class="sharer-link sharer-linkedin" title="Share to LinkedIn" target="_blank">
        	<svg width="100%" height="100%" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <g id="Artboard1" transform="matrix(1.66667,0,0,0.833333,0,0)">
                    <rect x="0" y="0" width="180" height="360" style="fill:none;"/>
                    <g transform="matrix(0.351562,0,0,0.703125,-571.641,0)">
                        <path d="M2137.87,512L2137.87,511.979L2138,511.979L2138,324.203C2138,232.341 2118.22,161.579 2010.83,161.579C1959.2,161.579 1924.56,189.909 1910.42,216.768L1908.92,216.768L1908.92,170.155L1807.1,170.155L1807.1,511.979L1913.12,511.979L1913.12,342.72C1913.12,298.155 1921.57,255.061 1976.76,255.061C2031.14,255.061 2031.95,305.92 2031.95,345.579L2031.95,512L2137.87,512ZM1634.45,170.176L1740.6,170.176L1740.6,512L1634.45,512L1634.45,170.176ZM1687.48,0C1653.54,0 1626,27.541 1626,61.483C1626,95.424 1653.54,123.541 1687.48,123.541C1721.42,123.541 1748.97,95.424 1748.97,61.483C1748.94,27.541 1721.4,0 1687.48,0Z" style="fill-rule:nonzero;"/>
                    </g>
                </g>
            </svg>        
			<span class="screen-reader-text">LinkedIn</span> 
        </a>
        
        <a href="<?php echo $emailURL; ?>" class="sharer-link sharer-email" title="Share to LinkedIn" target="_blank">
        	<svg width="100%" height="100%" viewBox="0 0 26 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                <g transform="matrix(1,0,0,1,0,-40)">
                    <g id="Envelope" transform="matrix(0.0629083,0,0,0.0474574,-46.7526,25.1447)">
                        <rect x="743.187" y="313.024" width="413.3" height="421.43" style="fill:none;"/>
                        <clipPath id="_clip1">
                            <rect x="743.187" y="313.024" width="413.3" height="421.43"/>
                        </clipPath>
                        <g clip-path="url(#_clip1)">
                            <g transform="matrix(15.8961,0,0,21.0715,711.395,-616.982)">
                                <path d="M28,48.136C28,45.927 26.209,44.136 24,44.136C19.389,44.136 10.611,44.136 6,44.136C3.791,44.136 2,45.927 2,48.136L2,60.136C2,62.345 3.791,64.136 6,64.136C10.611,64.136 19.389,64.136 24,64.136C26.209,64.136 28,62.345 28,60.136L28,48.136ZM9.509,54.308L4.477,57.4C4.006,57.689 3.859,58.305 4.148,58.775C4.437,59.246 5.053,59.393 5.523,59.104L11.419,55.482L13.43,56.717C14.393,57.309 15.607,57.309 16.57,56.717L18.581,55.482L24.477,59.104C24.947,59.393 25.563,59.246 25.852,58.775C26.141,58.305 25.994,57.689 25.523,57.4L20.491,54.308L25.523,51.217C25.994,50.928 26.141,50.311 25.852,49.841C25.563,49.371 24.947,49.224 24.477,49.512L15.523,55.013C15.202,55.21 14.798,55.21 14.477,55.013L5.523,49.512C5.053,49.224 4.437,49.371 4.148,49.841C3.859,50.311 4.006,50.928 4.477,51.217L9.509,54.308Z"/>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
			<span class="screen-reader-text">Email</span> 
        </a>
          
    </div>
</div>