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
    // Update localStorage every time expenses or sales change
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [expenses, sales]);

  // Check if it's a new day and reset daily data if so
  useEffect(() => {
    const lastUpdated = localStorage.getItem("lastUpdated");
    const currentDate = new Date().toDateString();

    if (lastUpdated !== currentDate) {
      localStorage.setItem("lastUpdated", currentDate);
      setDailyData({ expenses: [], sales: [] }); // Reset the daily data
    } else {
      const storedDailyData = JSON.parse(localStorage.getItem("dailyData")) || { expenses: [], sales: [] };
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
      localStorage.setItem("dailyData", JSON.stringify(newData)); // Save daily data to localStorage
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

  // Calculate total sales and total expenses for the day, ensuring numeric values
  const totalSalesToday = dailyData.sales.reduce((total, sale) => {
    const amount = parseFloat(sale.amount); // Ensure the amount is a number
    return total + (isNaN(amount) ? 0 : amount); // Add only valid numbers
  }, 0);

  const totalExpensesToday = dailyData.expenses.reduce((total, expense) => {
    const amount = parseFloat(expense.amount); // Ensure the amount is a number
    return total + (isNaN(amount) ? 0 : amount); // Add only valid numbers
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

        {/* Daily Sales and Expenses Calculation Section */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5>
                  <strong>Total Sales Today: </strong> ₹{totalSalesToday.toFixed(2)}
                </h5>
                <h5>
                  <strong>Total Expenses Today: </strong> ₹{totalExpensesToday.toFixed(2)}
                </h5>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
