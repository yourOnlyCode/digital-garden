/** Paper grain laid over the whole page. Purely decorative. */
export function Grain() {
  return (
    <svg aria-hidden="true" className="grain">
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="1.1"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .18  0 0 0 0 .14  0 0 0 .8 -.2" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
