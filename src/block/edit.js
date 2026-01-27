/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	Disabled,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import './editor.scss';

/**
 * ButtonsPreview component - renders the buttons control style
 *
 * @param {Object} props           Component props
 * @param {number} props.sizeSteps Number of size steps
 * @param {number} props.minScale  Minimum scale value
 * @param {number} props.maxScale  Maximum scale value
 * @return {Element} Buttons preview element
 */
function ButtonsPreview({ sizeSteps, minScale, maxScale }) {
	const scales = [];
	const step = (maxScale - minScale) / (sizeSteps - 1);
	for (let i = 0; i < sizeSteps; i++) {
		scales.push(minScale + step * i);
	}

	// Find the default (1.0) or middle index
	let defaultIndex = scales.findIndex((s) => Math.abs(s - 1) < 0.01);
	if (defaultIndex === -1) {
		defaultIndex = Math.floor(sizeSteps / 2);
	}

	return (
		<div
			className="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--buttons"
			role="group"
			aria-label={__('Text size controls', 'text-resizer')}
		>
			{scales.map((scale, index) => {
				const isActive = index === defaultIndex;
				let label = __('Reset text size', 'text-resizer');
				if (index === 0) {
					label = __('Decrease text size', 'text-resizer');
				} else if (index === scales.length - 1) {
					label = __('Increase text size', 'text-resizer');
				}

				return (
					<button
						key={index}
						type="button"
						className={`wp-block-readease-text-resizer__button ${
							isActive
								? 'wp-block-readease-text-resizer__button--active'
								: ''
						}`}
						aria-label={label}
						aria-pressed={isActive}
					>
						<span className="wp-block-readease-text-resizer__button-text">
							A
						</span>
					</button>
				);
			})}
		</div>
	);
}

/**
 * SliderPreview component - renders the slider control style
 *
 * @param {Object} props           Component props
 * @param {number} props.sizeSteps Number of size steps
 * @param {number} props.minScale  Minimum scale value
 * @param {number} props.maxScale  Maximum scale value
 * @return {Element} Slider preview element
 */
function SliderPreview({ sizeSteps, minScale, maxScale }) {
	// Calculate step to match sizeSteps setting
	const step = (maxScale - minScale) / (sizeSteps - 1);

	return (
		<div className="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--slider">
			<span className="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--min">
				A
			</span>
			<input
				type="range"
				className="wp-block-readease-text-resizer__slider"
				min={minScale}
				max={maxScale}
				step={step}
				defaultValue="1"
				aria-label={__('Text size', 'text-resizer')}
			/>
			<span className="wp-block-readease-text-resizer__slider-label wp-block-readease-text-resizer__slider-label--max">
				A
			</span>
		</div>
	);
}

/**
 * DropdownPreview component - renders the dropdown control style
 *
 * @param {Object} props           Component props
 * @param {number} props.sizeSteps Number of size steps
 * @param {number} props.minScale  Minimum scale value
 * @param {number} props.maxScale  Maximum scale value
 * @return {Element} Dropdown preview element
 */
function DropdownPreview({ sizeSteps, minScale, maxScale }) {
	const scales = [];
	const step = (maxScale - minScale) / (sizeSteps - 1);
	for (let i = 0; i < sizeSteps; i++) {
		scales.push(minScale + step * i);
	}

	// Find the default (1.0) or middle index
	let defaultIndex = scales.findIndex((s) => Math.abs(s - 1) < 0.01);
	if (defaultIndex === -1) {
		defaultIndex = Math.floor(sizeSteps / 2);
	}

	return (
		<div className="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--dropdown">
			<select
				className="wp-block-readease-text-resizer__select"
				aria-label={__('Text size', 'text-resizer')}
				defaultValue={scales[defaultIndex]}
			>
				{scales.map((scale, index) => {
					const isDefault = index === defaultIndex;
					const percentage = Math.round(scale * 100);
					const label = isDefault
						? __('Default', 'text-resizer')
						: `${percentage}%`;

					return (
						<option key={index} value={scale}>
							{label}
						</option>
					);
				})}
			</select>
		</div>
	);
}

/**
 * IconsPreview component - renders the icons control style
 *
 * @return {Element} Icons preview element
 */
