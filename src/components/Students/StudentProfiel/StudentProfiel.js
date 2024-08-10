import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

function StudentProfile() {
  const [student, setStudent] = useState({});
  const [Paymentsstudent, setPaymentsstudent] = useState([]);
  const [studentsPresenceAchievement, setStudentsPresenceAchievement] =
    useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);

  const [paymentCurrentPage, setPaymentCurrentPage] = useState(0);
  const [paymentItemsPerPage] = useState(5);
  const [paymentSearchStartDate, setPaymentSearchStartDate] = useState("");
  const [paymentSearchEndDate, setPaymentSearchEndDate] = useState("");

  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const history = useHistory();

  const id = history.location.state?.id.id;
  const nom = history.location.state?.id.nom;
  const prenom = history.location.state?.id.prenom;
  const numerotlfparent = history.location.state?.id.numerotlfparent;
  const cardid = history.location.state?.id.cardid;
  console.log({ history: history.location });

  const getArchivedPresence = () => {
    axios
      .get(`http://localhost:3001/archivedpresence/` + id)
      .then((response) => {
        setStudentsPresenceAchievement(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching archived presence data!",
          error
        );
      });
  };

  const getPaymentsstudent = () => {
    axios
      .get(`http://localhost:3001/getPaymentsstudent/${id}`)
      .then((response) => {
        setPaymentsstudent(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching payment data!", error);
      });
  };

  useEffect(() => {
    getArchivedPresence();
    getPaymentsstudent();
  }, [id]);

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
    return `${day}/${month}/${year}`;
  };

  const filterByDateAndStatus = (items) => {
    if (!searchStartDate || !searchEndDate) return items;

    const startDate = new Date(searchStartDate);
    const endDate = new Date(searchEndDate);
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

    const startDate = new Date(paymentSearchStartDate);
    const endDate = new Date(paymentSearchEndDate);
    endDate.setHours(23, 59, 59, 999);

    return items.filter((item) => {
      const itemDate = new Date(item.payment_date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };
  const handleUpdatePayment = (payment, itemPrice) => {
    const newAmount = itemPrice * payment.attendance_count;
    updatePaymentAmount(payment.id, newAmount); // Use payment.id here
  };

  const updatePaymentAmount = (id, newAmount) => {
    axios
      .put(`http://localhost:3001/updatePaymentAmount/${id}`, {
        amount: newAmount,
        id: id, // Ensure the id is passed in the body as well
      })
      .then((response) => {
        console.log("Payment updated successfully");
        // Optionally, you can refresh the payment data after update
        getPaymentsstudent();
      })
      .catch((error) => {
        console.error("There was an error updating the payment!", error);
      });
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
    <div style={{ direction: "rtl" }}>
      <div className="row">
        <div className="col-12">
          <div className="my-5">
            <h3>
              {nom} {prenom}
            </h3>
            <hr />
          </div>
          <form className="file-upload">
            <div className="row mb-5 gx-5">
              <div className="col-md-6">
                <label className="form-label">الأسم *</label>
                <input
                  type="text"
                  className="form-control"
                  value={nom || ""}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">اللقب *</label>
                <input
                  type="text"
                  className="form-control"
                  value={prenom || ""}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">الهاتف *</label>
                <input
                  type="text"
                  className="form-control"
                  value={numerotlfparent || ""}
                  readOnly
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">رقم بطاقة تعريف الولي *</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardid || ""}
                  readOnly
                />
              </div>
            </div>
          </form>

          {/* Attendance Table */}
          <div className="my-5">
            <h4>- الحضور</h4>
            <form className="file-upload">
              <div className="row mb-5 gx-5">
                <div className="col-md-6">
                  <label className="form-label">تاريخ البدء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={searchStartDate}
                    onChange={(e) => setSearchStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={searchEndDate}
                    onChange={(e) => setSearchEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
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
                      <td>
                        {item.teacher_nom} {item.teacher_prenom}
                      </td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.is_present ? "حاضر" : "غائب"}</td>
                      <td>{item.subject}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No data available
                    </td>
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
              containerClassName={"pagination"}
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
          <div className="my-5">
            <h4>- الدفعات</h4>
            <form className="file-upload">
              <div className="row mb-5 gx-5">
                <div className="col-md-6">
                  <label className="form-label">تاريخ البدء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={paymentSearchStartDate}
                    onChange={(e) => setPaymentSearchStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    className="form-control"
                    value={paymentSearchEndDate}
                    onChange={(e) => setPaymentSearchEndDate(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <table className="table table-bordered table-hover table-sm">
              <thead className="table-dark">
                <tr>
                  <th>التاريخ</th>
                  <th>المبلغ</th>
                  <th>عدد الحصص</th>
                  <th>تحديث</th>
                </tr>
              </thead>
              <tbody>
                {currentPaymentItems.length > 0 ? (
                  currentPaymentItems.map((payment, paymentIndex) => {
                    const itemPrice =
                      currentItems.length > 0 ? currentItems[0].price : 0;

                    return (
                      <tr key={paymentIndex}>
                        <td>{formatDate(payment.payment_date)}</td>
                        <td>
                          {payment.amount === "0.00"
                            ? "لم يدفع"
                            : payment.amount}
                        </td>
                        <td>{payment.attendance_count}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleUpdatePayment(payment, itemPrice)
                            }
                            className="btn btn-primary btn-sm"
                          >
                            تحديث
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No payment data available
                    </td>
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
              containerClassName={"pagination"}
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
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
