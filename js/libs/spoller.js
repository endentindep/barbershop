(function () {
	const spollersClass = 'spollers';
	const spollerClass = 'spoller';
	const spollerTitleClass = 'spoller__title';
	const spollerBodyClass = 'spoller__body';
	const spollerInitClass = 'spoller_initialized';
	const spollersInitClass = 'spollers_initialized';
	const spollerActiveClass = 'spoller_active';
	const mediaHover = window.matchMedia('((any-hover: hover))');
	const collapseStyle = 'height: 0px; padding-top: 0px; padding-bottom: 0px; margin: 0px; border-width: 0px;';
	const defaultParams = {
		accordion: false,
		hover: true,
		select: false,
		nesting: true,
		animated: true,
		media: false
	};
	function getAllClasses(elem) {
		return `.${elem.getAttribute('class').replace(' ', '.')}`
	}
	function hideSpollerAnim(spoller) {
		if (!(spoller.body.hasAttribute('style'))) {
			spoller.body.style.cssText = `height:${spoller.body.offsetHeight}px`;
		}
		setTimeout(() => {
			if (!(spoller.main.classList.contains(`${spollerActiveClass}`))) {
				spoller.body.style.cssText = collapseStyle;
			} else {
				spoller.body.removeAttribute('style');
			}
		}, 1)
		spoller.main.classList.remove(`${spollerActiveClass}`);
	}
	function showSpollerAnim(spoller) {
		const clone = spoller.body.cloneNode(true);
		clone.style.cssText = `top:0;left:0;position:fixed;`;
		spoller.main.appendChild(clone);
		spoller.body.style.cssText = `height:${clone.offsetHeight}px`;
		spoller.main.classList.add(`${spollerActiveClass}`);
		clone.remove();
	}
	function hideSpollerNoAnim(spoller) {
		spoller.main.classList.remove(`${spollerActiveClass}`);
	}
	function showSpollerNoAnim(spoller) {
		spoller.main.classList.add(`${spollerActiveClass}`);
	}
	function spollerInitializeAnim(spoller) {
		spoller.body.style.cssText = `${collapseStyle} transition: none;`;
		spoller.main.classList.add(`${spollerInitClass}`);
	}
	function spollerInitializeNoAnim(spoller) {
		spoller.main.classList.add(`${spollerInitClass}`);
	}
	function spollerDeinitialize(spoller) {
		spoller.main.classList.remove(`${spollerInitClass}`);
		spoller.main.classList.remove(`${spollerActiveClass}`)
		spoller.body.style.cssText = '';
	}
	function clickSelectHandler(spoller, elem) {
		if (elem !== spoller.selected) {
			spoller.button.append(elem);
			spoller.body.prepend(spoller.selected);
			spoller.selected = elem;
			hideSpoller(spoller);
		}
	}
	class Spollers {
		hideNestingSpollers(spoller, spollers) {
			if (spoller.spollersNesting) {
				for (const i of spollers) {
					if (Array.from(spoller.spollersNesting).includes(i.main)) {
						this.hideSpoller(i);
					}
				}
			}
		}
		clickCommonHandler(spoller) {
			if (this.params.accordion) {
				if (!(spoller.main.classList.contains(`${spollerActiveClass}`))) {
					this.showSpoller(spoller)
				} else this.hideSpoller(spoller);
				for (const i of this.spollers) {
					if (i !== spoller) {
						if (i.main.classList.contains(`${spollerActiveClass}`)) {
							i.main.classList.remove(`${spollerActiveClass}`);
							this.hideSpoller(i);
						}
					}
				}
			} else if (this.params.nesting) {
				if (!(spoller.main.classList.contains(`${spollerActiveClass}`))) {
					this.showSpoller(spoller)
				} else {
					this.hideNestingSpollers(spoller, this.spollers);
					this.hideSpoller(spoller);
				}
			} else {
				if (!(spoller.main.classList.contains(`${spollerActiveClass}`))) {
					this.showSpoller(spoller)
				} else this.hideSpoller(spoller);
			}
		}

		constructor(ref, params) {
			this.params = { ...defaultParams, ...params };
			if (this.params.media && (typeof this.params.media === 'string' || typeof this.params.media === 'number') && this.params.media !== '0') {
				this.params.media = this.params.media.toString();
				if (isFinite(this.params.media) && this.params.media !== '') {
					this.params.media = window.matchMedia(`(max-width: ${this.params.media.replace('max', '')}px)`)
				} else if (this.params.media.includes('min') && this.params.media.replace('min', '') !== '') {
					this.params.media = window.matchMedia(`(min-width: ${this.params.media.replace('min', '')}px)`)
				} else this.params.media = false
			} else this.params.media = false
			this.hideSpoller = this.params.animated ? hideSpollerAnim : hideSpollerNoAnim;
			this.showSpoller = this.params.animated ? showSpollerAnim : showSpollerNoAnim;
			this.init = this.params.animated ? spollerInitializeAnim : spollerInitializeNoAnim;
			this.mainElem = document.querySelector(ref);
			this.spollers = [];
			for (const spoller of this.mainElem.querySelectorAll(`.${spollerClass}`)) {
				let spollerData = spoller.getAttribute('data-spoller');
				let spollerMedia;
				if (spollerData) {
					for (const i of spollerData.split(' ')) {
						if (isFinite(i)) {
							spollerMedia = window.matchMedia(`(max-width: ${i}px)`)
						} else if (i.includes('min')) {
							spollerMedia = window.matchMedia(`(min-width: ${i.replace('min', '')}px)`)
						}
					}
				}
				const curSpoller = this.spollers[this.spollers.push({
					main: spoller,
					button: spoller.querySelector(`.${spollerTitleClass}`),
					body: spoller.querySelector(`.${spollerBodyClass}`),
					media: spollerMedia ? spollerMedia : false,
					selected: null
				}) - 1];
				curSpoller.body.removeAttribute('style');
				if (curSpoller.media) {
					if (curSpoller.media.matches) {
						this.init(curSpoller);
					}
					curSpoller.media.addEventListener('change', (e) => {
						if (this.params.media) {
							if (this.params.media.matches && e.matches) {
								this.init(curSpoller)
							} else spollerDeinitialize(curSpoller)
						} else if (e.matches) {
							this.init(curSpoller)
						} else {
							spollerDeinitialize(curSpoller)
						}
					})
				} else if (this.params.media) {
					if (this.params.media.matches) {
						this.init(curSpoller);
					}
				} else this.init(curSpoller);
				if (this.params.nesting) {
					const spollersNesting = curSpoller.body.querySelectorAll(`.${spollerClass}`);
					if (spollersNesting.length !== 0) {
						curSpoller.spollersNesting = spollersNesting;
					}
				}

				if (this.params.hover && mediaHover.matches) {
					curSpoller.button.onmouseenter = () => {
						if (curSpoller.main.classList.contains(`${spollerInitClass}`)) {
							this.showSpoller(curSpoller)
						}
					}
					if (this.params.nesting && curSpoller.spollersNesting) {
						curSpoller.main.onmouseleave = () => {
							if (curSpoller.main.classList.contains(`${spollerInitClass}`)) {
								this.hideNestingSpollers(curSpoller, this.spollers);
								this.hideSpoller(curSpoller)
							}
						}
					} else curSpoller.main.onmouseleave = () => {
						if (curSpoller.main.classList.contains(`${spollerInitClass}`)) {
							this.hideSpoller(curSpoller)
						}
					}
				} else {
					document.addEventListener('click', (e) => {
						const isSpoller = e.target.closest(`.${spollerClass}`);
						if (isSpoller) {
							if (isSpoller.closest(`.${spollerClass}`).closest(`.${spollersClass}`) === curSpoller.main.closest(`.${spollersClass}`)) {
								return
							}
						}
						if ((curSpoller.main.classList.contains(`${spollerActiveClass}`))) {
							this.hideSpoller(curSpoller);
						}
					})
					curSpoller.button.onclick = () => {
						if (curSpoller.main.classList.contains(`${spollerInitClass}`)) {
							this.clickCommonHandler(curSpoller)
						}
					};
				}
				if (this.params.animated) {
					curSpoller.body.addEventListener('transitionend', () => {
						if (curSpoller.body.style.cssText !== collapseStyle) {
							curSpoller.body.removeAttribute('style');
						}
					})
				}
				if (this.params.select) {
					const curSelected = curSpoller.button.children[0];
					curSpoller.selected = curSelected;
					curSpoller.selected.onclick = () => {
						if (curSpoller.classList.contains(spollerInitClass)) {
							this.clickSelectHandler(curSpoller, curSelected)
						}
					}
					for (const option of curSpoller.body.querySelectorAll(`${getAllClasses(curSpoller.body)}>*`)) {
						option.onclick = () => {
							if (curSpoller.classList.contains(spollerInitClass)) {
								this.clickSelectHandler(curSpoller, option)
							}
						}
					}
				}
			}
			if (this.params.media) {
				if (this.params.media.matches) {
					this.mainElem.classList.add(`.${spollersInitClass}`);
				}
				this.params.media.addEventListener('change', (e) => {
					if (e.matches) {
						this.mainElem.classList.add(`.${spollersInitClass}`);
						this.spollers.forEach(a => {
							if (a.media) {
								if (a.media.matches) {
									this.init(a)
								}
							} else this.init(a)
						})
					} else {
						this.mainElem.classList.remove(`.${spollersInitClass}`);
						this.spollers.forEach(spoller => {
							spollerDeinitialize(spoller);
						})
					}
				})
			} else {
				this.mainElem.classList.add(`.${spollersInitClass}`);
			}
		}
	}
	new Spollers('.header__menu', {
		animated: false
	})
	new Spollers('.links__container', {
		media: 600.5,
		accordion: true,
		hover: false
	})
})()
