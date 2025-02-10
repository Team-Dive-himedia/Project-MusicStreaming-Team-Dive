import { Routes, Route, Link } from 'react-router-dom';
import styles from '../../css/main.module.css';
import { LoginPage } from './loginPage';

function Home({ menubar }) {
  return (
    <div className={styles.container}>
      
      
      <div className={`${styles.sidebar} ${menubar ? styles.open : ''}`}>
        <Link to='/' className={styles.link}>🏠</Link> <br />
        <Link to='/today' className={styles.link}>오늘의 인기차트</Link><br />
        <Link to='/playList' className={styles.link}>플레이리스트 모음</Link><br />
        <Link to='/menu1' className={styles.link}>메뉴1</Link><br />
        <Link to='/menu2' className={styles.link}>메뉴2</Link><br />
        <Link to='/menu3' className={styles.link}>메뉴3</Link><br />

        <div className={styles.sidebarEnd}>
          <Link to='/login' className={styles.linkEnd}>로그인</Link><br />
          <Link to='/sign-up' className={styles.linkEnd}>회원가입</Link><br />
        </div>
      </div>

      <div className={`${styles.main} ${menubar ? styles.move : ''}`}>
        <Routes>
          <Route path='/' element={<h4>메인페이지임</h4>} />
          <Route path='/today' element={<h4>오늘의 인기차트 페이지임</h4>} />
          <Route path='/playList' element={<h4>플리페이지임</h4>} />
          <Route path='/menu1' element={<h4>메뉴1 페이지임</h4>} />
          <Route path='/menu2' element={<h4>메뉴2 페이지임</h4>} />
          <Route path='/menu3' element={<h4>메뉴3 페이지임</h4>} />
          <Route path='/login' element={<LoginPage></LoginPage>} />
          <Route path='/sign-up' element={<h4>회원가입 페이지임</h4>} />
        </Routes>
      </div>
    </div>
  );
}

export { Home };
