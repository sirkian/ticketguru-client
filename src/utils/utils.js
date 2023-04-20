export const formatTime = (dateTime) => {
  const year = dateTime.substr(0, 4);
  const month = dateTime.substr(5, 2);
  const day = dateTime.substr(8, 2);
  const hrs = dateTime.substr(11, 2);
  const min = dateTime.substr(14, 2);
  return `${day}.${month}.${year} klo ${hrs}.${min}`;
};

export const formatPrice = (price) => {
  return `${price.toFixed(2)}€`;
};
