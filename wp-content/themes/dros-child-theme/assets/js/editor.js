wp.domReady( () => {
	wp.blocks.unregisterBlockStyle(
		'core/button', [ 'fill', 'outline' ]
	);
} );
