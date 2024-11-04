import React, { useState } from "react";
import { Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaCogs, FaSignOutAlt, FaBook } from "react-icons/fa";

function CustomNavbar() {
  const [show, setShow] = useState(false);
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    history.push("/");
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
              <Nav.Link href="/dashboard" className="text-primary">
                <FaHome className="me-2" /> الصفحة الرئيسية
              </Nav.Link>
            </Nav.Item>
            
            <Nav.Item className="my-2">
              <Nav.Link href="/List/Classes" className="text-primary">
                <FaBook className="me-2" /> الأقسام
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Nav.Link href="/List/Std" className="text-primary">
                <FaUserGraduate className="me-2" /> التلاميذ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Nav.Link href="/List/Teacher" className="text-primary">
                <FaChalkboardTeacher className="me-2" /> الأساتذة
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="my-2">
              <Nav.Link href="/List/Settings" className="text-primary">
                <FaCogs className="me-2" /> الإعدادات
              </Nav.Link>
            </Nav.Item>
            <hr />
            <Nav.Item className="my-2">
              <Nav.Link
                onClick={handleLogout}
                className="text-danger"
                style={{ cursor: "pointer" }}
              >
                <FaSignOutAlt className="me-2" /> تسجيل الخروج
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default CustomNavbar;
