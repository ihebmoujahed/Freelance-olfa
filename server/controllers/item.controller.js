// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
var db = require("../database-pg");

////////////////////////////////////////////////////////////////////////////////////////////////
const addTeacher = function (req, res) {
  var cond = req.body;
  var insert = `INSERT INTO teacher  (nom ,prenom ,numerotlf,cardid,subject,price)values('${cond.nom}','${cond.prenom}','${cond.numerotlf}','${cond.cardid}','${cond.subject}','${cond.price}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const recordTeacherAttendance = async function (req, res) {
  const { teacher_id, class_id, date } = req.body;

  // Validate input
  if (!teacher_id || !class_id || !date) {
    return res.status(400).send("Missing required fields");
  }

  // Hardcode is_present to true for teacher attendance
  const isPresentBoolean = true;

  const insertQuery = `
    INSERT INTO teacherattendance (teacher_id, class_id, date, is_present)
    VALUES ($1, $2, $3, $4)
  `;

  const values = [teacher_id, class_id, date, isPresentBoolean];

  try {
    // Insert teacher attendance with is_present always set to true
    await db.query(insertQuery, values);

    // Check if teacher's attendance has reached 4 true attendances
    const countQuery = `
      SELECT COUNT(*) AS attendance_count
      FROM teacherattendance
      WHERE teacher_id = $1 AND class_id = $2 AND is_present = true
    `;
    const countResult = await db.query(countQuery, [teacher_id, class_id]);
    const attendanceCount = parseInt(countResult.rows[0].attendance_count, 10);

    if (attendanceCount === 4) {
      // Archive students' attendance
      const fetchStudentAttendanceQuery = `
        SELECT *
        FROM Presence
        WHERE class_id = $1
      `;
      const studentAttendanceResult = await db.query(
        fetchStudentAttendanceQuery,
        [class_id]
      );

      const archivePromises = studentAttendanceResult.rows.map(
        async (record) => {
          const archiveQuery = `
          INSERT INTO ArchivedPresence (student_id, class_id, date, is_present, number_seance)
          VALUES ($1, $2, $3, $4, $5)
        `;
          const archiveValues = [
            record.student_id,
            record.class_id,
            record.date,
            record.is_present,
            record.number_seance,
          ];
          await db.query(archiveQuery, archiveValues);
        }
      );

      await Promise.all(archivePromises);

      // Archive teacher attendance records
      const fetchTeacherAttendanceQuery = `
        SELECT *
        FROM teacherattendance
        WHERE class_id = $1
      `;
      const teacherAttendanceResult = await db.query(
        fetchTeacherAttendanceQuery,
        [class_id]
      );

      const archiveTeacherPromises = teacherAttendanceResult.rows.map(
        async (record) => {
          const archiveTeacherQuery = `
          INSERT INTO ArchivedTeacherAttendance (teacher_id, class_id, date, is_present)
          VALUES ($1, $2, $3, $4)
        `;
          const archiveTeacherValues = [
            record.teacher_id,
            record.class_id,
            record.date,
            record.is_present,
          ];
          await db.query(archiveTeacherQuery, archiveTeacherValues);
        }
      );

      await Promise.all(archiveTeacherPromises);

      // Delete student attendance from Presence table
      const deleteQuery = `
        DELETE FROM Presence
        WHERE class_id = $1
      `;
      await db.query(deleteQuery, [class_id]);

      // Delete teacher attendance from teacherattendance table
      const deleteTeacherAttendanceQuery = `
        DELETE FROM teacherattendance
        WHERE class_id = $1
      `;
      await db.query(deleteTeacherAttendanceQuery, [class_id]);

      res.send(
        "Teacher attendance recorded, student attendance archived, and records deleted successfully"
      );
    } else {
      res.send("Teacher attendance recorded successfully");
    }
  } catch (err) {
    console.error("Error recording teacher attendance:", err);
    res.status(500).send("Error recording teacher attendance");
  }
};
const getTeacherAttendance = function (req, res) {
  const { teacher_id, class_id } = req.params;

  const query = `
    SELECT *
    FROM teacherattendance
    WHERE teacher_id = $1 AND class_id = $2 
  `;

  const values = [teacher_id, class_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching teacher attendance:", err);
      res.status(500).send("Error fetching teacher attendance");
    } else {
      res.json(result.rows);
    }
  });
};

const getNumberSeance = function (req, res) {
  const { student_id, class_id } = req.params; // Use the same names as in the route

  console.log(
    `Fetching number of sessions for student_id: ${student_id}, class_id: ${class_id}`
  );

  const query = `
    SELECT COALESCE(SUM(number_seance), 0) AS total_sessions_attended
    FROM Presence
    WHERE student_id = $1 AND class_id = $2
  `;
  const values = [student_id, class_id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching number of sessions attended:", err);
      res
        .status(500)
        .json({ error: "Error fetching number of sessions attended" });
    } else {
      console.log("Query result:", result.rows);
      const totalSessionsAttended = result.rows[0].total_sessions_attended;
      res.json({ number_seance: totalSessionsAttended });
    }
  });
};
const addClasses = function (req, res) {
  const { groupNumber, TeacherName, subject } = req.body;

  // Step 1: Query to get teacher_id
  const getTeacherIdQuery = `
    SELECT id 
    FROM teacher 
    WHERE nom = $1 AND subject = $2
  `;

  // Step 2: Find teacher_id
  db.query(getTeacherIdQuery, [TeacherName, subject], (err, result) => {
    if (err) {
      console.error("Error fetching teacher ID:", err);
      res.status(500).send("Error fetching teacher ID");
      return;
    }

    if (result.rows.length === 0) {
      res.status(404).send("Teacher not found or subject mismatch");
      return;
    }

    const teacher_id = result.rows[0].id;

    // Step 3: Insert new class
    const insertQuery = `
      INSERT INTO Classes (groupNumber, teacher_id, subject)
      VALUES ($1, $2, $3)
    `;

    db.query(insertQuery, [groupNumber, teacher_id, subject], (err, result) => {
      if (err) {
        console.error("Error inserting class:", err);
        res.status(500).send("Error inserting class");
      } else {
        res.send("Class added successfully");
      }
    });
  });
};
const addClasseStd = function (req, res) {
  const { studentId, groupNumber, teacherId } = req.body;

  const insertQuery = `
    INSERT INTO Classelist (student_id, groupNumber, teacher_id)
    VALUES ($1, $2, $3)
  `;

  const values = [studentId, groupNumber, teacherId];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send(result);
    }
  });
};

const ClassesList = function (req, res) {
  const { teacher_id, groupnumber } = req.params;
  const query = `SELECT s.nom AS studentnom, s.prenom AS studentprenom, s.id AS student_id 
  FROM Classelist cl
  JOIN student s ON cl.student_id = s.id
  WHERE cl.teacher_id = $1 AND cl.groupNumber = $2`;
  const values = [teacher_id, groupnumber];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching class list:", err);
      res.status(500).send("Error retrieving class list");
    } else {
      res.json(result.rows);
    }
  });
};

const getTeachers = function (req, res) {
  var select = "select * from teacher";
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const getTeachersinfo = function (req, res) {
  const { id } = req.params;

  var select = `select * from teacher where id = $1`;
  const values = [id];
  db.query(select, values, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const getClasses = function (req, res) {
  const selectQuery = `
    SELECT
      c.id,
      c.groupNumber AS groupnumber,
      t.nom AS teachername,
      c.subject
    FROM
      Classes c
    JOIN
      teacher t ON c.teacher_id = t.id
  `;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else {
      res.send(result.rows); // Make sure to send only the rows
    }
  });
};
const classeinformation = function (req, res) {
  var select = `select * from Classes where id =${req.params.id}`;
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};

//////////////////////////////////////////////////////////////////////////////////////////////////
const addStudent = function (req, res) {
  var cond = req.body;
  var insert = `INSERT INTO student  (nom ,prenom ,numerotlfparent
     ,cardid)values('${cond.nom}','${cond.prenom}','${cond.numerotlfparent}','${cond.cardid}')`;
  db.query(insert, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const PaymentStudent = function (req, res) {
  var cond = req.body;
  var insert = `
    INSERT INTO payment (student_id, amount, payment_date, attendance_count)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [
    cond.student_id,
    cond.amount,
    cond.payment_date,
    cond.attendance_count,
  ];

  db.query(insert, values, (err, result) => {
    if (err) {
      console.error("Error inserting payment:", err);
      res.status(500).send("Error inserting payment");
    } else {
      res.send(result);
    }
  });
};
const UpdatePaymentAmount = function (req, res) {
  var cond = req.body;
  var update = `
    UPDATE payment
    SET amount = $1
    WHERE id = $2
  `;
  const values = [
    cond.amount,
    cond.id,
  ];

  db.query(update, values, (err, result) => {
    if (err) {
      console.error("Error updating payment amount:", err);
      res.status(500).send("Error updating payment amount");
    } else {
      res.send(result);
    }
  });
};

