import {  RouterProvider } from "react-router-dom"
import route from "./routes/route"
import { Toaster } from "react-hot-toast";


function App() {

  return (
    <>
     <RouterProvider router={route} />
     <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
