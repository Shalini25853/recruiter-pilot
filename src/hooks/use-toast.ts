export type ToastType = 'success' | 'error' | 'warning' | 'message'

function notify(type: ToastType, message: string) {
  if (type === 'error') console.error(message)
  else console.log(`[${type}] ${message}`)
  try {
    if (typeof window !== 'undefined') alert(message)
  } catch {}
}

export const toast = {
  success: (msg: string) => notify('success', msg),
  error: (msg: string) => notify('error', msg),
  warning: (msg: string) => notify('warning', msg),
  message: (msg: string) => notify('message', msg),
}

export function useToast() {
  return { toast }
}