function IconsPreview() {
	return (
		<div
			className="wp-block-readease-text-resizer__controls wp-block-readease-text-resizer__controls--icons"
			role="group"
			aria-label={__('Text size controls', 'text-resizer')}
		>
			<button
				type="button"
				className="wp-block-readease-text-resizer__icon-button"
				aria-label={__('Decrease text size', 'text-resizer')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M7 11.5h10V13H7z" />
				</svg>
			</button>
			<button
				type="button"
				className="wp-block-readease-text-resizer__icon-button wp-block-readease-text-resizer__icon-button--active"
				aria-label={__('Reset text size', 'text-resizer')}
				aria-pressed="true"
			>
				<span className="wp-block-readease-text-resizer__icon-text">
					A
				</span>
			</button>
			<button
				type="button"
				className="wp-block-readease-text-resizer__icon-button"
				aria-label={__('Increase text size', 'text-resizer')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					aria-hidden="true"
					focusable="false"
				>
					<path d="M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" />
				</svg>
			</button>
		</div>
	);
}

/**
 * Edit component for Text_Resizer block
 *
 * @param {Object}   props               Component props
 * @param {Object}   props.attributes    Block attributes
 * @param {Function} props.setAttributes Function to update attributes
 * @return {Element} Editor element
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		sizeSteps,
		minScale,
		maxScale,
		mobileOnly,
		scaleScope,
		targetSelector,
		controlStyle,
		labelPosition,
		labelText,
	} = attributes;

	const classNames = [
		`wp-block-readease-text-resizer--${controlStyle}`,
		`wp-block-readease-text-resizer--label-${labelPosition}`,
		mobileOnly ? 'wp-block-readease-text-resizer--mobile-only' : '',
	]
		.filter(Boolean)
		.join(' ');

	const blockProps = useBlockProps({
		className: classNames,
	});

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Display Settings', 'text-resizer')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Control Style', 'text-resizer')}
						value={controlStyle}
						options={[
							{
								label: __('Dropdown', 'text-resizer'),
								value: 'dropdown',
							},
							{
								label: __('Buttons (A- A A+)', 'text-resizer'),
								value: 'buttons',
							},
							{
								label: __('Slider', 'text-resizer'),
								value: 'slider',
							},
							{
								label: __('Icons (Minimal)', 'text-resizer'),
								value: 'icons',
							},
						]}
						onChange={(value) =>
							setAttributes({ controlStyle: value })
						}
					/>
					<SelectControl
						label={__('Label Position', 'text-resizer')}
						value={labelPosition}
						options={[
							{
								label: __('Side', 'text-resizer'),
								value: 'side',
							},
							{
								label: __('Top', 'text-resizer'),
								value: 'top',
							},
							{
								label: __('Hidden', 'text-resizer'),
								value: 'hidden',
							},
						]}
						onChange={(value) =>
							setAttributes({ labelPosition: value })
						}
					/>
					<TextControl
						label={__('Label Text', 'text-resizer')}
						value={labelText}
						onChange={(value) =>
							setAttributes({ labelText: value })
						}
					/>
					<ToggleControl
						label={__('Mobile Only', 'text-resizer')}
						help={__(
							'Only show controls on mobile and tablet devices.',
							'text-resizer'
						)}
						checked={mobileOnly}
						onChange={(value) =>
							setAttributes({ mobileOnly: value })
						}
					/>
				</PanelBody>
				<PanelBody
					title={__('Scale Settings', 'text-resizer')}
					initialOpen={true}
				>
					<SelectControl
						label={__('Scale Scope', 'text-resizer')}
						help={__(
							'Choose which parts of the page to resize.',
							'text-resizer'
						)}
						value={scaleScope}
						options={[
							{
								label: __('Full Page', 'text-resizer'),
								value: 'full-page',
							},
							{
								label: __(
									'Exclude Template Parts',
									'text-resizer'
								),
								value: 'exclude-template',
							},
						]}
						onChange={(value) =>
							setAttributes({ scaleScope: value })
						}
					/>
					<RangeControl
						label={__('Size Steps', 'text-resizer')}
						help={__(
							'Number of size options to offer visitors.',
							'text-resizer'
						)}
						value={sizeSteps}
						onChange={(value) =>
							setAttributes({ sizeSteps: value })
						}
						min={2}
						max={5}
					/>
					<RangeControl
						label={__('Minimum Scale', 'text-resizer')}
						help={__(
							'Smallest text size multiplier. 1 = theme default.',
							'text-resizer'
						)}
						value={minScale}
						onChange={(value) => setAttributes({ minScale: value })}
						min={1}
						max={1.2}
						step={0.05}
					/>
					<RangeControl
						label={__('Maximum Scale', 'text-resizer')}
						help={__(
							'Largest text size multiplier (e.g., 1.2 = 120%).',
							'text-resizer'
						)}
						value={maxScale}
						onChange={(value) => setAttributes({ maxScale: value })}
						min={1.1}
						max={1.5}
						step={0.05}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={__('Target Selector', 'text-resizer')}
					help={__(
						'Custom CSS selector to override the scale scope.',
						'text-resizer'
					)}
					value={targetSelector}
					onChange={(value) =>
						setAttributes({ targetSelector: value })
					}
				/>
			</InspectorAdvancedControls>
			<div {...blockProps}>
				<span
					className={`wp-block-readease-text-resizer__label${
						labelPosition === 'hidden'
							? ' wp-block-readease-text-resizer__label--hidden'
							: ''
					}`}
				>
					{labelText}
				</span>
				<Disabled>
					{controlStyle === 'dropdown' && (
						<DropdownPreview
							sizeSteps={sizeSteps}
							minScale={minScale}
							maxScale={maxScale}
						/>
					)}
					{controlStyle === 'buttons' && (
						<ButtonsPreview
							sizeSteps={sizeSteps}
							minScale={minScale}
							maxScale={maxScale}
						/>
					)}
					{controlStyle === 'slider' && (
						<SliderPreview
							sizeSteps={sizeSteps}
							minScale={minScale}
							maxScale={maxScale}
						/>
					)}
					{controlStyle === 'icons' && <IconsPreview />}
				</Disabled>
			</div>
		</>
	);
}
