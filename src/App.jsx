import { useState } from 'react'
import './App.css'
import Nav from './components/nav'
import QuizMasterHomepage from './page/homepage'
import Footer from './components/footer'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import AuthPages from './page/authPage'
import TeacherDashboard from './page/teacherDashboard'

const Home = ()=>{
  const navigate = useLocation()
  return(
    <section>
      <Nav/>
      {
        navigate.pathname == "/" ? <QuizMasterHomepage/> : <Outlet/>
      }
      <Footer/>
    </section>
  )
}

const router = createBrowserRouter([
  {
    path:"/",
    element:<Home/>,
    children:[{
      path:"/auth",
      element:<AuthPages/>
    },
    {
      path:"/teacher/dashboard",
      element:<TeacherDashboard/>
    }
  ]
  }
])
function App() {


  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
