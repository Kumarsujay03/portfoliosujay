import Header from "@/components/Header";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <RouteScrollToTop />
      <Header />
      <Outlet />
    </>
  );
};

export default AppLayout;
