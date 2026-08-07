import { ActionButton } from "./action-button";

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export function ClearButton({
  onClear,
  disabled = false,
  label = "Clear",
}: ClearButtonProps) {
  return (
    <ActionButton
      disabled={disabled}
      icon="trash-2"
      onClick={onClear}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
