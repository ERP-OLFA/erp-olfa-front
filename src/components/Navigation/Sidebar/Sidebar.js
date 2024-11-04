// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaCogs, FaSignOutAlt, FaBook } from 'react-icons/fa';

function Sidebar() {
  const history = useHistory();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="sidebar d-none d-md-block"  style={{ direction: "rtl" }}>
        <Nav className="flex-column">
          <Nav.Item>
            <Link to="/dashboard" className="nav-link">
              <FaHome className="me-2" /> الصفحة الرئيسية
            </Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Link to="/List/Classes" className="nav-link">
              <FaBook className="me-2" /> الأقسام
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Std" className="nav-link">
              <FaUserGraduate className="me-2" /> التلاميذ
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Teacher" className="nav-link">
              <FaChalkboardTeacher className="me-2" /> الأساتذة
            </Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Settings" className="nav-link">
              <FaChalkboardTeacher className="me-2" /> الاعدادات
            </Link>
          </Nav.Item>

          <hr />
          <Nav.Item>
          <Link to="/Login" className="nav-link" onClick={handleLogout}>
          <FaSignOutAlt className="me-2" /> تسجيل الخروج
            </Link>
          </Nav.Item>
        </Nav>
      </div>
      
    </>
  );
}

export default Sidebar;
