import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../../../style/music.scss";
import AddArtistModal from './AddArtistModal';
import UpdateArtistModal from './UpdateArtistModal';
import jaxios from '../../../util/JwtUtil';

const Artist = () => {
    const [artistList, setArtistList] = useState([]);
    const [search, setSearch] = useState("");
    const [insertModal, setInsertModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    const onSearch = (e) => { setSearch(e.target.value); };

    const formatDate = (dateString) => {
        return format(new Date(dateString), "yyyy-MM-dd");
    };

    

    // 전체 가수 목록 불러오기
    const getArtistList = async () => {
        try {
            const response = await axios.get("/api/music/getAllArtist"); 
            const artistListData = response.data.artist || []; 
            setArtistList(artistListData);
            
        } catch (error) {
            console.error("가수 목록 불러오기 실패:", error);
        }
    };

    useEffect(() => {

        getArtistList();
    }, []);

    // 가수 추가 후 리스트 갱신
    const addArtistToList = async (newArtist) => {
        await getArtistList();
        if (!newArtist || !newArtist.artistId) {
            console.error("❌ 유효하지 않은 가수 데이터:", newArtist);
            return;
        }
        try {
            const response = await axios.get(`/api/music/getArtist?artistId=${newArtist.artistId}`);
            const artistData  = response.data.artist;
            if (artistData) {
                setArtistList(prev => [...prev, artistData]);
            } else {
                console.error("❌ 응답 데이터에 가수 정보 없음:", response.data);
            }
        } catch (error) {
            console.error("❌ 새로운 가수 정보 불러오기 실패:", error);
        }
    };

 //--------------------------------------------------------------------------
    const openUpdateModal = async (artistId) => {
        try{
            const response = await axios.get(`/api/music/getArtist?artistId=${artistId}`);
            setSelectedArtist(response.data.artist);
            setUpdateModal(true);
        } catch(error) {
            console.error("가수 정보 불러오기 실패:", error)
        }
    };

    
 //--------------------------------------------------------------------------
    const deleteArtist = async (artistId) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;

        try{
            const response = await axios.delete(`/api/music/deleteArtist`,{data: {artistId}});
            if(response.data.msg === "yes"){
                alert("삭제 완료!");
                setArtistList(prev => prev.filter(artist => artist.artistId !== artistId));
            }else{
                alert("삭제 실패");
            }
        }catch(error){
            console.error("가수 삭제 오류:", error);
            alert("삭제 중 오류 발생");
        }

    };


    



    const searchFilter = search === "" ? artistList : artistList.filter(artist =>
        
        artist.artistName.toLowerCase().includes(search.toLowerCase()) ||   
        artist.country.toLowerCase().includes(search.toLowerCase())
        
    );


    return (
        <div className={"musicPage"}>          
        <div className="musicContent">
        <h1>가수 관리</h1>
            <div className='top2' >
            <input type="text" className="searchInput" placeholder="가수 검색(이름, 국적)" value={search} onChange={onSearch}/>
            <button className="addMusicButton" onClick={() => setInsertModal(true)}>가수 등록</button>   
            </div>   
            {insertModal && <AddArtistModal onClose={() => setInsertModal(false)} addArtistToList={addArtistToList} />}
            {updateModal && <UpdateArtistModal onClose={()=> setUpdateModal(false)} artist={selectedArtist} getArtistList={getArtistList} />}   
                <table>
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>국적</th>                         
                            <th>데뷔일</th>
                            <th>이미지</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {artistList.length === 0 ? ( 
                            <tr><td colSpan="4" className="noData">등록된 가수가 없습니다.</td></tr>
                        ) : searchFilter.length === 0 ? (
                            <tr><td colSpan="4" className="noData">검색 결과가 없습니다.</td></tr>
                        ) : ( 
                            searchFilter.map((artist, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="clickable" onClick={() => openUpdateModal(artist.artistId)}>
                                            {artist.artistName}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="clickable" onClick={() => openUpdateModal(artist.artistId)}>
                                            {artist.country}
                                        </span>
                                    </td>                               
                                    <td>{formatDate(artist.debut)}</td>
                                    <td><img src={artist.image} alt="가수 이미지" width="50" /></td>
                                    <td>
                                    <button className="deleteBtn" onClick={() => deleteArtist(artist.artistId)}>🗑 삭제</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>                                    
            </div>
        </div>
    );
};

export default Artist
