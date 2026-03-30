function Navbar() {
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    };
  
    return (
      <div style={{
        height: "60px",
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid #ccc"
      }}>
        <h3>AI Resume Builder Dashboard</h3>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
  
  export default Navbar;