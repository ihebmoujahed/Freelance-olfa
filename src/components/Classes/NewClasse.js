import { Container, Row, Col, Modal, Table, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function NewClasse() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    groupNumber: "",
    TeacherName: "",
    subject: "",
  });

  const [showModalteacher, setShowModalteacher] = useState(false); // State to control teacher modal visibility

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = () => {
    axios
      .get("http://localhost:3001/getTeacher")
      .then((response) => {
        setTeachers(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
        setTeachers([]);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/addClasses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Data inserted successfully");
        setFormData({
          groupNumber: "",
          TeacherName: "",
          subject: "",
        });
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleChangeTeacher = (teacher) => {
    setFormData({
      ...formData,
      TeacherName: teacher.nom,
      subject: teacher.subject,
    });
    toggleModalteacher(); // Close the modal after selecting a teacher
  };

  const toggleModalteacher = () => {
    setShowModalteacher(!showModalteacher);
  };

  return (
    <>
      <div className="text-center mb-4">
        <h1 style={{ fontSize: "2.5rem" }}>التسجيل</h1>
      </div>
      <hr style={{ margin: "20px 0" }} />

      <Container style={{ direction: "rtl", marginTop: "50px" }}>
        <Row className="justify-content-center">
          <Col lg={8}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="groupNumber" style={{ fontSize: "1.5rem" }}>
                  اسم المجموعة
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="groupNumber"
                  placeholder="الاسم"
                  value={formData.groupNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, groupNumber: e.target.value })
                  }
                  style={{ fontSize: "1.2rem" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="TeacherName" style={{ fontSize: "1.5rem" }}>
                  اسم الأستاذ
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="TeacherName"
                    placeholder="اسم الأستاذ"
                    value={formData.TeacherName}
                    onChange={(e) =>
                      setFormData({ ...formData, TeacherName: e.target.value })
                    }
                    style={{ fontSize: "1.2rem" }}
                    readOnly
                  />
                  <div className="input-group-append">
                    <Button variant="primary" onClick={toggleModalteacher} style={{ fontSize: "1.2rem" }}>
                      عرض الاساتذ
                    </Button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" style={{ fontSize: "1.5rem" }}>
                  المادة
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="subject"
                  placeholder="المادة"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  style={{ fontSize: "1.2rem" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                style={{ fontSize: "1.5rem" }}
              >
                تسجيل
              </button>
            </form>
          </Col>
        </Row>

        {/* Modal Section */}
        <Modal
          show={showModalteacher}
          onHide={toggleModalteacher}
          centered
          dir="rtl"
        >
          <Modal.Header closeButton>
            <Modal.Title>قائمة الاساتذة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم الاساتذ(ة)</th>
                  <th>لقب الاساتذ(ة)</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher, index) => (
                  <tr key={index} onClick={() => handleChangeTeacher(teacher)}>
                    <td>{index + 1}</td>
                    <td>{teacher.nom}</td>
                    <td>{teacher.prenom}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={toggleModalteacher}
              style={{ fontSize: "1.2rem" }}
            >
              إغلاق
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}

export default NewClasse;
