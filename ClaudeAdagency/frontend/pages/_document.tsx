import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom _document.tsx
 * - Google Fonts loaded ONCE here instead of in every page (saves 5 extra requests)
 * - Default meta tags (overridden per-page via next/head)
 * - Preconnects to external domains
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnects — load before any request */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts — loaded ONCE globally */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Default Open Graph (overridden per-page) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TheCraftStudios" />
        <meta property="og:image" content="https://www.thecraftstudios.in/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@thecraftstudios" />
        <meta name="twitter:image" content="https://www.thecraftstudios.in/og-image.png" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* Theme colour (browser chrome on mobile) */}
        <meta name="theme-color" content="#0A0A0A" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
