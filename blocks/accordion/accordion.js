export default function decorate(block) {
  /* change to ul, li */
  const items = block.querySelectorAll(':scope > div');
  let itemNumber = 1;
  const collection = document.createElement('div');
  items.forEach(i => {
    const pieces = i.querySelectorAll('div');
    const heading = document.createElement('h4');
    heading.classList.add('usa-accordion__heading');
    const button = document.createElement('button');
    button.classList.add('usa-accordion__button');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', `a${itemNumber}`);
    button.innerText = pieces[0].innerText;
    heading.append(button);
    const div = document.createElement('div');
    div.classList.add('usa-accordion__content', 'usa-prose');
    div.id = `a${itemNumber}`;
    div.innerHTML = pieces[1].innerHTML;
    collection.append(heading, div);
    itemNumber = itemNumber+1;
  });
  block.textContent = '';
  block.classList.add('usa-accordion');
  block.innerHTML = collection.innerHTML;
}
