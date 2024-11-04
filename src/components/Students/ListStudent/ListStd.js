import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as XLSX from 'xlsx';

function ListStd() {
  const { id } = useParams();
  const history = useHistory();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    axios
      .get("http://localhost:3001/getStudent")
      .then((response) => {
        setStudents(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setStudents([]);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

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

  const filteredStudents = students.filter((student) =>
    student.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.numerotlfparent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    // Select only the relevant columns
    const dataToExport = paginatedStudents.map(({ id, nom, prenom, numerotlfparent, cardid }) => ({
      'رقم التلميذ': id,
      'الاسم': nom,
      'اللقب': prenom,
      'رقم الولي': numerotlfparent,
      'رقم البطاقة': cardid,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة التلاميذ</h1>
        <div>
          <a href="/List/Newstd" className="btn btn-success me-2">إضافة تلميذ</a>
          <a onClick={exportToExcel} className="btn btn-primary me-2">
            تحميل إلى Excel
          </a>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="ابحث باسم التلميذ"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">الاسم</th>
                <th scope="col">اللقب</th>
                <th scope="col">رقم الولي</th>
                <th scope="col">رقم التلميذ</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={index}>
                  <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                  <td>
                    <button
                      onClick={() => getStudentData(student.id)}
                      className="btn btn-link p-0 text-decoration-none text-primary"
                    >
                      {student.nom}
                    </button>
                  </td>
                  <td>{student.prenom}</td>
                  <td>{student.numerotlfparent}</td>
                  <td>{student.cardid}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center">
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

export default ListStd;
