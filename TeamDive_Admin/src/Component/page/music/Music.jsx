import React, { useEffect, useState, useMemo, useCallback  } from 'react'
import axios from 'axios';
import jaxios from "../../../util/JwtUtil";
import { useNavigate } from "react-router-dom";
import "../../../style/music.scss";

const Music = () => {
    const [musicList, setMusicList] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const onSearch = (e) => {
        setSearch(e.target.value);
    };





    const getMusicList = async () => {
        try {
            const response = await axios.get("/api/music/getAllMusic");
            setMusicList(response.data.music);
            console.log("🎵 음악 리스트 불러오기 성공:", response.data.music);
        } catch (error) {
            console.error("음악 목록을 불러오지 못했습니다:", error);
        }
    };

    useEffect(() => {
        getMusicList();
    }, []);

    useEffect(() => {

    }, [musicList]); 


    const searchFilter = search === "" ? musicList : musicList.filter(music =>    
        music.title.toLowerCase().includes(search.toLowerCase()) ||   
        music.genre.toLowerCase().includes(search.toLowerCase())
        
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
                                <th>제목</th>                         
                                <th>장르</th>
                                <th>이미지</th>
                                <th>재생</th>
                            </tr>
                        </thead>
                        <tbody>
                            {musicList.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="noData">등록된 음원이 없거나 검색 결과가 없습니다.</td>
                                </tr>
                            ) : (                 
                                searchFilter.length === 0 ? ( 
                                    <tr><td colSpan="4" className="noData">등록된 가수가 없습니다.</td></tr>
                                ) : searchFilter.length === 0 ? (
                                    <tr><td colSpan="4" className="noData">검색 결과가 없습니다.</td></tr>
                                ) : ( 
                                    searchFilter.map((music, index) => (
                                        <tr key={index}>
                                                <td></td>
                                                <td></td>
                                                <td>{music.title}</td>                               
                                                <td>{music.genre}</td>
                                                <td><img src={music.image} alt={music.title} width="50" /></td>
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
