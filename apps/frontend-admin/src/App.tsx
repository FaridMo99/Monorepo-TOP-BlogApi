import { useState } from 'react'
import './App.css'
import { Button } from "@monorepotopblogapi/ui"

function App() {
  const [state,setState] = useState(false)

  return (
    <>
      <Button onClick={()=>{setState(pre=>!pre)}}>
        Hello
      </Button>
      {state && <p className='bg-green-500'>!!!</p>}
    </>
  )
}

export default App
