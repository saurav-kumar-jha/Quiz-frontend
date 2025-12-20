import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../util/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser
      ? JSON.parse(storedUser)
      : { id: "", username: "", email: "", token: "", created_at: "", role: "" };
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("user"); 
  });
  const [Isloading, setLoading] = useState(true)

  useEffect(() => {
    if (user && user.token) {
      localStorage.setItem("user", JSON.stringify(user));
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    }
  }, [user]);

  const validateToken = async ()=>{
    if(!user?.token){
      setLoading(false)
      return;
    }

    try {
      const res = await api.get(`/test/validate`,{
        "headers":{
          "Authorization":`Bearer ${user.token}`
        }
      })
      console.log(res)
      
      const resUser = await api.get("/auth/me",{
        "headers":{
          "Authorization": `Bearer ${user.token}`
        }
      })
      console.log(resUser)
      setIsLoggedIn(true)
    } catch (error) {
      console.log(error)
      if(error.response?.status == 401){
        logout()
      }
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    validateToken()
  },[])


  const logout = () => {
    setUser({ id: "", username: "", email: "", token: "", created_at: "", role: "" });
    setIsLoggedIn(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout, Isloading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
