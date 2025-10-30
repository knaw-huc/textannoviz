import { toast as toastifyToast } from "react-toastify";

export type ToastOptions = Parameters<typeof toastifyToast>[1];

export function toast(message: string, options?: ToastOptions) {
  console.trace(message);
  toastifyToast(message, options);
}
