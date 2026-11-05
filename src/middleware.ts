import { clerkMiddleware } from "@clerk/astro/server";
import { defineMiddleware } from "astro:middleware";

const clerk = clerkMiddleware();

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Check if target is warning page or static/asset paths
  const isWarningPage = pathname === '/warning';
  const isStaticAsset = pathname.startsWith('/_astro/') || 
                        pathname.startsWith('/favicon') || 
                        pathname.endsWith('.ico') || 
                        pathname.endsWith('.png') || 
                        pathname.endsWith('.svg') || 
                        pathname.endsWith('.css') || 
                        pathname.endsWith('.js');

  const accessCookie = context.cookies.get('somashiva_access')?.value;

  if (!accessCookie && !isWarningPage && !isStaticAsset) {
    return context.redirect('/warning');
  }

  return clerk(context, next);
});
