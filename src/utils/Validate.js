export const validateEvent = (event) => {
  let res = {
    valid: true,
    message: "",
  };

  if (event.eventName.length < 1 || event.eventName.length > 250) {
    res.valid = false;
    res.message = "Tapahtuman nimen tulee olla 1-250 merkkiä!";
  }

  if (event.description.length < 1 || event.description.length > 450) {
    res.valid = false;
    res.message = "Tapahtuman kuvauksen tulee olla 1-450 merkkiä!";
  }

  if (event.amountTickets < 1) {
    res.valid = false;
    res.message = "Tapahtumalla pitää olla vähintään 1 lippu!";
  }

  if (event.startTime.length === 0) {
    res.valid = false;
    res.message = "Aseta tapahtumalle aloitusaika!";
  }

  if (event.endTime.length === 0) {
    res.valid = false;
    res.message = "Aseta tapahtumalle lopetusaika!";
  }

  if (event.presaleEnds.length === 0) {
    res.valid = false;
    res.message = "Aseta ennakkomyynnin loppuaika!";
  }

  return res;
};

export const validateVenue = (venue) => {
  let res =  {
    valid: true,
    message: "",
  };

  if (venue.venueName.length < 2 || venue.venueName.length > 50) {
    res.valid = false;
    res.message = "Tapahtumapaikan nimen tulee olla 2-50 merkkiä!";
  }

  if (venue.venueDescription.length < 5 || venue.venueDescription.length > 500) {
    res.valid = false;
    res.message = "Tapahtumapaikan kuvauksen tulee olla 5-500 merkkiä!";
  }

  if (venue.address.length < 5 || venue.address.length > 250) {
    res.valid = false;
    res.message = "Tapahtumapaikan katuosoitteen tulee olla 5-250 merkkiä!";
  }

  if (!venue.postalCode || !venue.postalCode.postalCode || venue.postalCode.postalCode.trim() === "") {
    res.valid = false;
    res.message = "Tapahtumapaikalla tulee olla postinumero!";
  }

  return res;
};

export const validateTicketType = (ticketType) => {
  let res = {
    valid: true,
    message: "",
  };

  if (ticketType.typeName.length < 2 || ticketType.typeName.length > 25) {
    res.valid = false;
    res.message = "Lipputyypin nimessä tulee olla 2-25 merkkiä!";
  }

  return res;
}

