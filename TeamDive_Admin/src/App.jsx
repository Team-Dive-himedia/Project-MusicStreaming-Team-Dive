import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "./Component/page/DashBoard";
import SideBar from "./Component/SideBar";
import NavigationBar from "./Component/NavigationBar";
import User from "./Component/page/User";
import Music from "./Component/page/Music";
import Login from "./Component/Login";
import "./style/global.scss";
import { useSelector } from "react-redux";
import { useState } from "react";


const App = () => {
    const isLoggedIn = useSelector((state)=> state.user.isLoggedIn); // Redux 상태 가져오기
    const [SidebarOpen, setSidebarOpen] = useState(true)    



    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
            <div className="appLayout">
                {isLoggedIn && <SideBar SidebarOpen={SidebarOpen} />}
                <div className={`mainContent ${isLoggedIn ? "loggedIn" : "loggedOut"}`}>
                    {isLoggedIn && <NavigationBar setSidebarOpen={setSidebarOpen} SidebarOpen ={SidebarOpen}/>}
                    <Routes>                      
                        <Route path="/" element={<Login />} />                     
                        {isLoggedIn ? (
                            <>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/user" element={<User />} />
                                <Route path="/music" element={<Music />} />
                            </>
                            ) : (
                                <Route path="*" element={<Login />} />
                            )}
                    </Routes>
                </div>
            </div>
        </motion.div>
    );
}

export default App;