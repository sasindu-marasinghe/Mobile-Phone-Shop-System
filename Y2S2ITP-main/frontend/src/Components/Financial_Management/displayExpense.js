import React , {useState} from 'react';
import './FinanceCSS/DisplayDatabase.css';
import UpdateExpense from './UpdateExpense';

function DisplayExpense({ expense, onUpdate }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const { expense_id, date, category, amount, payment_method, description, receipt_no, name, location } = expense;

  return (
    <tr>
      <td>{expense_id}</td>
      <td>{date}</td>
      <td>{category}</td>
      <td>{amount}</td>
      <td>{payment_method}</td>
      <td>{description}</td>
      <td>{receipt_no}</td>
      <td>{name}</td>
      <td>{location}</td>
      <td>
        <button className="update-button" onClick={openPopup}>Update</button>
        <br />
        <button className="delete-button">Delete</button>
      </td>
      {isPopupOpen && (
        <UpdateExpense expenseId={expense_id} onUpdate={onUpdate} onClose={closePopup} />
      )}
    </tr>
  );
}

export default DisplayExpense;
