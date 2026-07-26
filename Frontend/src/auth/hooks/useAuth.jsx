import {AuthContext} from "../auth.context.jsx"
import {login , register , logout, getUser} from "../services/auth.api.js"
import { useContext, useEffect } from "react"

export const useAuth = ()=>{
   const context = useContext(AuthContext)

   const {user , setUser , loading , setLoading} = context

   const handleLogin = async({email , password})=>{
       setLoading(true)
       try {
           const data = await login({email , password})
           if (data && data.success && data.user) {
               setUser(data.user)
           }
           return data  // Return so Login.jsx can check success/error
       } catch (error) {
           console.log("Login failed:", error)
           return { success: false, message: "Login failed. Please try again." }
       } finally {
           setLoading(false)
       }
   }

   const handleRegister = async({name, email, username, password})=>{
    setLoading(true)
    try {
        const data = await register({name, email, username, password})
        if (data && data.success && data.user) {
            setUser(data.user)
        }
        return data  // Return so Register.jsx can check success/error
    } catch (error) {
        console.log("Register failed:", error)
        return { success: false, message: "Registration failed. Please try again." }
    } finally {
        setLoading(false)
    }
    }

    const handleLogout = async()=>{
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
            return data
        } catch (error) {
            console.log("Logout failed:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleGetUser = async()=>{
        setLoading(true)
        try {
            const data = await getUser()
            if (data && data.user) {
                setUser(data.user)
            }
            return data
        } catch (error) {
            console.log("Get user failed:", error)
        } finally {
            setLoading(false)
        }
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


