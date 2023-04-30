import { Provider } from "react-redux";
import store from "../store/Reducer";
import Main from "./Main";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import Venues from "./Venues";


function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState([]);
  const [starttime, setStarttime] = useState("");
  const [endtime, setEndtime] = useState("");
  const [presale_ends, setPresale_ends] = useState("");
  const [cancelled, setCancelled] = useState("");
  const [venue, setVenues] = useState("");


  useEffect(() => {
    fetchEvents();
}, []);

useEffect(() => {
    fetchVenues();
}, []);


//Haetaan tapahtumat
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
const fetchVenues = async () => {
  const reqOptions = {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authEncoded,
      },
  };

//Haetaan tapahtumapaikat
  try {
      const response = await fetch(`${URL}/venues`, reqOptions);
      const json = await response.json();

      setVenues(json);
      setError("");
  } catch (error) {
      setError(error.message);
  }
};

//Lisää uuden tapahtuman
const addEvent = async (e) => {
  e.preventDefault();
  try {
      const reqOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: "Basic " + authEncoded,
          },
          body: JSON.stringify({
              eventName: eventName,
              description: description,
              starttime: starttime,
              endtime: endtime,
              presale_ends: presale_ends,
              cancelled: cancelled,
              Venues: {
                  venue : venue
              }
          }),
      };

      const response = await fetch(`${URL}/events`, reqOptions);

      if (response.status === 400) {
          setError("Virheelliset tiedot!");
      }
      if (response.status === 201) {
          alert("Tapahtuma lisätty!");
          setEventName("");
          setDescription("");
          setStarttime("");
          setEndtime("");
          setPresale_ends("");
          setCancelled("");
          setVenues("");
          setError("");
          fetchEvents();
      }

  } catch (error) {
      setError(error.message);
  }
};



  return (
      <div>
            {fetchVenues}
            <form onSubmit={addEvent}>
                <label htmlFor="event">Lisää tapahtuma:</label>
                < br />
                <input type="text" required placeholder="Tapahtuman nimi" value={eventName} onChange={(e) => setEventName(e.target.value)} />
                <input type="text" required placeholder="Kuvaus" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" required placeholder="Alkuaika" value={starttime} onChange={(e) => setStarttime(e.target.value)} />
                <input type="text" required placeholder="Loppuaika" value={endtime} onChange={(e) => setEndtime(e.target.value)} />
                <input type="text" required placeholder="Lipunmyynti päättyy" value={presale_ends} onChange={(e) => setPresale_ends(e.target.value)} />
                <input type="text" required placeholder="Tapahtumapaikka" value={venue} onChange={(e) => setVenues(e.target.value)} />
                <button type="submit">Lisää</button>
            </form>

            <p>
                <b>Tapahtumat:</b>
            </p>
            {events.map((ev) => {
                return (
                    <div key={ev.eventId}>
                        <span>
                            {ev.eventName}, {ev.description}, {ev.starttime}, {ev.endtime}, {ev.presale_ends}
                        </span>
                    </div>
                );
            })}

            < br />
            <Venues/>

            <div>{error.length > 0 && <p>{error}</p>}</div>

        </div>
  );
};

export default Events;
