import { configureStore } from "@reduxjs/toolkit";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CALCULATE_TOTAL_PRICE,
  CLEAR_CART,
} from "../utils/constants";

const initialState = {
  cartTickets: [],
};

export const addToCart = (ticket) => {
  return {
    type: ADD_TO_CART,
    payload: ticket,
  };
};

export const removeFromCart = (ticket) => {
  return {
    type: REMOVE_FROM_CART,
    payload: ticket,
  };
};

export const calculateTotalPrice = (ticket) => {
  return {
    type: CALCULATE_TOTAL_PRICE,
    payload: ticket,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};

function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      const existingTicketIndex = state.cartTickets.findIndex(
        (ticket) => ticket.eventTypeId === action.payload.eventTypeId
      );
      if (existingTicketIndex !== -1) {
        // Jos lippu on jo valittuna, lisätään määrää yhdellä
        const updatedCartTickets = state.cartTickets.map((ticket, index) => {
          if (index === existingTicketIndex) {
            return {
              ...ticket,
              quantity: ticket.quantity + 1,
            };
          }
          return ticket;
        });
        return {
          ...state,
          cartTickets: updatedCartTickets,
        };
      } else {
        // Jos lippua ei vielä ole, lisätään lippu ja asetetaan määräksi 1
        const newTicket = {
          ...action.payload,
          quantity: 1,
        };
        return {
          ...state,
          cartTickets: [...state.cartTickets, newTicket],
        };
      }
    case REMOVE_FROM_CART:
      const index = state.cartTickets.findIndex(
        (ticket) => ticket.eventTypeId === action.payload.eventTypeId
      );
      if (index !== -1) {
        const updatedCartTickets = [...state.cartTickets];
        if (updatedCartTickets[index].quantity === 1) {
          // Jos viimeinen lippu, poistetaan se kokonaan
          updatedCartTickets.splice(index, 1);
        } else {
          // Muuten vähennetään määrää yhdellä
          updatedCartTickets[index] = {
            ...updatedCartTickets[index],
            quantity: updatedCartTickets[index].quantity - 1,
          };
        }
        return {
          ...state,
          cartTickets: updatedCartTickets,
        };
      } else {
        return state;
      }
    case CALCULATE_TOTAL_PRICE:
      // Lasketaan lippujen kokonaissumma
      const totalPrice = state.cartTickets.reduce(
        (accumulator, ticket) => accumulator + ticket.price * ticket.quantity,
        0
      );
      return {
        ...state,
        totalPrice: totalPrice,
      };
    case CLEAR_CART:
      return {
        ...state,
        cartTickets: [],
      };
    default:
      return state;
  }
}

const store = configureStore({
  reducer: {
    tickets: cartReducer,
  },
});

export default store;
