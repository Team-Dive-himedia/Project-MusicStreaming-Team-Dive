// src/components/NoticeBoard.jsx
import React from 'react';
import styles from '../../../css/mainPage/noticeBoard.module.css';
import { useNavigate } from 'react-router-dom';

const NoticeBoard = ({ notice }) => {

    const navigate = useNavigate()

    return (
        <div className={styles.noticeBoard}>
            {notice.map(notice => (
                <div key={notice.noticeId} className={styles.noticeItem}
                    onClick={()=>{navigate(`/notice/${notice.noticeId}`)}}
                >
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                    <small>{notice.indate}</small>
                    
                </div>
            ))}
        </div>
    );
};

export default NoticeBoard;
