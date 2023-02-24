import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  document.querySelector('footer').classList.add('usa-footer', 'usa-footer--big');
  const cfg = readBlockConfig(block);
  block.textContent = '';

  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});
  const html = await resp.text();
  block.innerHTML = html;
  const primary = block.children[0];
  const secondary = block.children[1];
  primary.className = 'usa-footer__primary-section';
  secondary.className = 'usa-footer__secondary-section';

  //primary section
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid-container';
  const gridRow = document.createElement('div');
  gridRow.classList.add('grid-row', 'grid-gap');
  const gridCol = document.createElement('div');
  gridCol.className = 'tablet:grid-col-8';
  const footerNav = document.createElement('nav');
  footerNav.className = 'usa-footer__nav';
  footerNav.setAttribute('aria-label', 'Footer navigation,,');
  const gridRowFour = document.createElement('div');
  gridRowFour.classList.add('grid-row', 'grid-gap-4');

  const columns = primary.querySelector('.columns>div');
  gridRowFour.innerHTML = columns.innerHTML;
  primary.querySelector('.columns').remove();
  gridRowFour.querySelectorAll('div').forEach(i => {
    i.classList.add('mobile-lg:grid-col-6', 'desktop:grid-col-3');
    const section = document.createElement('section');
    section.classList.add('usa-footer__primary-content', 'usa-footer__primary-content--collapsible');
    const title = i.querySelector('strong').innerText;
    const titleTag = document.createElement('h4');
    titleTag.className ='usa-footer__primary-link';
    titleTag.innerText = title;
    i.querySelector('p').remove();
    section.innerHTML = i.innerHTML;
    section.prepend(titleTag);
    i.innerHTML = '';
    i.prepend(section);
    
  });
  gridRowFour.querySelectorAll('ul').forEach(i => { i.classList.add('usa-list','usa-list--unstyled')});
  gridRowFour.querySelectorAll('li').forEach(i => { i.classList.add('usa-footer__secondary-link')});

  footerNav.append(gridRowFour);
  gridCol.append(footerNav);
  gridRow.append(gridCol);
  gridContainer.append(gridRow);

  primary.append(gridContainer);

  //secondary section
  const secContainer = document.createElement('div');
  secContainer.className = 'grid-container';
  const secRow = document.createElement('div');
  secRow.classList.add('grid-row', 'grid-gap');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('usa-footer__logo', 'grid-row', 'mobile-lg:grid-col-6', 'mobile-lg:grid-gap-2');
  const logoChild1 = document.createElement('div');
  const logoChild2 = document.createElement('div');
  logoChild1.className = 'mobile-lg:grid-col-auto';
  logoChild2.className = 'mobile-lg:grid-col-auto';
  const logoNodes = secondary.querySelectorAll(':scope > p a');
  logoChild1.innerHTML =logoNodes[0].innerHTML;
  const logoTitle = document.createElement('p');
  logoTitle.className = 'usa-footer__logo-heading';
  logoTitle.innerText = logoNodes[1].innerText;
  logoChild2.append(logoTitle);
  logoChild1.querySelector('img').className='usa-footer__logo-img';
  logoDiv.append(logoChild1, logoChild2);
  secRow.append(logoDiv);

  const contactDiv = document.createElement('div');
  contactDiv.classList.add('usa-footer__contact-links', 'mobile-lg:grid-col-6');
  const socialDiv = document.createElement('div');
  socialDiv.classList.add('usa-footer__social-links', 'grid-row', 'grid-gap-1');
  
  const socialLinks = secondary.querySelectorAll('.social-links li');
  socialLinks.forEach(s => {
    const socialWrapperDiv = document.createElement('div');
    socialWrapperDiv.className = 'grid-col-auto';
    socialWrapperDiv.innerHTML = s.innerHTML;
    socialDiv.append(socialWrapperDiv);
  });

  //social icons
  const link = socialDiv.querySelectorAll('a');
  const iconPath = '/icons/usa-icons/'
  link.forEach( a => {
      a.className = 'usa-social-link';
      const type = a.innerText;
      let icon = '';
      if (type.includes('Facebook')) {
        icon = 'facebook.svg';
      } else if (type.includes('Twitter')) {
        icon= 'twitter.svg';
      } else if (type.includes('YouTube')) {
        icon= 'youtube.svg';
      } else if (type.includes('Instagram')) {
        icon= 'instagram.svg';
      } else if (type.includes('RSS')) {
        icon= 'rss_feed.svg';
      } else if (type.includes('LinkedIn')) {
        icon= 'linkedin.svg';
      } else {
        icon = 'github.svg'
      };

      const iconImg = document.createElement('img');
      iconImg.className = 'usa-social-link__icon';
      iconImg.setAttribute('alt', '');
      iconImg.setAttribute('src', iconPath+icon);
      a.innerHTML=''
      a.append(iconImg);
  })




  const contactHeading = document.createElement('p');
  contactHeading.className = 'usa-footer__contact-heading';
  const address = document.createElement('address');
  address.className = 'usa-footer__address';
  const contactContent = secondary.querySelectorAll('.contact p');
  contactHeading.innerHTML = contactContent[0].innerHTML;
  const phone = document.createElement('div');
  phone.className = 'grid-col-auto';
  phone.innerHTML = contactContent[1].innerHTML;
  const email = document.createElement('div');
  email.className = 'grid-col-auto';
  email.innerHTML = contactContent[2].innerHTML;
  address.append(phone, email);
  contactDiv.append(socialDiv);
  contactDiv.append(contactHeading);
  contactDiv.append(address);

  secRow.append(contactDiv);
  secContainer.append(secRow);

  secondary.innerHTML = '';

  secondary.append(secContainer);

}
