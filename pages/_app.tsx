import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/main.scss'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => {
  return (
    // <SessionProvider session={pageProps.session}>
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default MyApp
