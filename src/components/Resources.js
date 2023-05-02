import React, { useState } from "react";
import TicketTypes from "./TicketTypes";
import Venues from "./Venues";
import EventTicketTypes from "./EventTicketTypes";



function Resources() {
    return(
        <>
            <TicketTypes/>
            <Venues/>
            <EventTicketTypes/>
        </>
    )
}

export default Resources;