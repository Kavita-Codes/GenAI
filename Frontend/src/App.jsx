import { RouterProvider } from "react-router-dom"
import router from "./routes"
import AuthProvider from "./auth/auth.context.jsx"
import  InterviewProvider from "./interview/interview.context.jsx"

const App = () => {
  return (
  <AuthProvider>
    <InterviewProvider>
    <RouterProvider router={router} />
    </InterviewProvider>
  </AuthProvider>
  )
}

export default App