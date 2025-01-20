import React, { useState } from "react";

const SalesForm = ({ addSale }) => {
  const [sale, setSale] = useState({ date: "", amount: "", description: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sale.date || !sale.amount) return;
    addSale(sale);
    setSale({ date: "", amount: "", description: "" });
  };

  return (
    <div className="card p-3 mb-4 shadow">
      <h4 className="text-primary">Add Sale</h4>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" type="date" value={sale.date} 
          onChange={(e) => setSale({ ...sale, date: e.target.value })} required />
        <input className="form-control mb-2" type="number" placeholder="Amount" 
          value={sale.amount} onChange={(e) => setSale({ ...sale, amount: e.target.value })} required />
        <input className="form-control mb-2" type="text" placeholder="Description" 
          value={sale.description} onChange={(e) => setSale({ ...sale, description: e.target.value })} />
        <button className="btn btn-success w-100">Add Sale</button>
      </form>
    </div>
  );
};

export default SalesForm;
