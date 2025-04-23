import { useState } from 'react'

const App = () => {
  const [value, setValue] = useState(10)


  const hello = () => {
    const handler = () => console.log('hello world')
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
export default App