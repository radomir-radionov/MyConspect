import {
  DEV_RESOURCES_REFRESH_MESSAGE,
  DEV_RESOURCES_REFRESH_PATH,
} from "@/lib/dev/shared";

export { DEV_RESOURCES_REFRESH_PATH };

export function shouldRefreshFromResourcesSse(data: string): boolean {
  return data === DEV_RESOURCES_REFRESH_MESSAGE;
}

/** Opens the dev SSE channel; returns cleanup that closes the connection. */
export function subscribeResourcesRefresh(onRefresh: () => void): () => void {
  const source = new EventSource(DEV_RESOURCES_REFRESH_PATH);
  source.onmessage = (event) => {
    if (shouldRefreshFromResourcesSse(event.data)) {
      onRefresh();
    }
  };
  return () => {
    source.close();
  };
}
