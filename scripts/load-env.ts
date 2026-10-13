import { loadEnvConfig } from "@next/env";

/** Load `.env*` before scripts read `MYCONSPECT_NOTES_ROOT` or other app env. */
loadEnvConfig(process.cwd());
