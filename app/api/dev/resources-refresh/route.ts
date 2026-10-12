import { createResourcesRefreshSseResponse } from "@/lib/dev/resourcesRefreshSse";
import { isDevResourcesRefreshEnabled } from "@/lib/dev/shared";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isDevResourcesRefreshEnabled()) {
    return new Response("Not found", { status: 404 });
  }

  return createResourcesRefreshSseResponse(request);
}
