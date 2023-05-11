import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import "../styles/editVenue.css";
import { validateVenue } from "../utils/Validate";
import { formatTime } from "../utils/utils";

function EditVenue() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state.token;
    const postalCodes = location.state.postalCodes;
    const [venue, setVenue] = useState(location.state.ve);
    const [postalCode, setPostalCode] = useState(venue.postalCode.postalCode);
    const [events, setEvents] = useState([]);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setVenue({ ...venue, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        fetchVenuesEvents(venue.venueId);
        // eslint-disable-next-line
    }, []);

    // Tapahtumapaikan muutokset
    const handleUpdate = async () => {

        // Validoidaan kentät
        const { valid, message } = validateVenue(venue);
        if (!valid) {
            return setError(message);
        }

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
            setError("");
            if (response.status === 200) navigate(-1);
        } catch (error) {
            setError(error.message);
        }
    };

    // Poiston käsittely
    const handleDelete = async (venueId) => {
        try {
            if (window.confirm("Haluatko varmasti poistaa tämän tapahtumapaikan?")) {
                await deleteVenue(venueId);
                setError("");
                navigate(-1);
            }
        } catch (error) {
            setError(error.message);
        }
    };

    // Tapahtumapaikan poisto
    const deleteVenue = async (venueId) => {
        const reqOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        try {
            const response = await fetch(`${URL}/venues/${venueId}`, reqOptions);
            if (response.status === 200);
            setError("");
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Haetaan tapahtumapaikan tapahtumat
    const fetchVenuesEvents = async (venueId) => {
        const reqOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        };
        try {
            const response = await fetch(`${URL}/venues/${venueId}/events`, reqOptions);
            const json = await response.json();

            if (response.status === 404) {
                setError("Tapahtumapaikalla ei löydy tapahtumia!");
                setEvents(null);
            } else {
                setEvents(json);
                setError("");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    };

    function noDelete() {
        alert("Et voi poistaa tapahtumapaikkaa johon on liitetty tapahtumia!");
    }

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
                    {events.length > 0 ? (
                        <button onClick={noDelete}>Poista tapahtumapaikka</button>
                    ) : (
                        <button onClick={() => handleDelete(venue.venueId)}>Poista tapahtumapaikka</button>

                    )}

                </div>

                <div className="venueEventContainer">
                    {events.length > 0 ? (
                        <div>
                            <p>
                                <b>Tapahtumapaikan tapahtumat:</b>
                            </p>
                            {events.map((ev, index) => {
                                return (
                                    <div key={index}>
                                        {!ev.cancelled && (
                                            <div key={ev.eventId}>
                                                <span>
                                                    {formatTime(ev.startTime)} {ev.venue.venueName} {" "}
                                                </span>
                                                <span>
                                                    <b>{ev.eventName}</b>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
                {error.length > 0 && <span>{error}</span>}
            </div>
        </div>
    );
}

export default EditVenue;