import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link,useParams } from 'react-router-dom';

function ListStd() {
  const { id } = useParams();
  const history = useHistory();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
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
    console.log("112")
    axios
      .get(`http://localhost:3001/getStudentbyId/${id}`)
      .then((response) => {
        const studentData = response.data.rows;
        console.log({studentData})
        history.push('/List/StudentProfiel',{id:studentData[0]});
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Filter students based on the search query
  const filteredStudents = students.filter((student) =>
    student.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ direction: "rtl" }}>
      <div>
        <h1>قائمة التلاميذ</h1>
        <hr />
        <a
          href="/List/Newstd"
          type="button"
          className="btn btn-primary"
          style={{ position: "absolute", left: "0" }}
        >
          اضافة تلميذ
        </a>
        <div style={{ marginTop: "100px" }}>
          <input
            type="text"
            placeholder="ابحث باسم التلميذ"
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
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={index}>
                  <th scope="row">{(currentPage - 1) * itemsPerPage + index + 1}</th>
                  <td>
                    <button
                      onClick={() => getStudentData(student.id)} // 
                      className="btn btn-link"
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

export default ListStd;
