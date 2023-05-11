import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";
import "../styles/editETT.css"

function EditETT() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = location.state.token;
    const [eventt, setEventt] = useState(location.state.evtt);

    const handleChange = (e) => {
        setEventt({ ...eventt, [e.target.name]: e.target.value })
    };

    const handleUpdate = async () => {

        const reqOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                event: {
                    eventId: eventt.event.eventId
                },
                price: eventt.price,
                ticketType: {
                    typeId: eventt.ticketType.typeId
                }
            }),
        };
        try {
            const response = await fetch(`${URL}/eventtickettypes/${eventt.eventTypeId}`, reqOptions);
            if (response.status === 200) navigate(-1);
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className="editETTContainer">
            <div className="editETTForm">
                <h1>Muokkaa lipputyyppiä</h1>
                <h3>{eventt.event.eventName}</h3>
                <div className="editETTInputs">
                    <label>Tapahtuman lipputyypin nimi</label>
                    <input
                        disabled
                        placeholder={eventt.ticketType.typeName}
                        type="text"
                    />
                    <label>Tapahtuman lipputyypin hinta</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={eventt.price}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="editETTFormBtns">
                    <button onClick={() => navigate(-1)}>Palaa takaisin</button>
                    <button onClick={handleUpdate}>Tallenna muutokset</button>
                </div>
            </div>
        </div>
    );
}
export default EditETT;