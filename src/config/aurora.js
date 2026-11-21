/**
 * Aurora blob configuration.
 * c: colour token suffix — maps to var(--c-aurora-<c>)
 * top/left: CSS position values (can be negative %)
 * w/h: blob dimensions in %
 * dur: animation duration in seconds
 * delay: negative delay so animation starts mid-cycle (seconds, stored negative)
 */
export const AURORA = {
  hero: [
    { c: 'sky',   top: '-20%', left: '-6%',  w: '42%', h: '130%', dur: 38, delay: -6  },
    { c: 'mint',  top: '-26%', left: '22%',  w: '34%', h: '125%', dur: 30, delay: -14 },
    { c: 'blue',  top: '-20%', left: '50%',  w: '44%', h: '135%', dur: 44, delay: -22 },
    { c: 'lilac', top: '-16%', left: '74%',  w: '38%', h: '125%', dur: 34, delay: -3  },
  ],
  panel: [
    { c: 'blue',  top: '-15%', left: '5%',   w: '55%', h: '120%', dur: 40, delay: -9  },
    { c: 'lilac', top: '-10%', left: '48%',  w: '50%', h: '120%', dur: 32, delay: -18 },
  ],
  cta: [
    { c: 'sky',   top: '-15%', left: '10%',  w: '50%', h: '120%', dur: 36, delay: -5  },
    { c: 'mint',  top: '-10%', left: '52%',  w: '45%', h: '120%', dur: 42, delay: -20 },
  ],
};
