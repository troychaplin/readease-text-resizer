<?php
/**
 * Server-side rendering for the Text_Resizer Text Resizer block.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 *
 * @package Text_Resizer
 */

// Extract attributes with defaults.
$size_steps      = isset( $attributes['sizeSteps'] ) ? absint( $attributes['sizeSteps'] ) : 3;
$min_scale       = isset( $attributes['minScale'] ) ? floatval( $attributes['minScale'] ) : 1;
$max_scale       = isset( $attributes['maxScale'] ) ? floatval( $attributes['maxScale'] ) : 1.2;
$mobile_only     = isset( $attributes['mobileOnly'] ) ? $attributes['mobileOnly'] : false;
$scale_scope     = isset( $attributes['scaleScope'] ) ? $attributes['scaleScope'] : 'exclude-template';
$target_selector = isset( $attributes['targetSelector'] ) ? $attributes['targetSelector'] : '';
$control_style   = isset( $attributes['controlStyle'] ) ? $attributes['controlStyle'] : 'dropdown';
$label_position  = isset( $attributes['labelPosition'] ) ? $attributes['labelPosition'] : 'side';
$label_text      = isset( $attributes['labelText'] ) ? $attributes['labelText'] : __( 'Text Size', 'text-resizer' );

// Calculate scale values.
$scales = array();
$step   = ( $max_scale - $min_scale ) / ( $size_steps - 1 );
for ( $i = 0; $i < $size_steps; $i++ ) {
	$scales[] = round( $min_scale + ( $step * $i ), 2 );
}

// Find default index (closest to 1.0).
$default_index = 0;
$min_diff      = PHP_FLOAT_MAX;
foreach ( $scales as $index => $scale ) {
	$diff = abs( $scale - 1 );
	if ( $diff < $min_diff ) {
		$min_diff      = $diff;
		$default_index = $index;
	}
}

// Build additional classes.
$additional_classes  = 'wp-block-readease-text-resizer--' . esc_attr( $control_style );
$additional_classes .= ' wp-block-readease-text-resizer--label-' . esc_attr( $label_position );
if ( $mobile_only ) {
	$additional_classes .= ' wp-block-readease-text-resizer--mobile-only';
}

// Build wrapper attributes with data attributes for JS.
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                => $additional_classes,
		'data-size-steps'      => esc_attr( $size_steps ),
		'data-min-scale'       => esc_attr( $min_scale ),
		'data-max-scale'       => esc_attr( $max_scale ),
		'data-scale-scope'     => esc_attr( $scale_scope ),
		'data-target-selector' => esc_attr( $target_selector ),
		'data-control-style'   => esc_attr( $control_style ),
		'data-default-index'   => esc_attr( $default_index ),
		'data-scales'          => esc_attr( wp_json_encode( $scales ) ),
	)
);

?>
<?php
// Build label class.
$label_class = 'wp-block-readease-text-resizer__label';
if ( 'hidden' === $label_position ) {
	$label_class .= ' wp-block-readease-text-resizer__label--hidden';
}
?>
<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<span class="<?php echo esc_attr( $label_class ); ?>">
		<?php echo esc_html( $label_text ); ?>
	</span>

	<?php if ( 'buttons' === $control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--buttons" role="group" aria-label="<?php esc_attr_e( 'Text size controls', 'text-resizer' ); ?>">
			<?php foreach ( $scales as $index => $scale ) : ?>
				<?php
				$is_active    = ( $index === $default_index );
				$button_class = 'wp-block-readease-text-resizer__button';
				if ( $is_active ) {
					$button_class .= ' wp-block-readease-text-resizer__button--active';
				}

				// Determine button label.
				if ( 0 === $index ) {
					$aria_label = __( 'Decrease text size', 'text-resizer' );
				} elseif ( count( $scales ) - 1 === $index ) {
					$aria_label = __( 'Increase text size', 'text-resizer' );
				} else {
					$aria_label = __( 'Reset text size', 'text-resizer' );
				}
				?>
				<button
					type="button"
					class="<?php echo esc_attr( $button_class ); ?>"
					data-scale="<?php echo esc_attr( $scale ); ?>"
					data-index="<?php echo esc_attr( $index ); ?>"
					aria-label="<?php echo esc_attr( $aria_label ); ?>"
					aria-pressed="<?php echo $is_active ? 'true' : 'false'; ?>"
				>
					<span class="wp-block-readease-text-resizer__button-text">A</span>
				</button>
			<?php endforeach; ?>
		</div>

	<?php elseif ( 'slider' === $control_style ) : ?>
		<?php
		// Calculate step to match sizeSteps setting.
		$slider_step = ( $max_scale - $min_scale ) / ( $size_steps - 1 );
		$slider_step = round( $slider_step, 4 );
		?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--slider">
			<span class="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--min">A</span>
			<input
				type="range"
				class="wp-block-readease-text-resizer__slider"
				min="<?php echo esc_attr( $min_scale ); ?>"
				max="<?php echo esc_attr( $max_scale ); ?>"
				step="<?php echo esc_attr( $slider_step ); ?>"
				value="1"
				aria-label="<?php esc_attr_e( 'Text size', 'text-resizer' ); ?>"
			/>
			<span class="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--max">A</span>
		</div>

	<?php elseif ( 'icons' === $control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--icons" role="group" aria-label="<?php esc_attr_e( 'Text size controls', 'text-resizer' ); ?>">
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button"
				data-action="decrease"
				aria-label="<?php esc_attr_e( 'Decrease text size', 'text-resizer' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
					<path d="M7 11.5h10V13H7z" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button wp-block-readease-text-resizer__icon-button--active"
				data-action="reset"
				aria-label="<?php esc_attr_e( 'Reset text size', 'text-resizer' ); ?>"
				aria-pressed="true"
			>
				<span class="wp-block-readease-text-resizer__icon-text">A</span>
			</button>
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button"
				data-action="increase"
				aria-label="<?php esc_attr_e( 'Increase text size', 'text-resizer' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
					<path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" fill="currentColor"/>
				</svg>
			</button>
		</div>

	<?php elseif ( 'dropdown' === $control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--dropdown">
			<select
				class="wp-block-readease-text-resizer__select"
				aria-label="<?php esc_attr_e( 'Text size', 'text-resizer' ); ?>"
			>
				<?php foreach ( $scales as $index => $scale ) : ?>
					<?php
					$is_default = ( $index === $default_index );
					$percentage = round( $scale * 100 );
					/* translators: %d: percentage value */
					$option_label = sprintf( __( '%d%%', 'text-resizer' ), $percentage );
					?>
					<option
						value="<?php echo esc_attr( $scale ); ?>"
						<?php selected( $is_default ); ?>
					>
						<?php echo esc_html( $option_label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
	<?php endif; ?>
</div>
