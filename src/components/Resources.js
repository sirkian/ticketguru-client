import React, { useState } from "react";
import TicketTypes from "./TicketTypes";
import PostalCodes from "./PostalCodes";
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