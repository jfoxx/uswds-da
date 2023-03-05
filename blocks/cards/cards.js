import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  ul.classList.add('usa-card-group');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('usa-card', 'tablet:grid-col-4');
    const wrap = document.createElement('div');
    wrap.classList.add('usa-card__container');
    wrap.innerHTML = row.innerHTML;
    [...wrap.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'usa-card__media';
        const imgWrap = document.createElement('div');
        imgWrap.className = 'usa-card__img';
        imgWrap.innerHTML = div.innerHTML;
        div.innerHTML = '';
        div.appendChild(imgWrap);
      } else div.className = 'usa-card__body';
    });
    li.prepend(wrap);
    ul.append(li);
  });

  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]), ''));
  ul.querySelectorAll('strong').forEach((heading) => {
    heading.classList.add('usa-card__heading');
    const parent = heading.closest('p');
    const contents = parent.innerHTML;
    const newDiv = document.createElement('div');
    newDiv.className = 'usa-card__header';
    newDiv.innerHTML = contents;
    heading.closest('.usa-card__container').prepend(newDiv);
    parent.remove();
  });

  const container = document.createElement('div');
  container.classList.add('grid-container');
  const row = document.createElement('div');
  row.classList.add('grid-row', 'grid-gap');
  const col = document.createElement('div');
  col.classList.add('tablet:grid-col');

  col.append(ul);
  row.append(col);
  container.append(row);
  block.textContent = '';
  block.append(container);
}
