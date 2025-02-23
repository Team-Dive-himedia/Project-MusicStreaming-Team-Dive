import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddMusicModal from "./AddMusicModal";
import axios from "axios";
import { format } from "date-fns";
import "../../../style/addAlbum.scss";
import jaxios from '../../../util/JwtUtil';

const UpdateAlbum = ( {getAlbumList}) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [artist, setArtist] = useState([]);
    const { albumId } = useParams();
    // const [album, setAlbum] = useState(null);
    const [searchArtist, setSearchArtist] = useState(""); // 입력값 상태
    const [filteredArtists, setFilteredArtists] = useState([]); // 필터링된 가수 목록
    const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 표시 여부




    const [updateAlbum, setUpdateAlbum] = useState({
        title: "",
        image: "/images/default_image.jpg",
        albumId: null,
        artistId: null,
        musicList: [],
        indate: format(new Date(), "yyyy-MM-dd"),
        trackNumber: 0,
    });



    





    /** ✅ 앨범 정보 불러오기 */
    
        const getAlbum = async () => {
            try {
                const response = await axios.get(`/api/music/getAlbum?albumId=${albumId}`);
                const albumData = response.data.album;
                if (albumData) {
                    setUpdateAlbum({
                        title: albumData.title || "",
                        image: albumData.image || "/images/default_image.jpg",
                        albumId: albumData.albumId || null,
                        artistId: albumData.artistId ? String(albumData.artistId) : "",
                        artistName: albumData.artistName || "",
                        musicList: albumData.musicList || [],
                        indate: albumData.indate || format(new Date(), "yyyy-MM-dd"),
                        trackNumber: albumData.trackNumber || 0,
                    });
                    setSearchArtist(albumData.artistName || ""); // 가수 이름 초기 설정
                }
            } catch (error) {
                console.error("앨범 정보를 불러오는 중 오류", error);
                alert("앨범 정보를 불러오는 중 오류");
            }
        };


    useEffect(() => {

        if (albumId) getAlbum();
    }, [albumId, ]);
    




    /** 가수 목록 불러오기 */
    useEffect(()=> {
        const getArtistList = async () => {
            try{
                const response = await axios.get("/api/music/getAllArtist");
                setArtist(response.data.artist || response.data.artists || []);
            }catch(error){
                console.error("아티스트 목록을 불러오는 중 애러");
                alert("아티스트 목록을 불러오는 중 애러");
            }
        };
        getArtistList();
    }, []) ;

    


    /**가수 검색 기능 */
    const onSearchChange = (e)=> {
        const value = e.target.value;
        setSearchArtist(value);

        if(value === ""){
            setFilteredArtists([]);
            setShowDropdown(false);
            return;
        }

        const filtered = artist.filter((a) => 
            a.artistName.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredArtists(filtered);
        setShowDropdown(true);
    };


    /** 가수 선택 시 updateAlbum 업데이트 */
    const onSelectArtist = (selectedArtist) => {
        setUpdateAlbum((prev) => ({
            ...prev,
            artistId: selectedArtist.artistId,
            artistName: selectedArtist.artistName,
        }));
        setSearchArtist(selectedArtist.artistName);
        setShowDropdown(false);
    }


    /**입력값 변경 시 updateAlbum 업데이트 */
    const onChange = (e) => {
        setUpdateAlbum({ ...updateAlbum, [e.target.name]: e.target.value });
    };


    /** 이미지 업로드 */
    const onImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await axios.post("/api/music/imageUpload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUpdateAlbum((prev) => ({ ...prev, image: response.data.image }));
        } catch (error) {
            console.error("이미지 업로드 실패", error);
            alert("이미지 업로드 실패");
        }
    };

    /** 음악 추가 */
    const addMusic = (newSong) => {
        setUpdateAlbum((prev) => {
            const maxTrackNumber = prev.musicList.length > 0 
            ? Math.max(...prev.musicList.map((song) => song.trackNumber)) 
            : 0;
            return {
                ...prev,
                musicList: [
                    ...prev.musicList,
                    {
                        ...newSong,
                        artistId: prev.artistId,
                        trackNumber: maxTrackNumber === 0 ? 1 : maxTrackNumber + 1 , 
                        image: newSong.image || prev.image,

                    },
                ],
            };
        });
        setShowModal(false);
    };


    const checkTitleMusic = (index) => {
        setUpdateAlbum((prev) => ({
            ...prev,
            musicList: prev.musicList.map((song, i) => ({
                ...song,
                titleMusic: i === index, 
            })),
        }));
    };

    /** 앨범 정보 업데이트 */
    const onSubmit = async () => {
        if (!updateAlbum.title) return alert("앨범 제목을 입력하세요");
        if (!updateAlbum.artistId) return alert("가수를 선택하세요");
        if (updateAlbum.musicList.length === 0) return alert("노래를 추가하세요");

        try {
            let albumId = updateAlbum.albumId;
            if (!albumId) {
                const albumResponse = await axios.post("/api/music/updateAlbum", {
                    title: updateAlbum.title,
                    artist: { artistId: Number(updateAlbum.artistId) }, // artistId 변환
                    image: updateAlbum.image,
                });
                if(albumResponse.data.album ==="yes") {
                    albumId = albumResponse.data.album.albumId;
                    setUpdateAlbum((prev) => ({ ...prev, albumId }));
                } else{
                    return alert("앨범 등록 실패");
                }
            }

            for (const music of updateAlbum.musicList) {
                await axios.post("/api/music/insertMusic", {
                    ...music,
                    album: { albumId },
                    artist: { artistId: Number(updateAlbum.artistId) }, // artistId 변환
                });
            }
            alert("음원이 등록되었습니다!");
            navigate("/musicController/album");
        } catch (error) {
            console.error("음원 등록 실패:", error);
            alert("등록 중 오류 발생");
        }
    };




    const deleteMusic = async (music) => {
        if (!window.confirm("정말로 삭제하시겠습니까?")) return;

        try{
            const response = await axios.post("/api/music/deleteMusic", music);

            if (response.data.msg === "yes") {
                alert("음악이 삭제되었습니다!");

                setUpdateAlbum((prev) => {
                    // 1️⃣ 삭제된 곡을 제외한 리스트 필터링
                    const filteredMusicList = prev.musicList.filter((m) => m.musicId !== music.musicId);
    
                    // 2️⃣ 트랙 번호를 1부터 다시 부여
                    const reindexedMusicList = filteredMusicList.map((m, index) => ({
                        ...m,
                        trackNumber: index + 1,
                    }));
    
                    // 3️⃣ 첫 번째 곡을 타이틀 곡으로 설정 (리스트가 비어있지 않을 경우)
                    if (reindexedMusicList.length > 0) {
                        reindexedMusicList[0].titleMusic = true;
                    }
                    console.log("🛠 삭제 후 갱신된 musicList:", reindexedMusicList);
    
                    // ✅ 최종적으로 한 번만 상태 업데이트
                    return {
                        ...prev,
                        musicList: reindexedMusicList,
                    };
               
            });
            
            setTimeout(() => {
                getAlbum();
            }, 300);

            } else {
                alert("음악 삭제 실패!");
            }

        }catch(error){
            console.error("음악 삭제 실패:", error);
            alert("음악 삭제중 오류 발생");
        }

        
    };


    return (
        <div className="mainContainer">
            <div className="contentBox">
                <div className="topBox">
                    <div className="imageUploadContainer">
                        <input type="file" id="imageUpload" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
                        <img src={updateAlbum.image} alt="앨범 커버" className="albumCover"  onClick={() => document.getElementById("imageUpload").click()} />
                    </div>

                    <div className="musicInfo">
                        <input type="text"  name="title" value={updateAlbum.title} onChange={onChange} placeholder="앨범 제목" />

                        <div className="artist-autocomplete">
                            <input type="text" placeholder="가수 검색" value={searchArtist} onChange={onSearchChange} onFocus={() => setShowDropdown(true)} />
                            {showDropdown && filteredArtists.length > 0 && (
                                <ul className="dropdown">
                                    {filteredArtists.map((a) => (
                                        <li key={a.artistId} onClick={() => onSelectArtist(a)}>
                                            {a.artistName}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input type="date" name="indate" value={updateAlbum.indate} onChange={onChange} required />    

                    </div>
                </div>

                <div className="bottomBox">
                    <button className="addMusicBtn" onClick={() => setShowModal(true)}>+ 노래 추가</button>
                    {showModal && <AddMusicModal onClose={() => setShowModal(false)} onAddMusic={addMusic} albumId={updateAlbum.albumId} artistId={updateAlbum.artistId} />}
                    
                </div>

                <table className="musicTable">
                    <thead>
                        <tr>
                            <th>타이틀</th>
                            <th>번호</th>
                            <th>제목</th>
                            <th>장르</th>
                            <th>파일</th>
                            <th>삭제</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {updateAlbum.musicList.length === 0 ? (
                            <tr>
                                <td colSpan="6">등록된 노래가 없습니다.</td>
                            </tr>
                        ) : (                          
                            updateAlbum.musicList.map((music, index) => (
                                <tr key={music.musicId}>
                                    <td><input type="checkbox"checked={music.titleMusic}onChange={() => checkTitleMusic(index)} />
                                    </td>
                                    <td>{index + 1}</td>
                                    <td>{music.title}</td>
                                    <td>{music.genre}</td>
                                    <td>
                                        {music.bucketPath ? (
                                            <audio controls>
                                            <source src={music.bucketPath} type="audio/mpeg" />
                                            브라우저가 오디오 태그를 지원하지 않습니다.
                                            </audio>
                                        ) : (
                                            "파일 없음"
                                        )}
                                    </td>
                                    <td>
                                        <button className="deleteBtn" onClick={() => deleteMusic(music)}>🗑</button>  
                                    </td>                                  
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="bottomBox">             
                    <button type="submit" className="btn submitBtn" onClick={onSubmit}>등록</button>
                    <button type="button" className="btn cancelBtn" onClick={() =>navigate("/musicController/album")}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAlbum;
