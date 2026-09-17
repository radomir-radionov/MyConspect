import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { NavGroup } from "@/lib/nav";
import { hrefInHandbook, readUi, writeUi } from "./uiStorage";

export function useRememberLocation(groups: readonly NavGroup[]) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const groupsRef = useRef(groups);
  const didCheckLandingRef = useRef(false);
  groupsRef.current = groups;

  useEffect(() => {
    if (!didCheckLandingRef.current) {
      didCheckLandingRef.current = true;
      if (pathname === "/") {
        const href = readUi().href;
        if (href !== "/" && hrefInHandbook(groupsRef.current, href)) {
          router.replace(href, { scroll: false });
          return;
        }
      }
    }

    function save() {
      if (pathname === "/") {
        return;
      }
      writeUi({ href: `${pathname}${window.location.hash}` });
    }

    save();
    window.addEventListener("hashchange", save);
    return () => window.removeEventListener("hashchange", save);
  }, [pathname, router]);
}
