import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import "../styles/editVenue.css";

function EditVenue() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state.token;
    const postalCodes = location.state.postalCodes;
    const [venue, setVenue] = useState(location.state.ve);
    const [postalCode, setPostalCode] = useState(venue.postalCode.postalCode);

    const handleChange = (e) => {
        setVenue({ ...venue, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const reqOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                venueName: venue.venueName,
                venueDescription: venue.venueDescription,
                address: venue.address,
                postalCode: {
                    postalCode: postalCode,
                },
            }),
        };
        try {
            const response = await fetch(`${URL}/venues/${venue.venueId}`, reqOptions);

            if (response.status === 400) {
                console.log("Virheelliset tiedot!");
            }

            if (response.status === 200) navigate(-1);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="editVenueContainer">
            <div className="editVenueForm">
                <h1>Muokkaa tapahtumapaikkaa</h1>
                <div className="editVenueInputs">
                    <label>Tapahtumapaikan nimi</label>
                    <input
                        type="text"
                        name="venueName"
                        value={venue.venueName}
                        onChange={(e) => handleChange(e)}
                    />
                    <label>Tapahtumapaikan kuvaus</label>
                    <input
                        type="text"
                        name="venueDescription"
                        value={venue.venueDescription}
                        onChange={(e) => handleChange(e)}
                    />
                    <label>Tapahtumapaikan katuosoite</label>
                    <input
                        type="text"
                        name="address"
                        value={venue.address}
                        onChange={(e) => handleChange(e)}
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
                </div>
                <div className="editVenueFormBtns">
                    <button onClick={() => navigate(-1)}>Palaa takaisin</button>
                    <button onClick={handleUpdate}>Tallenna muutokset</button>
                </div>
            </div>
        </div>
    );
}

export default EditVenue;