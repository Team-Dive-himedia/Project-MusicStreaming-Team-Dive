import React, { useEffect, useState } from "react";
import styles from "../../css/chartMore.module.css";
import axios from "axios";
import Pagination from "../Pagination";
import { useNavigate } from "react-router-dom";

const Top100 = () => {
  // 체크된 곡들을 저장할 상태
  const [selectedItems, setSelectedItems] = useState([]);
  const [monthlyCharts,setMonthlyCharts]=useState([]);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = monthlyCharts.slice(indexOfFirstItem, indexOfLastItem);



  useEffect(
    ()=>{
      axios.get('/api/music/getMusicChart')
        .then((result)=>{
        console.log(result.data);
        setMonthlyCharts(result.data.Top100MonthnoKor);
      }).catch((err)=>{ console.error(err);})
    },[]
  );
  // 체크박스 변경 처리
  const handleCheckboxChange = (music, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, music]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item.rank !== music.rank));
    }
  };
  const handleSelectedListen = () => {
    alert(
      "선택된 곡 듣기: " + selectedItems.map((item) => item.title).join(", ")
    );
  };
  const handleSelectedAdd = () => {
    alert(
      "선택된 곡 재생목록에 추가: " +
        selectedItems.map((item) => item.title).join(", ")
    );
  };
  const handleSelectedBuy = () => {
    alert(
      "선택된 곡 구매: " + selectedItems.map((item) => item.title).join(", ")
    );
  };
  return (
    <div className={styles.container}>
      {/* 상단 영역 */}
      <div className={styles.header}>
        <h1 className={styles.title}>해외 인기차트</h1>
        <div className={styles.buttonGroup}>
          {selectedItems.length === 0 ? (
            // 선택된 곡이 없으면 기존 버튼들
            <>
              <button className={styles.actionBtn}>전체듣기</button>
              <button className={styles.actionBtn}>플리 추가</button>
            </>
          ) : (
            // 하나라도 체크되면 보이는 버튼들
            <>
              <button className={styles.actionBtn} onClick={handleSelectedListen}>
                선택 듣기
              </button>
              <button className={styles.actionBtn} onClick={handleSelectedAdd}>
                선택 플리에 추가
              </button>
              <button className={styles.actionBtn} onClick={handleSelectedBuy}>
                선택 구매
              </button>
            </>
          )}
        </div>
      </div>
      {/* 테이블 영역 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th className={styles.rankColumn}>순위</th>
            <th>곡</th>
            <th>아티스트</th>
            <th>듣기</th>
            <th>재생목록</th>
            <th>MP3</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((music, index) => {
            const isChecked = selectedItems.some(
              (item) => item.music.musicId === music.music.musicId
            );
            return (
              <tr key={music.music.musicId}>
                <td>
                    <label className={styles.customCheckbox}>
                        <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                            handleCheckboxChange(music, e.target.checked)
                        }
                        />
                        <span className={styles.checkmark}></span>
                    </label>
                </td>
                <td className={styles.rankColumn}>{index+1}</td>
                <td onClick={()=>{navigate(`/music/${music.music.musicId}`)}} style={{cursor: "pointer"}}>{music.music.title}</td>
                <td onClick={()=>{navigate(`/artist/${music.music.artistId}`)}} style={{cursor: "pointer"}}>{music.music.artistName}</td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => alert(`듣기: ${music.music.title}`)}
                  >
                    듣기
                  </button>
                </td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => alert(`재생목록에 추가: ${music.music.title}`)}
                  >
                    추가
                  </button>
                </td>
                <td>
                  <button
                    className={styles.optionBtn}
                    onClick={() => alert(`구매: ${music.music.title}`)}
                  >
                    구매
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination
        totalCount={monthlyCharts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
export default Top100;