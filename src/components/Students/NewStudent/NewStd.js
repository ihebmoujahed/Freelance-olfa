import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory
function Newstd() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numerotlfparent: "",
    cardid: "",
  });
  const [submitSuccess, setSubmitSuccess] = useState(false); // State to track success
  const history = useHistory(); // Initialize useHistory hook
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/addStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Data inserted successfully");
        setSubmitSuccess(true); // Set success state to true
        history.push("/List/Std"); 
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div style={{ direction: "rtl" }}>
      {submitSuccess && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlinkHref="#check-circle-fill"/></svg>
            <div>
              تم إضافة البيانات بنجاح
            </div>
          </div>
        )}
      <h1>التسجيل</h1>
      <hr />

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputName">الاسم</label>
            <input
              type="text"
              className="form-control"
              id="nom"
              placeholder="الاسم"
              value={formData.nom}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputLastName">اللقب</label>
            <input
              type="text"
              className="form-control"
              id="prenom"
              placeholder="اللقب"
              value={formData.prenom}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputPhone">الهاتف</label>
          <input
            type="number"
            className="form-control"
            id="numerotlfparent"
            placeholder="الهاتف"
            value={formData.numerotlfparent}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputCardId">رقم البطاقة الوطنية</label>
          <input
            type="text"
            className="form-control"
            id="cardid"
            placeholder="رقم البطاقة الوطنية"
            value={formData.cardid}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ marginTop: "22px" }}
        >
          تسجيل
        </button>

        {/* Conditional rendering of success message */}
        
      </form>
    </div>
  );
}

export default Newstd;
