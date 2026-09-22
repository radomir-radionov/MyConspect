import { isLocale } from "@/lib/i18n/locales";
import { handbookNav } from "@/lib/nav/handbook";

export const dynamic = "force-static";

export async function GET(
  _request: Request,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale } = await context.params;
  if (!isLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json(handbookNav(locale));
}
