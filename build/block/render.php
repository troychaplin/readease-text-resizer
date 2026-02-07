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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Extract attributes with defaults.
$text_resizer_size_steps      = isset( $attributes['sizeSteps'] ) ? absint( $attributes['sizeSteps'] ) : 3;
$text_resizer_min_scale       = isset( $attributes['minScale'] ) ? floatval( $attributes['minScale'] ) : 1;
$text_resizer_max_scale       = isset( $attributes['maxScale'] ) ? floatval( $attributes['maxScale'] ) : 1.2;
$text_resizer_mobile_only     = isset( $attributes['mobileOnly'] ) ? $attributes['mobileOnly'] : false;
$text_resizer_scale_scope     = isset( $attributes['scaleScope'] ) ? $attributes['scaleScope'] : 'exclude-template';
$text_resizer_target_selector = isset( $attributes['targetSelector'] ) ? $attributes['targetSelector'] : '';
$text_resizer_control_style   = isset( $attributes['controlStyle'] ) ? $attributes['controlStyle'] : 'dropdown';
$text_resizer_label_position  = isset( $attributes['labelPosition'] ) ? $attributes['labelPosition'] : 'side';
$text_resizer_label_text      = isset( $attributes['labelText'] ) ? $attributes['labelText'] : __( 'Text Size', 'readease-text-resizer' );

// Calculate scale values.
$text_resizer_scales = array();
$text_resizer_step   = ( $text_resizer_max_scale - $text_resizer_min_scale ) / ( $text_resizer_size_steps - 1 );
for ( $text_resizer_i = 0; $text_resizer_i < $text_resizer_size_steps; $text_resizer_i++ ) {
	$text_resizer_scales[] = round( $text_resizer_min_scale + ( $text_resizer_step * $text_resizer_i ), 2 );
}

// Find default index (closest to 1.0).
$text_resizer_default_index = 0;
$text_resizer_min_diff      = PHP_FLOAT_MAX;
foreach ( $text_resizer_scales as $text_resizer_index => $text_resizer_scale ) {
	$text_resizer_diff = abs( $text_resizer_scale - 1 );
	if ( $text_resizer_diff < $text_resizer_min_diff ) {
		$text_resizer_min_diff      = $text_resizer_diff;
		$text_resizer_default_index = $text_resizer_index;
	}
}

// Build additional classes.
$text_resizer_additional_classes  = 'wp-block-readease-text-resizer--' . esc_attr( $text_resizer_control_style );
$text_resizer_additional_classes .= ' wp-block-readease-text-resizer--label-' . esc_attr( $text_resizer_label_position );
if ( $text_resizer_mobile_only ) {
	$text_resizer_additional_classes .= ' wp-block-readease-text-resizer--mobile-only';
}

// Build wrapper attributes with data attributes for JS.
$text_resizer_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                => $text_resizer_additional_classes,
		'data-size-steps'      => esc_attr( $text_resizer_size_steps ),
		'data-min-scale'       => esc_attr( $text_resizer_min_scale ),
		'data-max-scale'       => esc_attr( $text_resizer_max_scale ),
		'data-scale-scope'     => esc_attr( $text_resizer_scale_scope ),
		'data-target-selector' => esc_attr( $text_resizer_target_selector ),
		'data-control-style'   => esc_attr( $text_resizer_control_style ),
		'data-default-index'   => esc_attr( $text_resizer_default_index ),
		'data-scales'          => esc_attr( wp_json_encode( $text_resizer_scales ) ),
	)
);

