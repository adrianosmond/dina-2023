import { SVGProps } from 'react';

type PixelatedImageProps = {
  src: string;
  pixelation: number;
} & SVGProps<SVGSVGElement>;

const PixelatedImage = ({ src, pixelation, ...rest }: PixelatedImageProps) => (
  <svg {...rest}>
    <filter id="pixelate" x="0" y="0">
      <feFlood x="4" y="4" height="2" width="2" />
      <feComposite width={pixelation * 2} height={pixelation * 2} />
      <feTile result="a" />
      <feComposite in="SourceGraphic" in2="a" operator="in" />
      <feMorphology operator="dilate" radius={pixelation} />
    </filter>
    <image
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      {...(pixelation > 2 ? { filter: 'url(#pixelate)' } : {})}
      xlinkHref={src}
    />
  </svg>
);

export default PixelatedImage;
