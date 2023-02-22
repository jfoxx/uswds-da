import { getMetadata, decorateIcons } from '../../scripts/lib-franklin.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');


function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  block.textContent = '';
  document.querySelector('header').classList.add('usa-header', 'usa-header--basic');


  // fetch nav content
  const navPath = getMetadata('nav') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`, window.location.pathname.endsWith('/nav') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate nav DOM
    const navContainer = document.createElement('div');
    navContainer.className = 'usa-nav-container';
    navContainer.innerHTML = html;

    const classes = ['usa-navbar', 'usa-nav'];
    classes.forEach((c, i) => {
      const section = navContainer.children[i];
      if (section) section.classList.add(c);
    });



   //make the navbar
   const logo = document.createElement('div');
   logo.className = 'usa-logo';
   logo.id = 'basic-logo';
   const logoContents = navContainer.querySelector('.usa-navbar').innerHTML;
   logo.innerHTML = logoContents;
   logo.querySelector('p').className ='usa-logo__text';
   const picture = logo.querySelector('picture');
   picture.parentNode.className = 'usa-logo__text--img';
   const menuButton = document.createElement('button');
   menuButton.className = 'usa-menu-btn';
   menuButton.setAttribute('type', 'button');
   menuButton.innerText = 'Menu';
   logo.append(menuButton);
   navContainer.querySelector('.usa-navbar').innerHTML = '';
   navContainer.querySelector('.usa-navbar').append(logo);
  
   //make primary nav

  const nav = document.createElement('nav');
  const clone = navContainer.querySelector('div.usa-nav');
  nav.className = 'usa-nav';
  nav.setAttribute('aria-label','Primary navigation');
  nav.innerHTML = clone.innerHTML;
  clone.remove();
  navContainer.append(nav);
  const navUl = nav.querySelector(':scope > ul');
  navUl.classList.add('usa-nav__primary','usa-accordion');
  const primaryItems = navUl.querySelectorAll(':scope > li');
  primaryItems.forEach((i) => {
    i.className = 'usa-nav__primary-item';
    i.querySelector('a').className = 'usa-nav-link';
    if(i.querySelector('ul')) {
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

    block.append(navContainer);

    
   
  }
}