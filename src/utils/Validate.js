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
