import { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import "../styles/resources.css";
import "../styles/addPC.css";

function PostalCodes({ token }) {
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [postalCodes, setPostalCodes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPostalCodes();
    // eslint-disable-next-line
  }, []);

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

  // Lisää uuden postinumeron
  const postPostalCode = async (e) => {
    e.preventDefault();
    const postalCodePattern = /^[0-9]{5,}$/;
    const cityPattern = /^[a-zA-ZåäöÅÄÖ -]{1,100}$/;

    if (!postalCodePattern.test(postalCode)) {
      setError("Postinumeron tulee olla 5 numeroa");
      return error;
    }
    if (!cityPattern.test(city)) {
      setError("Kaupungin nimessä ei sallita numeroita");
      return error;
    }

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          postalCode: postalCode,
          city: city,
        }),
      };

      const response = await fetch(`${URL}/postalcodes`, reqOptions);

      if (response.status === 400) {
        setError("Postinumero on jo käytössä!");
      }
      if (response.status === 201) {
        setPostalCode("");
        setCity("");
        setError("");
        fetchPostalCodes();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <h4 onClick={() => setIsVisible(!isVisible)}>Postinumerot</h4>
      <br />
      {isVisible && (
      <div className="addPC">
        <form className="addPCForm" onSubmit={postPostalCode}>
          <label>Postinumero</label>
          <input
            type="text"
            required
            placeholder="Postinumero"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <label>Kaupunki</label>
          <input
            type="text"
            required
            placeholder="Kaupunki"
            value={city}
            onChange={(e) => setCity(e.target.value.toUpperCase())}
          />
          <button type="submit">Lisää</button>
        </form>

        <div className="showPCsContainer">
          <p>
            <b>Postinumerot:</b>
          </p>
          {postalCodes.map((pc) => {
            return (
              <div className="showPCs" key={pc.postalCode}>
                   <li>{pc.postalCode} {""} {pc.city}</li>
              </div>
            );
          })}
        </div>
        <div>{error.length > 0 && <p>{error}</p>}</div>
      </div>
       )}
    </div>
  );
}

export default PostalCodes;
