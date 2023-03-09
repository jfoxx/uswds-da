import {
  decorateBlock,
  buildBlock,
  loadBlock,
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  readBlockConfig,
  toClassName,
  toCamelCase,
} from './lib-franklin.js';

/**
 * Grab the current URL and search for a given keyword
 * @param {string} keyword The keyword to search for in the current window's URL
 * @returns {true} if keyword exists
 */
export function checkPath(keyword) {
  const path = window.location.pathname;
  let a = false;
  if (path.indexOf(keyword) > -1) {
    a = true;
  } else {
    a = false;
  }
  return a;
}

let contentOnly = false;

if (checkPath('block-library')) {
  contentOnly = true;
}

/**
 * Convience method for creating tags in one line of code
 * @param {string} tag Tag to create
 * @param {object} attributes Key/value object of attributes
 * @param {HTMLElement | HTMLElement[] | string} children Child element
 * @returns {HTMLElement} The created tag
 */
export function createTag(tag, attributes, children) {
  const element = document.createElement(tag);
  if (children) {
    if (children instanceof HTMLElement
      || children instanceof SVGElement
      || children instanceof DocumentFragment) {
      element.append(children);
    } else if (Array.isArray(children)) {
      element.append(...children);
    } else {
      element.insertAdjacentHTML('beforeend', children);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      element.setAttribute(key, val);
    });
  }
  return element;
}

/**
 * Decorates all sections in a container element.
 * @param {Element} $main The container element
 */
export function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((e) => {
      if (e.tagName === 'DIV' || !defaultContent) {
        const wrapper = document.createElement('div');
        if (contentOnly) {
          // do nothing
        } else { wrapper.classList.add('grid-container'); }
        wrappers.push(wrapper);
        defaultContent = e.tagName !== 'DIV';
        if (defaultContent) wrapper.classList.add('default-content-wrapper');
      }
      wrappers[wrappers.length - 1].append(e);
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section', 'usa-section');
    section.setAttribute('data-section-status', 'initialized');
    section.style.display = 'none';

    /* process section metadata */
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = readBlockConfig(sectionMeta);
      Object.keys(meta).forEach((key) => {
        if (key === 'style') {
          const styles = meta.style.split(',').map((style) => toClassName(style.trim()));
          styles.forEach((style) => section.classList.add(`usa-section--${style}`));
        } else {
          section.dataset[toCamelCase(key)] = meta[key];
        }
      });
      sectionMeta.parentNode.remove();
    }
  });
}

/**
 * decorates paragraphs containing a single link as buttons.
 * @param {Element} element container element
 */

export function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'usa-button bg-primary hover:bg-primary-darker'; // default
          up.classList.add('button-container');
        }
        if (up.childNodes.length === 1 && up.tagName === 'STRONG'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'usa-button bg-primary hover:bg-primary-darker';
          twoup.classList.add('button-container');
        }
        if (up.childNodes.length === 1 && up.tagName === 'EM'
          && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'usa-button bg-secondary hover:bg-secondary-dark';
          twoup.classList.add('button-container');
        }
      }
    }
  });
}

const LCP_BLOCKS = ['banner', 'hero']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here

function loadBanner(body) {
  const bannerWrapper = document.createElement('div');
  const bannerBlock = buildBlock('banner', '');
  body.prepend(bannerWrapper);
  bannerWrapper.append(bannerBlock);
  decorateBlock(bannerBlock);
  return loadBlock(bannerBlock);
}

function skipNav(body) {
  const link = document.createElement('a');
  link.classList.add('usa-skipnav');
  link.href = '#main-content';
  link.innerText = 'Skip to main content';
  body.prepend(link);
}

function decorateHeadlines(main) {
  const headings = main.querySelectorAll('h2');
  headings.forEach((h) => {
    h.classList.add('font-heading-xl', 'margin-top-0', 'tablet:margin-bottom-0');
  });
}

function proseText(main) {
  const prose = main.querySelectorAll('p>u');
  prose.forEach((p) => {
    const text = p.innerHTML;
    const parent = p.parentElement;
    const parentDiv = parent.parentElement;
    p.remove();
    parent.append(text);
    parentDiv.classList.add('usa-prose');
  });
}
/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */

function buildAutoBlocks() {
  try {
  //  buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateHeadlines(main);
  proseText(main);
  main.id = 'main-content';
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  if (contentOnly) {
    // do nothing
  } else { loadBanner(doc.querySelector('body')); }
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.parentElement.replaceChild(link, existingLink);
  } else {
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

/**
 * loads everything that doesn't need to be delayed.
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();
  if (contentOnly) {
    // do nothing
  } else {
    loadHeader(doc.querySelector('body > header'));
    loadFooter(doc.querySelector('body > footer'));
    skipNav(doc.querySelector('body'));
  }

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.svg`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * loads everything that happens a lot later, without impacting
 * the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

(function uswdsInit() {
  const loadingClass = 'usa-js-loading';
  let fallback = '';

  document.documentElement.classList.add(loadingClass);
  function revertClass() {
    document.documentElement.classList.remove(loadingClass);
  }

  fallback = setTimeout(revertClass, 8000);

  function verifyLoaded() {
    if (window.uswdsPresent) {
      clearTimeout(fallback);
      revertClass();
      window.removeEventListener('load', verifyLoaded, true);
    }
  }

  window.addEventListener('load', verifyLoaded, true);
}());

const uswds = document.createElement('script');
const body = document.querySelector('body');
uswds.async = 'true';
uswds.src = '/scripts/uswds.js';
body.append(uswds);
