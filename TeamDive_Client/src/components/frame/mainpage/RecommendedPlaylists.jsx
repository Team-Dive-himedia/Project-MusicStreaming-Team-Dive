// src/components/RecommendedPlaylists.jsx
import React, {useState, useEffect} from 'react';
import styles from '../../../css/mainPage/recommendedPlaylists.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RecommendedPlaylists = ({ playList }) => {

    const navigate = useNavigate();
    const [latestPlayList, setLatestPlayList] = useState([]);
    
    useEffect(() => {
        const fetchLatestPlayList = async () => {
            try {
                const result = await axios.get('/api/music/latestPlayList');
                setLatestPlayList(result.data.latestPlayList);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchLatestPlayList();
    }, []);

    return (
        <div className={styles.playlists}>
            {
                (latestPlayList)?(
                    latestPlayList.map((playList, idx) => (
                        <div key={playList.playListId} className={styles.playlistItem}
                            onClick={()=>{navigate(`/playList/${playList.playListId}`)}}
                        >
                            <div className={styles.playlistCover}>
                                {/* 플레이리스트 대표 이미지가 있다면 여기에 표시 */}
                                <img src={playList.coverImage} alt={playList.title} />
                            </div>
                            <div className={styles.playlistDetails}>
                                <h4>{playList.title}</h4>
                            </div>
                        </div>
                    ))
                ):(<div>추천 플레이 리스트가 없습니다.</div>)
            
            }
        </div>
    );
};

export default RecommendedPlaylists;
