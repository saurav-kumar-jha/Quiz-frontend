import { useEffect, useState } from 'react'
import './App.css'
import Nav from './components/nav'
import QuizMasterHomepage from './page/homepage'
import Footer from './components/footer'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import AuthPages from './page/authPage'
import TeacherDashboard from './page/teacherDashboard'
import ForgotPassword from './page/forgetPasswordPage'
import ResetPassword from './page/resetPasswordPage'
import { useAuth } from './context/AuthProvider'
import api from './util/authApi'
import QuizDetailPage from './page/quizDetailPage'

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
    },
    {
      path:"/auth/forget-password",
      element:<ForgotPassword/>
    },
    {
      path:"/auth/reset-password",
      element:<ResetPassword/>
    },
    {
      path:"/quiz/:id",
      element:<QuizDetailPage />
    }
  ]
  }
])
function App() {
  const {user,setUser,isLoggedIn,setIsLoggedIn} = useAuth();

  useEffect(()=>{
    const validate_token = async()=>{
      const res = await api.get(`/test/validate/${user.token}`)
      // console.log("isvalid",res)

      if(res.status != 200){
        setUser({ id: "", username: "", email: "", token: "", created_at: "", role: "" });
    setIsLoggedIn(false);
    localStorage.removeItem("user");
      }
    }
    validate_token()
  },[])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
