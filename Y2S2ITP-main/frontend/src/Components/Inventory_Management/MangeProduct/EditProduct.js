import { useParams } from 'react-router-dom';
import AdminNav from '../../Nav/adminNav';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './product.css';
import { useNavigate } from 'react-router-dom';

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8175/product/getProduct/${id}`)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data.product);
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  }, [id]);

  const [name, setName] = useState('');
  const [image, setImages] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  // Initialize state after product data is fetched
  useEffect(() => {
    if (!loading && Object.keys(product).length !== 0) {
      setName(product.name || '');
      setImages(product.image || '');
      setCategory(product.category || '');
      setBrand(product.brand || '');
      setPrice(product.price || '');
      setCountInStock(product.countInStock || '');
      setDescription(product.description || '');
    }
  }, [loading, product]);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadImage = async (event) => {
    const files = event.target.files;
    console.log(files.length);

    if (files.length === 1) {
      const base64 = await convertBase64(files[0]);
      setImages(base64);
      return;
    }

    const base64s = [];
    for (var i = 0; i < files.length; i++) {
      var base = await convertBase64(files[i]);
      base64s.push(base);
    }
    setImages(base64s);
  };

  function UpdateData(e) {
    e.preventDefault();

    const UpdateProduct = {
      name,
      image,
      category,
      brand,
      price,
      countInStock,
      description,
    };
    setLoading(true);
    axios
      .put(`http://localhost:8175/product/update/${id}`, UpdateProduct)
      .then((res) => {
        console.log('updated successfully:', res.data);
        setLoading(false);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Product Update Successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        history('/admin/productsList');
      })
      .catch((err) => {
        console.error('Error updating :', err);
        setLoading(false);
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error with Product Update',
          showConfirmButton: false,
          timer: 1500,
        });
      });
  }

  return (
    <>
      <header>
        <AdminNav />
      </header>
      <main className="padd">
        {loading ? (
          <div className="loader"></div>
        ) : (
          <div className="product-container">
            <div className="containerAddProduct">
              <h2>Edit Product</h2>
              <form
                onSubmit={UpdateData}
                id="productForm"
                className="formContainer"
              >
                <div className="formLeft">
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                      id="category"
                      name="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="select"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Iphone">iPhone</option>
                      <option value="Android">Android Phones</option>
                      <option value="Windows">Windows Phones</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="brand">Brand:</label>
                    <input
                      type="text"
                      id="brand"
                      name="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="countInStock">Count In Stock:</label>
                    <input
                      type="number"
                      id="countInStock"
                      name="countInStock"
                      min="0"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      rows="4"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="formRight">
                  <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <div className="w-full mx-auto grid grid-cols-2 justify-items-center justify-center gap-y-5 gap-x-8 mt-4 mb-4">
                      {Array.isArray(image) ? (
                        image.map((img, index) => (
                          <img
                            key={index}
                            width={200}
                            height={200}
                            src={img}
                            alt={`productImage${index}`}
                            className="image hover:scale-110"
                          />
                        ))
                      ) : image ? (
                        <img
                          width={200}
                          height={200}
                          src={image}
                          alt="productImage"
                          className="image hover:scale-110"
                        />
                      ) : (
                        <p>No Image Selected</p>
                      )}
                    </div>

                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={uploadImage}
                      multiple
                    />
                  </div>
                  <button disabled={loading} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default EditProduct;
