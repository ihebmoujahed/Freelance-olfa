const router = require('express').Router();
const itemController = require("../controllers/item.controller");
//For Sinistre
router.post("/addTeacher", itemController.addTeacher);
router.post("/addClasses", itemController.addClasses);
router.get("/getTeacher",itemController.getTeachers)
router.get("/getTeachersinfo/:id",itemController.getTeachersinfo)
router.get("/getTeacherAttendance/:teacher_id/:class_id",itemController.getTeacherAttendance)
router.get("/getClasses",itemController.getClasses)
router.get("/classeinformation/:id",itemController.classeinformation)
router.get("/ClassesList/:teacher_id/:groupnumber", itemController.ClassesList);
///////////////////////////////////////////////////////////
router.post("/addStudent", itemController.addStudent);
router.post("/addClasseStd", itemController.addClasseStd);
router.post("/PresenceStd", itemController.PresenceStd);
router.post("/recordTeacherAttendance", itemController.recordTeacherAttendance);
router.post("/PaymentStudent", itemController.PaymentStudent);
router.get('/getNumberSeance/:student_id/:class_id', itemController.getNumberSeance);
router.get("/getStudent", itemController.getStudent);
router.get("/getStudentbyId/:id", itemController.getStudentbyId);
router.put("/UpdatePaymentAmount/:id", itemController.UpdatePaymentAmount);
router.get("/archivedpresence/:student_id", itemController.archivedpresence);
router.get("/getPaymentsstudent/:student_id", itemController.getPaymentsstudent);
router.get("/getPayments", itemController.getPayments);


module.exports = router;
