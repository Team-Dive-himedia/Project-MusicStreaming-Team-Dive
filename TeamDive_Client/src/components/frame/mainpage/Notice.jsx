
import React, { useState, useEffect } from 'react';
import styles from '../../../css/mainPage/notice.module.css';

function NoticeRotator() {
  const notices = [
    '공지사항 111111111111111111111',
    '가나다라 마바사 아자차카 타파하',
    '공지사항 333',
    '공지사항 444444444',
    '공지사항 55555555555555555555555555555555555',
    '공지사항 6',

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 1500);
    return () => clearInterval(intervalId);
  }, [notices.length]);

  
  const TextCut = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div className={styles.noticeContainer}>
      <span className={styles.noticeLabel}>공지사항 </span>
      <span className={styles.noticeText} key={currentIndex}>
        {TextCut(notices[currentIndex], 13)}
      </span>
    </div>
  );
}

export default NoticeRotator;
