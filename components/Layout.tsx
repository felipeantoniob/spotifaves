// import Footer from './Footer'
import { AnimatePresence } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  return (
    <div className="content">
      <AnimatePresence exitBeforeEnter>
        {children}
        {/* <Footer /> */}
      </AnimatePresence>
    </div>
  )
}

export default Layout
