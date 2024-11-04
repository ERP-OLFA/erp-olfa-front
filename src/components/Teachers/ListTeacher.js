import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';
import { useHistory, useParams } from 'react-router-dom';


function ListTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:3001/getTeacher")
      .then((response) => {
        setTeachers(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTeachers([]);
      });
  }, []);
  const getTeachertData = (id) => {
    axios
      .get(`http://localhost:3001/getTeachersinfo/${id}`)
      .then((response) => {
        const teacherData = response.data.rows;
        history.push('/List/TeacherProfile', { id: teacherData[0] });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const dataToExport = paginatedTeachers.map(({ nom, prenom, numerotlf, subject }) => ({
      'الاسم': nom,
      'اللقب': prenom,
      'الهاتف': numerotlf,
      'المادة': subject,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, "teachers.xlsx");
  };

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة الأساتذة</h1>
        <div>
          <a href="/List/Newteacher" className="btn btn-success me-2">إضافة أستاذ</a>
          <button onClick={exportToExcel} className="btn btn-primary">
            تحميل إلى Excel
          </button>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="ابحث باسم الأستاذ"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">الاسم</th>
                <th scope="col">اللقب</th>
                <th scope="col">الهاتف</th>
                <th scope="col">المادة</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.map((teacher, index) => (
                <tr key={index}>
                  <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                  <td>                    <button
                    onClick={() => getTeachertData(teacher.id)}
                    className="btn btn-link p-0 text-decoration-none text-primary"
                  >
                    {teacher.nom}
                  </button>
                  </td>
                  <td>{teacher.prenom}</td>
                  <td>{teacher.numerotlf}</td>
                  <td>{teacher.subject}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${pageNumber + 1 === currentPage ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default ListTeacher;
