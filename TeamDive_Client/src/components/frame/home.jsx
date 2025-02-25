import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styles from '../../css/home.module.css';
import AppRoutes from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import { useEffect } from 'react';
import { logoutAction } from '../../store/UserSlice';

function Home({ menubar, mood, setMood}) {

    const loginUser = useSelector( state => state.user );
    const dispatch = useDispatch(); 
    const cookies = new Cookies();
    const navigate = useNavigate();

    useEffect(
        () => {
            console.log('loginUser', loginUser)
            //console.log(document.cookie);

        }
    )

    function onLogout(){
        cookies.remove('user');
        dispatch( logoutAction() );
        alert('로그아웃 되었습니다.');
        navigate('/')
    }

    return (
        <div className={styles.container}>
          
          
            <div className={`${styles.sidebar} ${menubar ? styles.open : ''}`}>
                <Link to='/' className={styles.link}>🏠</Link> <br />
                <Link to='/charts' className={styles.link}>오늘의 인기차트</Link><br />
                <Link to='/playList' className={styles.link}>플레이리스트 모음</Link><br />
                <Link to='/storage' className={styles.link}>보관함</Link><br />
                <Link to='/membership/all' className={styles.link}>멤버십</Link><br />
                
                <Link to='/mypage/myPageMain' className={styles.link}>마이페이지</Link><br />
                <div className={styles.sidebarEnd}>
                    {
                        (loginUser.memberId)?(
                            <div className={styles.userInfo}>
                                <div className={styles.userDetails}>
                                    <span className={styles.nickname}>{loginUser.nickname}</span>
                                    &nbsp;&nbsp;
                                    <span className={styles.memberId}>({loginUser.memberId})</span>
                                </div>
                                <button onClick={onLogout} className={styles.logoutButton}>로그아웃</button>
                                </div>
                        ) : (
                            <>
                                <Link to='/login' className={styles.authLink}>로그인</Link><br />
                                <Link to='/sign-up' className={styles.authLink}>회원가입</Link><br />        
                            </>
                        )
                    }

                </div>
            </div>

            <div className={`${styles.main} ${menubar ? styles.move : ""}`}>
                <AppRoutes mood={mood} setMood={setMood}/>  
            </div>
        </div>
    );
}

export { Home };
