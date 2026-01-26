/**
 * FlexType Frontend JavaScript
 *
 * Handles text resizing controls on the frontend.
 */

(function () {
	'use strict';

	const STORAGE_KEY = 'flextypeScale';
	const CSS_PROPERTY = '--flextype-scale';
	const STYLE_ID = 'flextype-scale-styles';
	const BLOCK_SELECTOR = '.wp-block-flextype-text-resizer';

	// Text elements to scale
	const TEXT_ELEMENTS = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'p',
		'li',
		'td',
		'th',
		'dd',
		'dt',
		'blockquote',
		'figcaption',
	];

	// Template part selectors to exclude when scaleScope is 'exclude-template'
	const TEMPLATE_PART_SELECTORS = [
		'header',
		'.site-header',
		'.wp-block-template-part[data-slug="header"]',
		'footer',
		'.site-footer',
		'.wp-block-template-part[data-slug="footer"]',
		'nav',
		'.site-navigation',
		'.wp-block-navigation',
		'#wpadminbar',
	];

	/**
	 * Get or create the dynamic style element
	 *
	 * @return {HTMLStyleElement} The style element
	 */
	function getStyleElement() {
		let styleEl = document.getElementById(STYLE_ID);
		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.id = STYLE_ID;
			document.head.appendChild(styleEl);
		}
		return styleEl;
	}

	/**
	 * Build exclusion selector for template parts
	 *
	 * @param {string} element The text element to build exclusion for
	 * @return {string} CSS selector with exclusions
	 */
	function buildExclusionSelector(element) {
		const exclusions = TEMPLATE_PART_SELECTORS.map(
			(tpl) => `:not(${tpl} ${element})`
		).join('');
		return `body ${element}${exclusions}`;
	}

	/**
	 * Apply scale to target element and inject scaling CSS
	 *
	 * @param {number} scale        Scale value to apply
	 * @param {string} scaleScope   Scale scope setting ('full-page' or 'exclude-template')
	 * @param {string} customTarget Custom CSS selector (overrides scaleScope if provided)
	 */
	function applyScale(scale, scaleScope, customTarget) {
		// Set CSS custom property on :root for reference
		document.documentElement.style.setProperty(CSS_PROPERTY, scale);

		// Get or create style element
		const styleEl = getStyleElement();

		// If scale is 1 (default), remove scaling styles to preserve theme defaults
		if (Math.abs(scale - 1) < 0.01) {
			styleEl.textContent = '';
			return;
		}

		// Build the selector based on scope
		let selector;

		if (customTarget && customTarget.trim() !== '') {
			// Custom target selector takes precedence
			selector = TEXT_ELEMENTS.map((el) => `${customTarget} ${el}`).join(
				', '
			);
		} else if (scaleScope === 'exclude-template') {
			// Exclude template parts (header, footer, nav)
			selector = TEXT_ELEMENTS.map((el) =>
				buildExclusionSelector(el)
			).join(', ');
		} else {
			// Full page: target all text elements but exclude admin bar
			selector = TEXT_ELEMENTS.map(
				(el) => `body ${el}:not(#wpadminbar ${el})`
			).join(', ');
		}

		// Inject CSS that scales text elements using zoom
		// Zoom multiplies the element's rendered size without affecting layout flow
		// This preserves the theme's font-size values while scaling the visual output
		styleEl.textContent = `
			${selector} {
				zoom: ${scale};
			}
		`;
	}

	/**
	 * Save scale preference to localStorage
	 *
	 * @param {number} scale Scale value to save
	 */
	function saveScale(scale) {
		try {
			window.localStorage.setItem(STORAGE_KEY, scale.toString());
		} catch (e) {
			// localStorage not available, fail silently
		}
	}

	/**
	 * Get saved scale from localStorage
	 *
	 * @return {number|null} Saved scale or null if not found
	 */
	function getSavedScale() {
		try {
			const saved = window.localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const scale = parseFloat(saved);
				if (!isNaN(scale)) {
					return scale;
				}
			}
		} catch (e) {
			// localStorage not available
		}
		return null;
	}

	/**
	 * Update active states on button controls
	 *
	 * @param {HTMLElement} container Block container element
	 * @param {number}      scale     Current scale value
	 */
	function updateButtonStates(container, scale) {
		const buttons = container.querySelectorAll(
			'.wp-block-flextype-text-resizer__button'
		);
		buttons.forEach((button) => {
			const buttonScale = parseFloat(button.dataset.scale);
			const isActive = Math.abs(buttonScale - scale) < 0.01;
			button.classList.toggle(
				'wp-block-flextype-text-resizer__button--active',
				isActive
			);
			button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		});
	}

	/**
	 * Update active states on icon controls
	 *
	 * @param {HTMLElement} container Block container element
	 * @param {number}      scale     Current scale value
	 * @param {number}      minScale  Minimum scale
	 * @param {number}      maxScale  Maximum scale
	 */
	function updateIconStates(container, scale, minScale, maxScale) {
		const resetButton = container.querySelector('[data-action="reset"]');
		if (resetButton) {
			const isDefault = Math.abs(scale - 1) < 0.01;
			resetButton.classList.toggle(
				'wp-block-flextype-text-resizer__icon-button--active',
				isDefault
			);
			resetButton.setAttribute(
				'aria-pressed',
				isDefault ? 'true' : 'false'
			);
		}

		// Update disabled states for min/max
		const decreaseBtn = container.querySelector('[data-action="decrease"]');
		const increaseBtn = container.querySelector('[data-action="increase"]');

		if (decreaseBtn) {
			decreaseBtn.disabled = scale <= minScale;
		}
		if (increaseBtn) {
			increaseBtn.disabled = scale >= maxScale;
		}
	}

	/**
	 * Update slider value
	 *
	 * @param {HTMLElement} container Block container element
	 * @param {number}      scale     Current scale value
	 */
	function updateSliderValue(container, scale) {
		const slider = container.querySelector(
			'.wp-block-flextype-text-resizer__slider'
		);
		if (slider) {
			slider.value = scale;
		}
	}

	/**
	 * Update all controls in all blocks
	 *
	 * @param {number} scale Current scale value
	 */
	function updateAllControls(scale) {
		const blocks = document.querySelectorAll(BLOCK_SELECTOR);
		blocks.forEach((container) => {
			const controlStyle = container.dataset.controlStyle;
			const minScale = parseFloat(container.dataset.minScale);
			const maxScale = parseFloat(container.dataset.maxScale);

			if (controlStyle === 'dropdown') {
				updateDropdownValue(container, scale);
			} else if (controlStyle === 'buttons') {
				updateButtonStates(container, scale);
			} else if (controlStyle === 'slider') {
				updateSliderValue(container, scale);
			} else if (controlStyle === 'icons') {
				updateIconStates(container, scale, minScale, maxScale);
			}
		});
	}

	/**
	 * Initialize buttons control style
	 *
	 * @param {HTMLElement} container    Block container element
	 * @param {string}      scaleScope   Scale scope setting
	 * @param {string}      customTarget Custom target selector
	 * @param {number}      currentScale Current scale value
	 */
	function initButtons(container, scaleScope, customTarget, currentScale) {
		const buttons = container.querySelectorAll(
			'.wp-block-flextype-text-resizer__button'
		);

		buttons.forEach((button) => {
			button.addEventListener('click', () => {
				const scale = parseFloat(button.dataset.scale);
				applyScale(scale, scaleScope, customTarget);
				saveScale(scale);
				updateAllControls(scale);
			});
		});

		// Set initial active state
		updateButtonStates(container, currentScale);
	}

	/**
	 * Initialize slider control style
	 *
	 * @param {HTMLElement} container    Block container element
	 * @param {string}      scaleScope   Scale scope setting
	 * @param {string}      customTarget Custom target selector
	 * @param {number}      currentScale Current scale value
	 */
	function initSlider(container, scaleScope, customTarget, currentScale) {
		const slider = container.querySelector(
			'.wp-block-flextype-text-resizer__slider'
		);

		if (!slider) {
			return;
		}

		// Set initial value
		slider.value = currentScale;

		// Update on input (while dragging)
		slider.addEventListener('input', () => {
			const scale = parseFloat(slider.value);
			applyScale(scale, scaleScope, customTarget);
			updateAllControls(scale);
		});

		// Save on change (when released)
		slider.addEventListener('change', () => {
			const scale = parseFloat(slider.value);
			saveScale(scale);
		});
	}

	/**
	 * Update dropdown value
	 *
	 * @param {HTMLElement} container Block container element
	 * @param {number}      scale     Current scale value
	 */
	function updateDropdownValue(container, scale) {
		const select = container.querySelector(
			'.wp-block-flextype-text-resizer__select'
		);
		if (select) {
			select.value = scale;
		}
	}

	/**
	 * Initialize dropdown control style
	 *
	 * @param {HTMLElement} container    Block container element
	 * @param {string}      scaleScope   Scale scope setting
	 * @param {string}      customTarget Custom target selector
	 * @param {number}      currentScale Current scale value
	 */
	function initDropdown(container, scaleScope, customTarget, currentScale) {
		const select = container.querySelector(
			'.wp-block-flextype-text-resizer__select'
		);

		if (!select) {
			return;
		}

		// Set initial value
		select.value = currentScale;

		// Update on change
		select.addEventListener('change', () => {
			const scale = parseFloat(select.value);
			applyScale(scale, scaleScope, customTarget);
			saveScale(scale);
			updateAllControls(scale);
		});
	}

	/**
	 * Initialize icons control style
	 *
	 * @param {HTMLElement} container    Block container element
	 * @param {string}      scaleScope   Scale scope setting
	 * @param {string}      customTarget Custom target selector
	 * @param {number}      currentScale Current scale value
	 * @param {number}      minScale     Minimum scale
	 * @param {number}      maxScale     Maximum scale
	 */
	function initIcons(
		container,
		scaleScope,
		customTarget,
		currentScale,
		minScale,
		maxScale
	) {
		const step = 0.1;

		const decreaseBtn = container.querySelector('[data-action="decrease"]');
		const resetBtn = container.querySelector('[data-action="reset"]');
		const increaseBtn = container.querySelector('[data-action="increase"]');

		let scale = currentScale;

		if (decreaseBtn) {
			decreaseBtn.addEventListener('click', () => {
				scale = Math.max(minScale, scale - step);
				scale = Math.round(scale * 100) / 100;
				applyScale(scale, scaleScope, customTarget);
				saveScale(scale);
				updateAllControls(scale);
			});
		}

		if (resetBtn) {
			resetBtn.addEventListener('click', () => {
				scale = 1;
				applyScale(scale, scaleScope, customTarget);
				saveScale(scale);
				updateAllControls(scale);
			});
		}

		if (increaseBtn) {
			increaseBtn.addEventListener('click', () => {
				scale = Math.min(maxScale, scale + step);
				scale = Math.round(scale * 100) / 100;
				applyScale(scale, scaleScope, customTarget);
				saveScale(scale);
				updateAllControls(scale);
			});
		}

		// Set initial states
		updateIconStates(container, currentScale, minScale, maxScale);
	}

	/**
	 * Initialize a single FlexType block
	 *
	 * @param {HTMLElement} container Block container element
	 */
	function initBlock(container) {
		const scaleScope = container.dataset.scaleScope || 'exclude-template';
		const customTarget = container.dataset.targetSelector || '';
		const controlStyle = container.dataset.controlStyle || 'buttons';
		const minScale = parseFloat(container.dataset.minScale) || 1;
		const maxScale = parseFloat(container.dataset.maxScale) || 1.2;

		// Get saved scale or use default (1.0)
		let currentScale = getSavedScale();
		if (currentScale === null) {
			currentScale = 1;
		}

		// Clamp to valid range
		currentScale = Math.max(minScale, Math.min(maxScale, currentScale));

		// Apply saved scale (only injects CSS if scale !== 1)
		applyScale(currentScale, scaleScope, customTarget);

		// Initialize based on control style
		if (controlStyle === 'dropdown') {
			initDropdown(container, scaleScope, customTarget, currentScale);
		} else if (controlStyle === 'buttons') {
			initButtons(container, scaleScope, customTarget, currentScale);
		} else if (controlStyle === 'slider') {
			initSlider(container, scaleScope, customTarget, currentScale);
		} else if (controlStyle === 'icons') {
			initIcons(
				container,
				scaleScope,
				customTarget,
				currentScale,
				minScale,
				maxScale
			);
		}
	}

	/**
	 * Handle storage events for cross-tab sync
	 *
	 * @param {StorageEvent} event Storage event
	 */
	function handleStorageChange(event) {
		if (event.key !== STORAGE_KEY) {
			return;
		}

		const scale = parseFloat(event.newValue);
		if (isNaN(scale)) {
			return;
		}

		// Get scope settings from first block
		const firstBlock = document.querySelector(BLOCK_SELECTOR);
		const scaleScope = firstBlock
			? firstBlock.dataset.scaleScope || 'exclude-template'
			: 'exclude-template';
		const customTarget = firstBlock
			? firstBlock.dataset.targetSelector || ''
			: '';

		applyScale(scale, scaleScope, customTarget);
		updateAllControls(scale);
	}

	/**
	 * Initialize all FlexType blocks on the page
	 */
	function init() {
		const blocks = document.querySelectorAll(BLOCK_SELECTOR);

		if (blocks.length === 0) {
			return;
		}

		// Initialize each block
		blocks.forEach(initBlock);

		// Listen for storage changes (cross-tab sync)
		window.addEventListener('storage', handleStorageChange);
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
