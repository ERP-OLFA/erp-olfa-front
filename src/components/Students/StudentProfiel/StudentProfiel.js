import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import './StudentProfiel.css';

function StudentProfile() {
  const [student, setStudent] = useState({});
  const [Paymentsstudent, setPaymentsstudent] = useState([]);
  const [studentsPresenceAchievement, setStudentsPresenceAchievement] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(0);
  const [paymentItemsPerPage] = useState(5);
  const [paymentSearchStartDate, setPaymentSearchStartDate] = useState("");
  const [paymentSearchEndDate, setPaymentSearchEndDate] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formState, setFormState] = useState({
    id: "",
    nom: "",
    prenom: "",
    numerotlfparent: "",
    cardid: "",
  });

  const history = useHistory();

  const id = history.location.state?.id.id;
  const nom = history.location.state?.id.nom;
  const prenom = history.location.state?.id.prenom;
  const numerotlfparent = history.location.state?.id.numerotlfparent;
  const cardid = history.location.state?.id.cardid;

  useEffect(() => {
    setFormState({
      nom: nom || "",
      prenom: prenom || "",
      numerotlfparent: numerotlfparent || "",
      cardid: cardid || "",
    });
    getArchivedPresence();
    getPaymentsstudent();
  }, [id]);

  const getArchivedPresence = () => {
    axios.get(`http://localhost:3001/archivedpresence/` + id)
      .then((response) => {
        setStudentsPresenceAchievement(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching archived presence data!", error);
      });
  };

  const getPaymentsstudent = () => {
    axios.get(`http://localhost:3001/getPaymentsstudent/${id}`)
      .then((response) => {
        setPaymentsstudent(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching payment data!", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const updateStudentInfo = (event) => {
    event.preventDefault();

    const updatedFields = {};
    if (formState.id !== id) updatedFields.id = formState.id;
    if (formState.nom !== nom) updatedFields.nom = formState.nom;
    if (formState.prenom !== prenom) updatedFields.prenom = formState.prenom;
    if (formState.numerotlfparent !== numerotlfparent) updatedFields.numerotlfparent = formState.numerotlfparent;
    if (formState.cardid !== cardid) updatedFields.cardid = formState.cardid;

    axios.put(`http://localhost:3001/updateStudent/${id}`, updatedFields)
      .then(response => {
        console.log("Student info updated successfully");
        history.push("/List/Std")
      })
      .catch(error => {
        console.error("There was an error updating student info!", error);
      });
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handlePaymentPageClick = (data) => {
    setPaymentCurrentPage(data.selected);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };


  const toDateInputValue = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const fromDateInputValue = (dateString) => {
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // Month is zero-based
  };

  const filterByDateAndStatus = (items) => {
    if (!searchStartDate || !searchEndDate) return items;

    const startDate = fromDateInputValue(searchStartDate);
    const endDate = fromDateInputValue(searchEndDate);
    endDate.setHours(23, 59, 59, 999);

    return items.filter((item) => {
      const itemDate = new Date(item.date);
      const matchesDate = itemDate >= startDate && itemDate <= endDate;
      const matchesStatus = statusFilter
        ? statusFilter === "present"
          ? item.is_present
          : !item.is_present
        : true;

      return matchesDate && matchesStatus;
    });
  };

  const filterPaymentsByDate = (items) => {
    if (!paymentSearchStartDate || !paymentSearchEndDate) return items;

    const startDate = fromDateInputValue(paymentSearchStartDate);
    const endDate = fromDateInputValue(paymentSearchEndDate);
    endDate.setHours(23, 59, 59, 999);

    return items.filter((item) => {
      const itemDate = new Date(item.payment_date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  const handleUpdatePayment = (payment) => {
    // Get the price of the current item
    const itemPrice = currentItems.length > 0 ? currentItems[0].price : 0;
    const name = currentItems.length > 0 ? currentItems[0].teacher_nom : 0;
    console.log(itemPrice)
    console.log(name)
    console.log(payment.attendance_count)

    // Calculate the new amount
    const newAmount = itemPrice * payment.attendance_count;
    console.log(newAmount)

    const updatedPayment = {
      id: payment.id,
      amount: payment.price * payment.attendance_count, // Correct amount calculation
      payment_date: paymentDate, // Ensure paymentDate is properly set
      attendance_count: payment.attendance_count,
    };

    // Call the update function
    updatePaymentAmount(updatedPayment);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setPaymentDate(newDate);
  };

  const [paymentDate, setPaymentDate] = useState("");

  const updatePaymentAmount = (updatedPayment) => {
    axios.put(`http://localhost:3001/updatePaymentAmount/${updatedPayment.id}`, updatedPayment)
      .then((response) => {
        console.log("Payment updated successfully");
        getPaymentsstudent(); // Refresh the payments data
      })
      .catch((error) => {
        console.error("There was an error updating the payment!", error);
      });
  };

  const handleAttendanceCountChange = (id, newAttendanceCount) => {
    // Get the current payment item
    const paymentItem = Paymentsstudent.find(payment => payment.id === id);

    // Calculate the new amount based on the price and new attendance count
    const newAmount = paymentItem.price * newAttendanceCount;

    // Ensure you have a valid payment date
    if (paymentItem) {
      updatePaymentAmount({
        id: id,
        amount: newAmount,
        payment_date: paymentItem.payment_date,
        attendance_count: newAttendanceCount
      });
    }
  };

  const filteredItems = filterByDateAndStatus(studentsPresenceAchievement);
  const paymentFilteredItems = filterPaymentsByDate(Paymentsstudent);

  const offset = currentPage * itemsPerPage;
  const paymentOffset = paymentCurrentPage * paymentItemsPerPage;

  const currentItems = filteredItems.slice(offset, offset + itemsPerPage);
  const currentPaymentItems = paymentFilteredItems.slice(
    paymentOffset,
    paymentOffset + paymentItemsPerPage
  );

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage);
  const paymentPageCount = Math.ceil(
    paymentFilteredItems.length / paymentItemsPerPage
  );

  return (
    <div className="container" style={{ direction: "rtl" }}>
      <div className="student-profile my-5">
        <h2 className="text-center mb-4">{formState.nom} {formState.prenom}</h2>
        <form className="update-form mb-5" onSubmit={updateStudentInfo}>
          <div className="row gx-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">الأسم *</label>
                <input
                  type="text"
                  className="form-control"
                  name="nom"
                  value={formState.nom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">اللقب *</label>
                <input
                  type="text"
                  className="form-control"
                  name="prenom"
                  value={formState.prenom}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">هاتف الولي *</label>
                <input
                  type="text"
                  className="form-control"
                  name="numerotlfparent"
                  value={formState.numerotlfparent}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">الهاتف *</label>
                <input
                  type="text"
                  className="form-control"
                  name="cardid"
                  value={formState.cardid}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">تحديث</button>
        </form>

        {/* Attendance Table */}
        <div className="attendance-section my-5">
          <h4 className="mb-4">- الحضور</h4>
          <form className="filter-form mb-4">
            <div className="row gx-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">تاريخ البدء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDateInputValue(searchStartDate)}
                    onChange={(e) => setSearchStartDate(fromDateInputValue(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDateInputValue(searchEndDate)}
                    onChange={(e) => setSearchEndDate(fromDateInputValue(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">حالة الحضور</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">الكل</option>
                    <option value="present">حاضر</option>
                    <option value="absent">غائب</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
          <table className="table table-bordered table-hover table-sm">
            <thead className="table-dark">
              <tr>
                <th>اسم و لقب الاتساذ</th>
                <th>التاريخ</th>
                <th>الحالة</th>
                <th>المادة</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.teacher_nom} {item.teacher_prenom}</td>
                    <td>{formatDate(item.date)}</td>
                    <td>{item.is_present ? "حاضر" : "غائب"}</td>
                    <td>{item.subject}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={"سابق"}
            nextLabel={"التالي"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>

        {/* Payment Table */}
        <div className="payment-section my-5">
          <h4 className="mb-4">- الدفوعات</h4>
          <form className="filter-form mb-4">
            <div className="row gx-3">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">تاريخ البدء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDateInputValue(paymentSearchStartDate)}
                    onChange={(e) => setPaymentSearchStartDate(fromDateInputValue(e.target.value))}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDateInputValue(paymentSearchEndDate)}
                    onChange={(e) => setPaymentSearchEndDate(fromDateInputValue(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </form>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>تاريخ الدفع</th>
                <th>المبلغ</th>
                <th>عدد الحضور</th>
                <th>الشهر</th>
                <th>المادة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentPaymentItems.length > 0 ? (
                currentPaymentItems
                  .filter(payment => payment.amount !== "0.00") // Filter out rows with amount 0
                  .map((payment, paymentIndex) => (
                    <tr key={paymentIndex}>
                      <td>
                        <input
                          type="date"
                          className="form-control"
                          value={toDateInputValue(payment.payment_date)}
                          onChange={handleDateChange}
                        />
                      </td>
                      <td>{payment.amount}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={payment.attendance_count}
                          onChange={(e) => handleAttendanceCountChange(payment.id, e.target.value)}
                        />
                      </td>
                      <td>{payment.month}</td>
                      <td>{payment.groupnumber}</td>
                      <td>
                        <button
                          onClick={() => handleUpdatePayment(payment)}
                          className="btn btn-primary btn-sm"
                        >
                          تحديث
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"سابق"}
            nextLabel={"التالي"}
            breakLabel={"..."}
            pageCount={paymentPageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePaymentPageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
        <h4 className="mb-4">- وجب الدفع</h4>

        {currentPaymentItems.some(payment => payment.amount === "0.00") && (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>تاريخ الدفع</th>
                <th>المبلغ</th>
                <th>عدد الحضور</th>
                <th>الشهر</th>
                <th>المادة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentPaymentItems.filter(payment => payment.amount === "0.00").length > 0 ? (
                currentPaymentItems.filter(payment => payment.amount === "0.00").map((payment, paymentIndex) => (
                  <tr key={paymentIndex}>
                    <td>
                      <input
                        type="date"
                        className="form-control"
                        value={toDateInputValue(payment.payment_date)}
                        onChange={handleDateChange}
                      />
                    </td>
                    <td>{payment.amount}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={payment.attendance_count}
                        onChange={(e) => handleAttendanceCountChange(payment.id, e.target.value)}
                      />
                    </td>
                    <td>{payment.month}</td>
                    <td>{payment.groupnumber}</td>
                    <td>
                      <button
                        onClick={() => handleUpdatePayment(payment)}
                        className="btn btn-primary btn-sm"
                      >
                        تحديث
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}

export default StudentProfile;
