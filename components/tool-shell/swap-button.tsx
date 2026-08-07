import { ActionButton } from "./action-button";

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
  label?: string;
}

export function SwapButton({
  onSwap,
  disabled = false,
  label = "Swap",
}: SwapButtonProps) {
  return (
    <ActionButton disabled={disabled} icon="swap" onClick={onSwap} tone="quiet">
      {label}
    </ActionButton>
  );
}
