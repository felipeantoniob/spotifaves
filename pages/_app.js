import { Provider } from 'next-auth/client'
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
