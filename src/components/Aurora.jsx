import * as React from 'react';
import { AURORA } from '@/config/aurora';
import { useAuroraVisibility } from '@/hooks/useAuroraVisibility';

// Map blob colour token suffix → actual CSS variable reference for the RGB triplet
const TOKEN_VAR = {
  sky:   '--c-aurora-sky',
  mint:  '--c-aurora-mint',
  blue:  '--c-aurora-blue',
  lilac: '--c-aurora-lilac',
};

/**
 * Aurora wrapper.
 * Renders .aurora__field with animated blobs then slots children above.
 * Does NOT change the structure or props of children.
 *
 * @param {object}            props
 * @param {Array}             props.config     blob config array from AURORA
 * @param {string}            [props.className] extra classes (e.g. 'aurora--soft')
 * @param {React.ReactNode}   props.children
 */
export function Aurora({ config = [], className = '', children, style, ...rest }) {
  const ref = React.useRef(null);
  useAuroraVisibility(ref);

  const cls = ['aurora', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={cls} style={style} {...rest}>
      <div className="aurora__field" aria-hidden="true">
        {config.map((blob, i) => {
          const cVar = TOKEN_VAR[blob.c] || `--c-aurora-${blob.c}`;
          return (
            <div
              key={i}
              className="aurora__blob"
              style={{
                '--top':   blob.top,
                '--left':  blob.left,
                '--w':     blob.w,
                '--h':     blob.h,
                '--dur':   `${blob.dur}s`,
                '--delay': `${blob.delay}s`,
                // --c must be an RGB triplet so the blob CSS works: rgb(var(--c) / 1)
                '--c':     `var(${cVar})`,
              }}
            />
          );
        })}
      </div>
      {children}
    </div>
  );
}

export { AURORA };
