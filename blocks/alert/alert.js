export default function decorate(block) {
  const classes = block.classList.value.split(' ');
  if (classes.length > 1) {
    const alertType = `usa-alert--${classes[1]}`;
    block.classList.add(alertType);
  }
  block.classList.add('usa-alert');
  const content = block.querySelectorAll(':scope > div > div');
  const body = document.createElement('div');
  body.classList.add('usa-alert__body');
  if (content.length > 1) {
    const title = document.createElement('h4');
    title.classList.add('usa-alert__heading');
    title.innerText = content[0].innerText;
    title.querySelectorAll('br').forEach((i) => { i.remove(); });
    body.append(title);
    const text = document.createElement('div');
    text.innerHTML = content[1].innerHTML;
    const links = text.querySelectorAll('a');
    if (links) {
      links.forEach((l) => {
        l.classList.add('usa-link');
      });
    }
    body.append(text);
  } else {
    const text = document.createElement('div');
    text.innerHTML = content[0].innerHTML;
    const links = text.querySelectorAll('a');
    if (links) {
      links.forEach((l) => {
        l.classList.add('usa-link');
      });
    }
    body.append(text);
  }
  block.textContent = '';
  block.append(body);
}
