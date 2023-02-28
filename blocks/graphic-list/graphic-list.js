export default function decorate(block) {
  block.classList.add('usa-graphic-list');
  const grid = document.createElement('div');
  grid.className = 'grid-container';
  const childDivs = block.children;
  const childArr = Array.from(childDivs);
  let html = '<div class="usa-graphic-list__row grid-row grid-gap">';
  childArr.forEach((item, index) => {
    html += item.outerHTML;
    if (index % 2 && index < (childArr.length - 1)) {
      html += '</div><div class="usa-graphic-list__row grid-row grid-gap">';
    }
  });
  html += '</div>';
  grid.innerHTML = html;
  grid.querySelectorAll('div.usa-graphic-list__row').forEach((r) => {
    const mediaBlock = r.querySelectorAll(':scope > div');
    mediaBlock.forEach((b) => {
      b.classList.add('usa-media-block', 'tablet:grid-col');
      const mediaBlockChildren = b.querySelectorAll('div');
      const img = mediaBlockChildren[0].querySelector('img');
      img.classList.add('usa-media-block__img');
      mediaBlockChildren[1].classList.add('usa-media-block__body');
      mediaBlockChildren[1].querySelector('h3').classList.add('usa-graphic-list__heading');
    });
  });

  block.textContent = '';
  block.append(grid);
}
