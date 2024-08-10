import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useHistory } from "react-router-dom"; // Import useHistory

function Newteacher() {
  const history = useHistory(); // Initialize useHistory hook

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numerotlf: '',
    cardid: '',
    subject: '',
    price:''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/addTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data inserted successfully');
        history.push("/List/Teacher"); 

      } else {
        console.error('Failed to insert data');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  return (
    <div style={{ direction: 'rtl' }}>
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
            id="numerotlf"
            placeholder="الهاتف"
            value={formData.numerotlf}
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
        <div className="form-group">
          <label htmlFor="inputCardId">المادة</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            placeholder="المادة"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="inputprice">الثمن(الحصة)</label>
          <input
            type="text"
            className="form-control"
            id="price"
            placeholder="الثمن(الحصة)"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{marginTop:"22px"}}>
          تسجيل
        </button>
      </form>
    </div>
  );}
export default Newteacher;
