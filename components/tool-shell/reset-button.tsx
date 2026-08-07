import { ActionButton } from "./action-button";

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
  label?: string;
}

export function ResetButton({
  onReset,
  disabled = false,
  label = "Reset",
}: ResetButtonProps) {
  return (
    <ActionButton
      disabled={disabled}
      icon="rotate-ccw"
      onClick={onReset}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
