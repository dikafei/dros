var $j = jQuery.noConflict();

var vpHeight = $j( window ).height();
var headerHeight = 0;
var headerEl;

const animItems = [];
const unitHeads = [];
const imageScales = [];
const imageScalesMobile = [];
const sectionImageScales = [];
const sectionImageScalesMobile = [];

let sectionPositionsDesktop = [];
let sectionPositionsMobile  = [];

const SECTION_WIDTH = 1920;
const ARROW_SCROLL_STEP = 120;

const ANIM_TRIGGER_OFFSET = 0.3;
const ANIM_STAGGER = 200; // ms between items
const X_GROUP_TOLERANCE = 10; // px (same column tolerance)
const animGroups = {};

const ANIM_UNITHEAD_OFFSET = 0; //0.2;
const ANIM_UNITHEAD_FASTER_SCROLL = 1; /*Math.min(
	0.6,
	1200 / window.innerWidth
); */ 

let ticking = false;

$j(function(){	
    
	// Initial mobile check - important put at very top
		mobileCheck();

	// Unit Head Texts - Make them same size
		syncUnitHeadTextWidth();

		function syncUnitHeadTextWidth() {
			$j( '.unit-head' ).each( function() {
				var topText = $j( this ).find( '.wp-block-cover__inner-container .wp-block-heading:first-child' );
				var bottomText = $j( this ).find( '.wp-block-cover__inner-container .wp-block-heading:last-child' );

				var maxWidth = Math.max(
					topText.outerWidth(),
					bottomText.outerWidth()
				);

				topText.width(maxWidth);
				bottomText.width(maxWidth);
			});	

			// reset first (important if content changes)
			//$top.css('width', 'auto');
			//$bottom.css('width', 'auto');			
		}

	// Keyboard Shortcut
		buildSectionPositions();

		function buildSectionPositions() {
			sectionPositionsDesktop = [];
			sectionPositionsMobile  = [];

			const $sections = $j('[class*="home-section"]');

			$sections.each(function (index) {
				// Desktop: horizontal
				sectionPositionsDesktop.push(index * SECTION_WIDTH);

				// Mobile: vertical
				if ( !$j( this ).hasClass( 'hero' ) ) { // Hero is hidden on mobile
					sectionPositionsMobile.push(this.offsetTop);
				}				
			});
		}

		function clampTargetScroll(x) {
			const maxScroll =
				$container[0].scrollWidth - window.innerWidth;

			return Math.max(0, Math.min(x, maxScroll));
		}

		function startSmoothScroll() {
			if (!animationId) {
				animationId = requestAnimationFrame(smoothScroll);
			}
		}

		/*function getCurrentSectionIndex() {
			let closestIndex = 0;
			let minDist = Infinity;

			sectionPositions.forEach((pos, i) => {
				const dist = Math.abs(pos - currentScroll);
				if (dist < minDist) {
					minDist = dist;
					closestIndex = i;
				}
			});

			return closestIndex;
		}*/

		function getCurrentSectionIndexDesktop() {
			let closestIndex = 0;
			let minDist = Infinity;

			sectionPositionsDesktop.forEach((pos, i) => {
				const dist = Math.abs(pos - currentScroll);
				if (dist < minDist) {
					minDist = dist;
					closestIndex = i;
				}
			});

			return closestIndex;
		}

		function getCurrentSectionIndexMobile() {
			const scrollY = window.scrollY;
			let closestIndex = 0;
			let minDist = Infinity;

			sectionPositionsMobile.forEach((pos, i) => {
				const dist = Math.abs(pos - scrollY);
				if (dist < minDist) {
					minDist = dist;
					closestIndex = i;
				}
			});

			return closestIndex;
		}

		$j(window).on('keydown', function (e) {
			const keys = [
				'PageDown',
				'PageUp',
				'Home',
				'End',
				'ArrowLeft',
				'ArrowRight'
			];

			if (!keys.includes(e.code)) return;

			e.preventDefault();

			/* ===========================
			MOBILE
			=========================== */
			if (isMobile()) {

				const currentIndex = getCurrentSectionIndexMobile();

				switch (e.code) {

					case 'PageUp': {
						const targetIndex = Math.max(0, currentIndex - 1);
						window.scrollTo({
							top: sectionPositionsMobile[targetIndex],
							behavior: 'smooth'
						});
						break;
					}

					case 'PageDown': {
						const targetIndex = Math.min(
							sectionPositionsMobile.length - 1,
							currentIndex + 1
						);
						window.scrollTo({
							top: sectionPositionsMobile[targetIndex],
							behavior: 'smooth'
						});
						break;
					}

					case 'Home':
						window.scrollTo({ top: 0, behavior: 'smooth' });
						break;

					case 'End':
						window.scrollTo({
							top: document.documentElement.scrollHeight,
							behavior: 'smooth'
						});
						break;

					case 'ArrowLeft':
						window.scrollBy({ top: -ARROW_SCROLL_STEP, behavior: 'smooth' });
						break;

					case 'ArrowRight':
						window.scrollBy({ top: ARROW_SCROLL_STEP, behavior: 'smooth' });
						break;
				}

				return;
			}

			/* ===========================
			DESKTOP (UNCHANGED)
			=========================== */

			const currentIndex = getCurrentSectionIndexDesktop();

			switch (e.code) {

				case 'PageUp': {
					const targetIndex = Math.max(0, currentIndex - 1);
					targetScroll = sectionPositionsDesktop[targetIndex];
					break;
				}

				case 'PageDown': {
					const targetIndex = Math.min(
						sectionPositionsDesktop.length - 1,
						currentIndex + 1
					);
					targetScroll = sectionPositionsDesktop[targetIndex];
					break;
				}

				case 'Home':
					targetScroll = 0;
					break;

				case 'End':
					targetScroll = clampTargetScroll(Infinity);
					break;

				case 'ArrowLeft':
					targetScroll = clampTargetScroll(targetScroll - ARROW_SCROLL_STEP);
					break;

				case 'ArrowRight':
					targetScroll = clampTargetScroll(targetScroll + ARROW_SCROLL_STEP);
					break;
			}

			startSmoothScroll();
		});

	// Animation 
		const $container = $j( '#page .entry-content' );
		let currentScroll = 0;
		let targetScroll = 0;
		let windowWidth = $j( window ).width();
		let maxScroll = 0;
		let animationId = null;

		let heroLeft = $j( '.hero' ).position().left;
		let heroWidth = $j( '.hero' ).width();

		const $sections = $j('[class*="home-section"]');

		let moveTrigger = '';

		/*$j( '.burger-bar-wrapper' ).click( function() {
			alert( $j( '.between' ).offset().top );
		});*/

		// Animation Type Fade: Collect animated elements into array
			var i = 0;
			$j( '.anim' ).each(function () {
				const $el = $j(this);
				const $section = $el.closest('[class*="home-section"]');
				if (!$section.length) return;

				const sectionIndex = $sections.index($section);				
				if (sectionIndex === -1) return;

				const sectionLeft = $section.position().left;				
				const sectionTop = $section.position().top;

				const xInSection = $el.position().left;
				const yInSection = $el.position().top;

				const worldX = sectionLeft + xInSection;
				//const worldY = sectionTop + yInSection;
				const worldY = $el.offset().top;

				// --- group by approximate X
				const groupKey = Math.round(worldX / X_GROUP_TOLERANCE) * X_GROUP_TOLERANCE;

				if (!animGroups[groupKey]) {
					animGroups[groupKey] = [];
				}

				/*if ( $j( this ).hasClass( 'between' )) {
					i = 'between';

					alert(worldY);
				}*/

				animGroups[groupKey].push({
					index: i,
					el: this,
					x: worldX,
					y: worldY,
					width: $el.outerWidth(),
					height: $el.outerHeight(),
					triggered: false,
					delay: 0
				});

				i++;
			});
			
			
			Object.values(animGroups).forEach(group => {
				group.forEach((item, index) => {
					item.delay = index * ANIM_STAGGER;
					animItems.push(item);
				});
			});

			// On mobile, sort anim items to fix some overlap animation
			if ( isMobile() ) {
				animItems.sort((a, b) => a.y - b.y);

				// Trigger the first animation on first section on load
				requestAnimationFrame(() => {
					checkAnimTriggers(window.scrollY);
				});
			}			

			console.log(animItems);

		// Animation Type Unit Head
			buildUnitHeads();

			function buildUnitHeads() {
				unitHeads.length = 0;

				const $sections = $j('[class*="home-section"]');

				$j('.unit-head').each(function () {
					const $section = $j(this);

					const startX = $section.position().left - window.innerWidth * ( 1 - ANIM_UNITHEAD_OFFSET );

					const $cover = $section.find('.wp-block-cover');
					const $inner = $cover.find('.wp-block-cover__inner-container');

					const innerWidth = $inner.outerWidth();

					const $left  = $inner.children().first();
					const $right = $inner.children().last();

					const leftWidth  = $left.outerWidth();
					const rightWidth = $right.outerWidth();

					const maxMove =
						innerWidth - Math.max(leftWidth, rightWidth);

					unitHeads.push({
						startX,
						maxMove,
						leftEl:  $left[0],
						rightEl: $right[0]
					});
				});
			}

			function updateUnitHeadAnimations(scrollX) {
				const viewportWidth = window.innerWidth;

				unitHeads.forEach(item => {
					const localScroll = scrollX - item.startX;

					/*const progress = Math.max(
						0,
						Math.min(1, localScroll / viewportWidth)
					);*/

					const progress = Math.max(
						0,
						Math.min( 1, localScroll / ( viewportWidth * ANIM_UNITHEAD_FASTER_SCROLL ) )
					);

					const move = Math.min(
						item.maxMove,
						progress * item.maxMove
					) * 0.9;

					const move2 = move * 1.2;

					const moveOpacity = Math.min(
						item.maxMove,
						progress * item.maxMove
					) * 0.2 / 100;

					//item.leftEl.style.transform  = `translateX(${ move }px)`;
					//item.rightEl.style.transform = `translateX(${ -move }px)`;
					item.leftEl.style.transform  = `translateX(${ -move }px)`;
					item.rightEl.style.transform = `translateX(${ -move2 }px)`;
					item.leftEl.style.opacity = `${ moveOpacity }`;
					item.rightEl.style.opacity = `${ moveOpacity }`;
				});
			}
			
		// Animation Type - Section Image (full size image)
			buildSectionImageScales();

			function buildSectionImageScales() {	
				const $sections = $j('[class*="home-section"]');

				//$j('[class*="home-section"] .wp-block-image:not(.noscaling) img').each(function () {
				$j('[class*="home-section"] .wp-block-image.section-image img').each(function () {
					const img = this;
					const $img = $j(img);
					const $block = $img.closest('.wp-block-image');
					const $section = $img.closest('[class*="home-section"]');

					const sectionIndex = $sections.index($section);
					if (sectionIndex === -1) return;

					// --- WORLD POSITION (no DOM reads after transform)
					const sectionX = sectionIndex * SECTION_WIDTH;
					const blockX = sectionX + $block.position().left;
					const blockWidth = $block.outerWidth();

					const isHero = $img.parent( '.wp-block-image' ).hasClass('hero-stack');

					let startX, endX;

					if (isHero) {
						const HERO_SCROLL_WIDTH = 2880;

						// Anchor hero animation to scroll origin
						startX = 0;
						endX   = HERO_SCROLL_WIDTH;
					} else {
						startX = blockX - window.innerWidth;
						endX   = blockX + blockWidth - window.innerWidth;
					}

					sectionImageScales.push({
						el: img,
						startX,
						endX,
						range: endX - startX,
						isHero
					});
				});
			}

			function updateSectionImageScales(scrollX) {
				sectionImageScales.forEach(item => {
					const local = scrollX - item.startX;

					const progress = Math.max(
						0,
						Math.min(1, local / item.range)
					);

					const scale = 1.2 - progress * 0.2;
					item.el.style.transform = `scale(${scale})`;
				});
			}

		// Animation Type - Section Image for mobile
			buildSectionImageScalesMobile();

			function buildSectionImageScalesMobile() {
				sectionImageScalesMobile.length = 0;

				$j('[class*="home-section"] .wp-block-image.section-image img').each(function () {
					const img = this;
					const $img = $j(img);
					const $block = $img.closest('.wp-block-image');

					const rect = $block[0].getBoundingClientRect();
					const scrollTop = window.scrollY;

					const blockTop = rect.top + scrollTop;
					const blockHeight = $block.outerHeight();

					const startY = blockTop - window.innerHeight;
					const endY   = blockTop + blockHeight;

					sectionImageScalesMobile.push({
						el: img,
						startY,
						endY,
						range: endY - startY
					});
				});
			}

			function updateSectionImageScalesMobile() {
				const scrollY = window.scrollY;

				sectionImageScalesMobile.forEach(item => {
					const local = scrollY - item.startY;

					let progress = local / item.range;
					progress = Math.max(0, Math.min(1, progress));

					const scale = 1.2 - progress * 0.2;
					item.el.style.transform = `scale(${scale})`;
				});
			}

		// Animation Type - Image (normal image, non full, non noscaling)
			buildImageScales();

			function buildImageScales() {	
				imageScales.length = 0;

				const $sections = $j('[class*="home-section"]');

				$j('[class*="home-section"] .wp-block-image:not(.noscaling):not(.section-image) img').each(function () {

					const img = this;
					const $img = $j(img);
					const $block = $img.closest('.wp-block-image');
					const $section = $img.closest('[class*="home-section"]');

					const sectionIndex = $sections.index($section);
					if (sectionIndex === -1) return;

					// --- world X (stable)
					const sectionX = sectionIndex * SECTION_WIDTH;
					const blockX   = sectionX + $block.offset().left - $section.offset().left;
					const blockW   = $block.outerWidth();

					// animation window
					const startX = blockX - window.innerWidth;
					const endX   = blockX + blockW - window.innerWidth;

					// how far the scaled image can move
					const SCALE = 1.2;
					const maxTranslateX = (blockW * SCALE - blockW) / 2;

					imageScales.push({
						el: img,
						startX,
						endX,
						range: endX - startX,
						maxTranslateX
					});
				});
			}

			function updateImageScales(scrollX) {
				const START_DELAY  = 0.3; // start later
				const SPEED_FACTOR = 1.6; // slower movement

				imageScales.forEach(item => {
					const local = scrollX - item.startX;					

					// Type 1: Delay start before move
					/*
					let raw = local / item.range;
					let progress = (raw - START_DELAY) / (1 - START_DELAY);
					progress = Math.max(0, Math.min(1, progress));*/

					// Type 2: Slower Movement
					/*
					const progress = Math.max(
						0,
						Math.min(1, local / (item.range * SPEED_FACTOR))
					);*/					
					
					// Type 3: Standard
					/*const progress = Math.max(
						0,
						Math.min(1, local / item.range)
					);				*/	

					// Type 4: Easing ease out (used with other type)
					// progress = progress * progress;

					// Type 5: Combo
					let raw = local / (item.range * SPEED_FACTOR);					
					let progress = (raw - START_DELAY) / (1 - START_DELAY);
					progress = Math.max(0, Math.min(1, progress));

					const translateX = progress * item.maxTranslateX;

					item.el.style.transform = `translateX(${translateX}px) scale(1.2)`;
				});
			}

		// Animation Type - Normal image but for mobile
			buildImageScalesMobile();

			function buildImageScalesMobile() {
				imageScalesMobile.length = 0;

				$j('.wp-block-image:not(.noscaling):not(.section-image) img').each(function () {
					const img = this;
					const $img = $j(img);
					const $block = $img.closest('.wp-block-image');

					const blockTop    = $block.offset().top;
					const blockHeight = $block.outerHeight();
					const viewportH   = window.innerHeight;

					// animation window (vertical)
					const startY = blockTop - viewportH;
					const endY   = blockTop + blockHeight - viewportH;

					const SCALE = 1.2;
					const blockW = $block.outerWidth();
					const maxTranslateX = (blockW * SCALE - blockW) / 2;
					const maxTranslateY =  (blockHeight * SCALE - blockHeight) / 2;

					imageScalesMobile.push({
						el: img,
						startY,
						endY,
						range: endY - startY,
						maxTranslateY
					});
				});
			}

			function updateImageScalesMobile(scrollY) {
				const START_DELAY  = 0.3;
				const SPEED_FACTOR = 1.6;

				imageScalesMobile.forEach(item => {
					const local = scrollY - item.startY;

					let raw = local / (item.range * SPEED_FACTOR);
					let progress = (raw - START_DELAY) / (1 - START_DELAY);
					progress = Math.max(0, Math.min(1, progress));

					const translateX = progress * item.maxTranslateX;
					const translateY = progress * item.maxTranslateY;

					/*item.el.style.transform =
						`translateX(${translateX}px) scale(1.2)`;*/
					item.el.style.transform =
						`translateY(${translateY}px) scale(1.2)`;
				});
			}
	

		// Initial call on animation
			if ( !isMobile() ) {
				checkAnimTriggers(0);
				updateUnitHeadAnimations(0);
			}

		// Calculate total scroll width from children
			function calculateMaxScroll() {
				if ( isMobile() ) {
					return $container.outerHeight() - $j(window).height();
				}

				let totalWidth = 0;
				$container.children().each(function() {
					totalWidth += $j(this).outerWidth(true); // includes margins
				});
				return totalWidth - $j(window).width();
			}
			
			maxScroll = calculateMaxScroll();		
		
		// Handle mouse wheel
			// Desktop Scroll
			$j( window ).on( 'wheel', function(e) {
				moveTrigger = 'wheel';

				if ( isMobile() ) { return; } // Native Scroll
				if ( $j( 'body, html' ).hasClass( 'is-loading') ) { return;	}

				e.preventDefault();
				
				// Adjust target scroll position
				targetScroll += e.originalEvent.deltaY;
				targetScroll = Math.max( 0, Math.min( targetScroll, maxScroll ) );
				
				// Start smooth scrolling animation if not already running
				if ( !animationId ) {
					animationId = requestAnimationFrame( smoothScroll );
				}					

				// Progress Bar
				var scrollProgress = targetScroll / maxScroll * 100;
				$j( '.progress-bar' ).css({ 'width' : scrollProgress + '%' });

				//
			});

			// Mobile Scroll
			$j( window ).on('scroll', function () {
				if ( !isMobile() ) return;

				moveTrigger = 'scroll';

				if ( $j( 'body, html' ).hasClass( 'is-loading' ) ) {
					return;
				}

				// Update Animations
				updateHeroMobile();
				updateUnitHeadAnimationsMobile();
				updateImageScalesMobile(window.scrollY);
				updateSectionImageScalesMobile();

				// Anim Executor
				checkAnimTriggers(window.scrollY);		

				// Progress Bar (mobile)
				const scrollTop   = window.scrollY;
				const docHeight  = document.documentElement.scrollHeight;
				const viewportH  = window.innerHeight;
				const maxScrollY = docHeight - viewportH;

				const scrollProgress = maxScrollY > 0
					? (scrollTop / maxScrollY) * 100
					: 0;

				$j('.progress-bar').css({
					width: scrollProgress + '%'
				});		

				if ( scrollTop > 61 ) {
					$j( '.admin-bar .site-header .inside-header .floating-header' ).addClass( 'onWheel' );
				}
				else {
					$j( '.admin-bar .site-header .inside-header .floating-header' ).removeClass( 'onWheel' );
				}
			});

			// Touchscreen
			let touchLastX  = 0;
			let isTouching = false;

			$j(window).on('touchstart', function(e) {
				if (isMobile()) return;
				if ($j('body, html').hasClass('is-loading')) return;				
				
				const touch = e.originalEvent.touches[0];
				touchStartX = touch.clientX;
				touchLastX  = touch.clientX;

				moveTrigger = 'touch';
				isTouching = true;

				cancelAnimationFrame(animationId);
				animationId = null;
			});

			$j(window).on('touchmove', function(e) {
				if (isMobile()) return;
				if ($j('body, html').hasClass('is-loading')) return;

				e.preventDefault();

				const touch = e.originalEvent.touches[0];
				const deltaX = touchLastX - touch.clientX; 
				touchLastX = touch.clientX;

				// Update targetScroll HERE
				targetScroll += deltaX;
				targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

				// Snap currentScroll directly
				currentScroll = targetScroll;

				// Apply transform
				$container.css(
					'transform',
					`translateX(-${currentScroll}px)`
				);

                // CONSOLE
                $j( '.console' ).html( 'currentScroll : ' + currentScroll );

				//console.log(targetScroll);

				// Animations
				checkAnimTriggers(currentScroll);
				updateUnitHeadAnimations(currentScroll);
				updateImageScales(currentScroll);
				updateSectionImageScales(currentScroll);

				// Progress bar
				const scrollProgress = (currentScroll / maxScroll) * 100;
				$j('.progress-bar').css({ width: scrollProgress + '%' });

                // Home Section 2 Transition			
				let imgScrollPost = currentScroll;
				if ( imgScrollPost < 0 ) { imgScrollPost = 0; }
				if ( imgScrollPost > ( heroLeft + ( heroWidth / 4 ) ) ) { imgScrollPost = ( heroLeft + ( heroWidth / 4 ) ) }
				
				let opacity = imgScrollPost / ( heroLeft + ( heroWidth / 4 ) );
				$j( '.hero .wp-block-image:nth-child(2)' ).css({ 'opacity' : opacity });	
			});

			$j(window).on('touchend touchcancel', function(e) {
				isTouching = false;
			});



			function updateHeroMobile() {
				const hero = document.querySelector('.hero');
				if (!hero) return;

				const rect = hero.getBoundingClientRect();
				const vh = window.innerHeight;

				/*
				Trigger range:
				- start when hero top enters viewport
				- finish when hero has scrolled 1/4 of its height
				*/
				const start = vh;
				//const end = vh - hero.offsetHeight / 4;
				const end = vh - hero.offsetHeight;

				let progress = (start - rect.top) / (start - end);
				progress = Math.max(0, Math.min(progress, 1));

				$j('.hero .wp-block-image:nth-child(2)')
					.css({ opacity: progress });
			}

			function updateUnitHeadAnimationsMobile() {
				const vh = window.innerHeight;

				unitHeads.forEach(item => {
					const rect = item.leftEl.getBoundingClientRect();

					/*
					Start when text bottom hits viewport bottom
					End when text top reaches 60% viewport height
					*/
					const start = vh;
					const end = vh * 0.6;

					let progress = (start - rect.bottom) / (start - end);
					progress = Math.max(0, Math.min(1, progress));

					const move  = item.maxMove * progress * 0.6;
					const move2 = move * 1.3;

					item.leftEl.style.transform  = `translateX(${-move}px)`;
					item.rightEl.style.transform = `translateX(${-move2}px)`;

					item.leftEl.style.opacity  = progress;
					item.rightEl.style.opacity = progress;
				});
			}

		// Animation executor		
			function checkAnimTriggers(scrollPos) {
				//console.log(scrollPos);

				const viewportStart = scrollPos;
				const viewportEnd = scrollPos + (
					isMobile() ? window.innerHeight : window.innerWidth
				);

				animItems.forEach(item => {
					if (item.triggered) return;

					const itemStart = isMobile()
						? item.y - 200 // tinggi translateY
						: item.x;

					const itemEnd = isMobile()
						? itemStart + item.height
						: itemStart + item.width;
	
					/*if ( item.index == 9 ) {
						let x = false;
						if (itemEnd >= viewportStart && itemStart <= viewportEnd) {
							x = true;
						}
						console.log( itemEnd + ' >= ' + viewportStart + ' && ' + itemStart + ' <= ' + viewportEnd + ' ||| ' + x );
					}*/

					if (itemEnd >= viewportStart && itemStart <= viewportEnd) {
						triggerAnim(item);
					}
				});
			}

			function triggerAnim(item) {
				item.triggered = true;

				if ( isMobile() ) {
					$j(item.el).addClass('is-visible');
				}
				else {
					if (item.delay) {
						setTimeout(() => {
							$j(item.el).addClass('is-visible');
						}, item.delay);
					} else {
						$j(item.el).addClass('is-visible');
					}
				}
			}

		// Smooth scrolling with easing
			function smoothScroll() {						
				// Easing factor: lower = smoother but slower (0.05-0.15 recommended)
				if (isTouching) return;
				
				if ( moveTrigger == 'touch' ) {
					currentScroll += ( targetScroll - currentScroll );									
					console.log( 'touch ' + currentScroll );
				}	
				else {
					currentScroll += ( targetScroll - currentScroll ) * 0.05;				
				}

				// Apply transform
				if ( isMobile() ) {
					$container.css(
						'transform',
						`translateY(-${currentScroll}px)`
					);
					
				} else {
					$container.css(
						'transform',
						`translateX(-${currentScroll}px)`
					);
				}

				// All animations
				checkAnimTriggers(currentScroll);
				updateUnitHeadAnimations(currentScroll);
				updateImageScales(currentScroll);
				updateSectionImageScales(currentScroll);
				
				// Continue animation if still moving
				if (Math.abs(targetScroll - currentScroll) > 0.5) {
					animationId = requestAnimationFrame(smoothScroll);
				} else {
					currentScroll = targetScroll;
					if (isMobile()) {
						$container.css('transform', `translateY(-${currentScroll}px)`);
											} else {
						$container.css('transform', `translateX(-${currentScroll}px)`);
					}
					animationId = null;
				}

				// Home Section 2 Transition			
				let imgScrollPost = currentScroll;
				if ( imgScrollPost < 0 ) { imgScrollPost = 0; }
				if ( imgScrollPost > ( heroLeft + ( heroWidth / 4 ) ) ) { imgScrollPost = ( heroLeft + ( heroWidth / 4 ) ) }
				
				let opacity = imgScrollPost / ( heroLeft + ( heroWidth / 4 ) );
				$j( '.hero .wp-block-image:nth-child(2)' ).css({ 'opacity' : opacity });	
			}	
			
		
		// Update variables on window resize
			$j( window ).on( 'resize', function() {
				const wasMobile = isMobile();

				maxScroll = calculateMaxScroll(); 
				targetScroll = Math.min( targetScroll, maxScroll );
				currentScroll = Math.min( currentScroll, maxScroll );

				if ( isMobile() ) {
					$container.css('transform', `translateY(-${currentScroll}px)`);
				} else {
					$container.css('transform', `translateX(-${currentScroll}px)`);
				}

				windowWidth = $j( window ).width();				
				$container.css( 'transform', `translateX(-${currentScroll}px)`);
				VIEWPORT_WIDTH = window.innerWidth;

    			buildUnitHeads();
				buildSectionImageScales();
				buildSectionImageScalesMobile();
				buildImageScales();
				buildImageScalesMobile();
				buildSectionPositions();				

				heroLeft = $j( '.hero' ).position().left;
				heroWidth = $j( '.hero' ).width();

				mobileCheck();
			});
	
	// Mobile Check		
		function mobileCheck() {
			let windowWidth = $j( window ).width();

			if ( windowWidth <= 1024 ) {				
				$j( 'body' ).addClass( 'mobile' );
			}
			else {
				$j( 'body' ).removeClass( 'mobile' );
			}
		}		

		function isMobile() {
			return document.body.classList.contains('mobile');
		}			

	// Touch Check
		function isTouchDevice() {
			return (
				'ontouchstart' in window ||
				navigator.maxTouchPoints > 0
			);
		}

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
		
	// Popup
		function initPopupForms() {
			if (typeof wpcf7 === 'undefined') return;

			$j('.popup-content .wpcf7 form').each(function () {
				if (this.dataset.wpcf7Bound) return;

				wpcf7.init(this);
				this.dataset.wpcf7Bound = 'true';
			});
		}

		$j('body').on('click', 'a.popup, .popup a', function (e) {
			e.preventDefault();

			const url = $j(this).attr('href');

			$j('#popup-overlay').fadeIn();
			$j('.popup-content').empty();
			$j('.popup-loader').show();
			$j( 'body' ).addClass( 'is-popup-open' );

			$j.ajax({
				url: HC.ajaxurl,
				type: 'POST',
				data: {
					action: 'load_popup_page',
					url: url
				},
				success: function (response) {
					$j('.popup-loader').hide();
					$j('.popup-content').html(response);

					initPopupForms();
				},
				error: function () {
					$j('.popup-loader').hide();
					$j('.popup-content').html('<p>Error loading content.</p>');
				}
			});
		});

		$j('.popup-close, #popup-overlay').on('click', function (e) {
			/*f (e.target !== this) return;
			$j('#popup-overlay').fadeOut();
			$j( 'body' ).removeClass( 'is-popup-open' );*/
			closePopup.call(this, e);
		});

		function closePopup(e) {
			if (e.target !== this) return;
			$j('#popup-overlay').fadeOut();
			$j( 'body' ).removeClass( 'is-popup-open' );
		}

		function closePopupNow() {
			$j('#popup-overlay').fadeOut();
			$j('body').removeClass('is-popup-open');
		}

		
}); 

$j(document).on('wpcf7mailsent', function () {
	closePopupNow();
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

