import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Pools from './pages/Pools.tsx'
import QuizPage from './pages/QuizPage.tsx'
import SwipePage from './pages/SwipePage.tsx'
import SwapPage from './pages/SwapPage.tsx'
import App from './App.tsx'
import './index.css'
import { AppStateProvider } from './state/appState.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <QuizPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'swipe', element: <SwipePage /> },
      { path: 'swap', element: <SwapPage /> },
      { path: 'pools', element: <Pools /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppStateProvider>
      <RouterProvider router={router} />
    </AppStateProvider>
  </React.StrictMode>,
)
