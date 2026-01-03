import { SVGProps } from 'react';

export function FemaleIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6zm-4.36 4.28c.7-1.78 2.43-3 4.36-3s3.66 1.22 4.36 3H7.64z" />
      <path d="M16 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      <path d="M9.5 12.5c-1.67 0-3.14.93-3.85 2.25h7.7c-.7-1.32-2.17-2.25-3.85-2.25z" />
    </svg>
  );
}
