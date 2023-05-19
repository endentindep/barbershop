(function () {
	const elems = document.querySelectorAll('[data-da]');
	let width = document.documentElement.clientWidth;
	let list = {};
	for (const i of elems) {
		let pos = null;
		let to;
		let dispWidth;
		const data = i.getAttribute('data-da') ? i.getAttribute('data-da').split(' ') : null
		if (data) {
			for (const t of data) {
				if (((t.includes('max') || t.includes('min'))) && (isFinite(t.replace('min', '')) || isFinite(t.replace('max', ''))) ||
					isFinite(t)
				) {
					if (t.includes('max') || isFinite(t)) {
						dispWidth = window.matchMedia(`(max-width:${t.replace('max', '')}px)`)
					} else dispWidth = window.matchMedia(`(min-width:${t.replace('min', '')}px)`)
				} else if (t.startsWith('.')) {
					to = t;
				} else if (t.includes('#')) {
					pos = t.replaceAll('#', '');
				}
			}
			if (list.hasOwnProperty(i.parentElement.classList)) {
				list[i.parentElement.classList].push({
					'elem': i,
					'to': document.querySelector(to),
					'width': dispWidth,
					'parent': i.parentElement,
					'pos': pos,
					'sib': i.nextSibling
				});
			} else {
				list[i.parentElement.classList] = [{
					'elem': i,
					'to': document.querySelector(to),
					'width': dispWidth,
					'parent': i.parentElement,
					'pos': pos,
					'sib': i.nextSibling
				}];
			}
		}
	}
	for (let i in list) {
		if (list[i].length !== 1) {
			list[i].sort((a, b) => a.pos - b.pos);
		}
	}
	function find(elem, arr) {
		if (elem.parent.contains(elem.sib)) {
			return elem.sib;
		} else {
			for (const i of arr) {
				if (elem.sib === i.elem) {
					return find(i, arr);
				}
			}
		}
	}
	for (const arr in list) {
		for (const i of list[arr]) {
			if (i.width.matches) {
				if (i.pos && i.pos <= i.to.childElementCount - 1) {
					if (i.pos <= 0) {
						i.to.prepend(i.elem);
					} else if (i.pos <= i.to.childElementCount - 1) {
						const ref = i.to.children[i.pos];
						ref.parentElement.insertBefore(i.elem, ref);
					}
				} else i.to.append(i.elem);
			}
			i.width.onchange = () => {
				if (i.width.matches) {
					if (i.pos && i.pos <= i.to.childElementCount - 1) {
						if (i.pos <= 0) {
							i.to.prepend(i.elem);
						} else if (i.pos <= i.to.childElementCount - 1) {
							const ref = i.to.children[i.pos];
							ref.parentElement.insertBefore(i.elem, ref);
						}
					} else i.to.append(i.elem);
				} else {
					if (i.sib) {
						i.parent.insertBefore(i.elem, find(i, list[arr]));
					} else {
						i.parent.append(i.elem)
					}
				}
			}
		}
	}
})()