import React, { useState } from "react";
import { Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { useHistory } from "react-router-dom";

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
    <Navbar bg="primary" variant="dark" style={{ direction: "rtl", position: "relative" }}>
      <Button 
        className="d-md-none" 
        variant="primary" 
        onClick={handleShow} 
        style={{
          position: "absolute", 
          top: "10px", 
          left: "10px", 
          zIndex: 1 // Ensure it is above other content
        }}
      >
        ☰
      </Button>
      <Navbar.Brand href="#home">فضاء الجنوب</Navbar.Brand>

      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item>
              <Nav.Link href="#home">الصفحة الرئيسية</Nav.Link>
            </Nav.Item>
            <hr />
            <Nav.Item>
              <Nav.Link href="#dashboard">الرئيسية</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/List/Classes">الأقسام</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/List/Std">التلاميذ</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/List/Teacher">الأساتذة</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/List/Std">الإعدادات</Nav.Link>
            </Nav.Item>
            <hr />
            <Nav.Item>
              <Nav.Link
                onClick={handleLogout}
                style={{ cursor: "pointer", color: "red" }}
              >
                تسجيل الخروج
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </Navbar>
  );
}

export default CustomNavbar;
