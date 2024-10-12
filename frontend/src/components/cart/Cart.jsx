import React, { useEffect } from "react";
import { useAlert } from "react-alert";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import { fetchCartItems, removeItemFromCart, updateCartQuantity } from "../../actions/cartActions";
import { payment } from "../../actions/orderActions";

// let fakeCartItems = [
//   {
//     foodItem: {
//       images: [
//         {
//           public_id: "kaala_channa_chat image",
//           url: "https://b.zmtcdn.com/data/dish_photos/94a/c01f4e8fcce05666b8a28eadd627394a.jpg?fit=around|130:130&crop=130:130;*,*",
//           _id: "1",
//         },
//       ],
//       name: "Kaala Channa Chat",
//       price: 120,
//       _id: "123",
//     },
//     quantity: 1,
//     _id: "cart123",
//   },
//   {
//     foodItem: {
//       images: [
//         {
//           public_id: "Pani puri image",
//           url: "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/FOOD_CATALOG/IMAGES/CMS/2024/3/11/b3734c76-eba3-4509-86ed-aa774e6336e4_e7abf189-300f-4cc7-bc9b-fc42a24c8178.png_compressed",
//           _id: "2",
//         },
//       ],
//       name: "Pani puri",
//       price: 50,
//       _id: "456",
//     },
//     quantity: 1,
//     _id: "cart456",
//   },
// ];

const Cart = () => {

  const alert = useAlert();
  const dispatch = useDispatch();

  const {cartItems, restaurant } = useSelector(state => state.cart);
  // console.table(cartItems);

  useEffect(() => {
    dispatch(fetchCartItems());

  },[dispatch]);

  const removeCartItemHandler = (id) => {
    dispatch(removeItemFromCart(id, alert));
  }

  const increaseQty = (id, quantity, stock) => {
    // console.log(id, quantity, stock);
    const newQty = quantity + 1;
    if (newQty > stock){
      alert.error("Stock limit reached");
    };
    dispatch(updateCartQuantity(id, newQty, alert));
  }

  const decreaseQty = (id, quantity) => {
    // console.log(id, quantity);
    if (quantity > 1){
      const newQty = quantity - 1;
      dispatch(updateCartQuantity(id, newQty, alert));
    } else {
      alert.error("Minimum quantity reached");
    }
  }

  const checkoutHandler = () => {
    dispatch(payment(cartItems, restaurant));
  }

  return (
    <>
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is empty</h2>
      ) : (
        <>
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>
          <h3 className="mt-5">
            Restaurant: <b>{restaurant.name}</b>
          </h3>

          <div className="row d-flex justify-content-between cartt">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div className="row">
                    <div className="col-4 col-lg-3">
                      {
                        <img
                          src={item.foodItem.images[0].url}
                          alt="items"
                          height="90"
                          width="115"
                        />
                      }
                    </div>
                    <div className="col-5 col-lg-3">{item.foodItem.name}</div>
                    <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                      <p id="card_item_price">
                        <LiaRupeeSignSolid />
                        {item.foodItem.price}
                      </p>
                    </div>
                    <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                      <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus"
                        onClick={() => decreaseQty(item.foodItem._id, item.quantity)}> - </span>
                        <input
                          type="number"
                          className="form-control count d-inline"
                          value={item.quantity}
                          readOnly
                        />
                        <span className="btn btn-primary plus"
                        onClick={() => increaseQty(item.foodItem._id, item.quantity, item.stock)}>+</span>
                      </div>
                    </div>
                    <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                      <i
                        id="delete_cart_item"
                        className="fa fa-trash btn btn-danger"
                        onClick={() => removeCartItemHandler(item.foodItem._id)}
                      ></i>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}
                    (Units)
                  </span>
                </p>
                <p>
                  Total:
                  <span className="order-summary-values">
                    <LiaRupeeSignSolid />
                    {cartItems
                      .reduce(
                        (acc, item) =>
                          acc + item.quantity * item.foodItem.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
                <hr />
                <button id="checkout_btn" onClick={checkoutHandler} className="btn btn-primary btn-block">
                  Check Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;
