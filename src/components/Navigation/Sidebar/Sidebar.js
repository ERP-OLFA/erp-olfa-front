import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import './Sidebar.css';
import { FaHome, FaChalkboardTeacher, FaUserGraduate, FaSignOutAlt, FaBook } from 'react-icons/fa';

function Sidebar() {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href='https://test-erp-olfa.netlify.app/';
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'} Sidebar
      </button>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
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
            <Link className="nav-link" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> تسجيل الخروج
            </Link>
          </Nav.Item>
        </Nav>
      </div>
    </>
  );
}

export default Sidebar;
