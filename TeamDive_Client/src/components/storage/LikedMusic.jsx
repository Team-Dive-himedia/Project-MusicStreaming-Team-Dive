import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/storage/likedMusic.module.css";
import { useSelector } from "react-redux";
import jaxios from "../../util/JwtUtil";

const LikedMusic = () => {
    // 더미 데이터: "liked" 곡들
    // const [likedMusic, setLikedMusic] = useState([
    //   {
    //     musicId: 1,
    //     title: "별별별",
    //     genre: "아이돌",
    //     artist: "엔믹스",
    //     image: "/public/image/album/album1.jpg",
    //   },
    //   {
    //     musicId: 2,
    //     title: "고민중독",
    //     genre: "밴드",
    //     artist: "QWER",
    //     image: "/public/image/album/album2.jpg",
    //   },
    //   {
    //     musicId: 3,
    //     title: "Dash",
    //     genre: "아이돌",
    //     artist: "엔믹스",
    //     image: "/public/image/album/album3.jpg",
    //   },
    //   {
    //     musicId: 4,
    //     title: "Love me Like that",
    //     genre: "아이돌",
    //     artist: "엔믹스",
    //     image: "/public/image/album/album8.jpg",
    //   },
    // ]);

    const [likeMusicList, setLikeMusicList] = useState([]);
    const loginUser = useSelector(state=>state.user);

    useEffect(()=>{
      jaxios.get('/api/community/getLikes', {params:{pagetype:'MUSIC', memberId: loginUser.memberId}})
      .then((result)=>{
        setLikeArtistList(result.data.likeArtistList);
      })
      .catch((err)=>{
        console.error(err);
      })
    },[]);
    

    // 체크박스 선택 상태 (musicId 배열)
    const [selectedIds, setSelectedIds] = useState([]);

    // "전체선택" 체크박스 토글
    const toggleSelectAll = (checked) => {
      if (checked) {
        setSelectedIds(likeMusicList.map((music) => music.musicId));
      } else {
        setSelectedIds([]);
      }
    };

    // 개별 곡 체크박스 토글
    const toggleSelect = (id) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
    };

    // 좋아요 취소 -> confirm 후 제거
    const handleUnlike = (id) => {
      if (window.confirm("좋아요를 취소할까요?")) {
        setLikeMusicList((prev) => prev.filter((music) => music.musicId !== id));
        // 혹시 선택 목록에도 있으면 제거
        setSelectedIds((prev) => prev.filter((x) => x !== id));
      }
    };

    // "전체 재생" 버튼 클릭
    const handlePlayAll = () => {
      alert(`전체 재생: 선택된 곡 ${selectedIds.length}개`);
    };

    // "전체 구매" 버튼 클릭
    const handleBuyAll = () => {
      alert(`전체 구매: 선택된 곡 ${selectedIds.length}개`);
    };

    // 곡별 MP3 구매 버튼
    const handleBuyOne = (id) => {
      alert(`곡 (ID: ${id})을(를) 구매합니다!`);
    };

    const isAllSelected =
    likeMusicList.length > 0 && selectedIds.length === likeMusicList.length;
    const isSomeSelected = selectedIds.length > 0;

    return (
      <div className={styles.sectionContainer}>

        {/* 노래가 하나도 없을 때 */}
        {likeMusicList.length === 0 ? (
          <div className={styles.emptyMessage}>
            <h2>좋아하는 노래가 없어요!</h2>
            <p>내가 좋아하는 노래들을 추가해보세요.</p>
          </div>
        ) : (
          <>
            {/* 상단: 전체선택, 전체재생, 전체구매 */}
            <div className={styles.topBar}>
              <label className={styles.checkAllLabel}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
                전체선택
              </label>

              <button
                className={styles.topBtn}
                onClick={handlePlayAll}
                disabled={!isSomeSelected}
              >
                전체 재생
              </button>
              <button
                className={styles.topBtn}
                onClick={handleBuyAll}
                disabled={!isSomeSelected}
              >
                전체 구매
              </button>
            </div>

            <div className={styles.songList}>
              {likeMusicList.map((likeMusic) => (
                <div className={styles.songRow} key={likeMusic.musicId}>
                  {/* 개별 체크박스 */}
                  <input
                    type="checkbox"
                    className={styles.rowCheckbox}
                    checked={selectedIds.includes(likeMusic.musicId)}
                    onChange={() => toggleSelect(likeMusic.musicId)}
                  />

                  {/* 앨범 커버 */}
                  <div className={styles.coverWrapper}>
                    <img
                      src={likeMusic.image}
                      alt={likeMusic.title}
                      className={styles.coverImage}
                    />
                  </div>

                  {/* 제목 */}
                  <div className={styles.title}>
                    <Link to={`/music/${likeMusic.musicId}`} className={styles.titleLink}>
                      {music.title}
                    </Link>
                  </div>

                  {/* 가수 */}
                  <div className={styles.artist}>{likeMusic.artist}</div>

                  {/* 장르 */}
                  <div className={styles.genre}>{likeMusic.genre}</div>

                  {/* MP3 구매 버튼 */}
                  <button
                    className={styles.buyBtn}
                    onClick={() => handleBuyOne(likeMusic.musicId)}
                  >
                    MP3구매
                  </button>

                  {/* 좋아요(하트) 버튼 */}
                  <button
                    className={styles.heartBtn}
                    onClick={() => handleUnlike(likeMusic.musicId)}
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
};

export default LikedMusic;
