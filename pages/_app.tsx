import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
// import { ReactQueryDevtools } from 'react-query/devtools'

import Layout from '../components/Layout'
import '../styles/main.scss'

const queryClient = new QueryClient()

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps): JSX.Element => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session} refetchInterval={5 * 60}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
