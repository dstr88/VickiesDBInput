export {};

declare global {
  interface Window {
    openExclusiveModal: (id: string) => void;
    closeModal: (id: string) => void;
  }
}
