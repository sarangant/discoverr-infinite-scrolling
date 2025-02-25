"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { StyledRoot } from "./StyledRoot";
import { Roboto } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={roboto.className}>
        <QueryClientProvider client={queryClient}>
          <AppRouterCacheProvider>
            <StyledRoot>{children}</StyledRoot>
          </AppRouterCacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
