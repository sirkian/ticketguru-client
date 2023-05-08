import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/constants";

function EditETT() {

    const navigate = useNavigate();
    const location = useLocation();
    //const eventTicketTypes = location.state.evtt;
    const token = location.state.token;
    console.log(location.state);
    const [eventt, setEventt] = useState(location.state.evtt);
    
    const handleChange = (e) => {
        console.log("hinta muuttuu");
        setEventt({ ...eventt, [e.target.name]: e.target.value})
    }
    const handleUpdate = async () => {
        console.log("PUT");
        const reqOptions = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({
                event: {
                    eventId : eventt.event.eventId
                },
                price: eventt.price,
                ticketType: {
                    typeId: eventt.ticketType.typeId
                }
            }),
        };
        try {
            console.log(reqOptions.body);
            const response = await fetch(
                `${URL}/eventtickettypes/${eventt.eventTypeId}`,
                reqOptions
            );
            if (response.status === 200) navigate(-1);
                //console.log(response);
        } catch (error) {
            console.log(error.message);
        }
    }

    return(
    
        <div>
            <p>Lipputyyppien muutokset</p>
            <div>{eventt.event.eventName}</div>
            <div>{eventt.ticketType.typeName}</div>
            <div>
                <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={eventt.price}
                    onChange={(e) => handleChange(e)}
                >
                </input>
            <button onClick={handleUpdate}>Tallenna muutokset</button>
            </div>
        </div>
        
    );

}
export default EditETT;