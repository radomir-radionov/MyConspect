import { watch } from "node:fs";
import path from "node:path";
import { clearTopicParseCache } from "@/lib/parse/load";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Listener = (message: string) => void;

type WatchState = {
  listeners: Set<Listener>;
  watcher: ReturnType<typeof watch> | null;
  timer: ReturnType<typeof setTimeout> | undefined;
};

const globalForWatch = globalThis as typeof globalThis & {
  __resourcesRefreshWatch?: WatchState;
};

function getState(): WatchState {
  if (!globalForWatch.__resourcesRefreshWatch) {
    globalForWatch.__resourcesRefreshWatch = {
      listeners: new Set(),
      watcher: null,
      timer: undefined,
    };
  }
  return globalForWatch.__resourcesRefreshWatch;
}

function ensureWatcher() {
  const state = getState();
  if (state.watcher) {
    return;
  }

  const dir = path.join(process.cwd(), "resources");
  state.watcher = watch(dir, { recursive: true }, () => {
    clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      clearTopicParseCache();
      for (const listener of state.listeners) {
        listener("refresh");
      }
    }, 80);
  });
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  ensureWatcher();
  const state = getState();
  const encoder = new TextEncoder();
  let listener: Listener | undefined;

  const stream = new ReadableStream({
    start(controller) {
      listener = (message) => {
        try {
          controller.enqueue(encoder.encode(`data: ${message}\n\n`));
        } catch {
          // Stream already closed.
        }
      };
      state.listeners.add(listener);
      controller.enqueue(encoder.encode(": connected\n\n"));
    },
    cancel() {
      if (listener) {
        state.listeners.delete(listener);
      }
    },
  });

  request.signal.addEventListener("abort", () => {
    if (listener) {
      state.listeners.delete(listener);
    }
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
