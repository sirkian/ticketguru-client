import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { formatPrice, formatTime } from "../utils/utils";
import {
  addToCart,
  calculateTotalPrice,
  clearCart,
  removeFromCart,
} from "../store/CartReducer";
import {
  ADD_TO_CART,
  CALCULATE_TOTAL_PRICE,
  URL,
  authEncoded,
} from "../utils/constants";
import "../styles/cart.css";
import Transaction from "./Transaction";

function mapStateToProps(state) {
  return {
    cartTickets: state.cartTickets,
    totalPrice: state.totalPrice,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    removeFromCart: (ticket) =>
      dispatch({ type: ADD_TO_CART, payload: ticket }),
    calculateTotalPrice: (ticket) =>
      dispatch({ type: CALCULATE_TOTAL_PRICE, payload: ticket }),
  };
}

// Ns. ostoskori - mihin liput lisätään
export function Cart(props) {
  const cartTickets = useSelector((state) => state.tickets.cartTickets);
  const totalPrice = useSelector((state) => state.tickets.totalPrice);
  const [transaction, setTransaction] = useState([]);
  const [transactionIsVisible, setTransactionIsVisible] = useState(false);
  const [cartIsVisible, setCartIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleAddToCart = (ticket) => {
    dispatch(addToCart(ticket));
    dispatch(calculateTotalPrice(ticket));
  };

  const handleRemoveFromCart = (ticket) => {
    dispatch(removeFromCart(ticket));
    dispatch(calculateTotalPrice(ticket));
  };

  const handleSellTickets = async () => {
    // TODO:
    // appUser: kovakoodattu => currentUser
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
      body: JSON.stringify({ total: totalPrice, appUser: { userId: 1 } }),
    };
    try {
      const response = await fetch(`${URL}/transactions`, reqOptions);
      const json = await response.json();
      const transactionId = await json.transactionId;
      cartTickets.forEach((ticket) => {
        for (let i = 0; i < ticket.quantity; i++) {
          postTickets(transactionId, ticket);
        }
      });
      setCartIsVisible(false);
      setIsLoading(true);
      // Laitetaan vielä 1,5sek timeout, että varmasti kaikki liput ehtii mukaan
      setTimeout(() => {
        fetchTransaction(transactionId);
        dispatch(clearCart());
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const postTickets = async (transactionId, ticket) => {
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
      body: JSON.stringify({
        usedDate: null,
        eventTicketType: { eventTypeId: ticket.eventTypeId },
        transaction: { transactionId },
      }),
    };
    try {
      const response = await fetch(`${URL}/tickets`, reqOptions);
      if (response.status === 400) {
        setError("Tapahtuma on loppuunmyyty!");
        setIsLoading(false);
        fetchTransaction(transactionId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTransaction = async (transactionId) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };
    try {
      const response = await fetch(
        `${URL}/transactions/${transactionId}/tickets`,
        reqOptions
      );
      const json = await response.json();
      setTransaction(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Pyritään varmistamaan, että myyntitapahtuma tulee varmasti näkyviin
    // ja että myyntitapahtuma ei ole tyhjä
    if (transaction.length > 0) {
      setIsLoading(false);
      setTransactionIsVisible(true);
    }
  }, [transaction]);

  const handleClearTransaction = () => {
    setTransaction([]);
    setTransactionIsVisible(false);
    setCartIsVisible(true);
  };

  return (
    <>
      {cartTickets.length > 0 && cartIsVisible && (
        <div className="cartContainer">
          <h2>Valitut liput</h2>
          <ul>
            {cartTickets !== null &&
              cartTickets.map((ticket, index) => (
                <li key={index}>
                  <div className="ticket">
                    <div className="ticketInfo">
                      <span className="eventInfo">
                        {ticket.event.eventName}{" "}
                        {formatTime(ticket.event.startTime)}
                      </span>
                      <span>
                        <b>{ticket.ticketType.typeName}</b> -{" "}
                        {formatPrice(ticket.price)}
                      </span>
                    </div>

                    <div className="quantityContainer">
                      <button
                        className="quantityBtn minus"
                        onClick={() => handleRemoveFromCart(ticket)}
                      >
                        -
                      </button>
                      <span>{ticket.quantity}</span>
                      <button
                        className="quantityBtn plus"
                        onClick={() => handleAddToCart(ticket)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
          <span className="totalPrice">
            Summa: {totalPrice !== undefined ? formatPrice(totalPrice) : "0 €"}
          </span>
          <button className="sellBtn" onClick={handleSellTickets}>
            Myy liput
          </button>
        </div>
      )}
      {transactionIsVisible && (
        <Transaction
          transaction={transaction}
          onClear={handleClearTransaction}
        />
      )}
      {isLoading && (
        <div className="cartContainer">
          <p>Pieni hetki...</p>
        </div>
      )}
      {error.length > 0 && (
        <div className="cartContainer">
          <p>
            {error} <span onClick={() => setError("")}>X</span>
          </p>
        </div>
      )}
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
