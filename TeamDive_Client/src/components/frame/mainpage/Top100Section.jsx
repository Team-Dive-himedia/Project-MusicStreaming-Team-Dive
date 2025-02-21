import React from 'react';
import styles from '../../../css/mainPage/mainPage.module.css';
import { Link } from 'react-router-dom';

const Top100Section = () => {
  // 더미 데이터: 실제 TOP 100 데이터로 대체 가능
  const top100Dummy = Array.from({ length: 100 }, (_, i) => ({
    musicId: i + 1,
    title: `TOP 100 곡 ${i + 1}`,
    artist: { name: `아티스트 ${i + 1}` }
  }));

  
  const displayItems = top100Dummy.slice(0, 10);

  return (
    <div className={styles.top100Section}>
      <header className={styles.top100Header}>
        <h2 className={styles.top100Title}>🎉 오늘의 TOP 100 🎉</h2>
        <Link to={"/top100"}>
        <button className={styles.moreButtonTop100}>전체보기</button>
        </Link>
      </header>
      <table className={styles.listTrackList}>
        <thead>
          <tr>
            <th>순위</th>
            <th>곡</th>
            <th>아티스트</th>
            <th>듣기</th>
            <th>재생목록</th>
            <th>옵션</th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item) => (
            <tr key={item.musicId}>
              <td>{item.musicId}</td>

              <td>{item.title}</td>
              <td>{item.artist.name}</td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => alert(`듣기: ${item.title}`)}
                >
                  듣기
                </button>
              </td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => alert(`재생목록에 추가: ${item.title}`)}
                >
                  추가
                </button>
              </td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => alert(`옵션: ${item.title}`)}
                >
                  옵션
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Top100Section;
