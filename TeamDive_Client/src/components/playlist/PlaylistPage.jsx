import { useState, useEffect } from "react";
import styles from "../../css/playlistPage.module.css";

const PlaylistPage = () => {
    
  // rotate.gif 이미지를 반환하는 간단한 함수
  function rotateGif() {
    return (
      <img
        src="/public/icon/rotate.gif"
        alt="rotate icon"
        className={styles.rotateIcon}
      />
    );
  }

  const [shufflePlaylist, setShufflePlaylist] = useState([]);

  // 임시 데이터
  const playlist = [
    { title: "여행가고 싶을 때", image: "/public/image/album/album1.jpg" },
    { title: "플리2", image: "/public/image/album/album2.jpg" },
    { title: "플리3", image: "/public/image/album/album3.jpg" },
    { title: "플리4", image: "/public/image/album/album4.jpg" },
    { title: "플리5", image: "/public/image/album/album5.jpg" },
    { title: "플리6", image: "/public/image/album/album6.jpg" },
    { title: "플리7", image: "/public/image/album/album7.jpg" },
    { title: "플리8", image: "/public/image/album/album8.jpg" },
    { title: "플리9", image: "/public/image/album/album9.jpg" },
    { title: "플리10", image: "/public/image/album/album10.jpg" },
    { title: "플리11", image: "/public/image/album/album11.jpg" },
  ];

  // 랜덤 5개 추출
  const getRandomPlaylist = () => {
    const shuffled = [...playlist].sort(() => 0.5 - Math.random());
    const randomFive = shuffled.slice(0, 5);
    setShufflePlaylist(randomFive);
  };

  useEffect(() => {
    getRandomPlaylist();
  }, []);

  return (
    <div className={styles.container}>
      {/* 랜덤 플레이리스트 */}
      <div className={styles.randomPlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>랜덤 플레이리스트</span>
          <span onClick={getRandomPlaylist} className={styles.rotateBtn}>
            {rotateGif()}
          </span>
        </div>
        <div className={styles.randomSection}>
          {shufflePlaylist.map((item, idx) => (
            <div
              key={idx}
              className={styles.randomCard}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 추천 플레이리스트 */}
      <div className={styles.recommendPlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>추천 플레이리스트</span>
        </div>
        <div className={styles.recommendSection}>
          {playlist.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className={styles.recommendCard}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 장르별 플레이리스트 */}
      <div className={styles.genrePlaylist}>
        <div className={styles.sectionHeader}>
          <span className={styles.spanTitle}>My 기분 맞춤 플레이리스트</span>
          <div className={styles.genreMenu}>적적한 기분 / 신날 때 / ??? </div>
        </div>
        <div className={styles.genreSection}>
          {playlist.slice(0, 5).map((item, idx) => (
            <div
              key={idx}
              className={styles.genreCard}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <p className={styles.pTitle}>{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PlaylistPage };
