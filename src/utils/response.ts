export const ok = <T>(data: T) => ({ success: true, data });
export const errorResponse = (code: string, message: string, details?: unknown) => ({
  success: false,
  error: { code, message, details },
});
