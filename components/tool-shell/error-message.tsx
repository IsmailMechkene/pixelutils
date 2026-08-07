interface ErrorMessageProps {
  message?: string;
  id?: string;
}

export function ErrorMessage({ message, id }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p
      className="rounded-[10px] border border-red-300/60 bg-red-50 px-3.5 py-3 text-sm leading-6 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-200"
      id={id}
      role="alert"
    >
      {message}
    </p>
  );
}
