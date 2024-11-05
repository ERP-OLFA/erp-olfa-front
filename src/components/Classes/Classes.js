import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
function Classes() {
  const history = useHistory();
  const [classes, setClasses] = useState([]);
  const [selectedClassInfo, setSelectedClassInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    axios
      .get("http://erp-olfa-back.onrender.com/getClasses")
      .then((response) => {
        console.log(response.data);
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setClasses([]);
      });
  }, []);

  const classeInformation = (id) => {
    axios
      .get(`http://erp-olfa-back.onrender.com/classeinformation/${id}`)
      .then((response) => {
        setSelectedClassInfo(response.data);
        history.push(`/List/ClassesList/${id}`);
      })
      .catch((error) => {
        console.error("Error fetching class information:", error);
        setSelectedClassInfo(null);
      });
  };

  // Get unique teacher names for the dropdown
  const teacherNames = [...new Set(classes.map(classe => classe.teachername))];

  // Filter classes based on search term and selected teacher
  const filteredClasses = classes.filter(classe => {
    const groupNumberMatches = classe.groupnumber.replace(/\s+/g, '').toLowerCase().includes(searchTerm.replace(/\s+/g, '').toLowerCase());
    const teacherMatches = selectedTeacher ? classe.teachername === selectedTeacher : true;
    return groupNumberMatches && teacherMatches;
  });

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة الأقسام</h1>
        <a href="/List/NewClasse" className="btn btn-success">إضافة قسم</a>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="بحث عن القسم"
          className="form-control mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">اختر الأستاذ(ة)</option>
          {teacherNames.map((teacher, index) => (
            <option key={index} value={teacher}>{teacher}</option>
          ))}
        </select>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">القسم</th>
                <th scope="col">اسم الأستاذ(ة)</th>
                <th scope="col">المادة</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((classe, index) => (
                <tr
                  key={index}
                  onClick={() => classeInformation(classe.id)}
                  style={{ cursor: "pointer" }}
                >
                  <th scope="row">{index + 1}</th>
                  <td>{classe.groupnumber}</td>
                  <td>{classe.teachername}</td>
                  <td>{classe.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Classes;
