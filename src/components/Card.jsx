function Card({ title, value }) {
  return (
    <div style={{
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  )
}

export default Card