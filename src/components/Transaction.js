import React, { useState } from "react";
import { formatPrice, formatTime } from "../utils/utils";
import "../styles/transaction.css";
import { URL, authEncoded } from "../utils/constants";

function Transaction({ transaction, onClear }) {
  const [transactionProp, setTransactionProp] = useState(transaction);

  const handleConfirm = async (id) => {
    //TODO
    // Tästä pitäis ohjata lippujen tulostukseen
    const reqOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
      body: true,
    };
    try {
      const response = await fetch(`${URL}/transactions/${id}`, reqOptions);
      if (response.status === 200) {
        // ------------------- //
        // Tästä ehkä vaikka routerilla omaan näkymään, jossa vain liput
        alert("Myyntitapahtuma OK");
        // Katotaan josko onClear voi olla tässä aiheuttamatta ongelmia
        // Ei tulis nii hirvee callback hell
        onClear();
        // ------------------- //
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (id) => {
    const reqOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };
    try {
      const response = await fetch(`${URL}/transactions/${id}`, reqOptions);
      if (response.status === 204) {
        alert("Myyntitapahtuma ID " + id + " poistettu");
        // Callback-funktio, joka tyhjentää transactions-listan Cart.js-komponentissa
        onClear();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="transactionContainer">
      <h2>Myyntitapahtuma #{transactionProp[0].transaction.transactionId}</h2>
      <span>{formatTime(transactionProp[0].transaction.transactionDate)}</span>
      <div>
        {transactionProp.map((ticket) => (
          <div key={ticket.ticketId}>
            <div className="ticket">
              <div className="ticketInfo">
                <span className="eventInfo">
                  {ticket.eventTicketType.event.eventName}{" "}
                  {formatTime(ticket.eventTicketType.event.startTime)}
                </span>
                <span>
                  <b>{ticket.eventTicketType.ticketType.typeName}</b> -{" "}
                  {formatPrice(ticket.eventTicketType.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="totalPrice">
        Summa: {formatPrice(transactionProp[0].transaction.total)}
      </span>
      <div className="transactionBtns">
        <button
          onClick={() =>
            handleConfirm(transactionProp[0].transaction.transactionId)
          }
        >
          Tulosta liput
        </button>
        <button
          onClick={() => handleCancel(transaction[0].transaction.transactionId)}
        >
          Peruuta
        </button>
      </div>
    </div>
  );
}

export default Transaction;
