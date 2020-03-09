{
	'use strict';

	const $ = document.getElementById.bind(document);
	const
		$mode = $('mode'),
		$top = $('top'), $bottom = $('bottom')
		$result = $('result');

	const seq = (from, to) => to >= from ? Array(to - from + 1).fill(0).map((_, i) => i + from) : [];
	const modes = {
		'C': {
			next: 'A',
			compute: (bottom, top) => ((a, b) => b.map(_ => _ - 1).reduce((r, i) => r * a[i] / b[i], 1))(seq(bottom - top + 1, bottom), seq(1, top)),
		},
		'A': {
			next: 'C',
			compute: (bottom, top) => seq(bottom - top + 1, bottom).reduce((r, _) => r * _, 1),
		},
	};
	let mode;
	function toggleMode() { mode = modes[$mode.innerText = mode.next]; }

	function filterInput(e) {
		if(!(e.key.match(/^[0-9]$/) || e.key === 'Backspace')) {
			const value = this.value;
			this.addEventListener('keyup', () => this.value = value, { once: true });
			return false;
		}
	}

	const isPositiveInteger = _ => !isNaN(_) && ~~_ === _ && _ > 0;
	const validateRange = (bottom, top) => isPositiveInteger(bottom) && isPositiveInteger(top) && bottom >= top;

	function computeAndDisplay() {
		const [bottom, top] = [+$bottom.value, +$top.value];
		$result.innerText = validateRange(bottom, top) ? mode.compute(bottom, top) : 'Error';
	}

	function initialize() {
		mode = modes[$mode.innerText = 'C'];
		$top.value = Math.floor(Math.random() * (($bottom.value = Math.floor(Math.random() * 10) + 5) - 1)) + 1;
		computeAndDisplay();
		$mode.addEventListener('click', toggleMode);
		$mode.addEventListener('click', computeAndDisplay);
		[$top, $bottom].forEach(_ => _.addEventListener('keydown', filterInput));
		[$top, $bottom].forEach(_ => _.addEventListener('keyup', setTimeout.bind(null, computeAndDisplay)));
	}
	initialize();
}