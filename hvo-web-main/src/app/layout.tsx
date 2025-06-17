import "src/styles.css";
import "src/global.css";

// ----------------------------------------------------------------------

import ThemeProvider from "src/theme";
import { primaryFont } from "@/theme/typography";

import ProgressBar from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import SnackbarProvider from "src/components/snackbar/snackbar-provider";
import { SettingsProvider } from "src/components/settings";
import { DesktopOnlyGuard } from "@/sections/shared/desktop-only-guard";

import { AuthProvider } from "src/auth/context/auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import { CookiesProvider } from "next-client-cookies/server";
import Head from "next/head";

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "HVO",
  description: "Human Voice Over - Admin Dashboard",
  // keywords: "react,material,kit,application,dashboard,admin,template",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon/favicon.ico" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon/favicon-16x16.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon/favicon-32x32.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  // console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  // console.log("Firebase API Key:", process.env.NEXT_PUBLIC_API_ENDPOINT);
  return (
    <html lang="en" className={primaryFont.className}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <CookiesProvider>
          <ReactQueryProvider>
            <AuthProvider>
              <SettingsProvider
                defaultSettings={{
                  themeMode: "light", // 'light' | 'dark'
                  themeDirection: "ltr", //  'rtl' | 'ltr'
                  themeContrast: "default", // 'default' | 'bold'
                  themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: "default", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: false,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <SnackbarProvider>
                      <ProgressBar />
                      <DesktopOnlyGuard>{children}</DesktopOnlyGuard>
                    </SnackbarProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
