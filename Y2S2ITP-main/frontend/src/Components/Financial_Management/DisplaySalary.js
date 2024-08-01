import React , {useState} from 'react';
import './FinanceCSS/DisplayDatabase.css';
import UpdateSalary from './UpdateSalary';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';


function DisplaySalary({ salary, onUpdate, onDelete }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  //popup for deleting a record
  const [isPopupOpenDelete,setIsPopupOpenDelete]=useState(false);
  const [popupText, setPopupText]=useState("");

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };


  const openPopupDelete = () => {
    setIsPopupOpenDelete(true);
    setPopupText("Record Is Deleting.. ");

    // Change text to "Record Is Deleted" after 2 seconds
    setTimeout(() => {
      setPopupText("Record Deleted Successfully");
      setTimeout(() => {
        setIsPopupOpenDelete(false);  // Close the popup after another 1 seconds
      }, 2000);
    }, 100);
  };

  const closePopupDelete = () => {
    setIsPopupOpenDelete(false);
  };

  const { employee_id, name, position, base_salary, ot_payment, bonus, deduction, net_salary,pay_period } = salary;
  const history=useNavigate();

  const deleteHandler = async () => {
    openPopupDelete(); // Open the popup when deleteHandler is called
    try {
      await axios.delete(`http://localhost:8080/salaries/delete/${employee_id}`);
      onDelete();  // Call the onDelete callback
    } catch (error) {
      console.error("Error deleting the expense:", error);
    }
  };

  
  
  

  return (
    <tr>
      <td>{employee_id}</td>
      <td>{name}</td>
      <td>{position}</td>
      <td>{base_salary}</td>
      <td>{ot_payment}</td>
      <td>{bonus}</td>
      <td>{deduction}</td>
      <td>{net_salary}</td>
      <td>{pay_period}</td>
      <td>
        <button className="update-button" onClick={openPopup}>Update</button>
        <br />
        <button className="delete-button" onClick={deleteHandler} >Delete</button>
      </td>

      {isPopupOpenDelete && (
        <>
       <div className="popup-del-overlay"></div>
        <div className="popup-del">
          <p>{popupText}</p>
        </div>
        </>
      )}

      {isPopupOpen && (
        <UpdateSalary employeeId={employee_id} onUpdate={onUpdate} onClose={closePopup} />
      )}
    </tr>
  );
}

export default DisplaySalary;
