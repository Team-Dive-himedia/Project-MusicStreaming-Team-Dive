import React, { useEffect, useState } from "react";
import styles from "../../css/storage/myPlaylist.module.css";
import jaxios from "../../util/JwtUtil";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyPlaylist = () => {

  const loginUser = useSelector(state => state.user);

  const navigate = useNavigate();


  const [showModal, setShowModal] = useState(false);


  const [playlistTitle, setPlaylistTitle] = useState("");
  const [playlistContent, setPlaylistContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  
  const [preview, setPreview] = useState("");      
  const [coverImageName, setCoverImageName] = useState(""); // 서버에서 반환된 파일명


  const [playlists, setPlaylists] = useState([]);

  // 모달 열기
  const handleNewPlaylistClick = () => {
    setShowModal(true);
  };

  // 모달 닫기 & 폼 초기화
  const handleCancel = () => {
    setPlaylistTitle("");
    setPlaylistContent("");
    setIsPublic(false);
    setPreview("");
    setCoverImageName("");
    setShowModal(false);
  };


  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

 
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
  
      const formData = new FormData();
      formData.append("image", file);

     
      const res = await jaxios.post("/api/music/imageUpload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

     
      if (res.data.image) {
        setCoverImageName(res.data.image);
        console.log("이미지 업로드 성공:", res.data.image);
      } else {
        console.error("이미지 업로드 실패:", res.data);
      }
    } catch (err) {
      console.error("이미지 업로드 에러:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

 
  const handleAdd = async () => {

    if (!playlistTitle.trim()) {
      alert('제목을 입력해주세요.');
      return ;
    }

    try {
      
      const response = await jaxios.post("/api/music/insertPlaylist", {
        title: playlistTitle,
        content: playlistContent,
        coverImage: coverImageName,
        shayringyn: isPublic,
      },{params: {memberId : loginUser.memberId}});

      console.log("플레이리스트 생성 성공:", response.data);

      
      const newPlaylist = {
        id: Date.now(),
         
        coverImage: coverImageName ? `/playlistImage/${coverImageName}` : "",
        title: playlistTitle,
        trackCount: 0,
      };
      setPlaylists([...playlists, newPlaylist]);

      
      setPlaylistTitle("");
      setPlaylistContent("");
      setIsPublic(false);
      setPreview("");
      setCoverImageName("");
      setShowModal(false);
    } catch (err) {
      console.error("플레이리스트 생성 에러:", err);
      alert("플레이리스트 생성 실패");
    }
  };


  useEffect(()=>{
  
    playlistView();
  },[]);

  const playlistView = async () => {
    try {
      const result = await jaxios.get("/api/music/getMemberPlaylist", {
        params: { memberId: loginUser.memberId },
      });
  
  
      if (result.data && result.data.playlist) { 
        setPlaylists(result.data.playlist);

      } else {

        setPlaylists([]);  
      }
    } catch (error) {
      console.error(" 플레이리스트 못 가져옴:", error);
      setPlaylists([]);  
    }
  };
  



  return (
    <div className={styles.playlistContainer}>

      <div className={styles.playlistGrid}>
         
        <div className={styles.playlistTile} onClick={handleNewPlaylistClick}>
          <div className={styles.addIcon}>+</div>
          <p>플레이리스트 추가</p>
        </div>

       
        {playlists.map((pl,i) => (
          <div key={i} className={styles.playlistTile} onClick={()=>{navigate(`/playlist/${pl.playlistId}`)}}>
            <div
              className={styles.coverPlaceholder}
              style={{ backgroundImage: `url(${pl.coverImage})` }}
            />
            <p className={styles.tileTitle}>{pl.title}</p>
            <p className={styles.tileTrackCount}>{pl.trackCount}곡</p>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCancel}>
          <div
            className={styles.modalContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>새 플레이리스트</h2>

            <div className={styles.modalContent}>
               
              <div className={styles.coverPreview}>
                {preview ? (
                  <img src={preview} alt="커버 미리보기" className={styles.coverImg} />
                ) : (
                  <div className={styles.coverPlaceholder2}>
                   
                  </div>
                )}
              </div>

              <div className={styles.formArea}>
                 
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className={styles.fileInput}
                />

                <input
                  type="text"
                  className={styles.titleInput}
                  maxLength={20}
                  placeholder="플레이리스트 제목 (최대 20자)"
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                />

                <textarea
                  className={styles.descInput}
                  maxLength={40}
                  placeholder="플레이리스트 설명을 입력해주세요. (최대 40자)"
                  value={playlistContent}
                  onChange={(e) => setPlaylistContent(e.target.value)}
                />

                <div className={styles.publicCheck}>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                  />
                  <label>공개 설정</label>
                </div>
                <p className={styles.publicDesc}>
                  플레이리스트를 공유하려면 공개로 설정해 주세요.
                  <br />
                  공개 설정된 플레이리스트는 검색 결과에도 노출됩니다.
                </p>
              </div>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                취소
              </button>
              <button className={styles.addBtn} onClick={handleAdd}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylist;
