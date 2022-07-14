import { useEffect, useState } from 'react'

const useFooterOnScroll = () => {
  const [showFooter, setShowFooter] = useState(false)

  const onScroll = () => {
    if (window.pageYOffset > 300) {
      setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { showFooter }
}

export default useFooterOnScroll
