interface AdSlotProps {
  placement?: "content" | "sidebar";
}

export function AdSlot(_props: AdSlotProps) {
  // Advertising is intentionally disabled. A provider-specific adapter can be
  // added later without changing page layouts or the tool workspace.
  void _props;
  return null;
}
