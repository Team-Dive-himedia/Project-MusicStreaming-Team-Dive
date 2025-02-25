// src/components/MyPlaylistSection.jsx
import React, { useEffect, useState } from 'react';
import styles from '../../../css/mainPage/mainPage.module.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../../util/JWTUtil';

const MyRecentMusicSection = () => {

    const navigate = useNavigate();


    const loginUser = useSelector(state => state.user);

    // 더미 데이터: 로그인한 사용자의 최근노래임 (API로 대체 가능)
    // const music = [
    //   { musicId: 1, title: '음악1', image: '/public/image/album/album1.jpg' },
    //   { musicId: 2, title: '음악2', image: '/public/image/album/album2.jpg' },
    //   { musicId: 3, title: '음악3', image: '/public/image/album/album3.jpg' },
    //   { musicId: 4, title: '음악4', image: '/public/image/album/album4.jpg' },
    //   { musicId: 5, title: '음악5', image: '/public/image/album/album5.jpg' },
    //   { musicId: 6, title: '음악악6', image: '/public/image/kakao_lion.png' },
    // ];
    const [music, setMusic]=useState([]);
    useEffect(
      ()=>{
        jaxios.get('/api/music/getMemberRecentMusics',{params:{memberId:loginUser.memberId}})
        .then((result)=>{
          console.log(result.data.musics);
          setMusic(result.data.musics);
        }).catch((err)=>{console.error(err);})
        
      },[]
    );
    
    const [visibleCount, setVisibleCount] = useState(5);

    const displayItems = music.slice(0,visibleCount);




    return (
      <div className={styles.recentMusicSection}>
        <h2><span style={{fontSize: '30px'}}>{loginUser.nickname}</span> 님의 자주 듣는 노래</h2>
        <div className={styles.recentMusicGrid}>
          {displayItems.map((item, index) => (
            <div key={index} className={styles.recentMusicCard} style={{backgroundImage: `url(${item.image})`}}
            onClick={()=>{navigate(`/music/${item.musicId}`)}}
            >
              <div className={styles.recentMusicInfo}>
                <p className={styles.recentMusictitle}>{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

export default MyRecentMusicSection;
