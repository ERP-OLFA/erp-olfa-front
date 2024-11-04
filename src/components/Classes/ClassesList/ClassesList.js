import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Alert, Table } from "react-bootstrap";
import { useHistory, useParams } from 'react-router-dom';

function ClassesList() {
  const { id } = useParams();
  const [classInfo, setClassInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [selectedPaymentStudent, setSelectedPaymentStudent] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [totalseance, settotalseance] = useState(null);
  const [teacherattendance, setTeacherAttendance] = useState([]);
  const [teacherinfo, setteacherinfo] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10); // Number of students per page
  const history = useHistory();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const filteredStudents = allStudents.filter((student) =>
    student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDeleteConfirmModalShow = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteConfirmModalClose = () => {
    setStudentToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleAlertClose = () => setShowAlert(false);
  const getStudentData = (id) => {
    axios
      .get(`http://localhost:3001/getStudentbyId/${id}`)
      .then((response) => {
        const studentData = response.data.rows;
        history.push('/List/StudentProfiel', { id: studentData[0] });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const updateClassMonth = async () => {
    await axios.put(`http://localhost:3001/updateClassMonth/${classInfo.id}`).then((response) => {
      console.log(response)
    })
  }
  const addClassMonth = async (studentIds, attendance_count) => {
    try {
      await axios.post("http://localhost:3001/addPreviousClass", {
        teacher_id: classInfo.teacher_id,
        number_sessions: attendance_count,
        month: classInfo.month,
        student_id: studentIds, // Include student IDs in the payload
      });
      console.log("Class month updated successfully.");
    } catch (error) {
      console.error("Error updating class month:", error);
    }
  };

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
        console.log(
          classInfo.id
        )
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

  const handleSelectStudent = (student) => {
    setSelectedStudent((prevSelected) =>
      prevSelected.includes(student)
        ? prevSelected.filter((s) => s !== student)
        : [...prevSelected, student]
    );
  };

  const handleAddStudent = async () => {
    if (selectedStudent.length === 0) {
      alert("Please select at least one student.");
      return;
    }

    const { groupnumber } = classInfo;

    try {
      await Promise.all(
        selectedStudent.map((student) =>
          axios.post("http://localhost:3001/addClasseStd", {
            studentId: student.id,
            groupNumber: groupnumber,
            teacherId: classInfo.teacher_id,
          })
        )
      );

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
      setSelectedStudent([]);
      handleModalClose();
    } catch (error) {
      console.error("Error adding students:", error);
      alert("تمت إظافة التلميذ.");
    }
    window.location.reload()
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
      date: selectedDate,
      is_present: student.attendance === "present",
      number_seance: student.attendance === "present" ? 1 : 0,
    }));

    const teacherAttendanceRecord = {
      teacher_id: classInfo.teacher_id,
      class_id: classInfo.id,
      date: selectedDate,
      is_present: studentList.some(
        (student) => student.attendance === "present"
      ),
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
        setAlertMessage("تم تأكيد تسجيل الحضور بنجاح.");
        if (totalseance === 4) {
          const studentIds = studentList.map(student => student.id); // Gather student IDs
          await Promise.all(
            studentList.map(student =>
              handleNotPayment(student.id, student.number_seance)
            )
          );
          updateClassMonth()
        }
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


  const handleNotPayment = async (studentId, numberSeance) => {
    const pricePerSession = teacherinfo[0]?.price || 0;
    const paymentAmount = pricePerSession * 0; // Zero payment amount
    const classId = classInfo.id; // Get class ID

    try {
      // Insert payment
      await axios.post("http://localhost:3001/PaymentStudent", {
        student_id: studentId,
        amount: paymentAmount,
        payment_date: currentDate,
        month: classInfo.month,
        teacher_id: classInfo.teacher_id,
        attendance_count: numberSeance,
        groupnumber: classInfo.groupnumber
      });

      // Update month in classes table
      // Display success alert
      setAlertMessage("تم تاكيد دفع التلميذ منجاح.");
      setAlertVariant("success");
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
      <h1>الشهر: {classInfo.month}</h1>
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
          <Alert variant={alertVariant} onClose={handleAlertClose} dismissible>
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
              <th scope="col">تاريخ الحصة</th>
              <th scope="col">ح</th>
              <th scope="col">غ</th>
              <th scope="col">Number of Sessions</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((std, index) => (
              <tr key={std.id}>
                <th scope="row">{index + 1}</th>
                <td><button
                  onClick={() => getStudentData(std.id)}
                  className="btn btn-link p-0 text-decoration-none text-primary"
                >
                  {std.studentnom}
                </button></td>
                <td>
                  {std.studentprenom}
                </td>
                <td>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={`present-radio-${std.id}`}
                    name={`attendance-${std.id}`}
                    checked={std.attendance === "present"}
                    onChange={() => handleAttendanceChange(std.id, true)}
                  />
                </td>
                <td>
                  <Form.Check
                    type="checkbox"
                    id={`absent-radio-${std.id}`}
                    name={`attendance-${std.id}`}
                    checked={std.attendance === "absent"}
                    onChange={() => handleAttendanceChange(std.id, false)}
                  />
                </td>
                <td>{std.number_seance}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
        <Button
          variant="success"
          onClick={() => setShowConfirmationModal(true)}
        >
          تسجيل الحضور
        </Button>

      </div>

      {/* Modal for adding a student */}
      <Modal
        show={showModal}
        onHide={handleModalClose}
        style={{ direction: "rtl" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>اختيار تلميذ(ة)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <input
              type="text"
              placeholder="بحث بالاسم"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>الاسم</th>
                <th>اللقب</th>
                <th>الاختيار</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.nom}</td>
                  <td>{student.prenom}</td>
                  <td>
                    <input
                      type="checkbox"
                      onClick={() => handleSelectStudent(student)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
              disabled={currentPage === 1}
            >
              السابق
            </Button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage(
                  currentPage < totalPages ? currentPage + 1 : totalPages
                )
              }
              disabled={currentPage === totalPages}
            >
              التالي
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            غلق
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedStudent) {
                handleAddStudent(selectedStudent);
              }
            }}
            disabled={!selectedStudent}
          >
            اضافة تلميذ(ة)
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        style={{ direction: "rtl" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>تأكيد تسجيل الحضور</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>هل أنت متأكد أنك تريد تسجيل الحضور لهذا اليوم؟</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitAttendance(); // Call your submitAttendance function here
              setShowConfirmationModal(false);
            }}
          >
            تأكيد
          </Button>
        </Modal.Footer>
      </Modal>
      

    </div>
  );
}

export default ClassesList;
