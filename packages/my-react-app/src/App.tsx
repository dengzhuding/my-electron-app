import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState(document.title)

  const btnClickHandle: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    console.log('here btn click handle:', event)
    window.setTitle && window.setTitle(title)
  }

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      
      <div className='flex flex-col'>
        <p className=''>title: {title}</p>
        <input className='border ' type="text" value={title} onChange={event => setTitle(event.target.value)}/>
        <button className='border-violet-500' onClick={btnClickHandle}>set title</button>
      </div>
    </>
  )
}

export default App
