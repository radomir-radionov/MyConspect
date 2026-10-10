import assert from "node:assert/strict";
import test from "node:test";
import { DEV_RESOURCES_REFRESH_MESSAGE } from "@/lib/dev/shared";
import { shouldRefreshFromResourcesSse } from "@/components/dev/utils/resourcesRefresh";

test("shouldRefreshFromResourcesSse accepts refresh payload only", () => {
  assert.equal(
    shouldRefreshFromResourcesSse(DEV_RESOURCES_REFRESH_MESSAGE),
    true,
  );
  assert.equal(shouldRefreshFromResourcesSse("connected"), false);
  assert.equal(shouldRefreshFromResourcesSse(""), false);
});
