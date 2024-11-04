import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Row, Col, Form, Pagination, Button } from "react-bootstrap";
import "./Dashboard.css"; // Import your custom CSS

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [currentStudentPage, setCurrentStudentPage] = useState(1);
  const [currentTeacherPage, setCurrentTeacherPage] = useState(1);
  const [password, setPassword] = useState("");
  const [passwordEntered, setPasswordEntered] = useState(false);
  const studentsPerPage = 10;
  const teachersPerPage = 10;

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const [studentsRes, teachersRes, paymentsRes] = await Promise.all([
          axios.get("http://localhost:3001/getStudent"),
          axios.get("http://localhost:3001/getTeacher"),
          axios.get("http://localhost:3001/getPayments"),
        ]);

        const studentsData = Array.isArray(studentsRes.data.rows) ? studentsRes.data.rows : [];
        const teachersData = Array.isArray(teachersRes.data.rows) ? teachersRes.data.rows : [];

        setStudentCount(studentsData.length);
        setTeacherCount(teachersData.length);

        const paymentsData = Array.isArray(paymentsRes.data) ? paymentsRes.data : [];
        const totalPayments = paymentsData.reduce((acc, payment) => {
          const amount = parseFloat(payment.amount) || 0;
          return acc + amount;
        }, 0);

        setPaymentTotal(totalPayments);
        console.log("Payments Data:", paymentsData);
        console.log("Total Payments:", totalPayments);
      } catch (err) {
        console.error("Error fetching totals:", err);
      }
    };

    fetchTotals();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRes = await axios.get("http://localhost:3001/getStudent");
        const studentsData = Array.isArray(studentsRes.data.rows) ? studentsRes.data.rows : [];
        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teachersRes = await axios.get("http://localhost:3001/getTeacher");
        const teachersData = Array.isArray(teachersRes.data.rows) ? teachersRes.data.rows : [];
        setTeachers(teachersData);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Replace 'your-password' with the actual password
    if (password === '98212091') {
      setPasswordEntered(true);
    } else {
      alert('Incorrect password');
    }
  };

  const filteredStudents = students.filter(student =>
    `${student.nom} ${student.prenom}`.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher =>
    `${teacher.nom} ${teacher.prenom}`.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  // Pagination logic for students
  const totalStudentPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const currentStudentData = filteredStudents.slice(
    (currentStudentPage - 1) * studentsPerPage,
    currentStudentPage * studentsPerPage
  );

  // Pagination logic for teachers
  const totalTeacherPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const currentTeacherData = filteredTeachers.slice(
    (currentTeacherPage - 1) * teachersPerPage,
    currentTeacherPage * teachersPerPage
  );

  return (
    <div className="dashboard-container" style={{ direction: "rtl" }}>
      {!passwordEntered ? (
        <div className="password-form-container">
          <Form onSubmit={handlePasswordSubmit} className="password-form">
            <Form.Group controlId="password">
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              دخول
            </Button>
          </Form>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col sm={12} md={4}>
              <Card className="dashboard-card card-student">
                <Card.Body>
                  <Card.Title className="dashboard-card-title">إجمالي الطلاب</Card.Title>
                  <Card.Text className="dashboard-card-text">{studentCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="dashboard-card card-teacher">
                <Card.Body>
                  <Card.Title className="dashboard-card-title">إجمالي الأساتذة</Card.Title>
                  <Card.Text className="dashboard-card-text">{teacherCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={4}>
              <Card className="dashboard-card card-payment">
                <Card.Body>
                  <Card.Title className="dashboard-card-title">إجمالي الدفوعات</Card.Title>
                  <Card.Text className="dashboard-card-text">${paymentTotal.toFixed(2)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="section-header">جميع الطلاب</Card.Header>
                <Card.Body>
                  <Form.Group controlId="studentSearch">
                    <Form.Control
                      type="text"
                      placeholder="البحث بالاسم"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                  {currentStudentData.length > 0 ? (
                    <>
                      <Table striped bordered hover className="table-custom mt-3">
                        <thead>
                          <tr>
                            <th>الرقم</th>
                            <th>الاسم</th>
                            <th>رقم التلميذ</th>
                            <th>هاتف ولي الأمر</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentStudentData.map((student) => (
                            <tr key={student.id}>
                              <td>{student.id}</td>
                              <td>{`${student.nom} ${student.prenom}`}</td>
                              <td>{student.cardid}</td>
                              <td>{student.numerotlfparent}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination className="pagination-custom mt-3">
                        {Array.from({ length: totalStudentPages }, (_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentStudentPage}
                            onClick={() => setCurrentStudentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </>
                  ) : (
                    <p>لا يوجد طلاب متاحين.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="dashboard-card">
                <Card.Header className="section-header">جميع الأساتذة</Card.Header>
                <Card.Body>
                  <Form.Group controlId="teacherSearch">
                    <Form.Control
                      type="text"
                      placeholder="البحث بالاسم"
                      value={teacherSearch}
                      onChange={(e) => setTeacherSearch(e.target.value)}
                      className="form-control-custom"
                    />
                  </Form.Group>
                  {currentTeacherData.length > 0 ? (
                    <>
                      <Table striped bordered hover className="table-custom mt-3">
                        <thead>
                          <tr>
                            <th>الرقم</th>
                            <th>الاسم</th>
                            <th>الهاتف</th>
                            <th>المادة</th>
                            <th>السعر</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTeacherData.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>{teacher.id}</td>
                              <td>{`${teacher.nom} ${teacher.prenom}`}</td>
                              <td>{teacher.numerotlf}</td>
                              <td>{teacher.subject}</td>
                              <td>{teacher.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Pagination className="pagination-custom mt-3">
                        {Array.from({ length: totalTeacherPages }, (_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentTeacherPage}
                            onClick={() => setCurrentTeacherPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                      </Pagination>
                    </>
                  ) : (
                    <p>لا يوجد معلمون متاحون.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
