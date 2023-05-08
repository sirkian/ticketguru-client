import React, { useState } from "react";
import { URL } from "../utils/constants";
import { formatPrice, formatTime } from "../utils/utils";
import "../styles/checkTickets.css";
import "../styles/transaction.css";
import { connect, useSelector } from "react-redux";
import Login from "./Login";

export function CheckTickets() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.user);
  const [vCode, setVCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const handleFindTicket = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        Authorization: currentUser.token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/tickets/q?name=${vCode}`,
        reqOptions
      );

      if (response.status === 200) {
        const json = await response.json();
        if (json.usedDate !== null) {
          setError("Lippu on jo käytetty! " + formatTime(json.usedDate));
          setTicket(null);
        } else {
          setTicket(json);
          setError("");
        }
      } else {
        setError("Lippua ei löydy!");
        setTicket(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUseTicket = async () => {
    const reqOptions = {
      method: "PATCH",
      headers: {
        Authorization: currentUser.token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/tickets/${ticket.ticketId}`,
        reqOptions
      );

      if (response.status === 200) {
        alert("Lippu käytetty!");
        setTicket(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClearTicket = () => {
    setTicket(null);
  };

  if (!isLoggedIn) return <Login />;
  return (
    <div className="checkTicketContainer">
      <div className="checkTicketForm">
        <h1>Tarkista lippu</h1>
        <div className="checkTicketInputs">
          <label>Lipun tarkastuskoodi:</label>
          <input
            maxLength={8}
            type="text"
            placeholder="Tarkastuskoodi"
            onChange={(e) => setVCode(e.target.value)}
          />
        </div>
        <div className="checkTicketFormBtns">
          <button onClick={handleFindTicket}>
            Tarkista
          </button>
        </div>



        {ticket !== null && (
          <div className="transactionContainer">
            <div className="ticket">
              <div className="ticketInfo">
                <span>
                  <b>ID:</b> {ticket.ticketId}
                </span>
                <img alt="qr-code" src={`data:image/png;base64,${ticket.qrCode}`} />
                <div>
                  <p>
                    <b>TAPAHTUMA:</b> {ticket.eventTicketType.event.eventName}<br />
                    {formatTime(ticket.eventTicketType.event.startTime)}
                  </p>
                  <p>
                    <b>LIPPUTYYPPI:</b> {ticket.eventTicketType.ticketType.typeName}
                  </p>
                  <p>
                    <b>HINTA:</b> {formatPrice(ticket.eventTicketType.price)}
                  </p>
                  <br />
                </div>
              </div>
            </div>
            <div className="transactionBtns">
              <button onClick={handleUseTicket}>
                Käytä lippu
              </button>
              <button onClick={handleClearTicket}>
                Peruuta
              </button>
            </div>
          </div>
        )}
        {error.length > 0 && <p>{error}</p>}


      </div>
    </div>
  );
}

export default connect()(CheckTickets);
