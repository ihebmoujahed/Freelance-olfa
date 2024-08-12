import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function ListTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة الأساتذة</h1>
        <a href="/List/Newteacher" className="btn btn-success">إضافة أستاذ</a>
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
                <th scope="col">رقم بطاقة التعريف</th>
                <th scope="col">المادة</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTeachers.map((teacher, index) => (
                <tr key={index}>
                  <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                  <td>{teacher.nom}</td>
                  <td>{teacher.prenom}</td>
                  <td>{teacher.numerotlf}</td>
                  <td>{teacher.cardid}</td>
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
