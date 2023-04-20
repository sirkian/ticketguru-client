import React from "react";
import { Provider } from "react-redux";
import store from "./store/CartReducer";
import { Cart } from "./components/Cart";
import Main from "./components/Main";

function App() {
  // Provider React Reduxia varten - älä poista
  return (
    <Provider store={store}>
      <Main />
      <Cart />
    </Provider>
  );
}

export default App;
