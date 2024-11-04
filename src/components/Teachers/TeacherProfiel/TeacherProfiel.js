import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function TeacherProfile() {
    const history = useHistory();

    const [formState, setFormState] = useState({
        id: "",
        nom: "",
        prenom: "",
        numerotlf: "",
        cardid: "",
        price:""
    });

    const [students, setStudents] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");

    useEffect(() => {
        const teacherId = history.location.state?.id.id;
        if (teacherId) {
            setFormState({
                id: teacherId,
                nom: history.location.state?.id.nom || "",
                prenom: history.location.state?.id.prenom || "",
                numerotlf: history.location.state?.id.numerotlf || "",
                cardid: history.location.state?.id.cardid || "",
                price: history.location.state?.id.price || "",
            });

            axios
                .get(`http://localhost:3001/studentDetailsByTeacher/${teacherId}`)
                .then((response) => {
                    const data = response.data;
                    setStudents(data);
                })
                .catch((error) => {
                    console.error("Error fetching student details:", error);
                    setStudents([]);
                });
        }
    }, [history.location.state?.id.id]);

    const groupStudentsByGroupNumber = (students) => {
        return students.reduce((acc, student) => {
            const group = student.groupnumber;
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(student);
            return acc;
        }, {});
    };

    const filterStudentsByMonth = (students, month) => {
        if (!month) return students;
        return students.filter(student => student.month === parseInt(month));
    };

    const filteredStudents = filterStudentsByMonth(students, selectedMonth);
    const groupedStudents = groupStudentsByGroupNumber(filteredStudents);

    const formatPaymentAmount = (amount) => {
        if (amount === null || amount === "0.00") {
            return "لم يدفع";
        }
        return amount;
    };

    const calculateTotalAmount = (students) => {
        return students.reduce((total, student) => {
            const amount = parseFloat(student.amount) || 0;
            return total + amount;
        }, 0);
    };

    const exportToExcel = (data, groupNumber) => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Group ${groupNumber}`);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(file, `Group_${groupNumber}_Data.xlsx`);
    };

    return (
        <div className="container" style={{ direction: "rtl" }}>
            <div className="student-profile my-5">
                <h2 className="text-center mb-4">{formState.nom} {formState.prenom}</h2>
                <form className="update-form mb-5">
                    <div className="row gx-3">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">الأسم *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="nom"
                                    value={formState.nom}
                                    readOnly
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
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">هاتف *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="numerotlf"
                                    value={formState.numerotlf}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label">price *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="price"
                                    value={formState.price}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">تحديث</button>
                </form>

                <div className="mb-4">
                    <label className="form-label">اختر الشهر</label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="">جميع الأشهر</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                    </select>
                </div>

                {Object.keys(groupedStudents).map((groupNumber) => {
                    const studentsInGroup = groupedStudents[groupNumber];
                    const totalAmount = calculateTotalAmount(studentsInGroup);

                    return (
                        <div key={groupNumber} className="mb-5">
                            <h3>Group {groupNumber}</h3>
                            <button 
                                className="btn btn-success mb-3"
                                onClick={() => exportToExcel(studentsInGroup, groupNumber)}
                            >
                                Export to Excel
                            </button>
                            <table className="table table-bordered table-hover">
                                <thead className="table-primary">
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">اسم الطالب</th>
                                        <th scope="col">اسم العائلة</th>
                                        <th scope="col">المبلغ</th>
                                        <th scope="col">عدد الحصص</th>
                                        <th scope="col">الشهر</th>
                                        <th scope="col">رقم المجموعة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsInGroup.map((student, index) => (
                                        <tr key={student.student_id}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{student.nom}</td>
                                            <td>{student.prenom}</td>
                                            <td>{formatPaymentAmount(student.amount)}</td>
                                            <td>{student.attendance_count}</td>
                                            <td>{student.month}</td>
                                            <td>{student.groupnumber}</td>
                                        </tr>
                                    ))}
                                    {/* Total amount row */}
                                    <tr>
                                        <td colSpan="3" className="text-end">الإجمالي:</td>
                                        <td>{formatPaymentAmount(totalAmount.toFixed(2))}</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TeacherProfile;
