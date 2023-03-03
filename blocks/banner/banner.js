export default function decorate(block) {
    const banner = document.createElement('section');
    banner.className = 'usa-banner';
    banner.setAttribute('aria-label', 'Official website of the United States government');
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
    text.innerText = 'An official website of the United States government';
    const action = document.createElement('p');
    action.className = 'usa-banner__header-action';
    action.innerText = 'Here\'s how you know';
    col.append(text, action);
  
    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('usa-banner__button', 'usa-accordion__button');
    button.setAttribute('aria-expanded', 'false');
    const btnText = document.createElement('span');
    btnText.className = 'usa-banner__button-text';
    btnText.innerText = 'Here\'s how you know';
    button.append(btnText);
  
    inner.append(grid);
    inner.append(col);
    inner.append(button);
    header.append(inner);
    accordion.append(header);
    banner.append(accordion);
    
    block.textContent = '';
    block.append(banner);
  }