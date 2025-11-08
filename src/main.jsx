import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import { AuthProvider } from './Context/AuthContext'
import Menu from './pages/menu.jsx'
import { store } from './Store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
   <AuthProvider>
    <Provider store={store}>
    {/* <SignUp /> */}
    {/* <SignIn /> */}
    <Menu />
    </Provider>
   </AuthProvider>
  </StrictMode>,
)
