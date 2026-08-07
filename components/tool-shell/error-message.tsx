interface ErrorMessageProps {
  message?: string;
  id?: string;
}

export function ErrorMessage({ message, id }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className="rounded-control border border-danger-line bg-danger-soft px-3.5 py-3 text-sm leading-6 text-danger"
      id={id}
      role="alert"
    >
      {message}
    </p>
  );
}
