import {
  sampleRUM,
  buildBlock,
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

const LCP_BLOCKS = []; // add your LCP blocks to the list
window.hlx.RUM_GENERATION = 'project-1'; // add your RUM generation information here



function buildBanner(main) {
  const banner = document.createElement('section');
  banner.className = 'usa-banner';
  banner.setAttribute('aria-label','Official website of the United States government');
  const accordion = document.createElement('div');
  accordion.className = 'usa-accordion';
  const header = document.createElement('div');
  header.className = 'usa-banner__header';
  const inner = document.createElement('div');
  inner.className = 'usa-banner__inner';
  const grid = document.createElement('div');
  grid.className = 'grid-col-auto';
  const flag = document.createElement('img');
  flag.className = 'usa-banner__header-flag';
  flag.setAttribute('aria-hidden', 'true');
  flag.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAsCAIAAABaPSmoAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAQKADAAQAAAABAAAALAAAAAA5W/rGAAABlElEQVRoBe2ZTU4DMQyFYzTLXoHOhhsAW24AR4GzFdb8iC2cABaoPUYXDFKlJt+TSJtZpFEkd+W4jhPnOX5Jxs4vV2H/M7O9GMI0JRkStbAOooef98V97L39pVVUh7yfZJOZTjhLJn1KHkBr3Abm3/rjNs5nvHqM8vrzLspZ/fVTtOH+GV9/kr6C5ClUYVFnueweAVuCByR01HLmtNgUNJ4XD9FqQjHn3vufHWK3nZCbTvcIeAAK9OlbQ0ByMUc3BZywBFdsyBXghIs354GDsPoeOLg8J/jTmMfcA6zTnAdrtthgL5E3yAPUix9xlEYDbWTvDJ5Cab3aSN0jMDAvpZajxhfdB2BPbnEeOJKZ3adQ9wGYvAsBLqnTBXqYyBvRC96FpK6j9lNPPyVy9wh4ACUw17Qxnn9qDlTLt6dQrZUt9ds9AvZ1Mx4NVr4boMrPrd+ZKwOPTjyaybxyfbtHwAMQnBs0nAcaLLoM6XtAlqNBw77BA3IHyJzXhRNyRIC+oI3Agj/3DMZx2ddTqEHWyJDdI/AHdI1y3pPhjf8AAAAASUVORK5CYII=');
  flag.setAttribute('alt', '');
  flag.setAttribute('width', '16');
  flag.setAttribute('height', '11');
  grid.append(flag);
  const col = document.createElement('div');
  col.classList.add('grid-col-fill', 'tablet:grid-col-auto');
  col.setAttribute('aria-hidden', 'true');
  const text = document.createElement('p');
  text.className = 'usa-banner__header-text';
  text.innerText = 'An official website of the United States government'
  const action = document.createElement('p');
  action.className = 'usa-banner__header-action';
  action.innerText = 'Here\'s how you know';
  col.append(text, action);

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('usa-banner__button');
  button.setAttribute('aria-expanded', 'false');
  const btnText = document.createElement('span');
  btnText.className = 'usa-banner__button-text';
  btnText.innerText = 'Here\'s how you know'
  button.append(btnText);

  inner.append(grid);
  inner.append(col);
  inner.append(button);
  header.append(inner);
  accordion.append(header);
  banner.append(accordion);

  main.parentElement.prepend(banner);
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */

function buildAutoBlocks(main) {
  try {
   // buildHeroBlock(main);
    buildBanner(main);
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
}

/**
 * loads everything needed to get to LCP.
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
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
  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));


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
