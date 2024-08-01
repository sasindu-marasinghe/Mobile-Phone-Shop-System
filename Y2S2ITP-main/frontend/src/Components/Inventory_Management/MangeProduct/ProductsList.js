import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNav from '../../Nav/adminNav';
import axios from 'axios';
import Swal from 'sweetalert2';
import PopupComponent from './PopupComponent';
import {
  FaShoppingBag,
  FaExclamationCircle,
  FaEye,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // Fetch products from API
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:8175/product/')
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message);
      });
  }, []);

  // Alert for out of stock products
  useEffect(() => {
    const outOfStockProducts = products.filter(
      (product) => product.countInStock === 0
    );

    setOutOfStockCount(outOfStockProducts.length);

    if (outOfStockProducts.length > 0) {
      const outOfStockProductNames = outOfStockProducts.map(
        (product) => product.name
      );
      Swal.fire({
        position: 'center',
        icon: 'warning',
        html: `${outOfStockProductNames.join(', ')}`,
        title: 'Some Product Are Out Of Stock',
        confirmButtonText: 'Ok',
      });
    }
  }, [products]);

  // Handle product deletion
  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        axios
          .delete(`http://localhost:8175/product/delete/${productId}`)
          .then(() => {
            setLoading(false);
            setProducts(
              products.filter((product) => product._id !== productId)
            );
            Swal.fire({
              title: 'Deleted!',
              text: 'Product has been deleted.',
              icon: 'success',
            });
          })
          .catch((error) => {
            setLoading(false);
            console.error('Error deleting product:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error deleting product',
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }
    });
  };

  const totalProducts = products.length;

  //stock update
  const updateStockMin = async (product) => {
    const countInStock = product.countInStock - 1;

    if (countInStock >= 0) {
      try {
        const res = await axios.put(
          `http://localhost:8175/product/update/${product._id}`,
          {
            countInStock,
          }
        );
        console.log('Stock updated successfully:', res.data);
        // Update the product countInStock directly in the state
        const updatedProducts = products.map((p) =>
          p._id === product._id ? { ...p, countInStock } : p
        );
        setProducts(updatedProducts);
      } catch (err) {
        console.error('Error updating stock:', err);
      }
    } else {
      console.log('error');
    }
  };

  const updateStockPlus = async (product) => {
    const countInStock = product.countInStock + 1;

    if (countInStock >= 0) {
      try {
        const res = await axios.put(
          `http://localhost:8175/product/update/${product._id}`,
          {
            countInStock,
          }
        );
        console.log('Stock updated successfully:', res.data);
        // Update the product countInStock directly in the state
        const updatedProducts = products.map((p) =>
          p._id === product._id ? { ...p, countInStock } : p
        );
        setProducts(updatedProducts);
      } catch (err) {
        console.error('Error updating stock:', err);
      }
    } else {
      console.log('error');
    }
  };


  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <header>
        <AdminNav />
      </header>
      <main className="plist ml-48">
        <div className="relative overflow-x-auto sm:rounded-lg flex flex-row justify-center">
          {/* Total Products Card */}
          <div className="rounded-lg bg-green-300 shadow-md p-4 mb-4 mr-4 duration-500 hover:scale-105 hover:shadow-xl w-50">
            <Link onClick={togglePopup}>
              <div className="flex items-center justify-center mb-2">
                <FaShoppingBag className="text-blue-500 text-3xl mr-2" />
                <div className="text-lg font-semibold">Total Products</div>
              </div>
              <div className="text-center text-3xl font-bold text-gray-800">
                {totalProducts}
              </div>
            </Link>
          </div>

          {isPopupOpen && <PopupComponent onClose={togglePopup} />}
          

          {/* Out of Stock Products Card */}
          <div className="rounded-lg bg-red-200 shadow-md p-4 mb-4 mr-4 duration-500 hover:scale-105 hover:shadow-xl w-50">
            <div className="flex items-center justify-center mb-2">
              <FaExclamationCircle className="text-red-700 text-2xl mr-2" />
              <div className="text-lg font-semibold">Out of Stock Products</div>
            </div>
            <div className="text-center text-3xl font-bold text-gray-800">
              {outOfStockCount}
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-1 p-3 max-w-full sm:max-w-7xl">
          <div className="flex flex-row items-center justify-between pb-4">
            <div className="addProductBtn">
              <Link to="/admin/productsList/addProduct">
                <button className="bg-blue-500 hover:bg-blue-700 text-white inline-flex items-center border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5">
                  + Add Product
                </button>
              </Link>
            </div>
            <div className="addProductBtn">
              <Link to="/admin/productsList/report">
                <button className="bg-green-500 hover:bg-green-700 text-white inline-flex items-center border border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-2.5">
                  Get Report
                </button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center justify-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-900"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                onChange={(e) => {
                  setSearchItem(e.target.value);
                }}
                className="block px-4 py-2.5 text-sm text-gray-900 border border-gray-800 rounded-lg w-36 sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for items"
              />
            </div>
          </div>

          <div>
            <table className="w-full text-sm text-left text-gray-500">
              {/* Table header */}
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" class="px-5 py-3">
                    Image
                  </th>
                  <th scope="col" class="px-5 py-3">
                    Name
                  </th>
                  <th scope="col" class="px-5 py-3">
                    Category
                  </th>
                  <th scope="col" class="px-5 py-3">
                    Stock Count
                  </th>

                  <th scope="col" class="px-5 py-3">
                    Price
                  </th>
                  <th scope="col" class="px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  {/* Table body */}
                  <tbody className="px-6 py-4">
                    {/* Table rows */}
                    {currentItems
                      .filter((product) => {
                        if (searchItem === '') {
                          return product;
                        } else if (
                          product.name
                            .toLowerCase()
                            .includes(searchItem.toLowerCase())
                        ) {
                          return product;
                        }
                      })
                      .map((product) => (
                        <tr
                          className="bg-white border-b hover:bg-white-50"
                          key={product._id}
                        >
                          <td className="px-2 py-1">
                            <div>
                              {Array.isArray(product.image) ? (
                                <img
                                  src={product.image[0]}
                                  alt={`${product.name}_0`}
                                  style={{ width: '90px', height: '80px' }}
                                />
                              ) : (
                                product.image && (
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{ width: '90px', height: '80px' }}
                                  />
                                )
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 font-semibold text-black">
                            {product.name}
                          </td>
                          <td className="px-5 py-3 font-semibold text-black">
                            {product.category}
                          </td>

                          <td className="px-5 py-3 font-semibold text-black">
                            <div>
                              {product.countInStock > 0 ? (
                                <>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => updateStockMin(product)}
                                      disabled={product.countInStock === 0}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-l"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-800">
                                      {product.countInStock}
                                    </span>
                                    <button
                                      onClick={() => updateStockPlus(product)}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-r"
                                    >
                                      +
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <span className="outStock">Out of Stock</span>
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => updateStockMin(product)}
                                      disabled={product.countInStock === 0}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-l"
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 bg-gray-200 text-gray-800">
                                      {product.countInStock}
                                    </span>
                                    <button
                                      onClick={() => updateStockPlus(product)}
                                      className="px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-r"
                                    >
                                      +
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-3 font-semibold text-black">
                            {product.price}
                          </td>
                          <td className="px-5 py-3 font-semibold text-black">
                            <Link
                              to={`/admin/productsList/viewProduct/${product._id}`}
                            >
                              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 m-2 rounded">
                                <FaEye />
                              </button>
                            </Link>

                            <Link
                              to={`/admin/productsList/editProduct/${product._id}`}
                            >
                              <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 m-2 rounded">
                                <FaEdit />
                              </button>
                            </Link>

                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 m-2 rounded"
                              onClick={() => handleDelete(product._id)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </>
              )}
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <ul className="flex">
                {Array.from({
                  length: Math.ceil(products.length / itemsPerPage),
                }).map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => paginate(index + 1)}
                      className={`${
                        currentPage === index + 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      } font-semibold py-2 px-4 rounded-l`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductsList;
