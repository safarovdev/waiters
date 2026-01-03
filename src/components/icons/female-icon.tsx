import { SVGProps } from 'react';

export function FemaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 250"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <circle cx="100" cy="60" r="40" />
        <path d="M100 110 H100 V160 L140 210 H60 L100 160" />

    </svg>
  );
}
