import React, { useState, useEffect } from 'react';
import styles from '../../../css/mainPage/randomMusic.module.css';
import { useNavigate } from 'react-router-dom';

const RandomMusic = () => {
  // 더미 데이터
  const musicData = [
    {
      musicId: 1,
      title: "Blueming",
      artist: "아이유 (IU)",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
    {
      musicId: 2,
      title: "Dynamite",
      artist: "BTS",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
    {
      musicId: 3,
      title: "Hype Boy",
      artist: "NewJeans",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
    {
      musicId: 4,
      title: "사건의 지평선",
      artist: "윤하",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
    {
      musicId: 5,
      title: "Unforgiven",
      artist: "LE SSERAFIM",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
    {
      musicId: 6,
      title: "Whistle",
      artist: "BLACKPINK",
      image: "/public/image/artist/artist3.jpg",
      artistId: 1
    },
    {
      musicId: 7,
      title: "Ditto",
      artist: "NewJeans",
      image: "/public/image/artist/artist1.jpg",
      artistId: 1
    },
  ];

 
  const [randomSongs, setRandomSongs] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    pickRandomSongs();
  }, []);

  
  const pickRandomSongs = () => {
    if (musicData.length <= 3) {
    
      setRandomSongs(musicData);
      return;
    }
   
    const shuffled = [...musicData].sort(() => 0.5 - Math.random());
    const top3 = shuffled.slice(0, 3);
    setRandomSongs(top3);
  };

  return (
    <div className={styles.randomMusicContainer}>
      <h2 className={styles.title}>오늘은 뭐 듣지?🤔</h2>
      <button className={styles.refreshButton} onClick={pickRandomSongs}>
        다른 곡 보기
      </button>

      <div className={styles.songList}>
        {randomSongs.map((music, idx) => (
          <div key={music.musicId} className={styles.songCard}>
            <img
              src={music.image}
              alt={music.title}
              className={styles.songImage}
            />
            <div className={styles.songInfo}>
              <p className={styles.songTitle}>
                <span 
                onClick={()=>{navigate(`/music/${music.musicId}`)}}
                style={{cursor: "pointer"}}>
              {music.title}</span></p>
              <p className={styles.songArtist}>
                <span
                onClick={()=>{navigate(`/artist/${music.artistId}`)}}
                style={{cursor: "pointer"}}>                
              {music.artist}</span></p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default RandomMusic;
