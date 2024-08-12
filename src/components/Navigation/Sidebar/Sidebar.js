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
    window.location.href = "/Login";
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="sidebar d-none d-md-block">
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
              <FaCogs className="me-2" /> الإعدادات
            </Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Link onClick={handleLogout} className="nav-link logout-link">
              <FaSignOutAlt className="me-2" /> تسجيل الخروج
            </Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Offcanvas for mobile view */}
      <Button variant="primary" className="d-md-none" onClick={handleShow}>
        القائمة
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={{ direction: 'rtl' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>القائمة</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item>
              <Link to="/dashboard" className="nav-link" onClick={handleClose}>
                <FaHome className="me-2" /> الصفحة الرئيسية
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/List/Classes" className="nav-link" onClick={handleClose}>
                <FaBook className="me-2" /> الأقسام
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/List/Std" className="nav-link" onClick={handleClose}>
                <FaUserGraduate className="me-2" /> التلاميذ
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/List/Teacher" className="nav-link" onClick={handleClose}>
                <FaChalkboardTeacher className="me-2" /> الأساتذة
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/List/Settings" className="nav-link" onClick={handleClose}>
                <FaCogs className="me-2" /> الإعدادات
              </Link>
            </Nav.Item>
            <hr />
            <Nav.Item>
              <Link onClick={() => { handleClose(); handleLogout(); }} className="nav-link logout-link">
                <FaSignOutAlt className="me-2" /> تسجيل الخروج
              </Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar;
