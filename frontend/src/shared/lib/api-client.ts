type ApiErrorBody = {
  message?: string;
  error?: string;
};

export async function fetchJson<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${trimTrailingSlash(baseUrl)}${path}`, {
    ...init,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function readErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json()) as ApiErrorBody;
    return body.message ?? body.error ?? `${response.status} ${response.statusText}`;
  }

  const text = await response.text();
  return text || `${response.status} ${response.statusText}`;
}
