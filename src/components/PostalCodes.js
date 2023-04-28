import { useEffect, useState } from "react";
import { URL, authEncoded } from "../utils/constants";

function PostalCodes() {
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [error, setError] = useState("");
    const [postalCodes, setPostalCodes] = useState([]);

    useEffect(() => {
        fetchPostalCodes();
    }, []);

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
                    city: city,
                }),
            };

            const response = await fetch(`${URL}/postalcodes`, reqOptions);

            if (response.status === 400) {
                setError("Postinumero on jo käytössä!");
            }
            if (response.status === 201) {
                alert("Postinumero lisätty!");
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
        <div>
            <form onSubmit={postPostalCode}>
                <label htmlFor="postalcode">Lisää puuttuva postinumero:</label>
                < br />
                <input type="text" required placeholder="Postinumero" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                <input type="text" required placeholder="Kaupunki" value={city} onChange={(e) => setCity(e.target.value)} />
                <button type="submit">Lisää</button>
            </form>

            <p>
                <b>Postinumerot:</b>
            </p>
            {postalCodes.map((pc) => {
                return (
                    <div key={pc.postalCode}>
                        <span>
                            {pc.postalCode} {""} {pc.city}
                        </span>
                    </div>
                );
            })}

            <div>{error.length > 0 && <p>{error}</p>}</div>

        </div>
    )
}

export default PostalCodes;