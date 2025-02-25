import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jaxios from "../../util/JwtUtil";
import { useSelector } from "react-redux"; 
import styles from "../../css/detail/artistDetail.module.css";

import PlaylistSelectModal from "./PlaylistSectionModal";

const ArtistDetail = () => {
  const { artistId } = useParams();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  

  const loginUser = useSelector((state) => state.user);

  const [artistDetail, setArtistDetail] = useState(null);


  const [artistReplyList, setArtistReplyList] = useState([]);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");

  const [selectedMusicId, setSelectedMusicId] = useState(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [musicIdList, setMusicIdList] = useState([selectedMusicId]);
  
    const handleAddToPlaylist = (musicId) => {
      setSelectedMusicId(musicId);
      setShowPlaylistModal(true);
    };
    
    const handleLike = () => {
      jaxios.post('/api/community/insertLikes',null,{params:{entityId: artistId, pagetype: 'ARTIST', memberId: loginUser.memberId}})
      .then((result)=>{
          console.log(result.data.msg)
          setIsLiked(prevLike => !prevLike);
      }).catch((err)=>{console.error(err);})
  }




  useEffect(() => {
    jaxios.get('/api/community/getLikes',{params:{pagetype: 'ARTIST',memberId: loginUser.memberId}})
        .then((result)=>{
            if(result.data.LikesList.some(likes => likes.allpage.entityId == artistId)){
                setIsLiked(true);
            }
        }).catch((err)=>{console.error(err);})
    
    axios
      .get("/api/music/getArtist", { params: { artistId } })
      .then((res) => {
        console.log(res.data.artist);
        setArtistDetail(res.data.artist);
      })
      .catch((err) => console.error(err));

    
    fetchReply();
  }, [artistId]);

  async function insertCart(mId) {
    if (!loginUser) {
      alert("로그인이 필요한 서비스입니다");
      navigate("/login");
    } else {
      try {
        const response = await jaxios.post("/api/cart/insertCart", {
          memberId: loginUser.memberId,
          musicIdList: [mId], // ★ 클릭된 곡의 ID만 전송
        });
        navigate("/storage/myMP3/pending");
      } catch (error) {
        console.error("장바구니 담기 실패", error);
      }
    }
  }
  



 
  const fetchReply = () => {
    axios
      .get("/api/community/getReplyList", {
        params: { pagetype: "ARTIST", entityId: artistId },
      })
      .then((result) => {
        setArtistReplyList(result.data.replyList);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  const handleCommentSubmit = (e) => {
    e.preventDefault();


    if (!loginUser?.memberId) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

   
    if (!content.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }


    setNickname(loginUser.nickname);

 
    jaxios
      .post(
        "/api/community/insertReply",
        { nickname, content },
        {
          params: {
            pagetype: "ARTIST",
            entityId: artistId,
            memberId: loginUser.memberId,
          },
        }
      )
      .then((result) => {
        if (result.data.msg === "yes") {
          alert("댓글이 추가되었습니다.");
          setContent("");
          fetchReply(); 
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!artistDetail) {
    return <div className={styles.loading}>Loading...</div>;
  }

 
  const formattedDebut = artistDetail.debut
    ? new Date(artistDetail.debut).toISOString().slice(0, 10).replace(/-/g, ".")
    : "";

  return (
    <div className={styles.container}>
    
      <div className={styles.artistHeader}>
        <img
          src={artistDetail.image}
          alt={artistDetail.artistName}
          className={styles.artistImage}
        />
        <div className={styles.artistInfo}>
          <h1 className={styles.artistName}>{artistDetail.artistName}</h1>
          <p className={styles.meta}>
            데뷔 {formattedDebut || "정보 없음"}
            <br />
            {artistDetail.country ? `국가: ${artistDetail.country}` : ""}
            <br />
            {artistDetail.content}
          </p>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            {isLiked ? "♥ 좋아요" : "♡ 좋아요"}
          </button>
        </div>
      </div>

      {/* 노래 목록 섹션 */}
      <div className={styles.musicSection}>
        <h2 className={styles.sectionTitle}>노래</h2>
        {artistDetail.musicList && artistDetail.musicList.length > 0 ? (
          <table className={styles.musicTable}>
            <tbody>
              {artistDetail.musicList.map((music, index) => (
                <tr key={music.musicId} className={styles.trackRow}>
                  <td className={styles.thNumber}>
                    <img src={music.image} style={{width:'50px', height: '50px' }}/>
                  </td>
                  <td
                    className={styles.thTitle}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/music/${music.musicId}`)}
                  >
                    {music.title}
                  </td>
                  <td className={styles.thAlbum}
                    onClick={()=>{navigate(`/album/${music.albumId}`)}}>
                        <span  style={{cursor:"pointer"}}>{music.albumTitle || ""}</span></td>
                  <td className={styles.thActions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => alert(`듣기: ${music.title}`)}
                    >
                      듣기
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleAddToPlaylist(music.musicId)}
                    >
                      플리+
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => insertCart(music.musicId)} 

                    >
                      MP3
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>등록된 노래가 없습니다.</p>
        )}
      </div>

      {/* 앨범 목록 섹션 */}
      <div className={styles.albumSection}>
        <h2 className={styles.sectionTitle}>앨범</h2>
        {artistDetail.albums && artistDetail.albums.length > 0 ? (
          <div className={styles.albumList}>
            {artistDetail.albums.map((album) => (
              <div
                key={album.albumId}
                className={styles.albumCard}
                onClick={() => navigate(`/album/${album.albumId}`)}
              >
                <img
                  src={album.image}
                  alt={album.title}
                  className={styles.albumImage}
                />
                <div className={styles.albumInfo}>
                  <p className={styles.albumTitle}>{album.title}</p>
                  <p className={styles.albumIndate}>
                    {album.indate?.substring(0, 10)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>등록된 앨범이 없습니다.</p>
        )}
      </div>

      {/* ===== 댓글 섹션 ===== */}
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
          {artistReplyList && artistReplyList.length > 0 ? (
            artistReplyList.map((replyData, idx) => (
              <div className={styles.commentItem} key={idx}>
                <p className={styles.commentAuthor}>
                  {replyData.member.memberId}
                </p>
                <p className={styles.commentContent}>{replyData.content}</p>
                <small className={styles.commentDate}>
                  {replyData.indate.substring(0, 10)}
                </small>
              </div>
            ))
          ) : (
            <div>댓글이 없습니다.</div>
          )}
        </div>
      </div>

{showPlaylistModal && (
  <PlaylistSelectModal
    musicIdList={[selectedMusicId]}  
    onClose={() => setShowPlaylistModal(false)}
  />
)}

    </div>
  );
};

export default ArtistDetail;
