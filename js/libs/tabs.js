(() => {
	function wrapTabs(pairs) {
		const body = pairs[0][1].parentElement;
		for (const pair of pairs) {
			const newNode = body.cloneNode();
			newNode.append(pair[1]);
			pair[0].after(newNode);
		}
		body.remove();
	}
	function recoverTabs(pairs) {
		const body = pairs[0][1].parentElement.cloneNode();
		pairs[0][0].parentElement.after(body);
		for (const pair of pairs) {
			const lastBody = pair[1].parentElement;
			body.append(pair[1]);
			lastBody.remove();
		}
	}
	const elems = document.querySelectorAll('[data-tabs]');
	for (const elem of elems) {
		const buttons = elem.querySelectorAll('[data-tabs]>nav>button');
		const contents = elem.querySelectorAll('[data-tabs]>:not(nav)>*');
		let media = elem.getAttribute('data-tabs');
		if (media) {
			if (media.includes('min')) {
				media = window.matchMedia(`(min-width: ${media.replace('min', '')}px)`)
			} else {
				media = window.matchMedia(`(max-width: ${media.replace('max', '')}px)`)
			}
		}
		let pairs = [];
		let active = [];
		for (let i = 0; i < buttons.length; i++) {
			pairs.push([buttons[i], contents[i]]);
		}
		buttons[0].classList.add('tabs__title_active');
		contents[0].classList.add('tabs__content_active');
		active = [buttons[0], contents[0]];
		if (media) {
			if (media.matches) wrapTabs(pairs);
			media.addEventListener('change', () => {
				if (media.matches) {
					wrapTabs(pairs);
				} else {
					recoverTabs(pairs);
				}
			})
		}
		for (const pair of pairs) {
			pair[0].addEventListener('click', () => {
				if (!(pair[0].classList.contains('tabs__title_active'))) {
					pair[0].classList.add('tabs__title_active');
					pair[1].classList.add('tabs__content_active');
					active[0].classList.remove('tabs__title_active');
					active[1].classList.remove('tabs__content_active');
					active[0] = pair[0];
					active[1] = pair[1];
				}
			})
		}
	}
})()