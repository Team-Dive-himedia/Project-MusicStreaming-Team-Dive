import React, { useState, useEffect } from "react";
import styles from "../../css/storage/likedArtist.module.css";
import jaxios from "../../util/JwtUtil";
import { useSelector } from "react-redux";

const LikedArtist = () => {
  // 가짜 데이터 예시
  // const [likedArtists, setLikedArtists] = useState([
  //   {
  //     artistId: 1,
  //     artistName: "엔믹스",
  //     debut: "2022-02-22",
  //     country: "Korea",
  //     image: "/public/image/artist/artist1.jpg",
  //   },
  //   {
  //     artistId: 2,
  //     artistName: "아이유",
  //     debut: "2008-09-18",
  //     country: "Korea",
  //     image: "/public/image/artist/artist2.jpg",
  //   },
  //   {
  //     artistId: 3,
  //     artistName: "NewJeans",
  //     debut: "2022-08-01",
  //     country: "Korea",
  //     image: "/public/image/artist/artist3.jpg",
  //   },
  // ]);

  const [likeArtistList, setLikeArtistList] = useState([]);
  const loginUser = useSelector(state=>state.user);

  useEffect(()=>{
    jaxios.get('/api/community/getLikes', {params:{pagetype:'ARTIST', memberId: loginUser.memberId}})
    .then((result)=>{
      setLikeArtistList(result.data.likeArtistList);
    })
    .catch((err)=>{
      console.error(err);
    })
  },[]);

  // 좋아요 취소
  const handleUnlike = (artistId) => {
    if (window.confirm("좋아요를 취소할까요?")) {
      setLikeArtistList((prev) =>
        prev.filter((artist) => artist.artistId !== artistId)
      );
    }
  };

  // 목록이 비어 있을 때
  if (!likeArtistList || likeArtistList.length === 0) {
    return (
      <div className={styles.emptyMessage}>
        <h2>좋아하는 가수가 없습니다</h2>
        <p>내가 좋아하는 가수들을 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className={styles.sectionContainer}>
      <div className={styles.artistGrid}>
        {likeArtistList.map((likeArtist, idx) => (
          <div className={styles.artistCard} key={likeArtist.artistId}>
            
            <div className={styles.imageOverlay}>
              <img
                src={likeArtist.image}
                alt={likeArtist.artistName}
                className={styles.artistImage}
              />
              
              <div className={styles.overlayGradient} />
              {/* 좋아요 버튼 (하트) */}
              <button
                className={styles.heartBtn}
                onClick={() => handleUnlike(likeArtist.artistId)}
              >
                ❤️
              </button>
            </div>

            {/* 가수 정보 */}
            <div className={styles.artistInfo}>
              <h3 className={styles.artistName}>{likeArtist.artistName}</h3>
              <p className={styles.debut}>데뷔일: {likeArtist.debut}</p>
              <p className={styles.country}>국가: {likeArtist.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedArtist;
