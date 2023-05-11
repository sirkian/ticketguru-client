import React, { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import "../styles/resources.css";

function EventTicketTypes({ token }) {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [event, setEvent] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [price, setPrice] = useState(0);
  const [eventTicketTypes, setEventTicketTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    fetchTicketTypes();
    // eslint-disable-next-line
  }, []);

  // tapahtmien haku (valikkoon)

  const fetchEvents = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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

  // lipputyyppien haku (valikkoon)

  const fetchTicketTypes = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    try {
      const response = await fetch(`${URL}/tickettypes`, reqOptions);
      const json = await response.json();

      setTicketTypes(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // tapahtuman lipputyyppien haku
  const fetchEventTicketTypes = async (e) => {
    e.preventDefault();
    // console.log("lipputyypithaku");
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    };

    try {
      const response = await fetch(
        `${URL}/events/${event}/eventtickettypes`,
        reqOptions
      );
      const json = await response.json();

      setEventTicketTypes(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // console.log(eventTicketTypes);

  const handleEditTicketTypes = (evtt) => {
    // console.log("navigointiin");
    // console.log(evtt);
    navigate("/editETT", { state: {token, evtt}});
    //navigate("/editett");
  };

  // lipputyyppien ja hintojen asettaminen tapahtumalle
  const addTicketTypes = async (e) => {
    e.preventDefault();
    // console.log(event);
    // console.log(ticketType);
    // console.log(price);

    // console.log("lipputyypit");

    const reqOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        event: { eventId: event },
        ticketType: { typeId: ticketType },
        price: price,
      }),
    };

    try {
      const response = await fetch(`${URL}/eventtickettypes`, reqOptions);
      const json = await response.json();

      setEventTicketTypes(json);
      setError("");
      //fetchEventTicketTypes();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <p>
        <b>Tapahtuman lipputyypit</b>
      </p>


      {/*lisätään uusi lippu, muokkaus navigoi toiselle sivulle */}
      <br></br><br></br>
      <form onSubmit={fetchEventTicketTypes}>
      <select value={event} onChange={(e) => setEvent(e.target.value)}>
          <option value="">Valitse tapahtuma</option>
          {events.map((ev) => (
            <option key={ev.eventId} value={ev.eventId}>
              {ev.eventName}
            </option>
          ))}
        </select>

            <button type="submit">Hae tiedot</button> <br></br><br></br>
        <select
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
        >
          <option value="">Valitse lipputyyppi</option>
          {ticketTypes.map((tt) => (
            <option key={tt.typeId} value={tt.typeId}>
              {tt.typeName}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="1.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        €<button onClick={addTicketTypes}>Lisää uusi lipputyyppi</button>
      </form>


      {eventTicketTypes.length > 0 && (
        <div>
          {eventTicketTypes.map((evtt) => {
            return(
            <div className="eventTicketTypescont" key={evtt.eventTypeId}>
              <div >
                {evtt.ticketType.typeName} {" "} {evtt.price} {"€"}
              </div>
              <div>
                
                <button onClick={() => handleEditTicketTypes(evtt)}>Muokkaa</button>
                
              </div>
            </div>
            );
          })}   
          <div>{error.length > 0 && <p>{error}</p>}</div>
        </div>
      )}

    </div>
  );
}

export default EventTicketTypes;
