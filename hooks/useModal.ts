import { useState } from 'react'

const useModal = () => {
  const [isModalShowing, setIsModalShowing] = useState(false)

  function toggleModal() {
    setIsModalShowing(!isModalShowing)
  }

  return {
    isModalShowing,
    toggleModal,
  }
}

export default useModal
