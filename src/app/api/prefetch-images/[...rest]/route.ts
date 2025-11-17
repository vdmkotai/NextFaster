import { NextRequest, NextResponse } from "next/server";
import { parseHTML } from "linkedom";

export const dynamic = "force-static";

function getHostname(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return "localhost:3000";
  }

  // Vercel-specific (check first for guaranteed Vercel compatibility)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return process.env.VERCEL_BRANCH_URL;
  }

  // Custom domain override (optional, works for any platform)
  if (process.env.PUBLIC_URL) {
    return process.env.PUBLIC_URL;
  }

  // Universal fallback: get from request headers (works everywhere!)
  return request.headers.get("host") || "";
}

export async function GET(
  request: NextRequest,
  { params }: { params: { rest: string[] } },
) {
  const schema = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = getHostname(request);
  if (!host) {
    return new Response("Failed to get hostname from env", { status: 500 });
  }
  const href = (await params).rest.join("/");
  if (!href) {
    return new Response("Missing url parameter", { status: 400 });
  }
  const url = `${schema}://${host}/${href}`;
  const response = await fetch(url);
  if (!response.ok) {
    return new Response("Failed to fetch", { status: response.status });
  }
  const body = await response.text();
  const { document } = parseHTML(body);
  const images = Array.from(document.querySelectorAll("main img"))
    .map((img) => ({
      srcset: img.getAttribute("srcset") || img.getAttribute("srcSet"), // Linkedom is case-sensitive
      sizes: img.getAttribute("sizes"),
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt"),
      loading: img.getAttribute("loading"),
    }))
    .filter((img) => img.src);
  return NextResponse.json(
    { images },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
