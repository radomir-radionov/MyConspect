import {
  ensureResourcesRefreshWatcher,
  subscribeResourcesRefresh,
  type ResourcesRefreshListener,
} from "@/lib/dev/resourcesRefreshWatch";

export function createResourcesRefreshSseResponse(request: Request): Response {
  const state = ensureResourcesRefreshWatcher();
  const encoder = new TextEncoder();
  let listener: ResourcesRefreshListener | undefined;
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      listener = (message) => {
        try {
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        } catch {
          // Stream already closed.
        }
      };
      unsubscribe = subscribeResourcesRefresh(state, listener);
      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel() {
      unsubscribe?.();
    },
  });

  request.signal.addEventListener("abort", () => {
    unsubscribe?.();
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
