import { ActionButton } from "./action-button";

interface UploadButtonProps {
  onUpload: () => void;
  disabled?: boolean;
  label?: string;
}

export function UploadButton({
  onUpload,
  disabled = false,
  label = "Upload",
}: UploadButtonProps) {
  return (
    <ActionButton
      disabled={disabled}
      icon="file-up"
      onClick={onUpload}
      tone="quiet"
    >
      {label}
    </ActionButton>
  );
}