const PresenceStd = async function (req, res) {
  const attendanceRecords = req.body;

  // Insert new attendance records
  const insertQuery = `
    INSERT INTO Presence (student_id, class_id, date, is_present, number_seance)
    VALUES ${attendanceRecords
      .map(
        (_, i) =>
          `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${
            i * 5 + 5
          })`
      )
      .join(", ")}
  `;

  const values = attendanceRecords.flatMap((record) => [
    record.student_id,
    record.class_id,
    record.date,
    record.is_present ? 1 : 0,
    record.number_seance,
  ]);

  try {
    await db.query(insertQuery, values);

    // Update the total number of sessions attended for each student in the specific class
    const updateQueries = attendanceRecords.map((record) => {
      return {
        query: `
          UPDATE student
          SET number_seance = (
            SELECT COALESCE(SUM(number_seance), 0)
            FROM Presence
            WHERE student_id = $1 AND class_id = $2
          )
          WHERE id = $1
        `,
        values: [record.student_id, record.class_id],
      };
    });

    await Promise.all(
      updateQueries.map(({ query, values }) => db.query(query, values))
    );

    res.send("Attendance recorded successfully");
  } catch (error) {
    console.error("Error recording attendance:", error);
    res.status(500).send("Error recording attendance");
  }
};

const getStudent = function (req, res) {
  var select = "select * from student";
  db.query(select, (err, result) => {
    if (err) {
      c;
      onsole.error(err);
    } else {
      res.send(result);
    }
  });
};
const getStudentbyId = function (req, res) {
  var select = `select * from student where id =${req.params.id}`;
  db.query(select, (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
};
const archivedpresence = function (req, res) {
  const studentId = req.params.student_id;
  const query = `
    SELECT 
      ap.*, 
      c.subject, 
      t.nom AS teacher_nom,
      t.prenom AS teacher_prenom,
      t.price
      
    FROM 
      archivedpresence ap
      JOIN classes c ON ap.class_id = c.id
      JOIN teacher t ON c.teacher_id = t.id
    WHERE 
      ap.student_id = $1
  `;
  db.query(query, [studentId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error querying the database');
    } else {
      res.send(result.rows);
    }
  });
};

const getPayments = function (req, res) {
  const query = `
    SELECT amount
    FROM payment
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching payments");
    } else {
      res.json(result.rows);
    }
  });
};
const getPaymentsstudent = function (req, res) {
  const { student_id } = req.params; // Assuming student_id is passed as a URL parameter

  const query = `
    SELECT *
    FROM payment
    WHERE student_id = $1
  `;

  db.query(query, [student_id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching payments");
    } else {
      res.json(result.rows);
    }
  });
};
const archiveAndDeleteAttendance = async function (req, res) {
  const { student_id, class_id, date } = req.body;

  try {
    // Archive attendance
    const archiveQuery = `
      INSERT INTO AttendanceArchive (student_id, class_id, date, is_present, number_seance)
      SELECT student_id, class_id, date, is_present, number_seance
      FROM Presence
      WHERE student_id = $1 AND class_id = $2 AND date = $3
    `;
    await db.query(archiveQuery, [student_id, class_id, date]);

    // Delete attendance
    const deleteQuery = `
      DELETE FROM Presence
      WHERE student_id = $1 AND class_id = $2 AND date = $3
    `;
    await db.query(deleteQuery, [student_id, class_id, date]);

    res.send("Attendance archived and deleted successfully");
  } catch (error) {
    console.error("Error archiving and deleting attendance:", error);
    res.status(500).send("Error archiving and deleting attendance");
  }
};

module.exports = {
  addTeacher,
  getTeachers,
  addStudent,
  getStudent,
  getStudentbyId,
  addClasses,
  getClasses,
  ClassesList,
  classeinformation,
  addClasseStd,
  PresenceStd,
  getNumberSeance,
  recordTeacherAttendance,
  getTeacherAttendance,
  archiveAndDeleteAttendance,
  PaymentStudent,
  getTeachersinfo,
  archivedpresence,
  getPayments,
  getPaymentsstudent,
  UpdatePaymentAmount
};
