import { handbookNav } from "@/lib/nav/handbook";

export const dynamic = "force-static";

export function GET() {
  return Response.json(handbookNav());
}
