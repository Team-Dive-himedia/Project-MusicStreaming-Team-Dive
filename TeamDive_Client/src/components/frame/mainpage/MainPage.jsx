// src/components/MainPage.jsx
import React, { useContext,useEffect, useState } from 'react';
import Top100Section from './Top100Section';
import MyRecentMusicSection from './MyRecentMusicSection.jsx';
import LatestMusic from './LatestMusic.jsx';
import LatestAlbums from './LatestAlbums';
import RecommendedPlaylists from './RecommendedPlaylists';
import styles from '../../../css/mainPage/mainPage.module.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LikeRankingSection from './LikeRankingSection.jsx';
import RandomMusic from './RandomMusic.jsx';
import axios from 'axios';
import jaxios from '../../../util/JWTUtil.jsx';
import { setRecommendedListToCookie, getRecommendedListFromCookie, setRecommendedListToStorage, getRecommendedListFromStorage } from '../../../util/CookieUtil.jsx';
import { PlayerContext } from '../../../context/PlayerContext.jsx';



const MainPage = ({mood, setMood}) => {
    const loginUser = useSelector(state => state.user);
    
    const [showAdModal, setShowAdModal] = useState(false); 

    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [recommendList, setRecommendList] = useState([]);
    
    // useEffect(() => {
    //     if (!mood) return;
    
    //     axios.get(`/api/music/recommend?mood=${mood}`)
    //       .then((res) => {
    //         setRecommendedSongs(res.data);
    //       })
    //       .catch((err) => {
    //         console.error(err);
    //       });
    //   }, [mood]);
    useEffect(() => {
    if (!mood || !loginUser.memberId) return;
    console.log('select mood', mood);
    
    jaxios.get('/api/AI/recommendList', { params: { mood, memberId: loginUser.memberId } })
    .then((result) => {
        const data = result.data?.recommendList;
        if (Array.isArray(data)) {
            setRecommendList(data);
            setRecommendedListToStorage(data);

            console.log('추천 목록을 저장함:', data);
        } else {
            console.warn('추천 목록이 없거나 잘못된 형식입니다.');
            setRecommendList([]);
        }

        // localStorage에서 가져오기 (이전에 저장한 데이터 활용)
        const storedList = getRecommendedListFromStorage();
        if (storedList && storedList.length > 0) {
            console.log('localStorage에서 불러온 추천 목록:', storedList);
            setRecommendList(storedList);
        }
    })
    .catch((err) => {
        console.error('추천 리스트 가져오기 실패:', err);
    });
    }, [mood, loginUser.memberId]);


    useEffect(() => {
        
        const timer = setTimeout(() => {
            setShowAdModal(true);
        }, 300);

        return () => clearTimeout(timer); 
    }, []);


    // 더미 데이터 (나중에 실제 API 호출로 대체)
    const [latestMusic, setLatestMusic] = useState([]);
    const [album, setAlbum] = useState([]);
    const [playList, setPlayList] = useState([]);

    useEffect(() => {
        // 최신등록음악 더미 데이터
        setLatestMusic([
        { musicId: 1, title: '최신곡 1', artist: 'Artist A', image: '/public/image/album/album1.jpg' },
        { musicId: 3, title: '최신곡 2', artist: 'Artist B', image: '/public/image/album/album2.jpg' },
        ]);

        // 최신등록앨범 더미 데이터
        setAlbum([
        { albumId: 1, title: '신규 앨범 1', image: '/public/image/album/album3.jpg' },
        { albumId: 2, title: '신규 앨범 2', image: '/public/image/album/album4.jpg' },
        ]);

        // 추천플레이리스트 더미 데이터
        setPlayList([
        { playListId: 1, title: 'Chill Vibes' },
        { playListId: 2, title: 'Workout Hits' },
        ]);
    }, []);

    function AdModal() {
        return (
        <div className={styles.adModalOverlay}>
            <div className={styles.adModal}>
            <button className={styles.closeButton} onClick={() => setShowAdModal(false)}>
                X
            </button>
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to={'/membership/all'}><img src='/public/image/adImage.png' style={{width: '100%', height: '100%'}}/></Link>
            </div>
            </div>
        </div>
        );
    }
    
    const {setAddPlaylist}=useContext(PlayerContext);
    const handlePlayAll = () => {
        setAddPlaylist(recommendList);
    };

    function closeRecommendArea() {
        console.log("mainPage에서의 무드",mood); // setMood가 undefined인지 확인
        setMood(""); // 정상적으로 실행되는지 확인
        console.log("setMood통과이후",mood)
    }

    return (
        <div className={styles.mainPageContainer}>

            <div className={
            mood && mood !== ''
                ? styles.recommendActive
                : styles.recommendHidden
            }>
            <h3>추천 노래 목록</h3>
            {
                (recommendList) ? (
                    <div>
                        <button className={styles.moreButtonRecommend}onClick={() => handlePlayAll()}>
                            모두 듣기
                        </button>
                        <button className={styles.moreButtonRecommend} onClick={() => {
                            closeRecommendArea();
                        }}>닫기</button>   
                        <div className={styles.songObject}>
                            {recommendList.slice(0, 15).map((recommendMusic, idx) => (
                                <Link to={`/music/${recommendMusic.musicId}`} key={recommendMusic.id || idx}>
                                    <div className={styles.songCard}>
                                        <div className={styles.songTitle}>
                                            <img src={recommendMusic.image} alt="곡 이미지" />
                                        </div>
                                        <div className={styles.titleArea}>
                                            <p className={styles.songTitle}>
                                                {recommendMusic.title}
                                            </p>
                                            <p className={styles.songArtist}>
                                                {recommendMusic.artistName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>추천곡이 없습니다.</div>
                )
                }

            </div>


            {!loginUser.memberId ? (showAdModal && (<AdModal/>)) : ''}
            
            <div className={styles.topSection}>

                <div className={styles.topRow}>
                    <div className={styles.topLeft}><LikeRankingSection /></div>

            
                    <section className={styles.conditionalSection1}>
                    { !loginUser.memberId ? 
                            <RandomMusic/>
                        :
                            <MyRecentMusicSection />  
                    }
                    </section>
                  

                </div>

                <section className={styles.conditionalSection}>
                        
                        <Top100Section />
                        
                    </section>
            </div>

        <section className={styles.section}>
            <h2>최신등록음악</h2>
            <LatestMusic music={latestMusic} />
        </section>

        <section className={styles.section}>
            <h2>최신등록앨범</h2>
            <LatestAlbums album={album} />
        </section>

        <section className={styles.section}>
            <h2>추천플레이리스트</h2>
            <RecommendedPlaylists playList={playList} />
        </section>
        
        </div>

    
    );
};

export default MainPage;
