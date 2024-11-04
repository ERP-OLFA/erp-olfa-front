import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Newstd.css"; // Import custom CSS

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
        setTimeout(() => {
          history.push("/List/Std");
        }, 2000); // Redirect after 2 seconds
      } else {
        console.error("Failed to insert data");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
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
    <div className="newstd-container">
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
          <label htmlFor="numerotlfparent">رقم الولي</label>
          <input
            type="number"
            className="form-control"
            id="numerotlfparent"
            placeholder="الهاتف"
            value={formData.numerotlfparent}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cardid">رقم  التلميذ</label>
          <input
            type="text"
            className="form-control"
            id="cardid"
            placeholder="رقم التلميذ"
            value={formData.cardid}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
        >
          تسجيل
        </button>
      </form>
    </div>
  );
}

export default Newstd;
