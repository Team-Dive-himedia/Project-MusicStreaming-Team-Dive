import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import updatePasswordStyle from '../../css/updatePasswordStyle.module.css';


const ForgottenPassword = ({setPwdModal}) => {

    const navigate = useNavigate();

    const [memberId, setMemberId] = useState('');
    const [email, setEmail] = useState('');

    const [emailVerified,setEmailVerified] = useState(false);

    async function findByMemberId() {

        try {
            let result = await axios.get('/api/member/findByMemberId', { params: { memberId } });

            if (result.data.msg === 'yes') {
                alert('아이디가 확인되었습니다.');
            } else {
                alert('조회한 아이디는 없는 아이디입니다.');
                if (window.confirm('회원가입 하시겠습니까?')) {
                    navigate('/sign-up'); // 회원가입 페이지로 이동
                }
            }
        } catch (err) {
            alert('비밀번호 초기화 중 오류가 발생했습니다. 관리자에게 문의하세요.');
            console.error('비밀번호 초기화 오류:', err);
        }
    }

    async function emailCheckForPassword(){
        if(!email){return alert('회원가입시 인증된 이메일을 입력해주세요.')}
        try{
            const result =await axios.get('/api/member/emailCheckForPassword', {params:{memberId, email}})

            if(result.data.msg === 'yes'){
                alert('인증되었습니다.');
                setEmailVerified(true);
            }else{
                alert('입력하신 이메일은 회원가입시 입력한 이메일과 다릅니다.');
            }

        }catch(err){
            console.error(err);
        }
    }

    async function sendEmailForPassword(memberId, email) {
        try {
            // 임시 비밀번호 발급 여부 확인
            if (!window.confirm('임시 비밀번호를 발급받으시겠습니까?')) {
                return;
            }

            // memberId와 email 유효성 검사
            if (!memberId || !email) {
                alert('회원 정보 또는 이메일이 잘못되었습니다.');
                return;
            }

            // 임시 비밀번호 이메일 발송 요청
            let result = await axios.post('/api/member/sendEmailForPassword', null, { params: { memberId, email } });

            if (result.data.msg === 'yes') {

                alert('임시비밀번호가 발급되었습니다. 이메일을 확인하세요.');
                navigate('/login');
            }
            else {
                // 임시 비밀번호 발급 실패
                alert('임시 비밀번호 발급에 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }




    return (
        <div className={updatePasswordStyle.forgottenPasswordContainer}>
            <h1 className={updatePasswordStyle.forgottenPasswordTitle}>비밀번호 찾기</h1>

            <div className={updatePasswordStyle.inputGroup}>
                <label className={updatePasswordStyle.forgottenPasswordLabel}>아이디</label>
                <div className={updatePasswordStyle.inputWithButton}>
                    <input type="text" value={memberId} onChange={(e) => setMemberId(e.target.value)} className={updatePasswordStyle.forgottenPasswordInput} />
                    <button className={updatePasswordStyle.forgottenPasswordButton} onClick={findByMemberId}>확인</button>
                </div>
            </div>

            <div className={updatePasswordStyle.inputGroup}>
                <label className={updatePasswordStyle.forgottenPasswordLabel}>이메일 인증</label>
                <div className={updatePasswordStyle.inputWithButton}>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={updatePasswordStyle.forgottenPasswordInput} />
                    <button className={updatePasswordStyle.forgottenPasswordButton} onClick={emailCheckForPassword}>인증</button>
                </div>
            </div>

            {emailVerified && (
                <button className={updatePasswordStyle.forgottenPasswordButton2} onClick={() => sendEmailForPassword(memberId, email)}>임시 비밀번호 발급</button>
            )}

            <button className={updatePasswordStyle.forgottenPasswordClose} onClick={() => setPwdModal(false)}>닫기</button>
        </div>

    )
}

export default ForgottenPassword
