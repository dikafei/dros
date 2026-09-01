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
let allAnimItemsTriggered = false; // avoid re-scanning animItems every rAF frame once done

$j(function(){

	// Initial mobile check - important put at very top
		mobileCheck();

	// The fake horizontal-scroll (wheel/touch/keyboard hijack, translateX
	// animation loop) only makes sense on pages actually built with the
	// home-sectionN layout (Home, About, The Rooms). Pages without that
	// structure (VikBooking's Our Rooms / booking-details pages) should
	// just get native scrolling; several handlers below bail out early via
	// this flag so they don't hijack wheel/keys/touch there. Keyed off the
	// content itself rather than a specific page/plugin so it keeps working
	// if more home-sectionN pages get added later.
		const isHomePage = $j( '[class*="home-section"]' ).length > 0;

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
			if (!isHomePage) return; // let PageUp/Down/Home/End/arrows behave natively everywhere else (booking forms, etc.)

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

			// Force the plain lerp path in smoothScroll() regardless of
			// whatever the last mouse/touch interaction set moveTrigger to -
			// otherwise a keypress right after a wheel scroll would fall into
			// the wheel-momentum branch and snap instead of easing.
			moveTrigger = 'keyboard';
			wheelVelocity = 0; // discard any in-flight wheel momentum so it can't leak into the next wheel scroll
			wheelFrameTime = null;

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

		// Wheel momentum: each notch adds an impulse instead of jumping
		// targetScroll straight to a new value. Friction bleeds it off over
		// several frames so consecutive notches blend into one glide rather
		// than each one "snapping" a new target for the old flat lerp to
		// chase - that snap-per-notch is what read as stutter on ratchet
		// mouse wheels.
		let wheelVelocity = 0;
		let wheelFrameTime = null; // performance.now() of the previous momentum frame - lets decay be time-based, not tied to actual rAF tick rate
		const WHEEL_FRICTION = 0.85; // decay per WHEEL_FRAME_MS of elapsed time (0-1, higher = longer, gentler glide)
		const WHEEL_FRAME_MS = 1000 / 60; // reference frame duration the friction value above is tuned against
		const WHEEL_DISTANCE_SCALE = 1; // fraction of the raw wheel delta a notch actually travels - lower = shorter/slower glide
		const WHEEL_VELOCITY_STOP = 0.05; // px/frame below which momentum is considered settled
		const MAX_WHEEL_VELOCITY = 70; // clamp so rapid-fire notches can't runaway-accelerate

		// `.hero` only exists on the home-sectionN pages. `.position()` on an
		// empty jQuery set returns `undefined`, so reading `.left` off it threw
		// here on every other page (booking-details, our-rooms, etc.) - a
		// synchronous, unguarded throw partway through this top-level ready
		// callback, which silently aborted ALL of the code after it: the
		// header "Book" popup handler, keyboard/wheel/touch handlers, and any
		// other click bindings registered further down the file. Guard it so
		// pages without a `.hero` just fall back to 0 instead of crashing.
		let heroLeft = $j( '.hero' ).length ? $j( '.hero' ).position().left : 0;
		let heroWidth = $j( '.hero' ).width() || 0;

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
				if ( !isHomePage ) { return; } // native wheel scroll everywhere else

				moveTrigger = 'wheel';

				if ( isMobile() ) { return; } // Native Scroll
				if ( $j( 'body, html' ).hasClass( 'is-loading') ) { return;	}

				e.preventDefault();

				// Feed this notch into the running momentum (scaled down by
				// WHEEL_DISTANCE_SCALE and by (1 - WHEEL_FRICTION) so its
				// *total* contribution, once friction bleeds it off across
				// frames in smoothScroll(), equals a fraction of the notch's
				// raw delta) instead of jumping targetScroll straight to a
				// new value.
				wheelVelocity += e.originalEvent.deltaY * WHEEL_DISTANCE_SCALE * ( 1 - WHEEL_FRICTION );
				wheelVelocity = Math.max( -MAX_WHEEL_VELOCITY, Math.min( MAX_WHEEL_VELOCITY, wheelVelocity ) );

				// Start smooth scrolling animation if not already running
				if ( !animationId ) {
					wheelFrameTime = null; // fresh glide - don't use a stale elapsed time for the first frame
					animationId = requestAnimationFrame( smoothScroll );
				}

				// Progress bar is updated from smoothScroll() each frame while
				// the momentum plays out, so it tracks the glide instead of
				// jumping ahead of the visible scroll.

				//
			});

			// Mobile Scroll
			// Runs all the layout-reading (getBoundingClientRect) + style-writing work for
			// a single frame. Native 'scroll' events can fire many times per rendered frame,
			// so this is coalesced via rAF + the `ticking` flag below instead of running
			// synchronously on every event (that was causing forced-layout jank/stutter).
			function updateMobileScrollEffects() {
				ticking = false;

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
			}

			$j( window ).on('scroll', function () {
				if ( !isHomePage ) return; // nothing to animate on other pages, don't do the work every scroll frame
				if ( !isMobile() ) return;

				moveTrigger = 'scroll';

				if ( !ticking ) {
					ticking = true;
					requestAnimationFrame( updateMobileScrollEffects );
				}
			});

			// Touchscreen
			let touchLastX  = 0;
			let isTouching = false;

			$j(window).on('touchstart', function(e) {
				if (!isHomePage) return; // native touch scroll everywhere else
				if (isMobile()) return;
				if ($j('body, html').hasClass('is-loading')) return;

				const touch = e.originalEvent.touches[0];
				touchStartX = touch.clientX;
				touchLastX  = touch.clientX;

				moveTrigger = 'touch';
				isTouching = true;
				wheelVelocity = 0; // discard any in-flight wheel momentum so it can't leak in later
				wheelFrameTime = null;

				cancelAnimationFrame(animationId);
				animationId = null;
			});

			$j(window).on('touchmove', function(e) {
				if (!isHomePage) return; // native touch scroll everywhere else
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

				// Once every item has fired, there's nothing left to check - skip the
				// per-item scan entirely instead of walking the whole array every frame.
				if (allAnimItemsTriggered) return;

				const viewportStart = scrollPos;
				const viewportEnd = scrollPos + (
					isMobile() ? window.innerHeight : window.innerWidth
				);

				let pending = false;

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
					} else {
						pending = true;
					}
				});

				if (!pending) {
					allAnimItemsTriggered = true;
				}
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

				let stillAnimating;

				if ( moveTrigger == 'touch' ) {
					currentScroll += ( targetScroll - currentScroll );
					stillAnimating = Math.abs(targetScroll - currentScroll) > 0.5;
				}
				else if ( moveTrigger == 'wheel' ) {
					// Momentum: bleed off the accumulated wheel velocity with
					// friction and feed it straight into
					// targetScroll/currentScroll together. The velocity
					// itself is already the smooth curve, so no separate lag
					// layer is needed on top of it (that would just add a
					// second, mushier delay).
					//
					// Decay is scaled to real elapsed time (not just "one rAF
					// tick") so the glide plays at the same speed regardless
					// of the display's refresh rate or any dropped frames -
					// a fixed per-tick multiplier would decay twice as fast
					// on a 120Hz screen as on 60Hz.
					const now = performance.now();
					const dt = wheelFrameTime ? ( now - wheelFrameTime ) : WHEEL_FRAME_MS;
					wheelFrameTime = now;

					wheelVelocity *= Math.pow( WHEEL_FRICTION, dt / WHEEL_FRAME_MS );
					if ( Math.abs( wheelVelocity ) < WHEEL_VELOCITY_STOP ) {
						wheelVelocity = 0;
					}

					targetScroll = Math.max( 0, Math.min( targetScroll + wheelVelocity, maxScroll ) );
					currentScroll = targetScroll;

					stillAnimating = wheelVelocity !== 0;

					// Progress bar tracks the glide, not just the triggering notch
					var scrollProgress = targetScroll / maxScroll * 100;
					$j( '.progress-bar' ).css({ 'width' : scrollProgress + '%' });
				}
				else {
					currentScroll += ( targetScroll - currentScroll ) * 0.05;
					stillAnimating = Math.abs(targetScroll - currentScroll) > 0.5;
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
				if (stillAnimating) {
					animationId = requestAnimationFrame(smoothScroll);
				} else {
					currentScroll = targetScroll;
					wheelVelocity = 0;
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

				heroLeft = $j( '.hero' ).length ? $j( '.hero' ).position().left : 0;
				heroWidth = $j( '.hero' ).width() || 0;

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

		function loadPopupContent( url ) {
			$j('.popup-chooser').hide();
			$j('.popup-content').empty();
			$j('.popup-loader').show();

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
		}

		// Clicking "Book" always opens the email/WhatsApp chooser first,
		// rather than jumping straight to the contact form.
		$j('body').on('click', 'a.popup, .popup a', function (e) {
			e.preventDefault();

			$j('#popup-overlay').fadeIn();
			$j( 'body' ).addClass( 'is-popup-open' );
			$j('.popup-loader').hide();
			$j('.popup-content').empty();
			$j('.popup-chooser').show();
		});

		// "book via email" swaps the chooser out for the existing contact-form
		// popup content (same AJAX load as before, just gated behind the
		// chooser instead of firing immediately).
		$j('body').on('click', '.popup-choice-email', function (e) {
			e.preventDefault();

			loadPopupContent( $j(this).attr('href') );
		});

		// "chat on whatsapp" is a plain link to wa.me and opens in its own tab
		// via target="_blank" - just close our popup behind it instead of
		// leaving it sitting open.
		$j('body').on('click', '.popup-choice-whatsapp', function () {
			closePopupNow();
		});

		$j('.popup-close, #popup-overlay').on('click', function (e) {
			closePopup.call(this, e);
		});

		function closePopup(e) {
			if (e.target !== this) return;
			resetPopup();
		}

		function closePopupNow() {
			resetPopup();
		}

		// Always leave the popup back at the chooser step when it closes, so
		// reopening it doesn't show whatever form/content was loaded last time.
		function resetPopup() {
			$j('#popup-overlay').fadeOut();
			$j( 'body' ).removeClass( 'is-popup-open' );
			$j('.popup-content').empty();
			$j('.popup-chooser').show();
		}

	// VikBooking Room Gallery - Hero Image Click
		// The large "hero" image in the room-details gallery isn't wrapped in a
		// link like the small thumbnails are, so clicking it does nothing.
		// Rather than reimplementing VikBooking's own lightbox-opening logic
		// (which didn't reliably work when driven programmatically), just
		// forward the click to its real "All photos" trigger - the hero image
		// is always the first photo, so this opens the lightbox in the right
		// spot using VikBooking's own click handling.
		$j( 'body' ).on( 'click', '.vikfx-gallery-image', function() {
			var openTrigger = $j( this ).closest( '.vikfx-gallery-container' ).find( '.vikfx-gallery-open' )[0];

			if ( openTrigger ) {
				openTrigger.click();
			}
		});

	// VikBooking Booking Options Step - Simplify Header
		// The showprc step (last step before "Book Now") still shows the full
		// "Dates > Rooms > Options > Book" progress tracker, duplicating context
		// the guest already knows by this point. Swap it for a plain title,
		// matching the treatment used on every other VikBooking page (styled in
		// _vikbooking.scss, which also hides the tracker itself).
		var vboShowprcHead = document.querySelector( '.vbo-showprc-head-wrapper' );

		if ( vboShowprcHead && !document.querySelector( '.vbo-showprc-title' ) ) {
			var vboShowprcTitle = document.createElement( 'h1' );
			vboShowprcTitle.className = 'vbo-showprc-title';
			vboShowprcTitle.textContent = 'Booking Summary';
			vboShowprcHead.parentNode.insertBefore( vboShowprcTitle, vboShowprcHead );
		}

	// VikBooking Booking Summary - Inline Gallery Slider
		// The compact room photo box's prev/next arrows are wired by VikBooking
		// to open the full lightbox (they directly call
		// window.vikfxgallery1.open(), same as clicking the photo), leaving no
		// way to actually browse the room's photos without leaving the compact
		// view. Intercept clicks in the capture phase - before VikBooking's own
		// handler, bound directly on the arrow, gets a chance to run - and swap
		// the small preview image to the next/previous photo instead. Clicking
		// the photo itself still opens the full lightbox (this page has no
		// separate `.vikfx-gallery-open` trigger for it, unlike the other
		// galleries, so that's handled here too), now navigated to whichever
		// photo is currently showing rather than always the first.
		document.addEventListener( 'click', function( e ) {
			var arrow = e.target.closest( '.vikfx-showprc-gallery-container .vikfx-gallery-next-image, .vikfx-showprc-gallery-container .vikfx-gallery-previous-image' );
			var galleryImage = e.target.closest( '.vikfx-showprc-gallery-container .vikfx-gallery-image' );

			if ( !arrow && !galleryImage ) {
				return;
			}

			var gallery = window.vikfxgallery1;
			var fadeContainer = ( arrow || galleryImage ).closest( '.vikfx-gallery-fade-container' );
			var img = fadeContainer ? fadeContainer.querySelector( '.vikfx-gallery-image' ) : null;

			if ( !gallery || !img || !gallery.length ) {
				return;
			}

			// Each room photo's filename (e.g. "20260407_163750_img_8095.jpg")
			// is shared between the small preview image's src and the matching
			// full-size lightbox link's href (just under a different path/
			// prefix) - use it to find which of the gallery's photos is
			// currently showing.
			var filenamePattern = /\d{8}_\d{6}_img_\d+\.\w+$/;
			var currentMatch = img.src.match( filenamePattern );

			if ( !currentMatch ) {
				return;
			}

			var currentIndex = -1;

			for ( var i = 0; i < gallery.length; i++ ) {
				var href = gallery[ i ].getAttribute( 'href' ) || '';

				if ( href.indexOf( currentMatch[ 0 ] ) !== -1 ) {
					currentIndex = i;
					break;
				}
			}

			if ( currentIndex === -1 ) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			if ( arrow ) {
				var isNext = arrow.classList.contains( 'vikfx-gallery-next-image' );
				var nextIndex = ( currentIndex + ( isNext ? 1 : -1 ) + gallery.length ) % gallery.length;
				var nextHref = gallery[ nextIndex ].getAttribute( 'href' ) || '';
				var nextMatch = nextHref.match( filenamePattern );

				if ( nextMatch ) {
					img.src = img.src.replace( filenamePattern, nextMatch[ 0 ] );
				}
			} else {
				gallery[ currentIndex ].click();
			}
		}, true );

	// VikBooking Booking Confirmation Step - Add Title
		// Same treatment as the Booking Summary step - this page also still
		// shows the (hidden) step tracker's wrapper with nothing in its place,
		// so add a plain title above the order summary.
		var vboOconfirmWrapper = document.querySelector( '.vbo-oconfirm-wrapper' );

		if ( vboOconfirmWrapper && !document.querySelector( '.vbo-oconfirm-title' ) ) {
			var vboOconfirmTitle = document.createElement( 'h1' );
			vboOconfirmTitle.className = 'vbo-oconfirm-title';
			vboOconfirmTitle.textContent = 'Confirm Your Booking';
			vboOconfirmWrapper.parentNode.insertBefore( vboOconfirmTitle, vboOconfirmWrapper );
		}

	// Our Rooms / Room Details - Approximate USD Price
		// Indonesian regulations require checkout to run in Rupiah
		// (VikBooking's configured currency), but many guests think in USD.
		// HC.usdIdrRate is a daily-cached USD->IDR rate (see inc/currency.php)
		// exposed for exactly this - show a rough estimate next to each
		// room's nightly rate, paired with a disclaimer that the real charge
		// is computed in IDR by our payment processor (Xendit) at checkout,
		// since a live card-network conversion can land a little differently
		// than this reference rate. Scoped to the room listing and each
		// room's own details page - not the showprc/oconfirm/your-booking-
		// detail pages, which also live under /booking-details/ but carry a
		// task= query param.
		var vboIsOurRooms = location.pathname.indexOf( '/our-rooms' ) !== -1;
		var vboIsRoomDetails = location.pathname.indexOf( '/booking-details' ) !== -1 && location.search.indexOf( 'task=' ) === -1;

		if ( ( vboIsOurRooms || vboIsRoomDetails ) && typeof HC !== 'undefined' && HC.usdIdrRate ) {
			document.querySelectorAll( '.room_cost' ).forEach( function( costEl ) {
				// .vbdivtotinline (room listing cards) holds both the price
				// block and the Details button side by side - insert after
				// that whole row so the note spans the full width below both.
				// .vb_detcostroom (a room's own details page) only wraps the
				// price itself, so falling back to it keeps the same
				// afterend-insertion approach there.
				var priceRow = costEl.closest( '.vbdivtotinline' ) || costEl.closest( '.vb_detcostroom' ) || costEl.closest( '.vbsrowpricediv' ) || costEl;

				if ( priceRow.nextElementSibling && priceRow.nextElementSibling.classList.contains( 'vbo-usd-approx' ) ) {
					return;
				}

				var currencyEl = costEl.querySelector( '.vbo_currency' );
				var priceEl = costEl.querySelector( '.vbo_price' );

				if ( !currencyEl || !priceEl || currencyEl.textContent.trim() !== 'Rp' ) {
					return;
				}

				var idrValue = parseFloat( priceEl.textContent.trim().replace( /\./g, '' ).replace( ',', '.' ) );

				if ( isNaN( idrValue ) ) {
					return;
				}

				var usdValue = Math.round( idrValue / HC.usdIdrRate );
				var usdFormatted = usdValue.toLocaleString( 'en-US' );

				var note = document.createElement( 'div' );
				note.className = 'vbo-usd-approx';

				var mainLine = document.createElement( 'span' );
				mainLine.className = 'vbo-usd-approx-main';
				mainLine.textContent = 'Approximately $' + usdFormatted + ' USD';

				var disclaimerLine = document.createElement( 'span' );
				disclaimerLine.className = 'vbo-usd-approx-disclaimer';
				disclaimerLine.textContent = 'Final amount is calculated in IDR at checkout';

				note.appendChild( mainLine );
				note.appendChild( disclaimerLine );

				priceRow.insertAdjacentElement( 'afterend', note );
			});
		}

	// VikBooking Options Step - Approximate USD (simplified)
		// Same idea as the note above, but this page (task=showprc) shows
		// several Rupiah figures at once - the room rate, Extra Bed, and
		// each Additional Breakfast tier - so a lighter single "~$X USD"
		// line directly under each number reads better here than repeating
		// the full two-line note/disclaimer everywhere. Builds on
		// HC.usdIdrRate from inc/currency.php, same as the note above.
		var vboIsShowprc = location.pathname.indexOf( '/booking-details' ) !== -1 && location.search.indexOf( 'task=showprc' ) !== -1;

		var vboMakeUsdApproxSpan = function( idrValue ) {
			if ( typeof HC === 'undefined' || !HC.usdIdrRate || isNaN( idrValue ) || idrValue <= 0 ) {
				return null;
			}

			var usdValue = Math.round( idrValue / HC.usdIdrRate );
			var usdSpan = document.createElement( 'span' );
			usdSpan.className = 'vbo-usd-approx-simple';
			usdSpan.textContent = '(approx. US$' + usdValue.toLocaleString( 'en-US' ) + ')';

			return usdSpan;
		};

		if ( vboIsShowprc ) {
			// .room_cost (rate plan price) is an inline-flex row itself, so
			// the note goes after it as a sibling rather than inside it -
			// appending inside would just become another flex item on the
			// same line instead of wrapping to its own line below.
			var vboAppendUsdAfterRoomCost = function( costEl ) {
				var currencyEl = costEl.querySelector( '.vbo_currency' );
				var priceEl = costEl.querySelector( '.vbo_price' );

				if ( !currencyEl || !priceEl || currencyEl.textContent.trim() !== 'Rp' ) {
					return;
				}

				if ( costEl.nextElementSibling && costEl.nextElementSibling.classList.contains( 'vbo-usd-approx-simple' ) ) {
					return;
				}

				var idrValue = parseFloat( priceEl.textContent.trim().replace( /\./g, '' ).replace( ',', '.' ) );
				var usdSpan = vboMakeUsdApproxSpan( idrValue );

				if ( usdSpan ) {
					costEl.insertAdjacentElement( 'afterend', usdSpan );
				}
			};

			document.querySelectorAll( '.vbo-showprc-price-entry-cost .room_cost' ).forEach( vboAppendUsdAfterRoomCost );

			// Extra Bed's own cost box (.vbo-showprc-option-entry-cost) is a
			// plain block, not flex, so appending inside it works directly -
			// it just wraps onto its own line below the existing price text.
			var vboShowprcExtraBedSelect = document.querySelector( 'select[name="optid11"]' );
			var vboShowprcExtraBedEntry = vboShowprcExtraBedSelect ? vboShowprcExtraBedSelect.closest( '.vbo-showprc-option-entry' ) : null;
			var vboShowprcExtraBedCost = vboShowprcExtraBedEntry ? vboShowprcExtraBedEntry.querySelector( '.vbo-showprc-option-entry-cost' ) : null;

			if ( vboShowprcExtraBedCost && !vboShowprcExtraBedCost.querySelector( '.vbo-usd-approx-simple' ) ) {
				var vboExtraBedPriceEl = vboShowprcExtraBedCost.querySelector( '.vbo_price' );
				var vboExtraBedIdrValue = vboExtraBedPriceEl ? parseFloat( vboExtraBedPriceEl.textContent.trim().replace( /\./g, '' ).replace( ',', '.' ) ) : NaN;
				var vboExtraBedUsdSpan = vboMakeUsdApproxSpan( vboExtraBedIdrValue );

				if ( vboExtraBedUsdSpan ) {
					vboShowprcExtraBedCost.appendChild( vboExtraBedUsdSpan );
				}
			}
		}

	// VikBooking Confirm / Your Booking Detail - Approximate USD (bracket)
		// Same idea as the notes above, but formatted as a short inline
		// "(approx. US$23)" right after each Rupiah figure rather than its
		// own line - these two pages (the final confirm-and-pay step, and
		// the read-only booking-detail page reached from the confirmation
		// email) show fewer numbers at once than the Options step, so an
		// inline aside fits without crowding the layout.
		var vboMakeUsdApproxBracket = function( idrValue ) {
			if ( typeof HC === 'undefined' || !HC.usdIdrRate || isNaN( idrValue ) || idrValue <= 0 ) {
				return null;
			}

			var usdValue = Math.round( idrValue / HC.usdIdrRate );
			var span = document.createElement( 'span' );
			span.className = 'vbo-usd-approx-bracket';
			span.textContent = ' (approx. US$' + usdValue.toLocaleString( 'en-US' ) + ')';

			return span;
		};

		var vboIsOconfirm = location.pathname.indexOf( '/booking-details' ) !== -1 && location.search.indexOf( 'task=oconfirm' ) !== -1;
		var vboIsYourBookingDetail = location.pathname.indexOf( '/your-booking-detail' ) !== -1;

		if ( vboIsOconfirm ) {
			// Both the per-room "Total Price" cell and the grand TOTAL row
			// reuse this same class - net/tax cells only exist (hidden) when
			// there's no separate tax to show, so this only ever touches the
			// one visible price per row.
			document.querySelectorAll( '.vbo-oconfirm-summary-room-cell-tot' ).forEach( function( cell ) {
				if ( getComputedStyle( cell ).display === 'none' ) {
					return;
				}

				var currencyEl = cell.querySelector( '.vbo_currency' );
				var priceEl = cell.querySelector( '.vbo_price' );
				var priceWrap = cell.querySelector( '.vbprice' );

				if ( !currencyEl || !priceEl || !priceWrap || currencyEl.textContent.trim() !== 'Rp' || cell.querySelector( '.vbo-usd-approx-bracket' ) ) {
					return;
				}

				var idrValue = parseFloat( priceEl.textContent.trim().replace( /\./g, '' ).replace( ',', '.' ) );
				var bracket = vboMakeUsdApproxBracket( idrValue );

				if ( bracket ) {
					priceWrap.insertAdjacentElement( 'afterend', bracket );
				}
			});
		}

		if ( vboIsYourBookingDetail ) {
			// Skip discount/coupon rows - a "(approx. US$-8)" next to a
			// negative adjustment reads as a mistake, not useful info - and
			// only touch rows with a real positive Rupiah figure (Room Rate,
			// any paid add-ons, Total).
			document.querySelectorAll( '.vbo-booking-costs-list .vbo-booking-cost-detail' ).forEach( function( row ) {
				if ( row.classList.contains( 'vbo-booking-cost-detail-discount' ) ) {
					return;
				}

				var currencyEl = row.querySelector( '.vbo_currency' );
				var priceEl = row.querySelector( '.vbo_price' );
				var valNumber = row.querySelector( '.vbo-booking-cost-val-number' );

				if ( !currencyEl || !priceEl || !valNumber || currencyEl.textContent.trim() !== 'Rp' || valNumber.querySelector( '.vbo-usd-approx-bracket' ) ) {
					return;
				}

				var idrValue = parseFloat( priceEl.textContent.trim().replace( /\./g, '' ).replace( ',', '.' ) );
				var bracket = vboMakeUsdApproxBracket( idrValue );

				if ( bracket ) {
					valNumber.appendChild( bracket );
				}
			});
		}

	// VikBooking Room Details - Extra Bed Note
		// Let guests know upfront (before they even start a booking) that an
		// extra bed is available as a checkout add-on, since the max-people
		// badges above only describe the base room capacity.
		var vboMaxPeopleBlock = document.querySelector( '.vbmaxminpeopleroom' );

		if ( vboMaxPeopleBlock && !document.querySelector( '.vbo-extrabed-note' ) ) {
			var vboExtraBedNote = document.createElement( 'p' );
			vboExtraBedNote.className = 'vbo-extrabed-note';
			vboExtraBedNote.textContent = 'Up to one extra bed may be added during checkout once the maximum room occupancy has been selected.';
			vboMaxPeopleBlock.insertAdjacentElement( 'afterend', vboExtraBedNote );
		}

	// VikBooking Room Details - Availability Calendar (thousands display,
	// notes reorder, higher-than-normal flag)
		// The per-day price calendar renders each day's rate in full Rupiah
		// with a "Rp" prefix ("Rp 2,500,000") - too many digits to scan at a
		// glance. Show it in thousands instead ("2.500", dot as the
		// Indonesian thousands separator), with a note explaining the unit,
		// and flag any day priced above the cheapest day shown that month so
		// it can be styled differently (see _vikbooking.scss).
		// VikBooking replaces this whole section's HTML via AJAX on every
		// month change (confirmed live - a fresh .vbpricecalwarning node
		// appears back in its original position each time), so all of this
		// needs to re-run after every swap, not just once on page load -
		// hence the MutationObserver below rather than a single pass.
		if ( vboIsRoomDetails ) {
			var vboCalProcessing = false;

			var vboProcessCalendarPrices = function( contEl ) {
				var priceCells = contEl.querySelectorAll( '.vbcalpricedaycost' );
				var idrValues = [];

				priceCells.forEach( function( cell ) {
					var idrValue;

					// Already seen this exact cell before (re-run triggered
					// by our own DOM changes, not a fresh AJAX swap) - reuse
					// the raw value stashed the first time, since by now the
					// visible text has already been rewritten to thousands.
					if ( cell.dataset.vboIdrValue ) {
						idrValue = parseInt( cell.dataset.vboIdrValue, 10 );
					} else {
						var priceEl = cell.querySelector( '.vbo_price' );

						if ( !priceEl ) {
							return;
						}

						idrValue = parseInt( priceEl.textContent.trim().replace( /[^0-9]/g, '' ), 10 );
					}

					if ( !isNaN( idrValue ) && idrValue > 0 ) {
						cell.dataset.vboIdrValue = idrValue;
						idrValues.push( idrValue );
					}
				});

				if ( !idrValues.length ) {
					return;
				}

				// "Normal" for this visible month = its own cheapest day -
				// simplest stand-in for the room's base rate without
				// depending on the separate "Starting From" price widget.
				var baselinePrice = Math.min.apply( null, idrValues );

				priceCells.forEach( function( cell ) {
					var idrValue = parseInt( cell.dataset.vboIdrValue, 10 );

					if ( isNaN( idrValue ) ) {
						return;
					}

					if ( cell.dataset.vboProcessed !== '1' ) {
						var currencyEl = cell.querySelector( '.vbo_currency' );

						if ( currencyEl ) {
							currencyEl.remove();
						}

						var priceEl = cell.querySelector( '.vbo_price' );

						if ( priceEl ) {
							priceEl.textContent = Math.round( idrValue / 1000 ).toLocaleString( 'id-ID' );
						}

						cell.dataset.vboProcessed = '1';
					}

					cell.classList.toggle( 'vbo-cal-price-high', idrValue > baselinePrice );
				});
			};

			// VikBooking always renders the price table (.vbcalsblock-price)
			// after the disclaimer (.vbpricecalwarning) - move the
			// disclaimer after the table instead, and add a second note
			// explaining the thousands display, both at the very end.
			var vboReorderCalendarNotes = function( contEl ) {
				var calBlock = contEl.querySelector( ':scope > .vbcalsblock-price' );
				var warning = contEl.querySelector( ':scope > .vbpricecalwarning' );

				if ( !calBlock ) {
					return;
				}

				var thousandsNote = contEl.querySelector( ':scope > .vbo-cal-thousands-note' );

				if ( !thousandsNote ) {
					thousandsNote = document.createElement( 'p' );
					thousandsNote.className = 'vbo-cal-thousands-note';
					thousandsNote.innerHTML = '<sup>**</sup>Prices shown are in thousand Rupiah.';
				}

				// appendChild relocates existing nodes rather than
				// duplicating them, so calling this on an already-correct
				// order is a harmless no-op.
				contEl.appendChild( thousandsNote );

				if ( warning ) {
					contEl.appendChild( warning );
				}
			};

			var vboProcessCalendarContainer = function() {
				if ( vboCalProcessing ) {
					return;
				}

				var contEl = document.querySelector( '.vbo-availcalendars-cont' );

				if ( !contEl ) {
					return;
				}

				vboCalProcessing = true;

				try {
					vboProcessCalendarPrices( contEl );
					vboReorderCalendarNotes( contEl );
				} finally {
					vboCalProcessing = false;
				}
			};

			vboProcessCalendarContainer();

			var vboCalsContainer = document.querySelector( '.vbo-roomdet-calscontainer' );

			if ( vboCalsContainer ) {
				new MutationObserver( vboProcessCalendarContainer ).observe( vboCalsContainer, { childList: true, subtree: true } );
			}
		}

	// VikBooking Booking Summary - Extra Bed / Breakfast Add-ons
		// Two related rules for the Options step:
		// 1. Extra Bed only makes sense once the room is already booked at its
		//    normal max adult occupancy - below that, guests should just book
		//    more adults in the search instead of adding a bed. The room's own
		//    max-adults figure isn't sent to this page, so fetch it from the
		//    room's own details page (same one linked from /our-rooms/) and
		//    compare against the adults actually booked here. Extra Bed is
		//    hidden entirely (not just disabled) until that's true.
		// 2. Additional Breakfast only makes sense for whoever is using that
		//    extra bed, and that's a single guest, so the three separate
		//    checkboxes are replaced with one combined "Additional Breakfast"
		//    entry offering a single choice (including "No Breakfast") that
		//    drives the real optid12/13/14 checkboxes behind the scenes -
		//    VikBooking still only ever sees at most one of them checked for
		//    its own price calculation. The combined entry is hidden entirely
		//    until an extra bed is actually added.
		var vboExtraBedSelect = document.querySelector( 'select[name="optid11"]' );
		var vboBreakfastCheckboxes = document.querySelectorAll( 'input[name="optid12"], input[name="optid13"], input[name="optid14"]' );

		if ( vboExtraBedSelect && vboBreakfastCheckboxes.length ) {
			var vboBreakfastLabels = {
				optid12: 'Under 7 years old',
				optid13: '8-12',
				optid14: '13+'
			};

			var vboBreakfastCombined = document.createElement( 'div' );
			vboBreakfastCombined.className = 'vbo-showprc-option-entry vbo-breakfast-combined';

			var vboBreakfastCombinedName = document.createElement( 'div' );
			vboBreakfastCombinedName.className = 'vbo-showprc-option-entry-name';
			vboBreakfastCombinedName.textContent = 'Additional Breakfast';
			vboBreakfastCombined.appendChild( vboBreakfastCombinedName );

			var vboBreakfastList = document.createElement( 'div' );
			vboBreakfastList.className = 'vbo-breakfast-combined-list';
			vboBreakfastCombined.appendChild( vboBreakfastList );

			var vboBreakfastRadios = [];
			var vboAnyBreakfastChecked = [].some.call( vboBreakfastCheckboxes, function( cb ) { return cb.checked; } );

			var vboMakeBreakfastOption = function( label, cb, cost ) {
				var item = document.createElement( 'label' );
				item.className = 'vbo-breakfast-combined-item';

				var radio = document.createElement( 'input' );
				radio.type = 'radio';
				radio.name = 'vbo-breakfast-choice';
				radio.className = 'vbo-breakfast-radio';
				radio.checked = cb ? cb.checked : !vboAnyBreakfastChecked;

				var labelText = document.createElement( 'span' );
				labelText.className = 'vbo-breakfast-combined-label';
				labelText.textContent = label;

				item.appendChild( radio );
				item.appendChild( labelText );

				if ( cost ) {
					var priceText = document.createElement( 'span' );
					priceText.className = 'vbo-breakfast-combined-price';

					var priceMain = document.createElement( 'span' );
					priceMain.className = 'vbo-breakfast-combined-price-main';
					priceMain.textContent = cost;
					priceText.appendChild( priceMain );

					// Same simplified "~$X USD" treatment as the rest of this
					// page's prices (see "Options Step - Approximate USD"
					// above) - cost here is already plain text ("Rp 600.000")
					// copied from the real (now hidden) checkbox's price box.
					var breakfastIdrValue = parseFloat( cost.replace( /[^0-9]/g, '' ) );
					var breakfastUsdSpan = typeof vboMakeUsdApproxSpan === 'function' ? vboMakeUsdApproxSpan( breakfastIdrValue ) : null;

					if ( breakfastUsdSpan ) {
						priceText.appendChild( breakfastUsdSpan );
					}

					item.appendChild( priceText );
				}

				radio.addEventListener( 'change', function() {
					if ( !radio.checked ) {
						return;
					}

					vboBreakfastCheckboxes.forEach( function( other ) {
						var shouldCheck = ( other === cb );

						if ( other.checked !== shouldCheck ) {
							other.checked = shouldCheck;
							other.dispatchEvent( new Event( 'change', { bubbles: true } ) );
						}
					});
				});

				vboBreakfastRadios.push( radio );
				vboBreakfastList.appendChild( item );
			};

			vboMakeBreakfastOption( 'No Breakfast', null, null );

			vboBreakfastCheckboxes.forEach( function( cb ) {
				var entry = cb.closest( '.vbo-showprc-option-entry' );
				var costEl = entry ? entry.querySelector( '.vbo-showprc-option-entry-cost' ) : null;
				var cost = costEl ? costEl.textContent.replace( /\s+/g, ' ' ).trim() : null;

				vboMakeBreakfastOption( vboBreakfastLabels[ cb.name ] || cb.name, cb, cost );

				if ( entry ) {
					entry.style.display = 'none';
				}
			});

			var vboFirstBreakfastEntry = vboBreakfastCheckboxes[ 0 ].closest( '.vbo-showprc-option-entry' );

			if ( vboFirstBreakfastEntry ) {
				vboFirstBreakfastEntry.insertAdjacentElement( 'afterend', vboBreakfastCombined );
			}

			var vboUpdateBreakfastState = function() {
				var extraBedActive = parseInt( vboExtraBedSelect.value, 10 ) > 0 && !vboExtraBedSelect.disabled;

				vboBreakfastCombined.style.display = extraBedActive ? '' : 'none';

				vboBreakfastCheckboxes.forEach( function( cb ) {
					cb.disabled = !extraBedActive;
				});

				vboBreakfastRadios.forEach( function( radio ) {
					radio.disabled = !extraBedActive;
				});

				if ( !extraBedActive ) {
					vboBreakfastCheckboxes.forEach( function( cb ) {
						if ( cb.checked ) {
							cb.checked = false;
							cb.dispatchEvent( new Event( 'change', { bubbles: true } ) );
						}
					});

					vboBreakfastRadios.forEach( function( radio, idx ) {
						radio.checked = ( idx === 0 );
					});
				}
			};

			vboExtraBedSelect.addEventListener( 'change', vboUpdateBreakfastState );
			vboUpdateBreakfastState();

			var vboRoomIdInput = document.querySelector( 'input[name="roomid[]"]' );
			var vboAdultsInput = document.querySelector( 'input[name="adults[]"]' );

			if ( vboRoomIdInput && vboAdultsInput ) {
				var vboBookedAdults = parseInt( vboAdultsInput.value, 10 );

				fetch( '/booking-details/?roomid=' + vboRoomIdInput.value, { credentials: 'same-origin' } )
					.then( function( res ) { return res.text(); } )
					.then( function( html ) {
						var doc = new DOMParser().parseFromString( html, 'text/html' );
						var maxEl = doc.querySelector( '.vbmaxadultsdet .vbmaxnumberdet' );

						if ( !maxEl ) {
							return;
						}

						var maxMatch = maxEl.textContent.match( /(\d+)\s*$/ );

						if ( !maxMatch ) {
							return;
						}

						var maxAdults = parseInt( maxMatch[ 1 ], 10 );

						if ( isNaN( vboBookedAdults ) || isNaN( maxAdults ) || vboBookedAdults >= maxAdults ) {
							return;
						}

						var extraBedEntry = vboExtraBedSelect.closest( '.vbo-showprc-option-entry' );

						vboExtraBedSelect.disabled = true;
						vboExtraBedSelect.value = '0';
						vboExtraBedSelect.dispatchEvent( new Event( 'change', { bubbles: true } ) );

						if ( extraBedEntry ) {
							extraBedEntry.style.display = 'none';
						}

						vboUpdateBreakfastState();
					})
					.catch( function() {
						// If the capacity check fails for any reason, leave Extra
						// Bed purchasable rather than silently breaking the option.
					});
			}
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

