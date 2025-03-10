import jaxios from '../../util/JwtUtil';
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Modal from 'react-modal';
import "../../style/dashboard.scss";

const Dashboard = () => {
  const [streamingStats, setStreamingStats] = useState([]);
  const [viewType, setViewType] = useState("daily"); // ✅ daily, monthly, yearly
  const [selectedDateData, setSelectedDateData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStreamingData();
  }, [viewType, currentDate]);

  const getStartEndDate = () => {
    const endDate = new Date(currentDate);
    let startDate;
    if (viewType === "daily") {
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 30);
    } else if (viewType === "monthly") {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    } else {
      startDate = new Date(endDate.getFullYear() - 10, 0, 1); // 최근 10년치 데이터
    }
    return { startDate, endDate };
  };

  const fetchStreamingData = async () => {
    try {
      setLoading(true);
      console.log("📊 백엔드 데이터 가져오는 중...");

      const { startDate, endDate } = getStartEndDate();
      const startDateStr = startDate.toISOString().split("T")[0];
      const endDateStr = endDate.toISOString().split("T")[0];

      console.log(`📅 요청: ${viewType} | 기간: ${startDateStr} ~ ${endDateStr}`);

      const response = await jaxios.get(`/api/stats/daily?type=${viewType}&startDate=${startDateStr}&endDate=${endDateStr}`);
      console.log(`✅ ${viewType} 데이터:`, response.data);

      setStreamingStats(response.data.map(item => ({
        date: item.date,
        totalPlayCount: item.totalPlayCount ?? 0,
      })).reverse());
    } catch (error) {
      console.error("❌ 백엔드 데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPeriod = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewType === "daily") newDate.setDate(newDate.getDate() - 30);
      else if (viewType === "monthly") newDate.setFullYear(newDate.getFullYear() - 1);
      else newDate.setFullYear(newDate.getFullYear() - 10);
      return newDate;
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (viewType === "daily") newDate.setDate(newDate.getDate() + 30);
      else if (viewType === "monthly") newDate.setFullYear(newDate.getFullYear() + 1);
      else newDate.setFullYear(newDate.getFullYear() + 10);
      return newDate;
    });
  };

  const getChart = () => (
    <BarChart data={streamingStats}>
      <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
      <YAxis stroke="#555" tick={{ fontSize: 12 }} />
      <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
      <Legend wrapperStyle={{ paddingBottom: 10 }} />
      <Bar dataKey="totalPlayCount" fill="#ff7300" />
    </BarChart>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">📊 관리자 대시보드</h1>

        {/* ✅ 조회 타입 선택 버튼 */}
        <div className="dashboard-controls">
          <button className={viewType === "daily" ? "active" : ""} onClick={() => setViewType("daily")}>일별</button>
          <button className={viewType === "monthly" ? "active" : ""} onClick={() => setViewType("monthly")}>월별</button>
          <button className={viewType === "yearly" ? "active" : ""} onClick={() => setViewType("yearly")}>연도별</button>
        </div>

        {/* ✅ 이전/다음 버튼 */}
        <div className="pagination-controls">
          <button onClick={handlePrevPeriod} className="pagination-btn">◀ 이전</button>
          <span>{viewType === "daily" ? `${currentDate.toISOString().split("T")[0]}` : `${currentDate.getFullYear()}년`}</span>
          <button onClick={handleNextPeriod} className="pagination-btn">다음 ▶</button>
        </div>

        {/* ✅ 차트 렌더링 */}
        <Card>
          <CardContent className="chart-card">
            <h2 className="chart-title">📈 {viewType.toUpperCase()} 스트리밍 통계</h2>
            <ResponsiveContainer width="100%" height={400}>
              {loading ? <p>📊 데이터 로딩 중...</p> : getChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
