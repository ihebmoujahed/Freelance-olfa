// src/components/Sidebar/Sidebar.js
import React, { useState } from 'react';
import { Nav, Button, Offcanvas } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const history = useHistory();
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = ("/Login")
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="sidebar d-none d-md-block">
        <Nav className="flex-column">
          <Nav.Item>
            <Link to="/dashboard" className="nav-link">الصفحة الرئيسية</Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Classes" className="nav-link">الأقسام</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Std" className="nav-link">التلاميذ</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Teacher" className="nav-link">الأساتذة</Link>
          </Nav.Item>
          <Nav.Item>
            <Link to="/List/Settings" className="nav-link">الإعدادات</Link>
          </Nav.Item>
          <hr />
          <Nav.Item>
            <Link onClick={handleLogout} className="nav-link" style={{ cursor: 'pointer', color: 'red' }}>تسجيل الخروج</Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* Offcanvas for mobile view */}
      
    </>
  );
}

export default Sidebar;
