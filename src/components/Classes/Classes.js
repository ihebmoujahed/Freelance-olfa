import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Classes() {
  const history = useHistory();
  const [classes, setClasses] = useState([]);
  const [selectedClassInfo, setSelectedClassInfo] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getClasses")
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
      .get(`http://localhost:3001/classeinformation/${id}`)
      .then((response) => {
        setSelectedClassInfo(response.data);
        history.push(`/List/ClassesList/${id}`);
      })
      .catch((error) => {
        console.error("Error fetching class information:", error);
        setSelectedClassInfo(null);
      });
  };

  return (
    <div className="container mt-4" style={{ direction: "rtl" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">قائمة الأقسام</h1>
        <a href="/List/NewClasse" className="btn btn-success">إضافة قسم</a>
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
              {classes.map((classe, index) => (
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
