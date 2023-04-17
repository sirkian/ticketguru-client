import "./App.css";
import React, { useEffect, useState } from "react";

const URL = "http://localhost:8080";
const authEncoded = "YWRtaW5AdGlrZXRndXJ1LmNvbTphZG1pbg==";

function App() {
  const [events, setEvents] = useState([]);
  const [eventtickets, setEventtickets] = useState([]);
  const [error, setError] = useState("Ladataan tapahtumia");
  const [tickets, setTickets] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const [trId, setTrId] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const response = await fetch(`${URL}/events`, reqOptions);
      const json = await response.json();

      setEvents(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Tapahtuman hakua varten...
  const [name, setName] = useState("");

  const change = (e) => {
    setName(e.target.value);
  };

  const fetchEventsByName = async (name) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const response = await fetch(`${URL}/events/q?name=${name}`, reqOptions);
      const json = await response.json();

      if (response.status === 404) {
        setError("Tapahtumia ei löydy!");
        setEvents(null);
      }

      setEvents(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };
  // ...tähän asti

  const formatTime = (dateTime) => {
    const year = dateTime.substr(0, 4);
    const month = dateTime.substr(5, 2);
    const day = dateTime.substr(8, 2);
    const hrs = dateTime.substr(11, 2);
    const min = dateTime.substr(14, 2);
    return `${day}.${month}.${year} klo ${hrs}.${min}`;
  };

  const formatPrice = (price) => {
    return `${price.toFixed(2)}€`;
  };

  const fetchEventTicketTypes = async (eventId) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const response = await fetch(
        `${URL}/events/${eventId}/eventtickettypes`,
        reqOptions
      );
      const json = await response.json();

      setEventtickets(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTransaction = async () => {
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
      body: JSON.stringify({ appUser: { userId: 1 } }),
    };

    try {
      const response = await fetch(`${URL}/transactions`, reqOptions);
      const json = await response.json();
      const transactionId = await json.transactionId;
      console.log(transactionId);
      setTrId(transactionId);

      tickets.forEach((ticket) => {
        for (let i = 0; i < ticket.amount; i++) {
          postTickets(transactionId, ticket);
        }
      });
      //showTransaction(transactionId);
    } catch (error) {
      setError(error.message);
    }
  };

  const postTickets = async (transactionId, ticket) => {
    console.log("TRANSACTION: " + transactionId);

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
      const json = await response.json();
      console.log("TICKET POSTED", json);
    } catch (error) {
      setError(error.message);
    }
  };

  const showTransaction = async (transactionId) => {
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
      console.log(json);
      console.log("näytä liput");

      setTransaction(json);
      setError("");
      setTotal(0);
      setTicketPrice(0);
      setTickets([]);
      setEventtickets([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAmountChange = (e, ticket) => {
    ticket.amount = parseInt(e.target.value);
    setTicketPrice(ticket.price * ticket.amount);
  };

  const handleCart = (evt) => {
    setTickets([...tickets, evt]);
    handleTotal(tickets);
  };

  const handleTotal = (tickets) => {
    console.log("handle total");
    let sum = 0;

    tickets.forEach((ticket) => {
      sum += ticket.amount * ticket.price;
      setTotal(sum);
      setTicketPrice(0);
      console.log(sum);
    });
  };

  const confirmTransaction = async (id) => {
    const reqOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
      body: true,
    };

    try {
      const res = await fetch(`${URL}/transactions/${id}`, reqOptions);
      if (res.status === 200) {
        alert("Myyntitapahtuma OK");
      }
      setTransaction([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const cancelTransaction = async (id) => {
    const reqOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const res = await fetch(`${URL}/transactions/${id}`, reqOptions);
      if (res.status === 204) {
        alert("Myyntitapahtuma poistettu");
      }
      setTransaction([]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="eventContainer">
      <div className="innerContainer">
        <h3>TicketGuru Ticket sales</h3>

        {/*Tapahtuman haku, jos tuloksia ei löydy heittää koko sivun errorin :D Saa keksiä korjauksia!*/}
        <form>
          <label htmlFor="event">
            <b>Hae tapahtuma nimellä: </b>
          </label>
          <br></br>
          <input
            type="text"
            name="event"
            value={name}
            onChange={(e) => change(e)}
          />
          <input
            type="button"
            value="Hae"
            id="search-btn"
            onClick={() => fetchEventsByName(name)}
          />
        </form>

        <p>
          <b>Tapahtumat:</b>
        </p>
        {events.length > 0 ? (
          <div>
            {events.map((ev) => {
              return (
                <div
                  className="event"
                  key={ev.eventId}
                  onClick={(e) => fetchEventTicketTypes(ev.eventId)}
                >
                  {formatTime(ev.startTime)} <b>{ev.eventName}</b>,{" "}
                  {ev.venue.venueName}
                </div>
              );
            })}
          </div>
        ) : (
          <div>Tapahtumia ei löytynyt</div>
        )}
        <p>
          <b>Valitse lippu</b>
        </p>
        {eventtickets.length > 0 && (
          <div className="innerContainer">
            {eventtickets.map((evt) => {
              return (
                <div key={evt.eventTypeId}>
                  <div className="tickets">
                    <span>{evt.ticketType.typeName}</span>{" "}
                    <span>{formatPrice(evt.price)}</span>
                    <button className="addBtn" onClick={(e) => handleCart(evt)}>
                      Lisää
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {tickets.length > 0 ? (
          <div className="cartContainer">
            {tickets.map((ticket, index) => {
              return (
                <div className="cartTicket" key={index}>
                  <div className="cartTicketInner">
                    <span>
                      {ticket.ticketType.typeName} {ticket.amount} kpl <br />
                      <span style={{ fontSize: 12 }}>
                        {ticket.event.eventName}
                      </span>
                    </span>
                    <input
                      className="ticketAmount"
                      type="number"
                      onChange={(e) => handleAmountChange(e, ticket)}
                    />
                  </div>

                  <p>Hinta: {formatPrice(ticket.price * ticket.amount)}</p>
                </div>
              );
            })}
            <div className="sell">
              <h3>Summa {formatPrice(total + ticketPrice)}</h3>
              <button className="sellBtn" onClick={handleTransaction}>
                Myy
              </button>
            </div>
          </div>
        ) : (
          <p>Ei valittuja lippuja</p>
        )}

        {transaction.length > 0 && (
          <div className="transaction">
            <h3>Myyntitapahtuma #{transaction[0].transaction.transactionId}</h3>
            <p>{formatTime(transaction[0].transaction.transactionDate)}</p>
            <p style={{ fontWeight: "bold" }}>
              {transaction[0].transaction.total} €
            </p>
            {transaction.map((t) => {
              return (
                <div className="transactionTicket" key={t.ticketId}>
                  <p>ID {t.ticketId}</p>
                  <p>Koodi {t.verificationCode}</p>
                  <p>Nimi {t.eventTicketType.ticketType.typeName}</p>
                  <p>Hinta {formatPrice(t.eventTicketType.price)}</p>
                  <p>Tapahtuma {t.eventTicketType.event.eventName}</p>
                  <img
                    src={`data:image/png;base64,${t.qrCode}`}
                    alt="qrCode"
                  ></img>
                </div>
              );
            })}
            <div className="transactionBtns">
              <button
                className="transactionBtn"
                id="confirmTransaction"
                onClick={(e) =>
                  confirmTransaction(transaction[0].transaction.transactionId)
                }
              >
                OK
              </button>
              <button
                className="transactionBtn"
                id="cancelTransaction"
                onClick={(e) =>
                  cancelTransaction(transaction[0].transaction.transactionId)
                }
              >
                PERUUTA
              </button>
            </div>
          </div>
        )}
        {
          <div>
            <button
              className="transactionTickets"
              onClick={() => showTransaction(trId)}
            >
              listaa liput
            </button>
          </div>
        }
        <div className="debug">
          {error.length > 0 ? (
            <p>{error}</p>
          ) : (
            <p>
              <i>All good.</i>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
