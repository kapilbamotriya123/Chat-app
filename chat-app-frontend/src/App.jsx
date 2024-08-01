import axios from 'axios'
import { UserContextProvider } from './userContext'
import Register from './components/Register'

const App=() => {
axios.defaults.baseURL = 'http://localhost:3001'
axios.defaults.withCredentials = true

  return (
    <UserContextProvider>
      <Register />
    </UserContextProvider>
  )
}

export default App