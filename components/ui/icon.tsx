import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  name: string;
};

const paths: Record<string, ReactNode> = {
  arrow: <path d="m9 18 6-6-6-6M3 12h12" />,
  brackets: <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3M14 8l-4 8" />,
  calculator: <path d="M5 3h14v18H5zM8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  code: <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  moon: <path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z" />,
  palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h2a7 7 0 0 0-2-11ZM7.5 10h.01M10 6.5h.01M14 6.5h.01M17 10h.01" />,
  search: <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />,
  shield: <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10ZM9 12l2 2 4-5" />,
  sun: <path d="M12 3V1M12 23v-2M3 12H1M23 12h-2M4.2 4.2 2.8 2.8M21.2 21.2l-1.4-1.4M19.8 4.2l1.4-1.4M2.8 21.2l1.4-1.4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />,
  system: <path d="M4 4h16v12H4zM8 20h8M12 16v4" />,
  text: <path d="M4 5h16M12 5v14M8 19h8" />,
};

export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      {...props}
    >
      {paths[name] ?? paths.code}
    </svg>
  );
}
