export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  const classes = block.classList.value.split(' ');
  block.classList.add(`columns-${cols.length}-cols`);
  block.classList.add('grid-container', 'usa-section', 'usa-prose');
  const firstDiv = block.querySelector('div')
  firstDiv.classList.add('grid-row', 'grid-gap');
  const layoutClass = classes.filter(s => s.includes('layout-'));
  if (layoutClass.length > -1) {
    const layoutItems = layoutClass[0].split('-');
    layoutItems.splice(0,1);
    const layoutNumber = layoutItems.length;
    const childDivs = firstDiv.querySelectorAll('div');
    let a=0;
    childDivs.forEach(d => {
      const layoutClass = 'tablet:grid-col-' + layoutItems[a];
      d.classList.add(layoutClass);
      a = (a + 1);
    })
  } else {
    const childDivs = firstDiv.querySelectorAll('div');
    childDivs.forEach(d => d.classList.add('tablet:grid-col-auto'));
  }
  


}
