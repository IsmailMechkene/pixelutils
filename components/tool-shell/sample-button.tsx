import { ActionButton } from "./action-button";

interface SampleButtonProps {
  onSample: () => void;
  disabled?: boolean;
  label?: string;
}

export function SampleButton({
  onSample,
  disabled = false,
  label = "Use sample",
}: SampleButtonProps) {
  return (
    <ActionButton disabled={disabled} icon="sparkles" onClick={onSample}>
      {label}
    </ActionButton>
  );
}
