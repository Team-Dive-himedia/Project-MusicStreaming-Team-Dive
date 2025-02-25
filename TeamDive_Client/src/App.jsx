
import { useState } from 'react';
import './App.css'
import { MainHeader } from './components/frame/Header';
import { Home } from './components/frame/Home';
import { FooterPlayer } from './components/frame/FooterPlayer';
import FloatingButton from './components/FloatingButton';
import ChatModal from './components/ChatModal';
import Footer from './components/frame/Footer';
import ScrollToTop from './components/ScrollToTop';

import { ThemeContext } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';

function App() {

    const [isDark, setIsDark] = useState(true);

    const [menubar, setMenubar] = useState(false);

    const toggleMenu = () => {
        setMenubar(!menubar);
        console.log(menubar)
    }

    const [mood, setMood] = useState('');
    const handleMoodSelect = (selectedMood) => {
        console.log('App에서 받은 기분:', selectedMood);
        setMood(selectedMood);
      };
    
    

    const [chatOpen, setChatOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
    }

    const closeChat = () => {
        setChatOpen(false);
    }


        return (
            <ThemeContext.Provider value={{isDark, setIsDark}}>
                <PlayerProvider>
                    <MainHeader toggleMenu={toggleMenu} onMoodSelect={handleMoodSelect} />

                    <FloatingButton onClick={openChat} />
        
                    {/* 채팅 모달 */}
                    {chatOpen && <ChatModal onClose={closeChat} />}

                    <ScrollToTop />
                    <Home menubar={menubar} mood={mood} setMood={setMood} />
                    <Footer />
                    <FooterPlayer />
                </PlayerProvider>
            </ThemeContext.Provider>
    )


}

export default App
