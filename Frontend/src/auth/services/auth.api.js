import axios from "axios"

const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})

export async function register({ name, username, email, password }){
  try {
    const response = await api.post("/api/auth/register",{
        name,
        username,
        email,
        password
    })
    return response.data
  } catch (error) {
    // Return error response data so the UI can show the message
    if (error.response && error.response.data) {
      return error.response.data
    }
    console.log(error)
    return { success: false, message: "Network error. Please try again." }
  }
}

export async function login({email, password}){
    try {
      const response = await api.post("/api/auth/login",{
          email,
          password
        })
        return response.data
    } catch (error) {
        if (error.response && error.response.data) {
          return error.response.data
        }
        console.log(error)
        return { success: false, message: "Network error. Please try again." }
    }
  }

  export async function logout(){
    try {
      const response = await api.delete("/api/auth/logout")
      return response.data
    } catch (error) {
      console.log(error)
    }
}

export async function getUser(){
    try {
        const response = await api.get("/api/auth/get-me")
        return response.data
    } catch (error) {
        // Don't log 401 errors (user not logged in - expected)
        if (error.response && error.response.status !== 401) {
          console.log(error)
        }
        return null
    }
}