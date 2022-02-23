import { AnimatePresence } from 'framer-motion'
// import Footer from './Footer'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="content">
      <Navbar />

      <AnimatePresence exitBeforeEnter>
        {children}
        {/* <Footer /> */}
      </AnimatePresence>
    </div>
  )
}

export default Layout
