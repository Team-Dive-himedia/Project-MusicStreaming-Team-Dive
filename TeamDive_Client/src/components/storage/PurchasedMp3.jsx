import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

import jaxios from "../../util/JwtUtil";

import styles from "../../css/storage/storage.module.css";

const PurchasedMp3 = () => {
    const loginUser = useSelector(state => state.user);

    const [purchasedMusicList, setPurchasedMusicList] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    /* 구매한 곡 불러오기 */
    useEffect(
        () => {
            // try{
            //     const response = jaxios.get('/api/mp3/getPurchasedMusic', {
            //         params: { memberId: loginUser.memberId }
            //     });
            //     if(response.data.message === 'yes'){
            //         setPurchasedMusicList(response.data.purchasedMusicList);
            //     }else{
            //         setPurchasedMusicList([]);
            //     }
            // }catch(error){
            //     console.log('구매한 곡 불러오기 실패', error);
            // }
    }, [])
    
    // "전체선택" 체크박스 토글
    const toggleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(purchasedMusicList.map((music) => music.musicId));
        } else {
            setSelectedIds([]);
        }
    };

    const isAllSelected =
    purchasedMusicList.length > 0 && selectedIds.length === purchasedMusicList.length;

    // 개별 곡 체크박스 토글
    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    return (
        <div>
            {
                (purchasedMusicList && purchasedMusicList.length === 0) ? (
                    <div className={styles.emptyMessage}>
                        <h2>구매한 MP3</h2>
                        <p>구매한 MP3가 없습니다.</p>
                    </div>
                ) : (   
                    <>
                        {/* 상단: 전체선택, 전체재생 */}
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
                        </div>

                        <div className={styles.songList}>
                            {purchasedMusicList.map((music) => (
                                <div className={styles.songRow} key={music.musicId}>
                                    {/* 개별 체크박스 */}
                                    <input
                                        type="checkbox"
                                        className={styles.rowCheckbox}
                                        checked={selectedIds.includes(music.musicId)}
                                        onChange={() => toggleSelect(music.musicId)}
                                    />

                                    {/* 앨범 커버 */}
                                    <div className={styles.coverWrapper}>
                                        <img
                                        src={music.image}
                                        alt={music.title}
                                        className={styles.coverImage}
                                        />
                                    </div>

                                    {/* 제목 */}
                                    <div className={styles.title}>
                                        <Link to={`/music/${music.musicId}`} className={styles.titleLink}>
                                        {music.title}
                                        </Link>
                                    </div>

                                    {/* 가수 */}
                                    <div className={styles.artist}>{music.artist}</div>

                                    {/* 장르 */}
                                    <div className={styles.genre}>{music.genre}</div>

                                    {/* MP3 다운로드 버튼 */}
                                    <button
                                        className={styles.buyBtn}
                                        onClick={() => {}}
                                    >
                                        다운로드
                                    </button>

                                    {/* 좋아요(하트) 버튼 */}
                                    <button
                                        className={styles.heartBtn}
                                        onClick={() => handleUnlike(music.musicId)}
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
}

export default PurchasedMp3;