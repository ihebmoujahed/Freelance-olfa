import { useState, useEffect } from "react";
import axios from "axios";

function ListTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:3001/getTeacher")
      .then((response) => {
        // Assuming response.data is an array of teachers
        setTeachers(response.data.rows);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTeachers([]); // Set teachers to an empty array on error
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter teachers based on the search query
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ direction: "rtl" }}>
      <div>
        <h1>قائمة الأساتذة</h1>
        <hr />
        <a
          href="/List/Newteacher"
          type="button"
          className="btn btn-primary"
          style={{ position: "absolute", left: "0" }}
        >
          اضافة أستاذ
        </a>
        <div style={{ marginTop: "100px" }}>
          <input
            type="text"
            placeholder="ابحث باسم الأستاذ"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ marginBottom: "20px", width: "100%", padding: "8px" }}
          />
          <table className="table table-bordered table-striped">
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
          <div style={{ marginTop: "20px" }}>
            <nav aria-label="Page navigation">
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
    </div>
  );
}

export default ListTeacher;
