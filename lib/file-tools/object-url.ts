/**
 * Keeps a single generated object URL alive until it is replaced or disposed.
 * File tool workspaces should own one of these for every visible preview.
 */
export function createObjectUrlHandle() {
  let currentUrl: string | undefined;

  return {
    replace(blob?: Blob) {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      currentUrl = blob ? URL.createObjectURL(blob) : undefined;
      return currentUrl;
    },
    dispose() {
      if (currentUrl) URL.revokeObjectURL(currentUrl);
      currentUrl = undefined;
    },
  };
}
