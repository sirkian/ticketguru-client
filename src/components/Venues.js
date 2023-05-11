import { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import PostalCodes from "./PostalCodes";
import "../styles/resources.css";
import { useNavigate } from "react-router-dom";
import "../styles/addVenue.css";
import { validateVenue } from "../utils/Validate";

function Venues({ token }) {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [postalCodes, setPostalCodes] = useState([]);
  const [venueName, setVenueName] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchVenues();
    fetchPostalCodes();
    // eslint-disable-next-line
  }, []);

  // Hakee kaikki tapahtumapaikat
  const fetchVenues = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
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

    // Validoidaan kentät
    const {valid, message} = validateVenue({
      venueName,
      venueDescription,
      address,
      postalCode: {
        postalCode
      },
    });

    if (!valid) {
      return setError(message);
    }

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
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

      if (response.status === 400 || response.status === 404) {
        setError("Virheelliset tiedot!");
      }
      if (response.status === 201) {
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

  const handleEditVenue = (ve) => {
    navigate("/editvenue", { state: { ve, postalCodes, token } });
  };

  return (
    <div className="resourcesInnerContainer">
      <h2 onClick={() => setIsVisible(!isVisible)}>Tapahtumapaikat</h2>
      {isVisible && (
        <div className="addVenue">
          <form className="addVenueForm" onSubmit={postVenue}>
            <label>Tapahtumapaikan nimi</label>
            <input
              type="text"
              required
              placeholder="Tapahtumapaikan nimi"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />
            <label>Tapahtumapaikan kuvaus</label>
            <input
              type="text"
              placeholder="Kuvaus"
              value={venueDescription}
              onChange={(e) => setVenueDescription(e.target.value)}
            />
            <label>Tapahtumapaikan katuosoite</label>
            <input
              type="text"
              required
              placeholder="Katuosoite"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <label>Postinumero</label>
            <select value={postalCode} onChange={(e) => setPostalCode(e.target.value)}>
              <option value="">Valitse postinumero</option>
              {postalCodes.map((pc) => (
                <option key={pc.postalCode} value={pc.postalCode}>
                  {pc.postalCode} {""} {pc.city}
                </option>
              ))}
            </select>
            <button type="submit">Lisää</button>
          </form>

          <div className="showVenuesContainer">
            <p>
              <b>Tapahtumapaikat:</b>
            </p>
            {venues.map((ve) => {
              return (
                <div className="showVenues" key={ve.venueId}>
                  <div className="showVenue">
                    <span>{ve.venueName}</span>
                    <span>{ve.venueDescription}</span>
                    <span> {ve.address}< br />{ve.postalCode.postalCode}, {ve.postalCode.city}</span>
                  </div>
                  <div>
                    <button onClick={() => handleEditVenue(ve)}>Muokkaa</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>{error.length > 0 && <p>{error}</p>}</div>
          <div>
            < br />
            <PostalCodes token={token} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Venues;
