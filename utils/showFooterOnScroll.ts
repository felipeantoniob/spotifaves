export const showFooterOnScroll = (
  setShowFooter: React.Dispatch<React.SetStateAction<boolean>>
) => {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      setShowFooter(true)
    } else {
      setShowFooter(false)
    }
  })
}
