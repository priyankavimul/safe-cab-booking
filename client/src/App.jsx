function App() {
  return (
    <Router>
      {/* This div class connects to the CSS above */}
      <div className="app-container"> 
        <nav>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
}