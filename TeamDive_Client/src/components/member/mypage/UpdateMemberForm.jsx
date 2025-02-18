import React,{ useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jaxios from '../../../util/JwtUtil'
import { useSelector, useDispatch } from 'react-redux'
import mypageStyle from '../../../css/mypage/mypage.module.css'

const UpdateMemberForm = () => {

    const navigate = useNavigate();

    const loginUser = useSelector(state=>state.user);
    
    

    function confirm(){

    };

    return (
        <div className={mypageStyle.updateMemberForm}>
            <h1>회원정보수정 FORM</h1>
            <div>
                <img src={`http://localhost:8070/profileImage/${loginUser.image}`}/>
                <input type='file' />
            </div>
            <div>
                <label>아이디</label>
                <input type='text' value={loginUser.memberId} readOnly/>
            </div>
            <div>
                <label>패스워드</label>
                <input type='text'/>
                <input type='text'/>
            </div>
            <div>
                <label>전화번호</label>
                <input type='text'/>
            </div>
            <div>
                <label>닉네임</label>
                <input type='text'/>
            </div>
            <div>
                <label>우편번호</label>
                <input type='text'/>
                <button type='button' onClick={()=>{

                }}>검색</button>
            </div>
            <div>
                <label>주소</label>
                <input type='text'/>
            </div>
            <div>
                <label>상세주소</label>
                <input type='text'/>
            </div>
            <div>
                <label>추가주소</label>
                <input type='text'/>
            </div>
            <div>
                <label>소개</label>
                <input type='text'/>
            </div>
            <div>
                <button type='button' onClick={()=>{
                    confirm();
                }}>수정</button>
                <button type='button' onClick={()=>{
                    navigate(-1);
                }}>뒤로</button>
            </div>
        </div>
    )
}

export default UpdateMemberForm
