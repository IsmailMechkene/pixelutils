import { Icon } from "@/components/ui/icon";

export function FilePrivacyNotice({
  message = "Your files stay on this device. Processing happens locally in your browser.",
}: {
  message?: string;
}) {
  return (
    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-ink-muted">
      <Icon className="mt-1 size-4 shrink-0 text-success" name="shield-check" />
      <span>{message}</span>
    </p>
  );
}
