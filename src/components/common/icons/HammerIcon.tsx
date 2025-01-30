type HammerIconProps = {
  className: string;
};

export function HammerIcon(props: HammerIconProps) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="56"
      viewBox="0 0 64 56"
      fill="currentColor"
    >
      <defs>
        <clipPath id="clip-Icon-chairman-hammer">
          <rect width="64" height="56" />
        </clipPath>
      </defs>
      <g id="Icon-chairman-hammer" clipPath="url(#clip-Icon-chairman-hammer)">
        <rect width="64" height="56" fill="#fff" />
        <g
          id="Group_10"
          data-name="Group 10"
          transform="translate(-1725.125 -746.074)"
        >
          <path
            id="Union_1"
            data-name="Union 1"
            d="M14.891,58.034V19.774H5.31A2.713,2.713,0,0,1,0,18.99V2.713a2.713,2.713,0,0,1,5.31-.784H30.017a2.713,2.713,0,0,1,5.31.784V18.99a2.713,2.713,0,0,1-5.31.784h-9.7v38.26a2.713,2.713,0,1,1-5.425,0Z"
            transform="translate(1729.981 770.528) rotate(-45)"
          />
          <rect
            id="Rectangle_22"
            data-name="Rectangle 22"
            width="38.1"
            height="5.426"
            rx="2.713"
            transform="translate(1763.225 801.771) rotate(180)"
          />
        </g>
      </g>
    </svg>
  );
}
