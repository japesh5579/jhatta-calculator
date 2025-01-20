import React from "react";

const ExpenseSummary = ({ expenses, sales }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.amount || 0), 0);
  const profit = totalSales - totalExpenses;

  return (
    <div>
      <h2>Total Expenses: ₹{totalExpenses.toFixed(2)}</h2>
      <h2>Total Sales: ₹{totalSales.toFixed(2)}</h2>
      <h2>Profit: ₹{profit.toFixed(2)}</h2>
    </div>
  );
};

export default ExpenseSummary;
