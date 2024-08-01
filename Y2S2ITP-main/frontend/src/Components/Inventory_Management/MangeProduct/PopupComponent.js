import React from 'react';
import StockChart from './StockChart';
import './product.css';

function PopupComponent({ onClose }) {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>
        <StockChart />
      </div>
    </div>
  );
}

export default PopupComponent;
