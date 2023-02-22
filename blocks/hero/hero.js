import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
 
  const newHero = document.createElement('section');
  newHero.className = 'usa-hero';
  newHero.setAttribute('aria-label', 'Introduction');

  const imgDiv = document.createElement('div');
  imgDiv.className = 'hero-img';
  imgDiv.innerHTML = block.children[0].innerHTML;
  newHero.append(imgDiv);

  const grid = document.createElement('div');
  grid.className = 'grid-container';
  const callout = document.createElement('div');
  callout.className = 'usa-hero__callout';
  const text = block.children[1].children[0].innerHTML;
  callout.innerHTML = text;
  callout.querySelector('h1').className='usa-hero__heading';
  callout.querySelector('h1 > em').className = 'usa-hero__heading--alt';
  callout.querySelector('a').className ='usa-button';
  grid.append(callout);
  newHero.append(grid);

 
  block.textContent = '';
  block.append(newHero);
}
