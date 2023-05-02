import React, { useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import { formatPrice, formatTime } from "../utils/utils";
import "../styles/checkTickets.css";
import { connect, useSelector } from "react-redux";
import Login from "./Login";

export function CheckTickets() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [vCode, setVCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const handleFindTicket = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        Authorization: "Basic " + authEncoded,
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
        Authorization: "Basic " + authEncoded,
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
    <div>
      <h3>TicketGuru: Lipun tarkastus</h3>
      <p>Lipun tarkastuskoodi:</p>
      <input
        maxLength={8}
        className="codeInput"
        type="text"
        placeholder="Tarkastuskoodi"
        onChange={(e) => setVCode(e.target.value)}
      />
      <br />
      <button className="useBtn" onClick={handleFindTicket}>
        Tarkista
      </button>

      {ticket !== null && (
        <div className="ticket">
          <p>
            <b>ID:</b> {ticket.ticketId}
          </p>
          <img alt="qr-code" src={`data:image/png;base64,${ticket.qrCode}`} />
          <p>
            <b>TAPAHTUMA:</b> {ticket.eventTicketType.event.eventName},{" "}
            {formatTime(ticket.eventTicketType.event.startTime)}
          </p>
          <p>
            <b>LIPPUTYYPPI:</b> {ticket.eventTicketType.ticketType.typeName}
          </p>
          <p>
            <b>HINTA:</b> {formatPrice(ticket.eventTicketType.price)}
          </p>
          <br />
          <button className="useBtn" onClick={handleUseTicket}>
            Käytä lippu
          </button>
          <button className="cancelBtn" onClick={handleClearTicket}>
            Peruuta
          </button>
        </div>
      )}
      {error.length > 0 && <p>{error}</p>}
    </div>
  );
}

export default connect()(CheckTickets);
