(function () {
	const burgerSelector = '.icon-menu__icon';
	const burgerMenuSelector = '.icon-menu__body'
	const burger = document.querySelector(`${burgerSelector}`);
	const burgerMenu = document.querySelector(`${burgerMenuSelector}`);
	const burgerParentSelector = '.' + burger.parentElement.getAttribute('class').split(' ').join('.');
	const body = document.querySelector('body');
	function toggleScroll() {
		if (burger.classList.contains(`${burgerSelector}_active`.slice(1))) {
			body.setAttribute('style', 'overflow: hidden;')
		} else body.removeAttribute('style');
	}
	if (burger) {
		burger.addEventListener('click', () => {
			burger.classList.toggle(`${burgerSelector}_active`.slice(1));
			burgerMenu.classList.toggle(`${burgerMenuSelector}_active`.slice(1));
		})
		document.addEventListener('click', (e) => {
			if (!(e.target.closest(burgerParentSelector))) {
				burger.classList.remove(`${burgerSelector}_active`.slice(1));
				burgerMenu.classList.remove(`${burgerMenuSelector}_active`.slice(1));
			}
			toggleScroll();
		})
	}
})()