?>
<?php
// Build label class.
$text_resizer_label_class = 'wp-block-readease-text-resizer__label';
if ( 'hidden' === $text_resizer_label_position ) {
	$text_resizer_label_class .= ' wp-block-readease-text-resizer__label--hidden';
}
?>
<div <?php echo wp_kses_post( $text_resizer_wrapper_attributes ); ?>>
	<span class="<?php echo esc_attr( $text_resizer_label_class ); ?>">
		<?php echo esc_html( $text_resizer_label_text ); ?>
	</span>

	<?php if ( 'buttons' === $text_resizer_control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--buttons" role="group" aria-label="<?php esc_attr_e( 'Text size controls', 'readease-text-resizer' ); ?>">
			<?php foreach ( $text_resizer_scales as $text_resizer_index => $text_resizer_scale ) : ?>
				<?php
				$text_resizer_is_active    = ( $text_resizer_index === $text_resizer_default_index );
				$text_resizer_button_class = 'wp-block-readease-text-resizer__button';
				if ( $text_resizer_is_active ) {
					$text_resizer_button_class .= ' wp-block-readease-text-resizer__button--active';
				}

				// Determine button label.
				if ( 0 === $text_resizer_index ) {
					$text_resizer_aria_label = __( 'Decrease text size', 'readease-text-resizer' );
				} elseif ( count( $text_resizer_scales ) - 1 === $text_resizer_index ) {
					$text_resizer_aria_label = __( 'Increase text size', 'readease-text-resizer' );
				} else {
					$text_resizer_aria_label = __( 'Reset text size', 'readease-text-resizer' );
				}
				?>
				<button
					type="button"
					class="<?php echo esc_attr( $text_resizer_button_class ); ?>"
					data-scale="<?php echo esc_attr( $text_resizer_scale ); ?>"
					data-index="<?php echo esc_attr( $text_resizer_index ); ?>"
					aria-label="<?php echo esc_attr( $text_resizer_aria_label ); ?>"
					aria-pressed="<?php echo $text_resizer_is_active ? 'true' : 'false'; ?>"
				>
					<span class="wp-block-readease-text-resizer__button-text">A</span>
				</button>
			<?php endforeach; ?>
		</div>

	<?php elseif ( 'slider' === $text_resizer_control_style ) : ?>
		<?php
		// Calculate step to match sizeSteps setting.
		$text_resizer_slider_step = ( $text_resizer_max_scale - $text_resizer_min_scale ) / ( $text_resizer_size_steps - 1 );
		$text_resizer_slider_step = round( $text_resizer_slider_step, 4 );
		?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--slider">
			<span class="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--min">A</span>
			<input
				type="range"
				class="wp-block-readease-text-resizer__slider"
				min="<?php echo esc_attr( $text_resizer_min_scale ); ?>"
				max="<?php echo esc_attr( $text_resizer_max_scale ); ?>"
				step="<?php echo esc_attr( $text_resizer_slider_step ); ?>"
				value="1"
				aria-label="<?php esc_attr_e( 'Text size', 'readease-text-resizer' ); ?>"
			/>
			<span class="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--max">A</span>
		</div>

	<?php elseif ( 'icons' === $text_resizer_control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--icons" role="group" aria-label="<?php esc_attr_e( 'Text size controls', 'readease-text-resizer' ); ?>">
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button"
				data-action="decrease"
				aria-label="<?php esc_attr_e( 'Decrease text size', 'readease-text-resizer' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
					<path d="M7 11.5h10V13H7z" fill="currentColor"/>
				</svg>
			</button>
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button wp-block-readease-text-resizer__icon-button--active"
				data-action="reset"
				aria-label="<?php esc_attr_e( 'Reset text size', 'readease-text-resizer' ); ?>"
				aria-pressed="true"
			>
				<span class="wp-block-readease-text-resizer__icon-text">A</span>
			</button>
			<button
				type="button"
				class="wp-block-readease-text-resizer__icon-button"
				data-action="increase"
				aria-label="<?php esc_attr_e( 'Increase text size', 'readease-text-resizer' ); ?>"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
					<path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" fill="currentColor"/>
				</svg>
			</button>
		</div>

	<?php elseif ( 'dropdown' === $text_resizer_control_style ) : ?>
		<div class="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--dropdown">
			<select
				class="wp-block-readease-text-resizer__select"
				aria-label="<?php esc_attr_e( 'Text size', 'readease-text-resizer' ); ?>"
			>
				<?php foreach ( $text_resizer_scales as $text_resizer_index => $text_resizer_scale ) : ?>
					<?php
					$text_resizer_is_default = ( $text_resizer_index === $text_resizer_default_index );
					$text_resizer_percentage = round( $text_resizer_scale * 100 );
					/* translators: %d: percentage value */
					$text_resizer_option_label = sprintf( __( '%d%%', 'readease-text-resizer' ), $text_resizer_percentage );
					?>
					<option
						value="<?php echo esc_attr( $text_resizer_scale ); ?>"
						<?php selected( $text_resizer_is_default ); ?>
					>
						<?php echo esc_html( $text_resizer_option_label ); ?>
					</option>
				<?php endforeach; ?>
			</select>
		</div>
	<?php endif; ?>
</div>
