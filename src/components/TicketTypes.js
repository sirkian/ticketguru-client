import { useEffect, useState } from "react";
import { URL } from "../utils/constants";
import { validateTicketType } from "../utils/Validate";
import "../styles/tickettypes.css";

function TicketTypes({ token }) {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [error, setError] = useState("");
  const [typeName, setTypeName] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTicketTypes();
    // eslint-disable-next-line
  }, []);

  // ladataan lipputyypit tietokannasta
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

  // funktio, jolla lisätään uusi lipputyyppi

  const addTicketType = async (e) => {
    // console.log("lipputyyppi");
    // console.log(typeName);
    e.preventDefault();

    // Validoidaan lipputyypin nimi
    const { valid, message } = validateTicketType({
      typeName,
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
          typeName: typeName,
        }),
      };

      const response = await fetch(`${URL}/tickettypes`, reqOptions);

      if (response.status === 400) {
        setError("Virheelliset tiedot");
      }
      if (response.status === 201) {
        // alert("lipputyyppi lisätty");
        setTypeName("");
        fetchTicketTypes();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="resourcesInnerContainer">
      <h2 onClick={() => setIsVisible(!isVisible)}>Lipputyyppi</h2>
      {isVisible && (
        <div className="addTicketType">
          <form className="addTicketTypeForm" onSubmit={addTicketType}>
            <label>Lipputyypin nimi</label>
            <input
              type="text"
              required
              placeholder="Lipputyyppi"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
            />
            <button type="submit">Lisää</button>
          </form>

          <div className="showTicketTypesContainer">
            <p>
              <b>Lipputyypit:</b>
            </p>
            {ticketTypes.map((tt) => {
              return (
                <div className="showTicketTypes" key={tt.typeId}>
                    <li>{tt.typeName}</li>
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

export default TicketTypes;
