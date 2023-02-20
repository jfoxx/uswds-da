import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.classList.add('usa-card-group');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('usa-card','tablet:grid-col-4');
    let wrap = document.createElement('div');
    wrap.classList.add('usa-card__container');
    wrap.innerHTML = row.innerHTML;
    [...wrap.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'usa-card__media';
        let imgWrap = document.createElement('div');
        imgWrap.className = 'usa-card__img';
        imgWrap.innerHTML = div.innerHTML;
        div.innerHTML='';
        div.appendChild(imgWrap);
      } 
      else div.className = 'usa-card__body';
    });
    li.prepend(wrap);
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]), ''));
  ul.querySelectorAll('strong').forEach((heading) => {
    heading.classList.add('usa-card__heading');
    let parent = heading.closest('p');
    let contents = parent.innerHTML;
    let newDiv = document.createElement('div');
    newDiv.className = 'usa-card__header';
    newDiv.innerHTML = contents;
    heading.closest('.usa-card__container').prepend(newDiv);
    parent.remove();
  });
  
 
  block.textContent = '';
  block.append(ul);
}
