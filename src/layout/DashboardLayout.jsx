import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setIsOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={() => setIsOpen(!isOpen)}
        isMobile={isMobile}
      />

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="overlay" onClick={() => setIsOpen(false)} />
      )}

      <main
        className="main-content"
        style={{
          marginLeft: !isMobile && isOpen ? "260px" : "70px",
        }}
      >
        <Outlet />
      </main>
    </>
  );
}
