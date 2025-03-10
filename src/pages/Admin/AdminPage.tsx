import { ReactNode, useState, useEffect } from "react";
import {
  BsPeople,
} from "react-icons/bs";
import KhachHangPage from "./KhachHangPage";
import { notification, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { RiBillLine, RiCalendarScheduleLine, RiHomeSmileLine } from "react-icons/ri";
import { TbAdjustmentsCheck, TbHomeInfinity, TbReportAnalytics } from "react-icons/tb";
import AmenityContent from "./AmenityContent";
import RoomTypeContent from "./RoomTypeContent";
import BillContent from "./BillContent";
import RoomContent from "./Room/RoomContent";
import StatisticsPage from "./StatisticsPage";
import OrderContent from "./OrderContent";
import { baseAxios, logoutUser } from "../../api/axios";


function AdminPage() {
  const [activeTab, setActiveTab] = useState("Statistic");

  const tabs = [
    { name: "Statistic", icon: <TbReportAnalytics size={20} />, content: <StatisticsPage/> },
    { name: "Room", icon: <RiHomeSmileLine size={20} />, content: <RoomContent/> },
    { name: "Room type", icon: <TbHomeInfinity size={20} />, content: <RoomTypeContent/> },
    { name: "Order", icon: <RiCalendarScheduleLine size={20} />, content: <OrderContent/> },
    { name: "Amentity", icon: <TbAdjustmentsCheck size={20} />, content: <AmenityContent /> },
    { name: "User", icon: <BsPeople size={20} />, content: <KhachHangPage /> },
    { name: "Bill", icon: <RiBillLine size={20} />, content: <BillContent/> },
    
  ];



  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Toure Hotel</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost" onClick={logoutUser}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-12 h-screen ">
        <div className="shadow-lg p-4 fixed py-20 left-0 top-0 bottom-0">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            tabPosition="left"
          >
            {tabs.map((tab) => (
              <TabPane
                tab={
                  <span className="flex items-center gap-2">
                    {tab.icon}
                    {tab.name}
                  </span>
                }
                key={tab.name}
              >
              </TabPane>
            ))}
          </Tabs>
        </div>
        <div className="p-4 flex-1 pl-[20%] py-20">
          {tabs.find((tab) => tab.name === activeTab)?.content}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;