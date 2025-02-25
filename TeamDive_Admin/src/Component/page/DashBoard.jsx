import React, {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";
import "../../style/dashboard.scss";




const DashBoard = () => {
    const [userCount, setUserCount] = useState(1200);
    const [musicCount, setMusicCount] = useState(5000);
    const [playCount, setPlayCount] = useState(10000);
    
    useEffect(()=>{

        setTimeout(()=>{
            setUserCount(2000);
            setMusicCount(7000);
            setPlayCount(13000);
        }, 2000);

    }, []);

    const chartData = [
        { name: "총 사용자", value: userCount },
        { name: "총 음원", value: musicCount },
        { name: "총 재생 수", value: playCount },
    ];

    


    return (
        <div className="dashBoard">                 

            
            
            <div className='chartContainer'>
                <h2>데이터 분석</h2>
                    <ResponsiveContainer width="90%" height={400} >
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="100%" stopColor="#1976d2" stopOpacity={1} /> 
                                    <stop offset="0%" stopColor="#1976d2" stopOpacity={0.8} /> 
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#0a192f" />
                            <XAxis dataKey="name" tick={{fill: "#0a192f", fontSize: 16 }} stroke="#0a192f"  /> 
                            <YAxis tick={{ fill: "#0a192f", fontSize: 16 }} stroke="#0a192f" domain={[0, 15000]} /> 
                            {/* <Tooltip /> */}
                            <Bar dataKey="value" fill="url(#barGlow)" barSize={50} style={{ filter: "drop-shadow(0px 0px 5px #1976d2)" }} > 
                            <LabelList dataKey="value" position="top" fill="#0a192f" fontSize={20} fontWeight="bold" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
            </div>
            {/* <div className="dashBoardCards">                         
                <div className="card"><h2>총 사용자</h2><p>{userCount.toLocaleString()}명</p></div>
                <div className="card"><h2>총 음원</h2><p>{musicCount.toLocaleString()}곡</p></div>
                <div className="card" ><h2>총 재생 수</h2><p>{playCount.toLocaleString()}화</p></div>               
            </div> */}



        </div>
    );
}

export default DashBoard
