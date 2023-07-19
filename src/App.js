import {HashRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import {Provider} from "react-redux";
import {store} from "./store/store";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateRoutes";
import OrderDetail from "./pages/OrderDetail";
import Notifications from "./pages/Notifications";
import SubscriptionDetail from "./pages/SubscriptionDetail";

function Router() {
    return (
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route element={<Register/>} path={'/register'}/>
                    <Route element={<Login/>} path={'/login'}/>
                    <Route element={<PrivateRoutes/>}>
                        <Route element={<Home/>} path={'/'}/>
                        <Route element={<OrderDetail/>} path={'/order-detail'}/>
                        <Route element={<Notifications/>} path={'/notifications'}/>
                        <Route element={<SubscriptionDetail/>} path={'/subscription-detail'}/>
                    </Route>
                </Routes>
            </HashRouter>
        </Provider>
    );
}

export default Router;
