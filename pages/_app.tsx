import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import Layout from '../components/Layout'
import '../styles/main.scss'

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
