import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import MainLayout from "./layout/MainLayout"

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App