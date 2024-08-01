import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from './CartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="cart-container mx-auto p-4 lg:w-3/4 xl:w-2/3">
      <h2 className="text-3xl font-semibold mb-4">Shopping Cart</h2>
      {cart.cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <div className="start-shopping mt-4">
            <Link to="/" className="flex items-center text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left mr-2"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cart.cartItems &&
              cart.cartItems.map((cartItem) => (
                <div
                  className="cart-item flex items-center justify-between border-b border-gray-200 py-4"
                  key={cartItem._id}
                >
                  <div className="cart-product flex items-center">
                    <img
                      src={cartItem.image}
                      alt={cartItem.name}
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <h3 className="font-semibold">{cartItem.name}</h3>
                      <p>{cartItem.description}</p>
                      <button
                        onClick={() => handleRemoveFromCart(cartItem)}
                        className="text-red-500 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-product-price">${cartItem.price}</div>
                  <div className="cart-product-quantity flex items-center">
                    <button
                      onClick={() => handleDecreaseCart(cartItem)}
                      className="px-2 py-1 bg-gray-200"
                      disabled={cartItem.cartQuantity === 0}
                    >
                      -
                    </button>
                    <div className="count mx-2">{cartItem.cartQuantity}</div>
                    <button
                      onClick={() => handleAddToCart(cartItem)}
                      className="px-2 py-1 bg-gray-200"
                      disabled={cartItem.cartQuantity >= cartItem.countInStock}
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-product-total-price">
                    ${cartItem.price * cartItem.cartQuantity}
                  </div>
                </div>
              ))}
          </div>
          <div className="cart-summary mt-8">
            <button
              className="clear-btn bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => handleClearCart()}
            >
              Clear Cart
            </button>
            <div className="cart-checkout mt-4">
              <div className="subtotal flex justify-between items-center">
                <span>Subtotal</span>
                <span className="amount">${cart.cartTotalAmount}</span>
              </div>
              <p className="text-gray-500 text-sm">
                Taxes and shipping calculated at checkout
              </p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
                Check out
              </button>
              <div className="continue-shopping mt-4">
                <Link to="/" className="flex items-center text-blue-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left mr-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
