import React, { useState } from "react";
import { URL, authEncoded } from "../utils/constants";
import TicketTypes from "./TicketTypes";
import PostalCodes from "./PostalCodes";
import Venues from "./Venues";



function Resources() {
    return(
        <>
            <TicketTypes/>
            <PostalCodes/>
            <Venues/>
        </>
    )
}

export default Resources;