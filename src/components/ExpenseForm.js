import React, { useState } from "react";

const ExpenseForm = ({ addExpense }) => {
  const [expense, setExpense] = useState({ date: "", category: "", amount: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!expense.date || !expense.amount) return;
    addExpense(expense);
    setExpense({ date: "", category: "", amount: "", description: "" });
  };

  return (
    <div className="card p-3 mb-4 shadow">
      <h4 className="text-success">Add Expense</h4>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="date" value={expense.date} 
          onChange={(e) => setExpense({ ...expense, date: e.target.value })} required />
        <input className="form-control mb-2" type="text" placeholder="Category" 
          value={expense.category} onChange={(e) => setExpense({ ...expense, category: e.target.value })} required />
        <input className="form-control mb-2" type="number" placeholder="Amount" 
          value={expense.amount} onChange={(e) => setExpense({ ...expense, amount: e.target.value })} required />
        <input className="form-control mb-2" type="text" placeholder="Description" 
          value={expense.description} onChange={(e) => setExpense({ ...expense, description: e.target.value })} />
        <button className="btn btn-primary w-100">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseForm;
