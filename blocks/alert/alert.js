export default function decorate(block) {
  const classes = block.classList.value.split(' ');
  if (classes.length > 1) {
    const alertType = `usa-alert--${classes[1]}`;
    block.classList.add(alertType);
  }
  block.classList.add('usa-alert');
  const titleP = block.querySelector('strong').parentElement;
  const body = document.createElement('div');
  const title = document.createElement('h4');
  title.classList.add('usa-alert__heading');
  title.innerText = block.querySelector('strong').innerText;
  body.append(title);
  titleP.remove();
  body.classList.add('usa-alert__body');
  const text = document.createElement('p');
  text.classList.add('usa-alert__text');
  const textHTML = block.querySelector('p').innerHTML;
  text.innerHTML = textHTML;
  const links = text.querySelectorAll('a');
  if (links) {
    links.forEach((l) => {
      l.classList.add('usa-link');
    });
  }
  body.append(text);
  block.textContent = '';
  block.append(body);
}
