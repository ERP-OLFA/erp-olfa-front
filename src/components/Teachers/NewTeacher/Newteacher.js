import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Spinner } from "react-bootstrap"; // Import Spinner
import "./Newteacher.css"; // Import custom CSS
import Loader from "../../Loader/Loader";
function Newteacher() {
  const history = useHistory();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    numerotlf: '',
    cardid: '',
    subject: '',
    price: ''
  });

  const [submitSuccess, setSubmitSuccess] = useState(false); // State to track success
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://erp-olfa-back.onrender.com/addTeacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Data inserted successfully');
        setSubmitSuccess(true);
        setTimeout(() => {
          history.push("/List/Teacher");
        }, 2000); // Redirect after 2 seconds
      } else {
        console.error('Failed to insert data');
      }
    } catch (error) {
      console.error('Error inserting data:', error);
    } finally {
      setIsSubmitting(false);
    }
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="newteacher-container">
      {submitSuccess && (
        <div className="alert alert-success" role="alert">
          <svg
            className="bi flex-shrink-0 me-2"
            width="24"
            height="24"
            role="img"
            aria-label="Success:"
          >
            <use xlinkHref="#check-circle-fill" />
          </svg>
          <div>تم إضافة البيانات بنجاح</div>
        </div>
      )}
      
      <h1>التسجيل</h1>
      <hr className="divider" />
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">الاسم</label>
          <input
            type="text"
            className="form-control"
            id="nom"
            placeholder="الاسم"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="prenom">اللقب</label>
          <input
            type="text"
            className="form-control"
            id="prenom"
            placeholder="اللقب"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="numerotlf">الهاتف</label>
          <input
            type="number"
            className="form-control"
            id="numerotlf"
            placeholder="الهاتف"
            value={formData.numerotlf}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">المادة</label>
          <input
            type="text"
            className="form-control"
            id="subject"
            placeholder="المادة"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">الثمن (الحصة)</label>
          <input
            type="text"
            className="form-control"
            id="price"
            placeholder="الثمن (الحصة)"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>
              <Loader /> {/* Spinner */}
              جاري التسجيل...
            </span>
          ) : (
            'تسجيل'
          )}
        </button>
      </form>
    </div>
  );
}

export default Newteacher;
