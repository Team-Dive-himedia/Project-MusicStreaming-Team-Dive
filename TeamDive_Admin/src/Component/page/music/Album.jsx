import React, { useEffect, useState, useMemo, useCallback  } from 'react'
import axios from 'axios'
import jaxios from '../../../util/JwtUtil';
import { useNavigate } from "react-router-dom";
import "../../../style/music.scss";


const Music = () => {
    const [albumList, setAlbumList] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState(null);



    const onSearch = (e) => {
        setSearch(e.target.value);
    };





    const getAlbumList = async () => {
        try {
            const response = await axios.get("/api/music/getAllAlbum");
            setAlbumList(response.data.album);
            console.log("🎵 앨범 리스트 불러오기 성공:", response.data.album);
        } catch (error) {
            console.error("앨범 목록을 불러오지 못했습니다:", error);
        }
    };

    useEffect(() => {
        getAlbumList();
    }, []);

    useEffect(() => {
        
    }, [albumList]); 


    const openUpdateModal = async (albumid) => {
        try{
            const response = await axios.get(`/api/music/getAlbum?albumid=${albumid}`);
            setSelectedAlbum(response.data.album);
            setUpdateModal(true);
        } catch(error) {
            console.error("앨범 정보 불러오기 실패:", error)
        }
    };

    const deleteAlbum = async (albumid) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;
        try{
            const response = await axios.delete(`/api/music/deleteAlbum`,{data: {albumid}});
            if(response.data.msg === "yes"){
                alert("삭제 완료!");
                setAlbumList(prev => prev.filter(album => album.albumid !== albumid));
            }else{
                alert("삭제 실패");
            }
        }catch(error){
            console.error("앨범 삭제 오류:", error);
            alert("삭제 중 오류 발생");
        }

    };




    const searchFilter = search === "" ? albumList : albumList.filter(album =>    
        album.title.toLowerCase().includes(search.toLowerCase())    

    );
    


    return (
        <div className={"musicPage"}>          
            <div className="musicContent">
            <h1>음원 관리</h1>
                <div className='top2' >
                <input type="text" className="searchInput" placeholder="음원 검색 (제목 또는 장르)" value={search} onChange={onSearch}/>
                <button className="addMusicButton" onClick={() => navigate("/AddAlbum")}>앨범 추가</button>   
                </div>   
                    <table>
                        <thead>
                            <tr>
                                <th>가수</th>
                                <th>앨범</th>                         
                                <th>이미지</th>
                            </tr>
                        </thead>
                        <tbody>
                            {albumList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="noData">등록된 음원이 없거나 검색 결과가 없습니다.</td>
                                </tr>
                            ) : (                 
                                searchFilter.length === 0 ? ( 
                                    <tr><td colSpan="4" className="noData">등록된 가수가 없습니다.</td></tr>
                                ) : searchFilter.length === 0 ? (
                                    <tr><td colSpan="4" className="noData">검색 결과가 없습니다.</td></tr>
                                ) : ( 
                                    searchFilter.map((album, index) => (
                                        <tr key={index}>
                                                <td></td>
                                                <td>
                                                    <span className="clickable" onClick={() =>  navigate(`/UpdateAlbum/${album.albumId}`)}>
                                                        {album.title}
                                                    </span>
                                                    </td>                               
                                                <td>
                                                    <img src={album.image} alt={album.title} width="50" />
                                                </td>
                                                <td>
                                                    <button className="deleteBtn" onClick={() => deleteAlbum(album.albumId)}>🗑 삭제</button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}

                        </tbody>
                    </table>                         
            </div>  
        </div>
    );
};

export default Music
