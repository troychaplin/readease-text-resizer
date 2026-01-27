<?php
// This file is generated. Do not modify it manually.
return array(
	'text-resizer' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'readease/text-resizer',
		'version' => '1.0.0',
		'title' => 'ReadEase: Text Resizer',
		'category' => 'theme',
		'icon' => 'editor-textcolor',
		'description' => 'Let visitors resize text for improved readability and accessibility.',
		'keywords' => array(
			'text',
			'size',
			'accessibility',
			'resize',
			'font'
		),
		'example' => array(
			
		),
		'attributes' => array(
			'sizeSteps' => array(
				'type' => 'number',
				'default' => 3
			),
			'minScale' => array(
				'type' => 'number',
				'default' => 1
			),
			'maxScale' => array(
				'type' => 'number',
				'default' => 1.5
			),
			'mobileOnly' => array(
				'type' => 'boolean',
				'default' => false
			),
			'scaleScope' => array(
				'type' => 'string',
				'default' => 'exclude-template',
				'enum' => array(
					'exclude-template',
					'full-page'
				)
			),
			'targetSelector' => array(
				'type' => 'string',
				'default' => ''
			),
			'controlStyle' => array(
				'type' => 'string',
				'default' => 'dropdown',
				'enum' => array(
					'dropdown',
					'buttons',
					'slider',
					'icons'
				)
			),
			'labelPosition' => array(
				'type' => 'string',
				'default' => 'side',
				'enum' => array(
					'top',
					'side',
					'hidden'
				)
			),
			'labelText' => array(
				'type' => 'string',
				'default' => 'Text Size'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'left',
				'center',
				'right'
			),
			'color' => array(
				'background' => true,
				'text' => true,
				'link' => false,
				'__experimentalDefaultControls' => array(
					'background' => true,
					'text' => true
				)
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'__experimentalDefaultControls' => array(
					'padding' => true
				)
			)
		),
		'textdomain' => 'text-resizer',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	)
);
