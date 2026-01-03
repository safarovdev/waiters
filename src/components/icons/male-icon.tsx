import { SVGProps } from 'react';

export function MaleIcon(props: SVGProps<SVGSVGElement>) {
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
        <rect x="60" y="110" width="80" height="100" />

    </svg>
  );
}
