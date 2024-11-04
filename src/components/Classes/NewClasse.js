import { Container, Row, Col, Modal, Table, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom"; 

function NewClasse() {
  const history = useHistory();

  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    groupNumber: "",
    TeacherName: "",
    subject: "",
  });

  const [showModalteacher, setShowModalteacher] = useState(false);

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
        history.push("/List/Classes"); 
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
    toggleModalteacher();
  };

  const toggleModalteacher = () => {
    setShowModalteacher(!showModalteacher);
  };

  return (
    <>
      <Container className="my-5" style={{ direction: "rtl" }}>
        <Row className="justify-content-center">
          <Col lg={8} md={10} sm={12}>
            <h1 className="text-center mb-4" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              التسجيل
            </h1>
            <hr className="my-4" />
            <Form onSubmit={handleSubmit} className="p-4 shadow-sm rounded border">
              <Form.Group controlId="groupNumber" className="mb-4">
                <Form.Label style={{ fontSize: "1.5rem" }}>اسم المجموعة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="اسم المجموعة"
                  value={formData.groupNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, groupNumber: e.target.value })
                  }
                  style={{ fontSize: "1.2rem" }}
                />
              </Form.Group>

              <Form.Group controlId="TeacherName" className="mb-4">
                <Form.Label style={{ fontSize: "1.5rem" }}>اسم الأستاذ</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="اسم الأستاذ"
                    value={formData.TeacherName}
                    onChange={(e) =>
                      setFormData({ ...formData, TeacherName: e.target.value })
                    }
                    style={{ fontSize: "1.2rem" }}
                    readOnly
                  />
                  <Button
                    variant="outline-primary"
                    onClick={toggleModalteacher}
                    style={{ fontSize: "1.2rem" }}
                  >
                    عرض الأساتذة
                  </Button>
                </div>
              </Form.Group>

              <Form.Group controlId="subject" className="mb-4">
                <Form.Label style={{ fontSize: "1.5rem" }}>المادة</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="المادة"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  style={{ fontSize: "1.2rem" }}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                className="btn-lg btn-block"
                style={{ fontSize: "1.5rem" }}
              >
                تسجيل
              </Button>
            </Form>
          </Col>
        </Row>

        <Modal
          show={showModalteacher}
          onHide={toggleModalteacher}
          centered
          dir="rtl"
        >
          <Modal.Header closeButton>
            <Modal.Title>قائمة الأساتذة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>اسم الأستاذ</th>
                  <th>لقب الأستاذ</th>
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
