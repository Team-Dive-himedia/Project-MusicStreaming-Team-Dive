import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import axios from 'axios';
import jaxios from '../../util/JwtUtil';

import PlaylistSelectModal from './PlaylistSectionModal';

import styles from '../../css/detail/albumDetail.module.css';

/* 아이콘 */
import { FaPlay } from "react-icons/fa";
import { HiOutlineHeart } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";

const AlbumDetail = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const loginUser = useSelector((state) => state.user);

    const [albumDetail, setAlbumDetail] = useState(null);
    const [albumReplyList, setAlbumReplyList] = useState([]);
    const [content, setContent] = useState('');
    const [nickname, setNickname] = useState('');
    const [isLiked, setIsLiked] = useState(false);

    const [selectedMusicId, setSelectedMusicId] = useState(null);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);
    const [musicIdList, setMusicIdList] = useState([selectedMusicId]);

    useEffect(() => {
        if (loginUser.memberId) {
            jaxios.get('/api/community/getLikes', {
                params: { pagetype: 'ALBUM', memberId: loginUser.memberId }
            }).then((result)=>{
                if(result.data.LikesList.some(likes => likes.allpage.entityId == albumId)){
                    setIsLiked(true);
                }
          }).catch((err)=>{console.error(err);})
      }

      axios.get('/api/music/getAlbum', {
          params: { albumId }
        }).then((res) => {
            console.log(res.data.album);
            setAlbumDetail(res.data.album);
        }).catch((err) => console.error(err));

      fetchReply();
    }, [albumId]);

    const handleAddToPlaylist = (musicId) => {
        setSelectedMusicId(musicId);
        setShowPlaylistModal(true);
    };
    
    const handleLike = async () => {
        if (!loginUser || !loginUser.memberId) {
            alert('로그인이 필요한 서비스입니다.');
        }else{
            await jaxios.post('/api/community/insertLikes', null, {
              params: { entityId: albumId, pagetype: 'ALBUM', memberId: loginUser.memberId } 
            }).then((result)=>{
                console.log(result.data.msg)
                setIsLiked(prevLike => !prevLike);
            }).catch((err)=>{console.error(err);})
        }
    }

    // 댓글 불러오기
    const fetchReply = () => {
        axios.get('/api/community/getReplyList', {
            params: { pagetype: 'ALBUM', entityId: albumId },
        }).then((result) => {
            setAlbumReplyList(result.data.replyList);
        }).catch((err) => { console.error(err); });
    };

    // 댓글 등록
    const handleCommentSubmit = (e) => {
        e.preventDefault();

        if (!loginUser?.memberId) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        if (!content.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        setNickname(loginUser.nickname);
    
        jaxios.post('/api/community/insertReply', {nickname, content}, {
          params: {pagetype: 'ALBUM', entityId: albumId, memberId: loginUser.memberId}
        }).then((result) => {
            if (result.data.msg === 'yes') {
                alert('댓글이 추가되었습니다.');
                setContent('');
                fetchReply(); 
            }
        }).catch((err) => { console.error(err); });
    };

    // 장바구니 추가
    async function insertCart(musicId) {
        if(!loginUser.memberId){
            alert('로그인이 필요한 서비스입니다');
            navigate('/login');
        }else{
            try{
                const response = await jaxios.post('/api/cart/insertCart', {
                    memberId: loginUser.memberId,
                    musicIdList: [musicId]
                });
                navigate('/mypage/mp3/pending');
            }catch (error) {
                console.error('장바구니 담기 실패', error);
            }
        }
    }
  
    // 음악 상세보기로 이동
    const handleTrackClick = (musicId) => {
        navigate(`/music/${musicId}`);
    };

    // 앨범 상세정보가 없을 경우
    if (!albumDetail) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            {/* 앨범 상단 영역 */}
            <div className={styles.albumHeader}>
                <div className={styles.cover}>
                    <img
                      src={albumDetail.image}
                      alt={albumDetail.title}
                      className={styles.albumImage}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.titleContainer}>
                        <h1 className={styles.albumTitle}>{albumDetail.title}</h1>
                        <button
                            className={`${styles.likeButton}`}
                            onClick={handleLike}
                        >
                            { isLiked ? <HiHeart size={20}/> : <HiOutlineHeart size={20}/> }
                        </button>
                    </div>
                    
                    <p className={styles.artistName}>
                        <span
                            onClick={() => {
                              navigate(`/artist/${albumDetail.artistId}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            {albumDetail.artistName}
                        </span>
                    </p>
                    {/* 발매일, 추가 정보 */}
                    <p className={styles.albumMeta}>
                        {albumDetail.indate.substring(0, 10)}
                        <span className={styles.divider}>|</span>
                        {/* 필요한 추가 정보 */}
                    </p>

                    {/* 버튼들 */}
                    <div className={styles.buttonGroup}>
                        <button className={styles.playButton}>
                            <FaPlay size={14}/>&nbsp;전체재생
                        </button>
                    </div>
                </div>
            </div>

            {/* 수록곡 목록 테이블 */}
            <div className={styles.trackListSection}>
                <table className={styles.trackTable}>
                    <thead>
                        <tr>
                            <th className={styles.thNumber}>#</th>
                            <th className={styles.thTitle}>곡</th>
                            <th className={styles.thArtist}>아티스트</th>
                            <th className={styles.thActions}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {albumDetail.musicList.map((track, index) => (
                            <tr key={track.musicId} className={styles.trackRow}>
                                <td>{index + 1}</td>
                                <td
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleTrackClick(track.musicId)}>
                                    {track.title}
                                </td>
                                <td>
                                    <span
                                        onClick={() => {
                                            navigate(`/artist/${track.artistId}`);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {albumDetail.artistName}
                                    </span>
                                </td>
                                <td className={styles.actionIcons}>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => alert(`듣기: ${track.title}`)}
                                    >
                                      듣기
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={()=>{handleAddToPlaylist(track.musicId)}}
                                    >
                                        플리+
                                    </button>
                                    <button
                                        className={styles.iconButton}
                                        onClick={() => insertCart(track.musicId)} 
                                    >
                                        MP3
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                    <button type="submit" className={styles.submitButton}>
                        댓글 작성
                    </button>
                </form>
                <div className={styles.commentsList}>
                    {albumReplyList && albumReplyList.length > 0 ? (
                        albumReplyList.map((replyData, idx) => (
                            <div className={styles.commentItem} key={idx}>
                                <p className={styles.commentAuthor}>{replyData.member.memberId}</p>
                                <p className={styles.commentContent}>{replyData.content}</p>
                                <small className={styles.commentDate}>
                                    {replyData.indate.substring(0, 10)}
                              </small>
                          </div>
                      ))
                    ) : (
                      <div className={styles.commentsList}>댓글이 없습니다.</div>
                    )}
                </div>
            </div>

            {/* 플레이리스트 선택 모달 */}
            {showPlaylistModal && (
                <PlaylistSelectModal
                    musicIdList={[selectedMusicId]}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
};

export default AlbumDetail;
