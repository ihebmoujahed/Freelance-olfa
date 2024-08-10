import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Modal, Button, Form, Alert } from "react-bootstrap";

function ClassesList() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPaymentStudent, setSelectedPaymentStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [totalseance, settotalseance] = useState(null);
  const [teacherattendance, setTeacherAttendance] = useState([]);
  const [teacherinfo, setteacherinfo] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const handleAlertClose = () => setShowAlert(false);

  useEffect(() => {
    const date = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    setCurrentDate(date);
    const fetchClassData = async () => {
      try {
        const classResponse = await axios.get(
          `http://localhost:3001/classeinformation/${id}`
        );
        const classInfo = classResponse.data.rows[0];
        setClassInfo(classInfo);

        const { teacher_id, groupnumber } = classInfo;
        const studentResponse = await axios.get(
          `http://localhost:3001/ClassesList/${teacher_id}/${groupnumber}`
        );

        const studentsWithAttendance = await Promise.all(
          studentResponse.data.map(async (student) => {
            const numberSeanceResponse = await axios.get(
              `http://localhost:3001/getNumberSeance/${student.student_id}/${classInfo.id}`
            );
            const numberSeance = numberSeanceResponse.data.number_seance;
            return {
              id: student.student_id,
              studentnom: student.studentnom,
              studentprenom: student.studentprenom,
              attendance: student.attendance || "absent",
              number_seance: numberSeance,
            };
          })
        );
        setStudentList(studentsWithAttendance);

        // Fetch teacher attendance
        try {
          const response = await axios.get(
            `http://localhost:3001/getTeacherAttendance/${teacher_id}/${classInfo.id}`
          );
          const result = response.data;

          const totalPresent = result.reduce((total, teacher) => {
            return total + (teacher.is_present ? 1 : 0);
          }, 0);

          settotalseance(totalPresent + 1);
        } catch (error) {
          console.error("Error fetching teacher attendance:", error);
          setTeacherAttendance([]);
        }
        // Fetch teacherinfo
        try {
          const response = await axios.get(
            `http://localhost:3001/getTeachersinfo/${teacher_id}`
          );
          const result = response.data.rows;
          setteacherinfo(result);
        } catch (error) {
          console.error("Error fetching teacher info:", error);
          setteacherinfo([]);
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setClassInfo(null);
        setStudentList([]);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/getStudent");
        setAllStudents(response.data.rows);
      } catch (error) {
        console.error("Error fetching all students:", error);
        setAllStudents([]);
      }
    };

    fetchClassData();
    fetchAllStudents();
  }, [id]);

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const handleConfirmModalShow = (student) => {
    setSelectedPaymentStudent(student);
    setShowConfirmModal(true);
  };
  const handleConfirmModalClose = () => setShowConfirmModal(false);

  const handleSelectChange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const student = {
      id: selectedOption.value,
      nom: selectedOption.getAttribute("data-nom"),
      prenom: selectedOption.getAttribute("data-prenom"),
    };
    setSelectedStudent(student);
  };

  const handleAddStudent = async () => {
    if (!selectedStudent) {
      alert("Please select a student.");
      return;
    }

    const { groupnumber } = classInfo;
    const { id, nom, prenom } = selectedStudent;

    try {
      await axios.post("http://localhost:3001/addClasseStd", {
        studentId: id,
        groupNumber: groupnumber,
        teacherId: classInfo.teacher_id,
      });

      const studentResponse = await axios.get(
        `http://localhost:3001/ClassesList/${classInfo.teacher_id}/${groupnumber}`
      );
      const studentsWithAttendance = await Promise.all(
        studentResponse.data.map(async (student) => {
          const numberSeanceResponse = await axios.get(
            `http://localhost:3001/getNumberSeance/${student.student_id}`
          );
          const numberSeance = numberSeanceResponse.data.number_seance || 0;
          return {
            id: student.student_id,
            studentnom: student.studentnom,
            studentprenom: student.studentprenom,
            attendance: student.attendance || "absent",
            number_seance: numberSeance,
          };
        })
      );
      setStudentList(studentsWithAttendance);
      setSelectedStudent(null);
      handleModalClose();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("An error occurred while adding the student.");
    }
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    const updatedStudentList = studentList.map((student) => {
      if (student.id === studentId) {
        const newNumberSeance = isPresent
          ? (parseInt(student.number_seance) || 0) + 1
          : Math.max((student.number_seance || 1) - 1, 0);

        return {
          ...student,
          attendance: isPresent ? "present" : "absent",
          number_seance: newNumberSeance,
        };
      }
      return student;
    });
    setStudentList(updatedStudentList);
  };

  const submitAttendance = async () => {
    const attendanceRecords = studentList.map((student) => ({
      student_id: student.id,
      class_id: classInfo.id,
      date: currentDate,
      is_present: student.attendance === "present",
      number_seance: student.attendance === "present" ? 1 : 0,
    }));

    const teacherAttendanceRecord = {
      teacher_id: classInfo.teacher_id,
      class_id: classInfo.id,
      date: currentDate,
      is_present: studentList.some(
        (student) => student.attendance === "present"
      ), // True if any student is present
      number_seance: studentList.reduce(
        (total, student) => total + (student.attendance === "present" ? 1 : 0),
        0
      ),
    };

    try {
      await axios.post("http://localhost:3001/PresenceStd", attendanceRecords);
      const response = await axios.post(
        "http://localhost:3001/recordTeacherAttendance",
        teacherAttendanceRecord
      );
      if (response.data.includes("student attendance archived")) {
        setAlertMessage(
          "تم تأكيد تسجيل الحضور بنجاح."
        );
      } else {
        setAlertMessage("Attendance submitted successfully.");
      }
      setAlertVariant("success");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setAlertMessage("An error occurred while submitting attendance.");
      setAlertVariant("danger");
    } finally {
      setShowAlert(true);
    }
  };

  const handlePayment = async () => {
    const { id: studentId, number_seance: numberSeance } =
      selectedPaymentStudent;
    const pricePerSession = teacherinfo[0]?.price || 0;
    const paymentAmount = pricePerSession * numberSeance;

    try {
      await axios.post("http://localhost:3001/PaymentStudent", {
        student_id: studentId,
        amount: paymentAmount,
        payment_date: currentDate,
        attendance_count: numberSeance,
      });

      // Display success alert
      setAlertMessage("تم تاكيد دفع التلميذ منجاح.");
    } catch (error) {
      console.error("Error recording payment:", error);
      // Display error alert
      setAlertMessage("توجد خطأ اثناء القيام بعملية الدفع.");
      setAlertVariant("danger");
    } finally {
      setShowConfirmModal(false);
      setShowAlert(true);
    }
  };
  const handleNotPayment = async () => {
    const { id: studentId, number_seance: numberSeance } =
      selectedPaymentStudent;
    const pricePerSession = teacherinfo[0]?.price || 0;
    const paymentAmount = pricePerSession * 0;

    try {
      await axios.post("http://localhost:3001/PaymentStudent", {
        student_id: studentId,
        amount: paymentAmount,
        payment_date: currentDate,
        attendance_count: numberSeance,
      });

      // Display success alert
      setAlertMessage("تم تاكيد دفع التلميذ منجاح.");
    } catch (error) {
      console.error("Error recording payment:", error);
      // Display error alert
      setAlertMessage("توجد خطأ اثناء القيام بعملية الدفع.");
      setAlertVariant("danger");
    } finally {
      setShowConfirmModal(false);
      setShowAlert(true);
    }
  };

  const getTotalAttendance = () => {
    return studentList.filter((student) => student.attendance === "present")
      .length;
  };

  if (!classInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ direction: "rtl" }}>
        <h1 className="text-center my-4">
          {classInfo.level} {classInfo.module} - {currentDate} - حصة رقم :{" "}
          {totalseance}
        </h1>
        <hr />
        <Button
          variant="primary"
          onClick={handleModalShow}
          style={{ position: "absolute", left: "0" }}
        >
          اضافة تلميذ(ة)
        </Button>
        <div style={{ marginTop: "100px" }}>
          {showAlert && (
            <Alert
              variant={alertVariant}
              onClose={handleAlertClose}
              dismissible
            >
              <Alert.Heading>
                {alertVariant === "success" ? "Success" : "Error"}
              </Alert.Heading>
              <p className="mb-0">{alertMessage}</p>
            </Alert>
          )}
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th scope="col">الرقم</th>
                <th scope="col">الاسم</th>
                <th scope="col">اللقب</th>
                <th scope="col">ح</th>
                <th scope="col">غ</th>
                <th scope="col">Number of Sessions</th>
                <th scope="col">الدفع</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((std, index) => (
                <tr key={std.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{std.studentnom}</td>
                  <td>{std.studentprenom}</td>
                  <td>
                    <Form.Check
                      type="radio"
                      id={`present-radio-${std.id}`}
                      name={`attendance-${std.id}`}
                      checked={std.attendance === "present"}
                      onChange={() => handleAttendanceChange(std.id, true)}
                    />
                  </td>
                  <td>
                    <Form.Check
                      type="radio"
                      id={`absent-radio-${std.id}`}
                      name={`attendance-${std.id}`}
                      checked={std.attendance === "absent"}
                      onChange={() => handleAttendanceChange(std.id, false)}
                    />
                  </td>
                  <td>{std.number_seance}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleConfirmModalShow(std)}
                      disabled={totalseance !== 4}
                    >
                      Pay
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button variant="success" onClick={submitAttendance}>
            تسجيل الحضور
          </Button>
        </div>

        {/* Modal for adding a student */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>اختيار تلميذ(ة)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formStudentSelect">
                <Form.Label>Select Student</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStudent ? selectedStudent.id : ""}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a student</option>
                  {allStudents.map((student) => (
                    <option
                      key={student.id}
                      value={student.id}
                      data-nom={student.nom}
                      data-prenom={student.prenom}
                    >
                      {student.nom} {student.prenom}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              غلق
            </Button>
            <Button variant="primary" onClick={handleAddStudent}>
              اضافة تلميذ(ة)
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Confirmation Modal for payment */}
        <Modal show={showConfirmModal} onHide={handleConfirmModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            التاكد من الدفع for{" "}
            {selectedPaymentStudent?.studentnom}{" "}
            {selectedPaymentStudent?.studentprenom}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleConfirmModalClose}>
              الغاء
            </Button>
            <Button variant="success " onClick={handlePayment}>
              الدفع
            </Button>
            <Button variant="danger " onClick={handleNotPayment}>
              لم يقم بعملبة الدفع
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
}

export default ClassesList;
