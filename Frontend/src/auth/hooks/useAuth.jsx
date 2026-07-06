import {AuthContext} from "../authContext.jsx"
import {login , register , logout, getUser} from "../services/auth.api.js"
import { useContext, useEffect } from "react"

export const useAuth = ()=>{
   const context = useContext(AuthContext)

   const {user , setUser , loading , setLoading} = context

   const handleLogin = async({email , password})=>{
       setLoading(true)
       try {
           const data = await login({email , password})
           console.log(data)
           if (data && data.user) {
               setUser(data.user)
           }
       } catch (error) {
           console.log("Login failed:", error)
       } finally {
           setLoading(false)
       }
   }

   const handleRegister = async({email ,username,password})=>{
    setLoading(true)
    try {
        const data = await register({email ,username, password})
        console.log(data)
        if (data && data.user) {
            setUser(data.user)
        }
    } catch (error) {
        console.log("Register failed:", error)
    } finally {
        setLoading(false)
    }
    }

    const handleLogout = async()=>{
        setLoading(true)
            const data = await logout()
            console.log(data)
            setUser(null)
            setLoading(false)
    
    }

    const handleGetUser = async()=>{
        setLoading(true)
            const data = await getUser()
            console.log(data)

            setLoading(false)
    
    }

    useEffect(()=>{
        const getAndSetUser = async()=>{
            try {
                const data = await getUser()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (error) {
                console.log("Failed to fetch user:", error)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return {
        user,
        setUser,
        loading,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetUser
    }
   

}


