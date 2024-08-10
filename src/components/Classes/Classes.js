import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

function Classes() {
  const history = useHistory();
  const [classes, setClasses] = useState([]);
  const [selectedClassInfo, setSelectedClassInfo] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3001/getClasses")
      .then((response) => {
        console.log(response.data); // Check if `teachername` is included
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
    <div style={{ direction: "rtl" }}>
      <div>
        <h1>قائمة الاقسام</h1>
        <hr />
        <a
          href="/List/NewClasse"
          type="button"
          className="btn btn-primary"
          style={{ position: "absolute", left: "0" }}
        >
          اضافة قسم
        </a>
        <div style={{ marginTop: "100px" }}>
          <table className="table table-bordered table-striped">
            <thead className="table-primary">
              <tr>
                <th scope="col">#</th>
                <th scope="col">القسم</th>
                <th scope="col">اسم الاساتذ(ة)</th>
                <th scope="col">المادة</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classe, index) => (
                <tr key={index} onClick={() => classeInformation(classe.id)}>
                  <th scope="row">{index + 1}</th>
                  <td>{classe.groupnumber}</td>
                  <td>{classe.teachername}</td> {/* Display teacher's name here */}
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
