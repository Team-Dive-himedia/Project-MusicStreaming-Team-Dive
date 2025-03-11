import jaxios from "../../../util/JwtUtil";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef  } from "react";
import { Card, CardContent } from "../../../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import "../../../style/StreamingChart.scss";

const StreamingChart = ({ isSmall = false, onClick  }) => {
  const [streamingStats, setStreamingStats] = useState([]);
  const [viewType, setViewType] = useState("daily"); // ✅ daily, monthly, yearly
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();



  // ✅ startDate 및 endDate 계산 (일별일 때는 항상 1일부터 31일까지)
  const { startDate, endDate } = useMemo(() => {
    const endDate = new Date(currentDate);
    

    let startDate;


    switch (viewType) {
      case "daily":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1); // 📌 매월 1일부터
        break;
      case "monthly":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case "yearly":
        startDate = new Date(endDate.getFullYear() - 10, 0, 1);
        break;
      default:
        startDate = new Date(endDate);
    }

    return { startDate, endDate };
  }, [viewType, currentDate]);

  // ✅ 차트 제목 설정 (연도, 월 추가)
  const chartTitle = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    if (viewType === "daily") return `📈 ${year}년 ${month}월 스트리밍 통계`;
    if (viewType === "monthly") return `📈 ${year}년 스트리밍 통계`;
    return `📈 최근 10년 스트리밍 통계`;
  }, [viewType, currentDate]);
  

  // ✅ 데이터 가져오기
  useEffect(() => {
    fetchStreamingData();
  }, [startDate, endDate]);

  

  const fetchStreamingData = async () => {
    try {
      setLoading(true);
      console.log("📊 백엔드 데이터 가져오는 중...");

      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      console.log(`📅 요청: ${viewType} | 기간: ${startDateStr} ~ ${endDateStr}`);

      const response = await jaxios.get( `/api/stats/daily?type=${viewType}&startDate=${startDateStr}&endDate=${endDateStr}`);

      console.log(`✅ ${viewType} 데이터:`, response.data);

      let stats = response.data.map((item) => ({
        date: item.date,
        totalPlayCount: item.totalPlayCount ?? 0,
      }));

      // ✅ 일별일 때 31개로 맞추기
      if (viewType === "daily") {
        stats = ensure31Days(stats);
      }

      setStreamingStats(stats);
    } catch (error) {
      console.error("❌ 백엔드 데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 31개 데이터 강제 유지
  const ensure31Days = (data) => {
    let result = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    for (let i = 0; i < 31; i++) {
      const date = new Date(firstDay);
      date.setDate(i + 2);
      const dateStr = date.toISOString().split("T")[0];

      // 📌 데이터가 있으면 사용, 없으면 0으로 채우기
      const existingData = data.find((item) => item.date === dateStr);
      result.push({
        date: dateStr,
        totalPlayCount: existingData ? existingData.totalPlayCount : 0,
      });
    }

    return result;
  };

  // ✅ 기간 이동 로직 (한 달 단위 이동)
  const changeDate = (delta) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);

      if (viewType === "daily") newDate.setMonth(newDate.getMonth() + delta);
      else if (viewType === "monthly") newDate.setFullYear(newDate.getFullYear() + delta);
      else newDate.setFullYear(newDate.getFullYear() + delta * 10);

      return newDate;
    });
  };

  // ✅ X축 날짜 형식 변경 (일자만 표시)
  const formatXAxis = (dateStr) => {
    if (viewType === "daily") {
      return dateStr.split("-")[2]; // "YYYY-MM-DD" → "DD"
    }else if(viewType === "monthly") {
      return dateStr.split("-")[1]; 
    }if(viewType === "yearly") {
      return dateStr.split("-")[0];  
    }
    return dateStr;
  };



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);








    return (
      <div className={`chart-container ${isSmall ? "small-chart" : ""}`} onClick={isSmall ? onClick : undefined}>

      {/* ✅ 버튼 영역 (isSmall 상태일 때 숨김) */}
      {!isSmall && (
        <div className="chart-controls">
          <div className="view-type-buttons">
            {["daily", "monthly", "yearly"].map((type) => (
              <button key={type} className={viewType === type ? "active" : ""} onClick={() => setViewType(type)}>
                {type === "daily" ? "일별" : type === "monthly" ? "월별" : "연도별"}
              </button>
            ))}
          </div>

          <div className="pagination-controls">
            <button onClick={() => changeDate(-1)} className="pagination-btn">◀ 이전</button>
            <span>{viewType === "daily" ? `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월` : `${currentDate.getFullYear()}년`}</span>
            <button onClick={() => changeDate(1)} className="pagination-btn">다음 ▶</button>
          </div>
        </div>
      )}


  
      <div className="chart-wrapper">
          <h2 className="chart-title">{chartTitle}</h2>
          <ResponsiveContainer width="100%" height={isSmall ? 250 : 300} shouldUpdate={false}>
            {loading ? <p className="loading-text">📊 데이터 로딩 중...</p> : (
              <BarChart data={streamingStats}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={formatXAxis} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
                <Legend />
                <Bar dataKey="totalPlayCount" fill="#ff7300" animationDuration={300} animationEasing="ease-out" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
    </div>
    );
};

export default StreamingChart;
