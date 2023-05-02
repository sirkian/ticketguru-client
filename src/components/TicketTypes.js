import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";

function TicketTypes() {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [error, setError] = useState("");
  const [typeName, setTypeName] = useState("");

  useEffect(() => {
    fetchTicketTypes();
    //console.log(ticketTypes);
  }, []);

  // ladataan lipputyypit tietokannasta
  const fetchTicketTypes = async () => {
    const reqOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + authEncoded,
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
    console.log("lipputyyppi");
    console.log(typeName);
    e.preventDefault();

    try {
      const reqOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + authEncoded,
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
      <p>
        <b>Lipputyypit</b>
      </p>
      {ticketTypes.map((tt) => {
        return (
          <div key={tt.typeId}>
            <span>{tt.typeName}</span>
          </div>
        );
      })}
      <br></br>
      <b>Lisää lipputyyppi</b>
      <form onSubmit={addTicketType}>
        <input
          type="text"
          placeholder="lipputyyppi"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value)}
        ></input>
        <button type="submit">Lisää</button>
      </form>

      <div>
        <p>{error}</p>
      </div>
    </div>
  );
}

export default TicketTypes;
