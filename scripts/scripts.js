import {
  decorateBlock,
  buildBlock,
  loadBlock,
  sampleRUM,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';

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

const LCP_BLOCKS = ['hero']; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here


function loadBanner(body) {
  const bannerWrapper = document.createElement('div');
  const bannerBlock = buildBlock('banner', '');
  body.prepend(bannerWrapper);
  bannerWrapper.append(bannerBlock);
  decorateBlock(bannerBlock);
  return loadBlock(bannerBlock);
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

function buildAutoBlocks(main) {
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
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  loadBanner(doc.querySelector('body'));
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
  loadHeader(doc.querySelector('body > header'));
  loadFooter(doc.querySelector('body > footer'));

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
  "use strict";

  var loadingClass = "usa-js-loading";
  var fallback;

  document.documentElement.classList.add(loadingClass);
  function revertClass() {
    document.documentElement.classList.remove(loadingClass);
  }

  fallback = setTimeout(revertClass, 8000);

  function verifyLoaded() {
    if (window.uswdsPresent) {
      clearTimeout(fallback);
      revertClass();
      window.removeEventListener("load", verifyLoaded, true);
    }
  }

  window.addEventListener("load", verifyLoaded, true);
})();
