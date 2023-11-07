import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ backgroundColor: "#F0F2F5", height: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default Layout;
