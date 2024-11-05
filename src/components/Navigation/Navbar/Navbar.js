import React, { useState } from "react";
import { Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaCogs, FaSignOutAlt, FaBook } from "react-icons/fa";

function CustomNavbar() {
  const [show, setShow] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href='https://test-erp-olfa.netlify.app/'
    // Navigate to login page after logout
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="py-3 shadow-sm"
      style={{ direction: "rtl", position: "relative" }}
    >
      <Button
        className="d-md-none"
        variant="outline-light"
        onClick={handleShow}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
        }}
      >
        ☰
      </Button>
      <Navbar.Brand href="#home" className="mx-auto font-weight-bold">
        فضاء الجنوب
      </Navbar.Brand>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton className="bg-primary text-white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-light">
          <Nav className="flex-column">
            <Nav.Item className="my-2">
              <Link to="/dashboard" className="nav-link text-primary">
                <FaHome className="me-2" /> الصفحة الرئيسية
              </Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Link to="/List/Classes" className="nav-link text-primary">
                <FaBook className="me-2" /> الأقسام
              </Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Link to="/List/Std" className="nav-link text-primary">
                <FaUserGraduate className="me-2" /> التلاميذ
              </Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Link to="/List/Teacher" className="nav-link text-primary">
                <FaChalkboardTeacher className="me-2" /> الأساتذة
              </Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Link to="/List/Settings" className="nav-link text-primary">
                <FaCogs className="me-2" /> الإعدادات
              </Link>
            </Nav.Item>
            <hr />
            <Nav.Item className="my-2">
              <Link to="/Login" className="nav-link text-danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> تسجيل الخروج
              </Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default CustomNavbar;
