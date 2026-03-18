const DEFAULT_MESSAGE = 'Something went wrong';

/**
 * Resolves the hey-api client error shape.
 * The client wraps the response body under `error.response`,
 * so we check for that nested shape first (guarding against null).
 */
const resolveSource = (error: unknown): unknown => {
  const obj = typeof error === 'object' && error !== null ? error : null;

  if (obj && 'response' in obj) {
    const response = (obj as Record<string, unknown>).response;
    if (typeof response === 'object' && response !== null) {
      return response;
    }
  }

  return obj;
};

/**
 * Extracts a human-readable message from an API error.
 * Handles the hey-api client response shape where the actual
 * error body is nested under `error.response`.
 */
const getErrorMessage = (error: unknown): string => {
  const source = resolveSource(error);

  if (source && typeof source === 'object' && 'message' in source) {
    const msg = (source as { message: unknown }).message;
    if (Array.isArray(msg)) {
      return typeof msg[0] === 'string' ? msg[0] : String(msg[0]);
    }
    if (typeof msg === 'string') return msg;
  }

  return DEFAULT_MESSAGE;
};

/**
 * Extracts the HTTP status code from an API error, if available.
 * Checks both the top-level `status` and nested `response.statusCode`.
 */
const getErrorStatus = (error: unknown): number | null => {
  const obj = typeof error === 'object' && error !== null ? error : null;

  // Check top-level status (hey-api client shape)
  if (
    obj &&
    'status' in obj &&
    typeof (obj as Record<string, unknown>).status === 'number'
  ) {
    return (obj as { status: number }).status;
  }

  // Check nested response.statusCode (NestJS error shape)
  const source = resolveSource(error);
  if (
    source &&
    typeof source === 'object' &&
    'statusCode' in source &&
    typeof (source as Record<string, unknown>).statusCode === 'number'
  ) {
    return (source as { statusCode: number }).statusCode;
  }

  return null;
};

export { getErrorMessage, getErrorStatus };
