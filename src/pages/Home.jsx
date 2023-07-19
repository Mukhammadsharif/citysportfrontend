import React from 'react'
import CustomMenu from "../components/CustomMenu";
import AllOrders from "../components/AllOrders";
import {useSelector} from "react-redux";
import SaunaOrders from "../components/SaunaOrders";
import PoolOrders from "../components/PoolOrders";
import TrainingOrders from "../components/TrainingOrders";
import BilliardOrders from "../components/BilliardOrders";
import Subscriptions from "../components/Subscriptions";
import Logout from "../components/Logout";

export default function Home() {
    const menu = useSelector(state => state.menuList)
    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <CustomMenu/>
            {menu.all
                ? <AllOrders/>
                : menu.sauna
                    ? <SaunaOrders/>
                    : menu.pool
                        ? <PoolOrders/>
                        : menu.training
                            ? <TrainingOrders/>
                            : menu.billiard
                                ? <BilliardOrders/>
                                : menu.subscriptions
                                    ? <Subscriptions/>
                                    : <Logout/>
            }
        </div>
    )
}
