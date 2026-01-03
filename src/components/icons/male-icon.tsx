import { SVGProps } from 'react';

export function MaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" />
      <path d="M10 18v-1.5c0-.83.67-1.5 1.5-1.5h1c.83 0 1.5.67 1.5 1.5V18h-4zm2-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
}
