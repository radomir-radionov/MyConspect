export const DEV_RESOURCES_REFRESH_PATH = "/api/dev/resources-refresh";

export const DEV_RESOURCES_REFRESH_MESSAGE = "refresh";

export function isDevResourcesRefreshEnabled(): boolean {
  return process.env.NODE_ENV === "development";
}
