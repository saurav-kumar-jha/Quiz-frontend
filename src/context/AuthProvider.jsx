import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [user, setUser]= useState({id:"",username:"",email:"",token:"",created_at:"",role:""})
    const [isLoggedIn, setisLoggedIn]= useState(false)

    return(
        <AuthContext.Provider value={{user,setUser,isLoggedIn,setisLoggedIn}}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = ()=>useContext(AuthContext);