import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addToCart, calculateTotalPrice } from "../store/Reducer";
import { formatPrice, formatTime } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import "../styles/main.css";
import Login from "./Login";

export function Main(props) {
  const [events, setEvents] = useState([]);
  const [eventtickets, setEventtickets] = useState([]);
  const [error, setError] = useState("Ladataan tapahtumia");
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const [transaction, setTransaction] = useState([]);
  const [ticket, setTicket] = useState([]);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  // currentUser.authorities.some((item) => item.authority === "ADMIN")

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
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

  // Tapahtuman haku nimellä
  const [eventName, setEventName] = useState("");

  const fetchEventsByName = async (eventName) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/events/q?name=${eventName}`,
        reqOptions
      );
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

  // Tapahtumapaikan tapahtumien haku
  const [venueName, setVenueName] = useState([]);

  const fetchVenuesEventsByName = async (venueName) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/venues/q?name=${venueName}`,
        reqOptions
      );
      const json = await response.json();

      console.log("json:", json);

      if (response.status === 404) {
        setError("Tapahtumapaikkoja ei löydy!");
        setEvents(null);
      } else {
        const venueId = await json[0].venueId;

        console.log("venueId:", venueId);

        const response2 = await fetch(
          `${URL}/venues/${venueId}/events`,
          reqOptions
        );
        const json2 = await response2.json();

        console.log("json2:", json2);

        if (response2.status === 404) {
          setError("Tapahtumapaikalla ei löydy tapahtumia!");
          setEvents(null);
        } else {
          setEvents(json2);
          setError("");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchEventTicketTypes = async (eventId) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
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
      fetchTicketsLeft(eventId);
    } catch (error) {
      setError(error.message);
    }
  };

  const fetchTicketsLeft = async (id) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };
    try {
      const response = await fetch(
        `${URL}/events/${id}/ticketsleft`,
        reqOptions
      );
      const json = await response.json();
      setTicketsLeft(json);
    } catch (error) {
      console.log(error);
    }
  };

  // Tulostetaan kaikki myymättömät liput
  const fetchTransaction = async (transactionId) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
    };
    try {
      const response = await fetch(
        `${URL}/transactions/${transactionId}/tickets`,
        reqOptions
      );
      const transactionProp = await response.json();
      navigate("/print", { state: transactionProp });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSellTickets = async (eventTypeId) => {
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
      body: JSON.stringify({ total: 0, appUser: { userId: 1 } }),
    };
    try {
      const response = await fetch(`${URL}/transactions`, reqOptions);
      const json = await response.json();
      const transactionId = await json.transactionId;
      for (let i = 0; i < ticketsLeft; i++) {
        printTickets(transactionId, eventTypeId);
      }
      // Laitetaan vielä 1,5sek timeout, että varmasti kaikki liput ehtii mukaan
      setTimeout(() => {
        fetchTransaction(transactionId);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };

  const printTickets = async (transactionId, eventTypeId) => {
    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: currentUser.token,
      },
      body: JSON.stringify({
        usedDate: null,
        eventTicketType: { eventTypeId: eventTypeId },
        transaction: { transactionId },
      }),
    };
    try {
      console.log("lol");
      const response = await fetch(`${URL}/tickets`, reqOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const dispatch = useDispatch();

  const handleAddToCart = (ticket) => {
    dispatch(addToCart(ticket));
    dispatch(calculateTotalPrice(ticket));
  };

  if (!isLoggedIn) return <Login />;

  return (
    <div className="eventContainer">
      <div className="innerContainer">
        <h1>TicketGuru</h1>

        <form className="Form">
          <label htmlFor="event">
            <b>Hae tapahtuma nimellä: </b>
          </label>
          <br></br>
          <input
            type="text"
            name="event"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <input
            type="button"
            className="Hae"
            value="Hae"
            id="search-btn"
            onClick={() => fetchEventsByName(eventName)}
          />
        </form>
        < br />
        <form className="Form">
          <label htmlFor="venue">
            <b>Hae tapahtumapaikan tapahtumat: </b>
          </label>
          <br></br>
          <input
            type="text"
            name="venue"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
          />
          <input
            type="button"
            className="Hae"
            value="Hae"
            id="search-btn"
            onClick={() => fetchVenuesEventsByName(venueName)}
          />
        </form>

        {events.length > 0 ? (
          <div className="events">
            <p>
              <b>Tapahtumat:</b>
            </p>
            {events.map((ev, index) => {
              return (
                <div key={index}>
                  {!ev.cancelled && (
                    <div
                      className="event"
                      key={ev.eventId}
                      onClick={(e) => fetchEventTicketTypes(ev.eventId)}
                    >
                      <span>
                        {formatTime(ev.startTime)} {ev.venue.venueName},{" "}
                        {ev.venue.postalCode.city}
                      </span>
                      <span>
                        <b>{ev.eventName}</b>
                      </span>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>Tapahtumia ei löytynyt</div>
        )}

        {eventtickets.length > 0 && (
          <div className="eventtickets">
            {ticketsLeft < 1 ? (
              <p>Tapahtuma <b>{eventtickets[0].event.eventName}</b> on loppuunmyyty!</p>
            ) : (
              <>
              <p>
              <b>Valitse lippu</b>
            </p>
            <h2>{eventtickets[0].event.eventName}</h2>
            <span className="ticketsLeft">Lippuja jäljellä: {ticketsLeft}</span>
            {eventtickets.map((evt) => {
              return (
                <div className="ticketsContainer" key={evt.eventTypeId}>
                  <div className="tickets">
                    <span>{evt.ticketType.typeName}</span>
                    <div>
                      <span>{formatPrice(evt.price)}</span>

                      {evt.ticketType.typeName === "Ovilippu" ? (
                        <button
                          className="addBtn"
                          onClick={() => handleSellTickets(evt.eventTypeId)}
                        >
                          Tulosta kaikki
                        </button>
                      ) : (
                        <button
                          className="addBtn"
                          onClick={() => handleAddToCart(evt)}
                        >
                          Lisää
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </>)}

          </div>
        )}

        <div className="debug">{error.length > 0 && <p>{error}</p>}</div>
      </div>
    </div>
  );
}

export default connect()(Main);
