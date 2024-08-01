// Layout.js
function Layout({ children }) {
  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div
        className="d-flex flex-column flex-shrink-0 p-3"
        style={{
          width: "280px",
          backgroundColor: "#d1d5db",
          borderRight: "2px solid #000",
        }}
      >
        <p>Home</p>
        <p>Home</p>
        <p>Home</p>
        <p>Home</p>
      </div>
      <div className="flex-grow-1 p-4" style={{ overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
