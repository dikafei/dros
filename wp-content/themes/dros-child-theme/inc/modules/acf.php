<?php
    // ACF BLOCKS
		// Category Block
			/*add_filter( 'block_categories', 'backbone_block_categories' );

			function backbone_block_categories( $categories ) {
				$category_slugs = wp_list_pluck( $categories, 'slug' );
				return in_array( 'generatepress', $category_slugs, true ) ? $categories : array_merge(
					$categories,
					array(
						array(
							'slug'  => 'backbone',
							'title' => __( 'Backbone', 'generatepress' ),
							'icon'  => null,
						),
					)
				);
			}*/            

        // Blocks
			add_action('acf/init', 'acf_init_block_types');

			function acf_init_block_types() 
			{	
				if( function_exists('acf_register_block_type') ) 
				{
					// Accordion Group
					acf_register_block_type(array(
						'name'              => 'accordion-group',
						'title'             => 'Accordion',
						'description'       => 'Create accordion.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> 'list-view',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/accordion-group.php',
					));

					// Accordion Item
					acf_register_block_type(array(
						'name'              => 'accordion-item',
						'title'             => 'Accordion Item',
						'description'       => 'Create accordion item.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> 'align-center',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/accordion-item.php',
					));

					// Slider
					acf_register_block_type(array(
						'name'              => 'slider',
						'title'             => 'Slider',
						'description'       => 'Create slider or carousel.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> '<svg width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="Artboard2" x="0" y="0" width="20" height="20" style="fill:none;"/><rect x="5" y="2.494" width="10" height="15.012" style="fill:none;stroke:#000;stroke-width:1.5px;"/><rect x="1" y="4.493" width="4" height="11.015" style="fill:none;stroke:#000;stroke-width:1.5px;"/><rect x="15" y="4.493" width="4" height="11.015" style="fill:none;stroke:#000;stroke-width:1.5px;"/></svg>',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/slider.php',
					));					

					// Slide
					acf_register_block_type(array(
						'name'              => 'slide',
						'title'             => 'Slide',
						'description'       => 'Create slide for slider/carousel.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> '<svg width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="Artboard2" x="0" y="0" width="20" height="20" style="fill:none;"/><rect x="2.5" y="6" width="15" height="8" style="fill:none;stroke:#000;stroke-width:1.5px;"/><path d="M4,2.494l12,-0" style="fill:none;stroke:#000;stroke-width:1.5px;"/><path d="M4,17.506l12,0" style="fill:none;stroke:#000;stroke-width:1.5px;"/></svg>',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/slide.php',
					));	

					// Testimonial Group
					acf_register_block_type(array(
						'name'              => 'testimonial-group',
						'title'             => 'Testimonial',
						'description'       => 'Create testimonial.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> '<svg width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="Artboard2" x="0" y="0" width="20" height="20" style="fill:none;"/><rect x="5" y="2.494" width="10" height="15.012" style="fill:none;stroke:#000;stroke-width:1.5px;"/><rect x="1" y="4.493" width="4" height="11.015" style="fill:none;stroke:#000;stroke-width:1.5px;"/><rect x="15" y="4.493" width="4" height="11.015" style="fill:none;stroke:#000;stroke-width:1.5px;"/></svg>',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/testimonial-group.php',
					));

					// Testimonial Item
					acf_register_block_type(array(
						'name'              => 'testimonial-item',
						'title'             => 'Testimonial Item',
						'description'       => 'Create testimonial item.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> '<svg width="100%" height="100%" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"><rect id="Artboard2" x="0" y="0" width="20" height="20" style="fill:none;"/><rect x="2.5" y="6" width="15" height="8" style="fill:none;stroke:#000;stroke-width:1.5px;"/><path d="M4,2.494l12,-0" style="fill:none;stroke:#000;stroke-width:1.5px;"/><path d="M4,17.506l12,0" style="fill:none;stroke:#000;stroke-width:1.5px;"/></svg>',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/testimonial.php',
					));

					// Tab Group
					acf_register_block_type(array(
						'name'              => 'tab-group',
						'title'             => 'Tab',
						'description'       => 'Create Tab.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> 'list-view',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/tab-group.php',
					));

					// Tab Item
					acf_register_block_type(array(
						'name'              => 'tab-item',
						'title'             => 'Tab Item',
						'description'       => 'Create tab item.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> 'align-center',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/tab-item.php',
					));

					// Link Group
					acf_register_block_type(array(
						'name'              => 'link-group',
						'title'             => 'Link Group',
						'description'       => 'Create a block that can be clicked.',
						'category'          => 'formatting',
						'mode'              => 'preview',
						'icon'				=> 'admin-links',
						'supports'          => array(
							'align' => true,
							'mode' => false,
							'jsx' => true
						),
						'render_template' => 'template-parts/blocks/link-group.php',
					));
				}
			}

		// Default Blocks ( Accordion / Slider / Marquee)
			add_action( 'acf/include_fields', function() {
				if ( ! function_exists( 'acf_add_local_field_group' ) ) {
					return;
				}

				acf_add_local_field_group( array(
					'key' => 'group_662f57af1cbfe',
					'title' => 'Block - Accordion Group',
					'fields' => array(
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/accordion-group',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

				acf_add_local_field_group( array(
					'key' => 'group_662f57e7907c3',
					'title' => 'Block - Accordion Item',
					'fields' => array(
						array(
							'key' => 'field_662f57e7fe330',
							'label' => 'Title',
							'name' => 'title',
							'aria-label' => '',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'maxlength' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
						),
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/accordion-item',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

				acf_add_local_field_group( array(
					'key' => 'group_662a8f7326e1e',
					'title' => 'Block - Marquee',
					'fields' => array(
						array(
							'key' => 'field_662a8f740cfd4',
							'label' => 'Words',
							'name' => 'words',
							'aria-label' => '',
							'type' => 'textarea',
							'instructions' => 'Put each word in new line.',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'maxlength' => '',
							'rows' => '',
							'placeholder' => '',
							'new_lines' => '',
						),
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/marquee',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

				acf_add_local_field_group( array(
					'key' => 'group_662f5a6b3f840',
					'title' => 'Block - Slide',
					'fields' => array(
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/slide',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

				acf_add_local_field_group( array(
					'key' => 'group_662f5a829782d',
					'title' => 'Block - Slider',
					'fields' => array(
						array(
							'key' => 'field_662f5a82e3e04',
							'label' => 'Slider Style',
							'name' => 'slider_style',
							'aria-label' => '',
							'type' => 'button_group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'choices' => array(
								'slider' => 'Slider',
								'carousel' => 'Carousel',
							),
							'default_value' => 'slider',
							'return_format' => 'value',
							'allow_null' => 0,
							'layout' => 'horizontal',
						),
						array(
							'key' => 'field_662f5b464330c',
							'label' => 'Slide Per View Count',
							'name' => 'slide_per_view_count',
							'aria-label' => '',
							'type' => 'group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => array(
								array(
									array(
										'field' => 'field_662f5a82e3e04',
										'operator' => '==',
										'value' => 'carousel',
									),
								),
							),
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'layout' => 'block',
							'sub_fields' => array(
								array(
									'key' => 'field_662f5b6a4330d',
									'label' => '# Slide per view (Desktop)',
									'name' => '#_slide_per_view_desktop',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 5,
									'min' => 2,
									'max' => 10,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
								array(
									'key' => 'field_662f5bd54330e',
									'label' => '# Slide per view (Tablet)',
									'name' => '#_slide_per_view_tablet',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 3,
									'min' => 1,
									'max' => 10,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
								array(
									'key' => 'field_662f5c234330f',
									'label' => '# Slide per view (Mobile)',
									'name' => '#_slide_per_view_mobile',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 1,
									'min' => 1,
									'max' => 10,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
							),
						),
						array(
							'key' => 'field_662f5cbf666fd',
							'label' => 'Navigation',
							'name' => 'navigation',
							'aria-label' => '',
							'type' => 'button_group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'choices' => array(
								'none' => 'None',
								'arrow' => 'Arrow',
							),
							'default_value' => 'arrow',
							'return_format' => 'value',
							'allow_null' => 0,
							'layout' => 'horizontal',
						),
						array(
							'key' => 'field_662f8b1a7e664',
							'label' => 'Navigation Position',
							'name' => 'navigation_position',
							'aria-label' => '',
							'type' => 'button_group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => array(
								array(
									array(
										'field' => 'field_662f5cbf666fd',
										'operator' => '==',
										'value' => 'arrow',
									),
								),
							),
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'choices' => array(
								'top' => 'Top',
								'middle' => 'Middle',
								'bottom' => 'Bottom',
							),
							'default_value' => 'middle',
							'return_format' => 'value',
							'allow_null' => 0,
							'layout' => 'horizontal',
						),
						array(
							'key' => 'field_662f5c5d666fc',
							'label' => 'Pagination',
							'name' => 'pagination',
							'aria-label' => '',
							'type' => 'button_group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'choices' => array(
								'none' => 'None',
								'bullets' => 'Bullets',
								'fraction' => 'Fraction',
							),
							'default_value' => 'bullets',
							'return_format' => 'value',
							'allow_null' => 0,
							'layout' => 'horizontal',
						),
						array(
							'key' => 'field_6630986766ffa',
							'label' => 'Slide Gap',
							'name' => 'slide_gap',
							'aria-label' => '',
							'type' => 'group',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => array(
								array(
									array(
										'field' => 'field_662f5a82e3e04',
										'operator' => '==',
										'value' => 'carousel',
									),
								),
							),
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'layout' => 'block',
							'sub_fields' => array(
								array(
									'key' => 'field_6630986766ffb',
									'label' => 'Gap (Desktop)',
									'name' => 'gap_desktop',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 50,
									'min' => 0,
									'max' => 200,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
								array(
									'key' => 'field_6630986766ffc',
									'label' => 'Gap (Tablet)',
									'name' => 'gap_tablet',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 25,
									'min' => 0,
									'max' => 200,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
								array(
									'key' => 'field_6630986766ffd',
									'label' => 'Gap Mobile',
									'name' => 'gap_mobile',
									'aria-label' => '',
									'type' => 'number',
									'instructions' => '',
									'required' => 0,
									'conditional_logic' => 0,
									'wrapper' => array(
										'width' => '',
										'class' => '',
										'id' => '',
									),
									'default_value' => 16,
									'min' => 0,
									'max' => 200,
									'placeholder' => '',
									'step' => 1,
									'prepend' => '',
									'append' => '',
								),
							),
						),
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/slider',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

				acf_add_local_field_group( array(
					'key' => 'group_660a8ff233994',
					'title' => 'Block - Testimonial Group',
					'fields' => array(
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/testimonial-group',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				) );

					acf_add_local_field_group( array(
					'key' => 'group_660a9018e5853',
					'title' => 'Block - Testimonial Item',
					'fields' => array(
						array(
							'key' => 'field_660a90197db88',
							'label' => 'Name',
							'name' => 'name',
							'aria-label' => '',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'maxlength' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
						),
						array(
							'key' => 'field_660a90287db89',
							'label' => 'Company',
							'name' => 'company',
							'aria-label' => '',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'maxlength' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
						),
						array(
							'key' => 'field_660a90317db8a',
							'label' => 'Testimonial',
							'name' => 'testimonial',
							'aria-label' => '',
							'type' => 'textarea',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'maxlength' => '',
							'rows' => '',
							'placeholder' => '',
							'new_lines' => '',
						),
					),
					'location' => array(
						array(
							array(
								'param' => 'block',
								'operator' => '==',
								'value' => 'acf/testimonial-item',
							),
						),
					),
					'menu_order' => 0,
					'position' => 'normal',
					'style' => 'default',
					'label_placement' => 'top',
					'instruction_placement' => 'label',
					'hide_on_screen' => '',
					'active' => true,
					'description' => '',
					'show_in_rest' => 0,
				));
			} );

		
?>