import React from "react";
import Head from "next/head";
import Link from "next/link";
import { ThemeProvider } from "@/components/themeprovider";
import { ModeToggle } from "~/components/darkmodetoggle";

export const Layout = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex min-h-screen w-full flex-col items-center">
            <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
              <div className="container flex h-14 items-center">
                <div className="mr-2 hidden md:flex">
                  <Link href="/" className="mr-2 flex items-center space-x-2">
                    <span className="hidden font-bold sm:inline-block">
                      Edaikazhinadu coffee house
                    </span>
                  </Link>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                  {/* Additional common header components can be added here */}
                  <ModeToggle />
                </div>
              </div>
            </header>
            {children}
          </main>
        </ThemeProvider>
    </>
  );
};


