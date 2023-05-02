import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { addToCart, calculateTotalPrice } from "../store/Reducer";
import { formatPrice, formatTime } from "../utils/utils";
import { URL, authEncoded } from "../utils/constants";
import "../styles/main.css";
import Login from "./Login";

export function Main(props) {
  const [events, setEvents] = useState([]);
  const [eventtickets, setEventtickets] = useState([]);
  const [error, setError] = useState("Ladataan tapahtumia");
  const [ticketsLeft, setTicketsLeft] = useState(0);
  const currentUser = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

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

  // Tapahtuman haku nimellä
  const [eventName, setEventName] = useState("");

  const fetchEventsByName = async (eventName) => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
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
        Authorization: "Basic " + authEncoded,
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
        Authorization: "Basic " + authEncoded,
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

  const dispatch = useDispatch();

  const handleAddToCart = (ticket) => {
    dispatch(addToCart(ticket));
    dispatch(calculateTotalPrice(ticket));
  };

  if (!isLoggedIn) return <Login />;

  return (
    <div className="eventContainer">
      <div className="innerContainer">
        <h3>TicketGuru Ticket sales</h3>

        <form>
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
            value="Hae"
            id="search-btn"
            onClick={() => fetchEventsByName(eventName)}
          />
        </form>

        <form>
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
            {events.map((ev) => {
              return (
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
              );
            })}
          </div>
        ) : (
          <div>Tapahtumia ei löytynyt</div>
        )}

        {eventtickets.length > 0 && (
          <div className="eventtickets">
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
                      <button
                        className="addBtn"
                        onClick={() => handleAddToCart(evt)}
                      >
                        Lisää
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="debug">{error.length > 0 && <p>{error}</p>}</div>
      </div>
    </div>
  );
}

export default connect()(Main);
