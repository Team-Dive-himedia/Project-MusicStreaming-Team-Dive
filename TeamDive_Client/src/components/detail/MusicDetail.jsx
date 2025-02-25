import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from '../../css/detail/musicDetail.module.css';

import PlaylistSelectModal from './PlaylistSectionModal';

import axios from 'axios';
import jaxios from '../../util/JwtUtil';

const MusicDetail = () => {
    const { musicId } = useParams();
    const [musicDetail, setMusicDetail] = useState(null);
    const [expandedLyrics, setExpandedLyrics] = useState(false);

    //const [commentText, setCommentText] = useState('');
    //const [comments, setComments] = useState([]);
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');
    const [replyMusicList, setReplyMusicList] = useState([]);
    const [reply, setReply] = useState({});
    const [like, setLike] = useState(null);
    const [musicIdList, setMusicIdList] = useState([musicId]);

    const loginUser = useSelector((state) => state.user);
    const navigate = useNavigate();


    const handleLike = () => {
        jaxios.post('/api/community/insertLikes',null,{params:{entityId: musicId, pagetype: 'MUSIC', memberId: loginUser.memberId}})
        .then((result)=>{
            console.log(result.data.msg)
            setLike(prevLike => !prevLike);
        }).catch((err)=>{console.error(err);})
    }

    // 플리 추가 모달
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const handleAddToPlaylist = () => {
      
      setShowPlaylistModal(true);
    };
    
    


    useEffect(() => {

        jaxios.get('/api/community/getLikes',{params:{pagetype: 'MUSIC',memberId: loginUser.memberId}})
        .then((result)=>{
            if(result.data.LikesList.some(likes => likes.allpage.entityId == musicId)){
                setLike(true);
            }
        }).catch((err)=>{console.error(err);})

        const sample = {
            musicId: musicId,
            title: "테스트제목",
            artistName: "테스트가수",
            image: "/public/image/album/album1.jpg",
            playCount: 1234,
            genre: "Pop",
            lyrics:
                " \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",

            albumId: 201,
            albumtitle: "테스트앨범이름",
            albumIndate: "2024-12-12"
        };
        setMusicDetail(sample);

        axios.get('/api/music/getMusic',{params:{musicId}})
        .then((result)=>{
            console.log(result.data.music);
            setMusicDetail(result.data.music);
        }).catch((err)=>{console.error(err);})


        axios.get('/api/community/getReplyList', {params:{pagetype:'MUSIC', entityId: musicId,}})
        .then((result)=>{
                setReplyMusicList(result.data.replyList);
        })
        .catch((err)=>{
                console.error(err);
        })
    }, [musicId]);

    /* 개별곡 구매를 위한 장바구니 담기 */
    async function insertCart(){
        if(!loginUser){
            alert('로그인이 필요한 서비스입니다');
            navigate('/login');
        }else{
             try{
                const response = await jaxios.post('/api/cart/insertCart', {
                    memberId: loginUser.memberId,
                    musicIdList
                });
                navigate('/storage/myMP3/pending');
            }catch(error){
                console.error('장바구니 담기 실패', error)
            }
        }
    }

    const toggleLyrics = () => {
        setExpandedLyrics((prev) => !prev);
    };

    // ========Reply UI를 재조회하여 댓글추가후 재 조회하는 함수

    const fetchReply = () => {
        axios.get('/api/community/getReplyList', {params:{pagetype:'MUSIC', entityId: musicId,}})
        .then((result) => {
        // 서버로부터 받은 댓글 데이터로 상태 업데이트
        setReplyMusicList(result.data.replyList);
        })
        .catch((err) => {
        console.error(err);
        });
    };


    const handleCommentSubmit = (e) => {
        e.preventDefault();
        // 로그인 여부 확인
        if (!loginUser.memberId) {alert("로그인하세요"); return; }

        // 빈칸 return
        if (!content.trim()) {alert('댓글을 입력해주세요'); return; }

        setNickname(loginUser.nickname);
        fetchReply();
        jaxios.post('/api/community/insertReply', {nickname, content},{params:{pagetype:'MUSIC', entityId: musicId, memberId: loginUser.memberId}})
        .then((result)=>{
            if(result.data.msg === 'yes'){
                alert('댓글이 추가되었습니다.');
                setContent('');
                fetchReply();
                navigate(`/music/${musicId}`);
            }
        })
        .catch((err)=>{
            console.error(err);
        })
    };

    if (!musicDetail) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 음악 상세 정보 */}
            <div className={styles.detailHeader}>
                <img src={musicDetail.image} alt={musicDetail.title} className={styles.image} />
                <div className={styles.info}>
                <div className={styles.titleContainer}>
                    <h1 className={styles.title}>{musicDetail.title}</h1>
                    <button className={styles.likeButton} onClick={handleLike}>
                    {like ? "❤️" : "♡"}
                    </button>
                </div>
                    <p className={styles.artist} 
                        onClick={()=>{navigate(`/artist/${musicDetail.artistId}`)}}>
                            By <span style={{cursor: "pointer"}}>{musicDetail.artistName}</span></p>
                    <p className={styles.genre}>장르: {musicDetail.genre}</p>
                    <p className={styles.like}>Likes: 미구현</p>

          
                    <div className={styles.buttonGroup}>
                        <button className={styles.playButton}>▶ 재생</button>
                        <button className={styles.addButton} onClick={handleAddToPlaylist}>플리 추가</button>
                        <button className={styles.purchaseButton} onClick={insertCart}>구매</button>
                    </div>
                </div>
            </div>

            {/* 가사 영역 */}
            <div className={styles.lyricsSection}>
                <h3>가사</h3>
                <div className={styles.lyrics}>
                {expandedLyrics
                    ? musicDetail.lyrics
                    : musicDetail.lyrics.slice(0, 200) + (musicDetail.lyrics.length > 200 ? "..." : "")}
                </div>
                {musicDetail.lyrics.length > 200 && (
                <button className={styles.toggleButton} onClick={toggleLyrics}>
                    {expandedLyrics ? "가사 접기" : "더보기"}
                </button>
                )}
            </div>



            <div className={styles.albumSection}>
                <h3>수록 앨범</h3>
                <div className={styles.album}>
                    <div><img src={musicDetail.image}  className={styles.albumImage} 
                        onClick={()=>{navigate(`/album/${musicDetail.albumId}`)}} style={{cursor:'pointer'}}/></div>
                    <div className={styles.albumTitle}
                        onClick={()=>{navigate(`/album/${musicDetail.albumId}`)}} style={{cursor:'pointer'}}
                    >{musicDetail.albumTitle}</div>
                    <div className={styles.albumArtist}
                        onClick={()=>{navigate(`/artist/${musicDetail.artistId}`)}} style={{cursor:'pointer'}}
                    >{musicDetail.artistName}</div>
                    <div className={styles.albumIndate}>{musicDetail.albumIndate}</div>
                </div>
            </div>




            {/* 댓글 영역 */}
            <div className={styles.commentsSection}>
                <h2>댓글</h2>
                <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="댓글을 입력하세요..."
                        className={styles.commentInput}
                    />
                    <button type="submit" className={styles.submitButton}> 댓글 작성
                    </button>
                </form>
                <div className={styles.commentsList}>
                    {                    
                        (replyMusicList && replyMusicList.length>0)?(
                            replyMusicList.map((replyMusic, idx)=>{
                                return(
                                    <div className={styles.commentItem} key={idx}>
                                        <p className={styles.commentAuthor}>{replyMusic.member.memberId}</p>
                                        <p className={styles.commentContent}>{replyMusic.content}</p>
                                        <small className={styles.commentDate}>{replyMusic.indate.substring(0.10)}</small>
                                    </div>
                                )
                            })
                        ):(<div>댓글이 없습니다.</div>)
                    }
                </div>
            </div>

            {/* 플레이리스트 선택 모달 */}
            {showPlaylistModal && (
                <PlaylistSelectModal
                    musicIdList={[musicId]}
                    onClose={() => setShowPlaylistModal(false)}
                />
                )}




        </div>
    );
};

export default MusicDetail;
