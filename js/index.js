import('./libs/icon-menu.js');
import('./libs/spoller.js');
import('./libs/dynamic-adaptive.js');
import('./libs/swiper.js');
import('./libs/tabs.js');

(function () {
	const button = document.querySelector('.search__icon');
	const body = document.querySelector('.search__body');
	const close = document.querySelector('.search__close');
	const input = document.querySelector('.search__input');
	function remAtr() {
		close.removeAttribute('tabindex')
		input.removeAttribute('tabindex')
	}
	function setAtr() {
		close.setAttribute('tabindex', '-1')
		input.setAttribute('tabindex', '-1')
	}
	setAtr()
	button.onclick = () => {
		body.classList.add('search__body_active')
		remAtr()
	}
	close.onclick = () => {
		body.classList.remove('search__body_active')
		setAtr()
	}
	document.addEventListener('click', (e) => {
		if (!(e.target.closest('.search'))) {
			body.classList.remove('search__body_active')
			setAtr()
		}
	})
})();

(function () {
	const header = document.querySelector('.header');
	document.addEventListener('scroll', () => {
		if (window.scrollY !== 0) {
			header.classList.add('header_scrolled');
		} else {
			header.classList.remove('header_scrolled');
		}
	})
})();

//animations

function addClass(targetSelector, mainElemSelector, className) {
	const elem = document.querySelectorAll(mainElemSelector);
	const target = document.querySelector(targetSelector);
	elem.forEach((item) => {
		let rect = target.getBoundingClientRect();
		let minY = window.innerHeight - target.offsetHeight / 2;
		if (rect.y <= minY) {
			item.classList.add(className);
		}
		document.addEventListener('scroll', () => {
			rect = target.getBoundingClientRect();
			if (rect.y <= minY) {
				item.classList.add(className);
			}
		})
	})
}

//first-page
(function () {
	const title = document.querySelector('.content-first-page__title');
	const subtitle = document.querySelector('.content-first-page__subtitle');
	setTimeout(() => {
		title.classList.add('content-first-page__title_animation');
		setTimeout(() => {
			subtitle.classList.add('content-first-page__subtitle_animation');
		}, 500);
	}, 600);
})();

//about

addClass('.about', '.about__exp', 'about__exp_animation');
addClass('.about', '.content-about__title', 'content-about__title_animation');
addClass('.about', '.content-about__text', 'content-about__text_animation');
addClass('.about', '.content-about__more', 'content-about__more_animation');
addClass('.main-services', '.main-services__slider', 'main-services__slider_animation');
addClass('.main-services', '.tabs-services__title', 'tabs-services__title_animation');
addClass('.main-services', '.tabs', 'tabs_animation');
addClass('.main-services', '.buttons-tabs', 'buttons-tabs_animation');
addClass('.specials-services', '.specials-services', 'specials-services_animation');

//gallery

addClass('.gallery', '.gallery .slider__title', 'slider__title_animation');
addClass('.gallery', '.gallery .slider__slider', 'slider__slider_animation');

//barbers

addClass('.barbers', '.barbers .slider__title', 'slider__title_animation');
addClass('.barbers', '.barbers .slider__slider', 'slider__slider_animation');

//feedbacks

addClass('.feedbacks__title', '.feedbacks__title', 'feedbacks__title_animation');
addClass('.feedbacks__subtitle', '.feedbacks__subtitle', 'feedbacks__subtitle_animation');
addClass('.feedbacks__slider', '.feedbacks__slider', 'feedbacks__slider_animation');

//contacts

addClass('.contacts__title', '.contacts__title', 'contacts__title_animation');
addClass('.contacts__content', '.contacts__item', 'contacts__item_animation');

//buttons

addClass('.buttons__container', '.buttons__appointment', 'buttons__appointment_animation');
addClass('.buttons__container', '.buttons__telephone', 'buttons__telephone_animation');
addClass('.buttons__container', '.buttons__offer-call', 'buttons__offer-call_animation');