import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import LogicFlowMain from "./logic-flow";
import ElectronApply from './electrorn-apply'

function App() {
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState(document.title)

  const btnClickHandle: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    console.log('here btn click handle:', event)
    if (!window.isolatedShare) {
      return
    }
    window.isolatedShare.setTitle(title)
  }
  
  const openShowOpenDialog = async () => {
    console.log('here btn click handle - openShowOpenDialog:')
    if (!window.isolatedShare) {
      return
    }
    const res = await window.isolatedShare.getFileChoosePath()
    const input = document.querySelector('#filePathInput') as HTMLInputElement
    if (input && res) {
      if (res.canceled) {
        input.value = ''
      } else {
        const path = Array.isArray(res.filePaths) ? res.filePaths[0] || '' : ''
        input.value = path
      }
    }

  }

  return (
    <>
      <LogicFlowMain></LogicFlowMain>
      <ElectronApply></ElectronApply>
    </>
  );
}

export default App
