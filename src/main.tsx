import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'
import 'normalize.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
    <App />
    </HashRouter>
    {/* <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter> */}
  </StrictMode>,
)

/*References: 
- https://stackoverflow.com/questions/63462828/404-error-on-refresh-with-spa-react-router-app-in-github-pages
*/