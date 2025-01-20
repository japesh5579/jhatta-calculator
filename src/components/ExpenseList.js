import React from "react";

const ExpenseList = ({ expenses, onDelete }) => (
  <div className="card p-3 mb-4 shadow">
    <h4>Expense List</h4>
    <ul className="list-group">
      {expenses.map((expense, index) => (
        <li className="list-group-item d-flex justify-content-between" key={index}>
          {expense.date} - {expense.category} - ₹{expense.amount} - {expense.description}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default ExpenseList;
