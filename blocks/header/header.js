import { getMetadata } from '../../scripts/lib-franklin.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';
  document.querySelector('body > header').classList.add('usa-header', 'usa-header--extended');

  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`, window.location.pathname.endsWith('/nav') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    block.innerHTML = html;

    const classes = ['usa-navbar', 'usa-nav'];
    classes.forEach((c, i) => {
      const section = block.children[i];
      if (section) section.classList.add(c);
    });

    // make the navbar
    const logo = document.createElement('div');
    logo.className = 'usa-logo';
    logo.id = 'extended-logo';
    const logoContents = block.children[0].innerHTML;
    logo.innerHTML = logoContents;
    logo.querySelector('p').className = 'usa-logo__text';
    const siteName = logo.innerText.replace(/(\r\n|\n|\r)/gm, '').trim();
    const picture = logo.querySelector('picture');
    picture.parentNode.className = 'usa-logo__text--img';
    const img = picture.querySelector('img');
    img.setAttribute('aria-label', `Logo for ${siteName}`);
    const menuButton = document.createElement('button');
    menuButton.className = 'usa-menu-btn';
    menuButton.setAttribute('type', 'button');
    menuButton.innerText = 'Menu';
    logo.append(menuButton);
    block.children[0].innerHTML = '';
    block.children[0].append(logo, menuButton);

    // make primary nav

    const nav = document.createElement('nav');
    const clone = block.children[1];
    nav.className = 'usa-nav';
    nav.setAttribute('aria-label', 'Primary navigation');
    const inner = document.createElement('div');
    inner.className = 'usa-nav__inner';
    inner.innerHTML = clone.innerHTML;
    clone.remove();
    const close = document.createElement('button');
    close.className = 'usa-nav__close';
    const closeImg = document.createElement('img');
    closeImg.setAttribute('alt', 'close');
    closeImg.setAttribute('src', '/icons/usa-icons/close.svg');
    close.append(closeImg);
    inner.prepend(close);
    const navUl = inner.querySelector(':scope > ul');
    navUl.classList.add('usa-nav__primary', 'usa-accordion');
    const primaryItems = navUl.querySelectorAll(':scope > li');
    primaryItems.forEach((i) => {
      i.className = 'usa-nav__primary-item';
      i.querySelector('a').className = 'usa-nav-link';
      if (i.querySelector('ul')) {
        const btn = document.createElement('button');
        btn.setAttribute('type', 'buton');
        btn.classList.add('usa-accordion__button', 'usa-nav__link');
        btn.setAttribute('aria-expanded', 'false');
        const content = i.innerHTML;
        btn.innerHTML = content;
        btn.querySelector('ul').remove();
        i.innerHTML = '';
        i.prepend(btn);
      }
    });

    // Create the secondary links section

    const secondary = document.createElement('div');
    secondary.className = 'usa-nav__secondary';
    const secondaryClone = inner.children[2].querySelector('ul').innerHTML;
    const secondaryUl = document.createElement('ul');
    secondaryUl.classList.add('usa-nav__secondary-links');
    secondaryUl.innerHTML = secondaryClone;
    secondaryUl.querySelectorAll('li').forEach((i) => { i.className = 'usa-nav__secondary-item'; });
    inner.children[2].remove();
    secondary.append(secondaryUl);

    // Search form
    const search = document.createElement('form');
    search.classList.add('usa-search', 'usa-search--small');
    search.setAttribute('action', '/search/');
    search.setAttribute('method', 'get');
    const searchDiv = document.createElement('div');
    searchDiv.setAttribute('role', 'search');
    const label = document.createElement('label');
    label.className = 'usa-sr-only';
    label.setAttribute('for', 'extended-search-field-small');
    label.innerText = 'Search';
    const field = document.createElement('input');
    field.classList.add('usa-input', 'usagov-search-autocomplete', 'ui-autocomplete-input');
    field.id = 'extended-search-field-small';
    field.setAttribute('type', 'search');
    field.setAttribute('name', 'query');
    field.setAttribute('autocomplete', 'off');
    const button = document.createElement('button');
    button.className = 'usa-button';
    button.setAttribute('type', 'submit');
    const buttonImg = document.createElement('img');
    buttonImg.className = 'usa-search__submit-icon';
    buttonImg.setAttribute('alt', 'Search');
    buttonImg.src = '/icons/usa-icons-bg/search--white.svg';
    button.append(buttonImg);
    searchDiv.append(label, field, button);
    search.append(searchDiv);
    secondary.append(search);

    inner.append(secondary);

    nav.append(inner);
    block.append(nav);
  }
}
