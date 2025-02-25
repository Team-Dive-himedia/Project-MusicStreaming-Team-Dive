import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import Dashboard from "./component/page/DashBoard";
import SideBar from "./component/SideBar";
import NavigationBar from "./component/NavigationBar";
import User from "./component/page/User";
import Music from "./component/page/music/Music";
import Album from "./component/page/music/Album";
import AddAlbum from "./component/page/music/AddAlbum";
import UpdateAlbum from "./component/page/music/UpdateAlbum";
import Login from "./component/Login";
import MusicController from "./component/page/MusicController";
import Artist from "./component/page/artist/Artist";
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
                                <Route path="/addAlbum" element={<AddAlbum />} />
                                <Route path="/updateAlbum/:albumId" element={<UpdateAlbum />} />
                                <Route path="/artist" element={<Artist />} />
                                
                                <Route path="/musicController" element={<MusicController />}>
                                    <Route path="music" element={<Music />} />
                                    <Route path="artist" element={<Artist />} />
                                    <Route path="album" element={<Album />} />
                                </Route>
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