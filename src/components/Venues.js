import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import PostalCodes from "./PostalCodes";
import "../styles/resources.css";

function Venues() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [postalCodes, setPostalCodes] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    fetchPostalCodes();
  }, []);

  // Hakee kaikki tapahtumapaikat
  const fetchVenues = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const response = await fetch(`${URL}/venues`, reqOptions);
      const json = await response.json();

      setVenues(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Hakee kaikki postinumerot
  const fetchPostalCodes = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
      },
    };

    try {
      const response = await fetch(`${URL}/postalcodes`, reqOptions);
      const json = await response.json();

      setPostalCodes(json);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  // Lisää uuden tapahtumapaikan
  const postVenue = async (e) => {
    e.preventDefault();

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authEncoded,
        },
        body: JSON.stringify({
          venueName: venueName,
          venueDescription: venueDescription,
          address: address,
          postalCode: {
            postalCode: postalCode,
          },
        }),
      };

      const response = await fetch(`${URL}/venues`, reqOptions);

      if (response.status === 400) {
        setError("Virheelliset tiedot!");
      }
      if (response.status === 201) {
        alert("Tapahtumapaikka lisätty!");
        setVenueName("");
        setVenueDescription("");
        setAddress("");
        setPostalCode("");
        setError("");
        fetchVenues();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <form onSubmit={postVenue}>
        <label htmlFor="venue">Lisää tapahtumapaikka:</label>
        <br />
        <input
          type="text"
          required
          placeholder="Tapahtumapaikan nimi"
          value={venueName}
          onChange={(e) => setVenueName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Kuvaus"
          value={venueDescription}
          onChange={(e) => setVenueDescription(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Katuosoite"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <select
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        >
          <option value="">Valitse postinumero</option>
          {postalCodes.map((pc) => (
            <option key={pc.postalCode} value={pc.postalCode}>
              {pc.postalCode} {""} {pc.city}
            </option>
          ))}
        </select>
        <button type="submit">Lisää</button>
      </form>

      <div>{error.length > 0 && <p>{error}</p>}</div>

      <p>
        <b>Tapahtumapaikat:</b>
      </p>
      {venues.map((ve) => {
        return (
          <div key={ve.venueId}>
            <span>
              {ve.venueName}, {ve.venueDescription}, {ve.address},{" "}
              {ve.postalCode.postalCode}, {ve.postalCode.city}
            </span>
          </div>
        );
      })}

      <br />
      <PostalCodes />
    </div>
  );
}

export default Venues;
