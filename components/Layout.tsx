import { AnimatePresence } from 'framer-motion'
// import Footer from './Footer'
import Navbar from './Navbar'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { status } = useSession()
  const authenticated = status === 'authenticated'
  return (
    <>
      <Head>
        <title>Spotifaves</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/ */}
        <link rel="manifest" href="/manifest.json" />
        {/* <link rel="shortcut icon" href="/favicons/favicon.ico" /> */}
        <link rel="icon" href="favicons/favicon.ico" />

        <meta name="description" content="A web app for visualizing personalized Spotify data" />
        <meta property="og:title" content="Spotify App" />
        <meta property="og:type" content="website" />
        <meta
          property="og:description"
          content="A web app for visualizing personalized Spotify data"
        />
        <meta property="og:url" content="https://spotifaves.vercel.app/" />
        <meta property="og:site_name" content="Spotify App" />
        {/* <meta property="og:image" content="https://spotify-profile.herokuapp.com/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" /> */}
        <meta property="og:locale" content="en_US" />
        <meta itemProp="name" content="Spotify Profile" />
        <meta
          itemProp="description"
          content="A web app for visualizing personalized Spotify data"
        />
        {/* <meta itemProp="image" content="https://spotify-profile.herokuapp.com/og.png" /> */}

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="spotifaves.vercel.app/favicons/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="spotifaves.vercel.app/favicons/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="spotifaves.vercel.app/favicons/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="spotifaves.vercel.app/favicons/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="spotifaves.vercel.app/favicons/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="spotifaves.vercel.app/favicons/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="spotifaves.vercel.app/favicons/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="spotifaves.vercel.app/favicons/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="spotifaves.vercel.app/favicons/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="spotifaves.vercel.app/favicons/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="spotifaves.vercel.app/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="spotifaves.vercel.app/favicons/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="spotifaves.vercel.app/favicons/favicon-16x16.png"
        />
        <meta
          name="msapplication-TileImage"
          content="spotifaves.vercel.app/favicons/ms-icon-144x144.png"
        />
        <meta name="msapplication-TileColor" content="#181818" />
        <meta name="theme-color" content="#181818" />
      </Head>
      <div className="content">
        {authenticated && <Navbar />}

        <AnimatePresence exitBeforeEnter>
          {children}
          {/* <Footer /> */}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Layout
