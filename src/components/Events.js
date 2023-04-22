import { Provider } from "react-redux";
import store from "../store/CartReducer";
import Main from "./Main";
import Cart from "./Cart";


const Events = () => {

    return (
        <>
        <h1>Ticketgurun tapahtumat</h1>
            <Provider store={store}>
                <Main />
                <Cart />
            </Provider>
        </>

    )
}

export default Events;