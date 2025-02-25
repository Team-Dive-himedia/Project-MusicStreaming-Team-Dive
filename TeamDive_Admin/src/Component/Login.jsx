import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { loginAction } from "../store/UserSlice";
import "../style/login.scss";

 const Login = () => {
    const [userid, setUserid] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [error, setError] = useState("");

    const onLogin = () => {
        if (userid === "1234" && password === "1234") {
            const userData = {
                member_id: userid,
                name: "1번 운영자"
            };

            dispatch(loginAction(userData));
            navigate("/dashboard"); 
        } else {
            setError("아이디 또는 비밀번호가 잘못되었습니다."); 
            
        }
    };

    return (
        <div className="loginBack">
        <motion.div className="loginContainer" initial={{ opacity: 0, y: -200 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h2>Admin Login</h2>
            <input type="text" placeholder="아이디 입력" value={userid} onChange={(e) => {
                setUserid(e.target.value)}}/>
            <input type="password" placeholder="비밀번호 입력" value={password} onChange={(e) => {
                setPassword(e.currentTarget.value)}}/>
                {error && <p className="errorMessage">{error}</p>}
            <motion.button onClick={onLogin} >로그인</motion.button>
        </motion.div>
        </div>
    );
}

export default Login

