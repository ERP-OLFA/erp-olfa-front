import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Settings() {
  const history = useHistory();
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  useEffect(() => {
    axios
      .get("http://erp-olfa-back.onrender.com/ClassesAllList")
      .then((response) => {
        console.log(response.data);
        setClasses(response.data.rows);
        setFilteredClasses(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setClasses([]);
        setFilteredClasses([]);
      });
  }, []);


  const deleteStudent = (id) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا التلميذ؟");
    if (isConfirmed) {
      axios.delete(`http://erp-olfa-back.onrender.com/deleteClasseStd/${id}`).then((response) => {
        console.log(response.data);
        // Optionally, refetch the classes or remove the deleted item from state
        setClasses(classes.filter(classe => classe.classelist_id !== id));
        setFilteredClasses(filteredClasses.filter(classe => classe.classelist_id !== id));
        window.location.reload()
      }).catch((error) => {
        console.error("Error deleting student:", error);
      });
    }
  }

  useEffect(() => {
    const results = classes.filter(classe =>
      `${classe.student_nom} ${classe.student_prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClasses(results);
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, classes]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClasses.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة الأقسام</h1>
        <a href="/List/NewClasse" className="btn btn-success">إضافة قسم</a>
      </div>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="بحث باسم التلميذ"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">القسم</th>
                <th scope="col">أسم التلميذ</th>
                <th scope="col">ازالة تلميذ(ة)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((classe, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }}
                >
                  <th scope="row">{indexOfFirstItem + index + 1}</th>
                  <td>{classe.groupnumber}</td>
                  <td>{classe.student_nom} {classe.student_prenom}</td>
                  <td>
                    <button 
                      className="btn btn-danger"
                      onClick={() => deleteStudent(classe.classelist_id)}
                    >
                      حذف تلميذ من القسم
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav>
        <ul className="pagination justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Settings;
