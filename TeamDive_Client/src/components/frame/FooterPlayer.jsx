// src/components/Footer.jsx
import { useEffect, useRef, useState } from 'react';
import styles from '../../css/footerplayer.module.css';
import jaxios from '../../util/JWTUtil';
import Player from '../Player';

const playList=[];

function FooterPlayer() {
    // const [playCounts,setPlayCounts]=useState({});
    // const [isplaying,setIsplaying]=useState(false);
    // const [music,setMusic]=useState({});
    // const audioRef=useRef(null);

    // const musicPlay = (songId) => {
    //     alert('재생했다')
    //     setPlayCounts(prev => ({
    //         ...prev,
    //         [songId]: (prev[songId] || 0) + 1
    //     }));
    //     console.log(playCounts)
    // };
    // useEffect(() => {
      
    //     const interval = setInterval(() => {
    //         // alert('인터벌 작동중')
    //         if (Object.keys(playCounts).length > 0) {
    //             jaxios.post("/api/music/playCount",null,{ playCounts }) // 서버에 전송
    //                 .then(() => setPlayCounts({})) // 성공하면 초기화
    //                 .catch(err => console.error("Error sending play counts:", err));
    //         }
    //     }, 60000); // 60초마다 전송

    //     return () => clearInterval(interval);
    // }, [playCounts]);



    return (
        <div className={styles.footer}>
            <Player />
        </div>
    );
}

export { FooterPlayer };
