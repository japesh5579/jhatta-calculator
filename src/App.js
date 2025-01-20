import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ExpenseForm from "./components/ExpenseForm";
import SalesForm from "./components/SalesForm";
import ExpenseList from "./components/ExpenseList";
import SalesList from "./components/SalesList";
import ExpenseSummary from "./components/ExpenseSummary";
import logo from "./jha.jpg";
import expenseIcon from "./expense.jpg";
import salesIcon from "./sales.jpg";
import "./App.css";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const App = () => {
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );
  const [sales, setSales] = useState(
    JSON.parse(localStorage.getItem("sales")) || []
  );

  const [dailyData, setDailyData] = useState({
    expenses: [],
    sales: [],
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [expenses, sales]);

  useEffect(() => {
    const lastUpdated = localStorage.getItem("lastUpdated");
    const currentDate = new Date().toDateString();

    if (lastUpdated !== currentDate) {
      localStorage.setItem("lastUpdated", currentDate);
      setDailyData({ expenses: [], sales: [] });
    } else {
      const storedDailyData =
        JSON.parse(localStorage.getItem("dailyData")) || {
          expenses: [],
          sales: [],
        };
      setDailyData(storedDailyData);
    }
  }, []);

  const showNotification = (message) => {
    Swal.fire({
      icon: "success",
      title: message,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
      position: "top-end",
    });
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, expense]);
    updateDailyData("expenses", expense);
    showNotification("Expense added successfully!");
  };

  const addSale = (sale) => {
    setSales([...sales, sale]);
    updateDailyData("sales", sale);
    showNotification("Sale added successfully!");
  };

  const updateDailyData = (type, data) => {
    setDailyData((prevData) => {
      const newData = { ...prevData, [type]: [...prevData[type], data] };
      localStorage.setItem("dailyData", JSON.stringify(newData));
      return newData;
    });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter((_, i) => i !== id));
    showNotification("Expense deleted successfully!");
  };

  const deleteSale = (id) => {
    setSales(sales.filter((_, i) => i !== id));
    showNotification("Sale deleted successfully!");
  };

  const clearDailyData = () => {
    setDailyData({ expenses: [], sales: [] });
    localStorage.setItem("dailyData", JSON.stringify({ expenses: [], sales: [] }));
    showNotification("Daily data cleared!");
  };

  const generatePDF = (type) => {
    const doc = new jsPDF();

    // Add title and date
    doc.setFontSize(18);
    const title =
      type === "daily"
        ? "Jhatta Pharmacy - Daily Report"
        : "Jhatta Pharmacy - Overall Report";
    doc.text(title, 14, 10);
    const currentDate = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Date: ${currentDate}`, 14, 20);

    // Table data
    const data = type === "daily" ? dailyData : { expenses, sales };

    // Expenses Table
    doc.setFontSize(14);
    doc.text("Expenses:", 14, 30);
    doc.autoTable({
      startY: 35,
      head: [["Description", "Amount"]],
      body: data.expenses.map((expense) => [
        expense.description,
        `₹${parseFloat(expense.amount).toFixed(2)}`,
      ]),
    });

    // Sales Table
    const nextTableY = doc.autoTable.previous.finalY + 10;
    doc.text("Sales:", 14, nextTableY);
    doc.autoTable({
      startY: nextTableY + 5,
      head: [["Description", "Amount"]],
      body: data.sales.map((sale) => [
        sale.description,
        `₹${parseFloat(sale.amount).toFixed(2)}`,
      ]),
    });

    // Save the PDF
    const fileName = type === "daily" ? "Daily_Report.pdf" : "Overall_Report.pdf";
    doc.save(fileName);
  };

  const generateExcel = (type) => {
    const workbook = XLSX.utils.book_new();

    // Data source
    const data = type === "daily" ? dailyData : { expenses, sales };

    // Expenses Sheet
    const expensesSheet = XLSX.utils.json_to_sheet(
      data.expenses.map((expense) => ({
        Description: expense.description,
        Amount: parseFloat(expense.amount).toFixed(2),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, expensesSheet, "Expenses");

    // Sales Sheet
    const salesSheet = XLSX.utils.json_to_sheet(
      data.sales.map((sale) => ({
        Description: sale.description,
        Amount: parseFloat(sale.amount).toFixed(2),
      }))
    );
    XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales");

    // Save Excel File
    const fileName = type === "daily" ? "Daily_Report.xlsx" : "Overall_Report.xlsx";
    XLSX.writeFile(workbook, fileName);
  };

  const totalSalesToday = dailyData.sales.reduce((total, sale) => {
    const amount = parseFloat(sale.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  const totalExpensesToday = dailyData.expenses.reduce((total, expense) => {
    const amount = parseFloat(expense.amount);
    return total + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <div className="App">
      <div className="container mt-5 p-4 shadow rounded bg-light">
        <div className="d-flex align-items-center mb-4 bg-success text-white p-3 rounded">
          <img
            src={logo}
            alt="Jhatta Pharmacy Logo"
            className="me-3"
            style={{ width: "70px", borderRadius: "50%" }}
          />
          <h1 className="fw-bold">Jhatta Pharmacy</h1>
        </div>

        <div className="row g-4">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white d-flex align-items-center">
                <img
                  src={expenseIcon}
                  alt="Expense Icon"
                  className="me-2"
                  style={{ width: "40px" }}
                />
                <h3 className="mb-0">Expenses</h3>
              </div>
              <div className="card-body">
                <ExpenseForm addExpense={addExpense} />
                <ExpenseList expenses={expenses} onDelete={deleteExpense} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white d-flex align-items-center">
                <img
                  src={salesIcon}
                  alt="Sales Icon"
                  className="me-2"
                  style={{ width: "40px" }}
                />
                <h3 className="mb-0">Sales</h3>
              </div>
              <div className="card-body">
                <SalesForm addSale={addSale} />
                <SalesList sales={sales} onDelete={deleteSale} />
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Summary</h3>
          </div>
          <div className="card-body">
            <ExpenseSummary expenses={expenses} sales={sales} />
          </div>
        </div>

        {/* Daily and Overall Report Section */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5>
                  <strong>Total Sales Today: </strong> ₹
                  {totalSalesToday.toFixed(2)}
                </h5>
                <h5>
                  <strong>Total Expenses Today: </strong> ₹
                  {totalExpensesToday.toFixed(2)}
                </h5>
                <button
                  className="btn btn-warning mt-3"
                  onClick={clearDailyData}
                >
                  Clear Daily Data
                </button>
                <button
                  className="btn btn-primary mt-3 ms-2"
                  onClick={() => generatePDF("daily")}
                >
                  Daily PDF
                </button>
                <button
                  className="btn btn-success mt-3 ms-2"
                  onClick={() => generateExcel("daily")}
                >
                  Daily Excel
                </button>
              </div>
            </div>
          </div>

          {/* PDF and Excel for Overall */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <button
                  className="btn btn-primary mt-3 ms-2"
                  onClick={() => generatePDF("overall")}
                >
                  Overall PDF
                </button>
                <button
                  className="btn btn-success mt-3 ms-2"
                  onClick={() => generateExcel("overall")}
                >
                  Overall Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
