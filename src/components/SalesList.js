import React from "react";

const SalesList = ({ sales, onDelete }) => (
  <div className="card p-3 mb-4 shadow">
    <h4>Sales List</h4>
    <ul className="list-group">
      {sales.map((sale, index) => (
        <li className="list-group-item d-flex justify-content-between" key={index}>
          {sale.date} - ₹{sale.amount} - {sale.description}
          <button className="btn btn-danger btn-sm" onClick={() => onDelete(index)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
);

export default SalesList;
