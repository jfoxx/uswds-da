export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  const classes = block.classList.toString().split(' ');
  block.classList.add(`columns-${cols.length}-cols`);
  block.classList.add('grid-container', 'usa-section', 'usa-prose');
  const firstDiv = block.querySelector('div');
  firstDiv.classList.add('grid-row', 'grid-gap');
  if (classes.length < 3) {
    const childDivs = firstDiv.querySelectorAll('div');
    childDivs.forEach((d) => d.classList.add('tablet:grid-col-auto'));
    firstDiv.classList.add('grid-nowrap');
  } else {
    const layoutClass = classes.filter((s) => s.includes('layout-'));
    const layoutItems = layoutClass[0].split('-');
    layoutItems.splice(0, 1);
    const childDivs = firstDiv.querySelectorAll('div');
    let a = 0;
    childDivs.forEach((d) => {
      const layoutClass2 = `tablet:grid-col-${layoutItems[a]}`;
      d.classList.add(layoutClass2);
      a += 1;
    });
  }
}
