type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

export function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 2H22l-7.6 8.68L23 22h-6.9l-5.4-6.6L4.6 22H1.5l8.13-9.29L1 2h7.1l4.9 6.03L18.9 2Zm-1.2 18h1.7L7.4 4H5.6l12.1 16Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23 12s0-3.2-.41-4.72a3 3 0 0 0-2.1-2.13C18.9 4.75 12 4.75 12 4.75s-6.9 0-8.49.4a3 3 0 0 0-2.1 2.13C1 8.8 1 12 1 12s0 3.2.41 4.72a3 3 0 0 0 2.1 2.13c1.59.4 8.49.4 8.49.4s6.9 0 8.49-.4a3 3 0 0 0 2.1-2.13C23 15.2 23 12 23 12ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function DiscordIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.3 5.4A17.6 17.6 0 0 0 15.9 4l-.3.5c1.7.4 2.6.9 3.5 1.6-1.5-.7-3-1.1-4.6-1.3-.4 0-.8-.1-1.2-.1-.4 0-.8 0-1.2.1-1.6.2-3.1.6-4.6 1.3.9-.7 1.9-1.2 3.5-1.6l-.3-.5A17.6 17.6 0 0 0 3.7 5.4C1.9 8.9 1.4 12.3 1.6 15.6a17.7 17.7 0 0 0 5.4 2.7l.7-1.2c-.8-.3-1.5-.6-2.2-1.1l.4-.3c2.1 1 4.4 1.5 6.7 1.5s4.6-.5 6.7-1.5l.4.3c-.7.5-1.4.8-2.2 1.1l.7 1.2a17.7 17.7 0 0 0 5.4-2.7c.3-3.9-.6-7.3-2.3-10.2ZM8.7 13.6c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7s.7-1.7 1.5-1.7 1.5.8 1.5 1.7-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}
