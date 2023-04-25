import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";

function Venues() {
    const [venues, setVenues] = useState([]);
    const [error, setError] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");

    useEffect(() => {
        fetchVenues();
    }, []);

    // Hakee kaikki tapahtumat
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

    // Lisää uuden postinumeron
    const postPostalCode = async (e) => {
        e.preventDefault();
        try {
            const reqOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic " + authEncoded,
                },
                body: JSON.stringify({
                    postalCode: postalCode,
                    city:  city,
                }),
            };

            const response = await fetch(`${URL}/postalcodes`, reqOptions);
            const json = await response.json();

            if (response.status === 400) {
                setError("Postinumero on jo käytössä!");
            }
            if (response.status === 201) {
                alert("Postinumero lisätty!");
                setPostalCode("");
                setCity("");
                setError("");
            }
  
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <form onSubmit={postPostalCode}>
                <label htmlFor="venue">Lisää postinumero:</label>
                < br />
                <input type="text" placeholder="Postinumero" value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>
                <input type="text" placeholder="Kaupunki" value={city} onChange={(e) => setCity(e.target.value)}/>
                <button type="submit">Lisää</button>
            </form>

            <div>{error.length > 0 && <p>{error}</p>}</div>

        </div>
    );
}

export default Venues;
