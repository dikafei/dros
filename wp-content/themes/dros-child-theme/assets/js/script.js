var $j = jQuery.noConflict();

var vpHeight = $j( window ).height();
var headerHeight = 0;
var headerEl;
//var flexslider = { vars:{} };

const animItems = [];
let ticking = false;

$j(function(){	
	// Animation - Element positions array
		$j( '.anim' ).each(function () {
			const animatedEl = $j( this );
			const sectionEl = animatedEl.closest( '[class*="home-section"]' );

			const sectionIndex = sectionEl.index( '[class*="home-section"]' );
			const xInSection   = animatedEl.position().left;

			animItems.push({
				el: this,
				x: sectionIndex * 1920 + xInSection,
				width: animatedEl.width(),
				triggered: false
			});
		});

	// GSAP
		const $container = $j( '.home .entry-content' );
		let currentScroll = 0;
		let targetScroll = 0;
		let windowWidth = $j( window ).width();
		let maxScroll = 0;
		let animationId = null;

		let homeSection2Left = $j( '.home-section2' ).position().left;
		let homeSection2Width = $j( '.home-section2' ).width();
		
		// Calculate total scroll width from children
		function calculateMaxScroll() {
			let totalWidth = 0;
			$container.children().each(function() {
				totalWidth += $j(this).outerWidth(true); // includes margins
			});
			return totalWidth - $j(window).width();
		}
		
		maxScroll = calculateMaxScroll();
		
		// Handle mouse wheel
		$j( window ).on( 'wheel', function(e) {
			e.preventDefault();
			
			// Adjust target scroll position
			targetScroll += e.originalEvent.deltaY;
			
			// Clamp to boundaries
			targetScroll = Math.max( 0, Math.min( targetScroll, maxScroll ) );
			
			// Start smooth scrolling animation if not already running
			if ( !animationId ) {
				animationId = requestAnimationFrame( smoothScroll );
			}			

			// Progress Bar
			var scrollProgress = targetScroll / maxScroll * 100;
			$j( '.progress-bar' ).css({ 'width' : scrollProgress + '%' });

			// Animation
			//var currentSection = Math.floor( targetScroll / 1920 ) + 1; // Based on left most viewport. ini asumsi semua section 1920px, section 1 dan 2 actually kagak.
			//var incomingSection = currentSection + 1;
			if ( !ticking ) {
				requestAnimationFrame(() => {
					checkAnimTriggers();
					ticking = false;
				});
				ticking = true;
			}
		});

		function checkAnimTriggers() {
			animItems.forEach(item => {
				console.log( targetScroll + ' >= ' + item.x );
				if ( !item.triggered && targetScroll + windowWidth >= item.x + item.width ) {
					$j( item.el ).addClass('is-visible'); // or trigger animation
					item.triggered = true;
				}
			});
		}

		// Smooth scrolling with easing
		function smoothScroll() {			
			// Easing factor: lower = smoother but slower (0.05-0.15 recommended)
			currentScroll += ( targetScroll - currentScroll ) * 0.05;
			
			// Continue animation if still moving
			if ( Math.abs( targetScroll - currentScroll ) > 0.5 ) 
			{
				$container.css( 'transform', `translateX(-${currentScroll}px)`);
				animationId = requestAnimationFrame(smoothScroll);
			} 
			else 
			{
				// Snap to final position
				currentScroll = targetScroll;
				$container.css( 'transform', `translateX(-${currentScroll}px)`);
				animationId = null;
			}

			// Home Section 2 Transition			
			let imgScrollPost = currentScroll;
			if ( imgScrollPost < 0 ) { imgScrollPost = 0; }
			if ( imgScrollPost > ( homeSection2Left + ( homeSection2Width / 4 ) ) ) { imgScrollPost = ( homeSection2Left + ( homeSection2Width / 4 ) ) }
			
			let opacity = imgScrollPost / ( homeSection2Left + ( homeSection2Width / 4 ) );
			$j( '.home-section2 .wp-block-image:nth-child(2)' ).css({ 'opacity' : opacity });			
		}
		
		// Update maxScroll on window resize
		$j( window ).on( 'resize', function() {
			maxScroll = calculateMaxScroll(); //$container.outerWidth() - $j( window ).width();
			targetScroll = Math.min( targetScroll, maxScroll );
			windowWidth = $j( window ).width();
			currentScroll = Math.min( currentScroll, maxScroll );
			$container.css( 'transform', `translateX(-${currentScroll}px)`);

			homeSection2Left = $j( '.home-section2' ).position().left;
			homeSection2Width = $j( '.home-section2' ).width();
		});

	// Search
		$j( '.search-field' ).attr( 'placeholder', 'Search...' );

		$j( 'body' ).on( 'click', '.search-wrapper svg', function() {
			headerEl.toggleClass( 'searchopen' );
			
			$j( '.search-input' ).focus();
		});

	// Burger bar on click		
		$j( '.burger-wrapper' ).click( function() {
			$j( this )
				.toggleClass( 'active' )
				.siblings( '#site-navigation' ).toggleClass( 'active' );
		});
		
	// Sticky
		headerEl = $j( 'header' );
		if( headerEl.length && headerEl.hasClass( 'stickyheader' ) ) 
		{
			var topBar = $j( '.topbar-wrapper' ).outerHeight();			
			var headerBar = $j( '.header-wrapper' ).outerHeight();
			topBar = topBar ? topBar : 0;
			headerBar = headerBar ? headerBar : 0;
			headerHeight = topBar + headerBar;
			
			if( $j( '.stickyheader:not(.transparentheader)' ).length ) {			
				$j( 'body' ).css({ 'padding-top' : headerHeight });
			}
		}
		

	// To Top	
		$j( '#toTop, .toTop' ).click( function(e) {
			e.preventDefault();
			$j( 'html, body' ).animate({
				scrollTop: 0
			}, 2000);
		});		
	
	// Styling Input File
		$j( '#photo-attachment-trigger' ).each( function()
		{
			var attachmentFileInput = $j( this ).find( '#photo-attachment' );
			var attachmentLabel	= $j( this ).siblings( '#photo-attachment-label' );
			var attachmentLabelValue = attachmentLabel.children( 'span' ).html();

			attachmentFileInput.on( 'change', function( e ) {
				var fileName = '';

				if( this.files && this.files.length > 1 ) 
				{
					fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
				}
				else if( e.target.value )
				{
					fileName = e.target.value.split( '\\' ).pop();
				}

				if( fileName ) 
				{
					attachmentLabel.html( '<span>' + fileName + '</span><span id="photo-attachment-remove"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"></path></svg></span>' );

					var reader = new FileReader();				
					reader.onload = function (e) {
						$j( '#photo-attachment-preview' ).html( '<img src="' + e.target.result + '">').addClass( 'file-added' );
					}

					reader.readAsDataURL( this.files[0] );
				}
				else 
				{
					attachmentLabel.html( attachmentLabelValue );
				}
			});

			// FF fix
			attachmentFileInput
				.on( 'focus', function(){ attachmentFileInput.addClass( 'has-focus' ); })
				.on( 'blur', function(){ attachmentFileInput.removeClass( 'has-focus' ); });
		});

		$j( 'body' ).on( 'click', '#photo-attachment-remove', function() {
			var triggerEl = $j( this ).parent( '#photo-attachment-label' ).siblings( '#photo-attachment-trigger' );

			triggerEl.find( '#photo-attachment-preview' )
				.removeClass( 'file-added' )
				.empty();

			triggerEl.find( '#photo-attachment' ).val( '' );

			$j( this ).siblings( 'span' ).html( 'No file chosen' );
			$j( this ).remove();
		})

	// Styling Input Number 
		$j( '.inputqty-wrapper .input-minus' ).click( function() {
			var parentEl = $j( this ).parent( '.inputqty-wrapper' );
			var numberEl = parentEl.find( 'input[type=number]' );
			var finalNumber = parseInt( numberEl.val(), 10 ) - 1;
			if ( finalNumber < 1 ) {
				finalNumber = 1;
			}

			numberEl.val( finalNumber );
		})

		$j( '.inputqty-wrapper .input-plus' ).click( function() {
			var parentEl = $j( this ).parent( '.inputqty-wrapper' );
			var numberEl = parentEl.find( 'input[type=number]' );
			var finalNumber = parseInt( numberEl.val(), 10 ) + 1;

			numberEl.val( finalNumber );
		})

	// Woocommerce 
		// Checkout - move amazon pay button from woocommerce notification to below
			setTimeout( function() {
				$j( '#pay_with_amazon' ).prependTo( '.checkout-expresscheckout');
			}, 2000 );

	// CF7 
		// Focus on the first invalid input
			document.addEventListener('wpcf7invalid', function (event) {
				setTimeout(function () {
				$j('#' + event.detail.unitTag + ' .wpcf7-not-valid').eq(0).focus();
				}, 1000);
			}, false);

	// Block - Accordion
		$j( '.accordion-item-title' ).click( function() {
			var parentEl = $j( this ).closest( '.accordion-item-wrapper' );			

			if ( parentEl.hasClass( 'active' ) ) {				
				parentEl.find( '.accordion-item-content' ).slideUp(200);				
				$j( this ).attr('aria-expanded', 'false'); 	
				parentEl.removeClass( 'active' );
			}
			else {				
				parentEl.find( '.accordion-item-content' ).slideDown(200);				
				$j( this ).attr('aria-expanded', 'true'); 	
				parentEl.addClass( 'active' );
			}
		});

	// Block - Tab		
		// Tab Nav Creation
			$j( '.tab-block-wrapper:not(.blog-tab)' ).each( function() {
				var tabNavigationWrapper = $j( this ).find( '.tab-block-navigation-wrapper' );
				var tabContentWrapper = $j( this ).find( '.tab-block-content-wrapper' );
				var tabID = tabTitle = tabClass = '';

				tabContentWrapper.children( '.tab-item-wrapper' ).each( function( index ) {
					tabID = $j( this ).attr( 'data-id' );
					tabTitle = $j( this ).attr( 'data-title' );
					tabClass = '';

					if ( index == 0 ) { tabClass = 'active'; }

					tabNavigationWrapper.append( '<div class="tab-navigation ' + tabClass +'" data-id="' + tabID + '">' + tabTitle + '</div>' );
				});

				tabContentWrapper.children( '.tab-item-wrapper:first-child' ).addClass( 'active' );
			});

		// Tab Nav Click
			$j( 'body' ).on( 'click', '.tab-block-navigation-wrapper .tab-navigation:not(.tab-title)', function() {
				var tabWrapper = $j( this ).closest( '.tab-block-wrapper' );
				var tabContentWrapper = tabWrapper.find( '.tab-block-content-wrapper' );
				var tabID = $j( this ).attr( 'data-id' );

				$j( this ).addClass( 'active' ).siblings().removeClass( 'active' );
				tabContentWrapper.find( '.tab-item-wrapper[data-id="' + tabID +'"]').addClass( 'active' ).siblings().removeClass( 'active' );
			});	
}); 


$j( window ).scroll( function() {
	// Scroll to top	
		/*if ( $j( window ).scrollTop() > vpHeight ) {
			$j( '#toTop' ).fadeIn(400);
		}
		else {
			$j( '#toTop' ).fadeOut(400);	
		}*/
	
	// Sticky Header
		if( $j( '.stickyheader' ).length ) 
		{
			if ( $j( window ).scrollTop() > headerHeight ) {
				headerEl.addClass( 'onScroll' );
			}
			else {
				headerEl.removeClass( 'onScroll' );
			}
		}	
});