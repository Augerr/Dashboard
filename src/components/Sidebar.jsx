import { Link } from "react-router-dom"

function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#111", color: "#fff", height: "100vh" }}>
      <h2 style={{ padding: "10px" }}>Dashboard</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>
    </div>
  )
}

export default Sidebar