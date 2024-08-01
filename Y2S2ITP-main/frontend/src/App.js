import { Routes, Route,Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/User/HomePage';
import ProductPage from './pages/User/ProductPage';
import Dashboard from './pages/Admin/Dashboard';
import ProductsList from './Components/Inventory_Management/MangeProduct/ProductsList';
import AddProduct from './Components/Inventory_Management/MangeProduct/AddProduct';
import EditProduct from './Components/Inventory_Management/MangeProduct/EditProduct';
import ViewProduct from './Components/Inventory_Management/MangeProduct/ViewProduct';


import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Signup from './Components/User_Management/signup';
import Login from './Components/User_Management/Login';
import ForgotPassword from './Components/User_Management/ForgotPassword';
import UpdateUsers from './Components/User_Management/updateuser';
import ResetPassword from './Components/User_Management/ResetPassword';
import OTPVerification from './Components/User_Management/OTPVerification';
import Users from './Components/User_Management/displayuserdetails';

import CreateUsers from './Components/User_Management/createuser'; // Import once
import AccountDetails from './Components/User_Management/AccountDetails';
import SecuritySettings from './Components/User_Management/SecuritySettings';
import Staff from './Components/User_Management/staffdetails';
import CreateStaff from'./Components/User_Management/createstaff'
import UpdateStaff from'./Components/User_Management/staffupdate'

import AddAForm from "./Components/Appointment_Management/AddAForm";
import UpdateAppointment from './Components/Appointment_Management/UpdateAppointment';
import CartPage from './pages/User/CartPage';


const AdminRouteGuard = ({ element }) => {
  const userRole = Cookies.get('role');

  if (userRole === 'admin') {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

const UserRouteGuard = ({ element }) => {
  const userRole = Cookies.get('role');

  if (userRole === 'user') {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};

const AllUsersRouteGuard = ({ element }) => {
  const userRole = Cookies.get('role');

  if (userRole === 'admin' || userRole === 'user') {
    return element;
  } else {
    return <Navigate to="/login" />;
  }
};



function App() {
 

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />}  />

        <Route path="/admin/*" element={<AdminRouteGuard element={<Dashboard />} />} />
        <Route path="/admin/productsList" element={<AdminRouteGuard element={<ProductsList />} />} />
        <Route path="/admin/productsList/addProduct" element={<AdminRouteGuard element={<AddProduct />} />} />
        <Route path="/admin/productsList/editProduct/:id" element={<AdminRouteGuard element={<EditProduct />} />} />
        <Route path="/admin/productsList/viewProduct/:id" element={<AdminRouteGuard element={<ViewProduct />} />} />

        <Route path="/cart" element={<CartPage />} />

        

        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/userdetails" element={<AdminRouteGuard element={<Users />} />} /> 
        <Route path="/usercreate" element={<AdminRouteGuard element={<CreateUsers />} />} />

        <Route path="/userupdate/:id" element={<AdminRouteGuard element={<UpdateUsers />} />} />

        <Route path="/AccountDetails" element={<AllUsersRouteGuard element={<AccountDetails />} />} />
        
        
        <Route path="/SecuritySettings" element={<AllUsersRouteGuard element={<SecuritySettings />} />} />
        <Route path="/createstaff" element={<CreateStaff />} />


        <Route path= "/staffdetails" element={<Staff/>}/>
        <Route path= "/staffupdate/:id" element={<UpdateStaff/>}/>
       

      
        <Route path="/addForm" element={<AddAForm />}/>
        <Route path="/updateD" element={<UpdateAppointment />} />

        <Route path="/staffdetails" element={<Staff/>}/>
        <Route path = "/financial-analysis" element={<FinanceHome/>}/>

        

      </Routes>
    </div>
  );
}

export default App;
