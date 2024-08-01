import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ViewProduct() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});

  useEffect(() => {
    async function getProduct() {
      try {
        const res = await axios.get(
          `http://localhost:8175/product/getProduct/${id}`
        );
        setProduct(res.data.product);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    getProduct();
  }, [id]);

  return (
      <>
          
          
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 justify-items-center justify-center gap-y-10 gap-x-8 mt-4 mb-4">
          <div
            className="w-72 bg-white shadow-md rounded-xl duration-200 hover:scale-105 hover:shadow-xl"
            key={product._id}
          >
            <div className="overflow-hidden">
              <img
                src={product.image[0]}
                alt={`${product.name}_0`}
                className="h-50 w-80 object-cover rounded-t-xl transition-transform duration-300 transform-gpu hover:scale-125"
              />
            </div>

            <div className="px-4 py-3 w-72">
              <strong className="text-lg font-bold text-black truncate block capitalize">
                {product.name}
              </strong>
              {/* rating */}
              <div className="flex items-center mt-2.5 mb-5">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className="w-4 h-4 text-yellow-300"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                  ))}
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
                    5.0
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <p className="text-lg font-semibold text-blue-700 cursor-auto my-3">
                  Rs.149,000
                </p>
                <del>
                  <p className="text-sm text-red-600 cursor-auto ml-2">
                    Rs.{product.price && product.price.toLocaleString()}
                  </p>
                </del>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ViewProduct;
