// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here


const uswds = document.createElement('script');
const body = document.querySelector('body');
uswds.async = 'true';
uswds.src = '/scripts/uswds.js';
console.log(uswds);
body.append(uswds);