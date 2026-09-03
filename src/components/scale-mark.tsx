/** Marca do site: uma balança de dois pratos — tudo aqui é pesado em gramas. */
export function ScaleMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 4.4v14.2" />
      <path d="M5 7.1h14" />
      <path d="M8.4 18.6h7.2" />
      <path d="M2.6 13.1 5 7.6l2.4 5.5a2.7 2.7 0 0 1-4.8 0Z" />
      <path d="M16.6 13.1 19 7.6l2.4 5.5a2.7 2.7 0 0 1-4.8 0Z" />
      <circle cx="12" cy="4.4" r="1.3" />
    </svg>
  );
}
