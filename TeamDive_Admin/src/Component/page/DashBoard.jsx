import jaxios from '../../util/JwtUtil';
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import Modal from 'react-modal';
import "../../style/dashboard.scss";

const Dashboard = () => {
  const [streamingStats, setStreamingStats] = useState([]);  
  const [viewMode, setViewMode] = useState("daily");  // ✅ 일별 or 월별 데이터 보기
  const [selectedDateData, setSelectedDateData] = useState(null);  // ✅ 선택된 날짜 상세 데이터 저장
  const [modalIsOpen, setModalIsOpen] = useState(false);  // ✅ 모달 상태
  const [testDate, setTestDate] = useState(""); // ✅ 테스트용 날짜 입력
 
  useEffect(() => {
    fetchStreamingData();
  }, [viewMode]);

  // ✅ 일별 또는 월별 데이터 가져오기
  const fetchStreamingData = async () => {
    try {
      console.log("📊 백엔드 데이터 가져오는 중...");
  
      // ✅ 오늘 날짜 가져오기
      const today = new Date();
      const endDate = today.toISOString().split("T")[0]; // ✅ 오늘 날짜 포함
  
      // ✅ 정확한 30일 전 날짜 계산 (today 값 변경 없이)
      const startDateObj = new Date();
      startDateObj.setDate(today.getDate() - 29); // ✅ 오늘 포함 30일치 가져오기
      const startDate = startDateObj.toISOString().split("T")[0];
  
      console.log(`📅 요청 날짜 범위 (일별): ${startDate} ~ ${endDate}`);
  
      const response = await jaxios.get(`/api/stats/daily?startDate=${startDate}&endDate=${endDate}`);
      console.log("✅ 일별 데이터:", response.data);
  
      setStreamingStats(response.data.map(item => ({
        date: item.date,
        totalPlayCount: item.totalPlayCount ?? 0,
      })).reverse());
    } catch (error) {
      console.error("❌ 백엔드 데이터 가져오기 실패:", error);
    }
  };
  

  // ✅ 특정 날짜 클릭 시 상세 데이터 조회
  const fetchDailyDetail = async (date) => {
    try {
      console.log(`📅 세부 데이터 요청: ${date}`);
      const response = await jaxios.get(`/api/stats/dailyDetail/${date}`);
      console.log("✅ 세부 데이터:", response.data);

      setSelectedDateData(response.data);
      setModalIsOpen(true);
    } catch (error) {
      console.error("❌ 세부 데이터 가져오기 실패:", error);
    }
  };

  // ✅ 차트 생성 함수
  const getChart = () => {
    return (
      <BarChart data={streamingStats} onClick={(e) => e && e.activeLabel && fetchDailyDetail(e.activeLabel)}>
        <XAxis dataKey="date" stroke="#555" tick={{ fontSize: 12 }} />
        <YAxis stroke="#555" tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }} />
        <Legend wrapperStyle={{ paddingBottom: 10 }} />
        <Bar dataKey="totalPlayCount" fill="#ff7300" />
      </BarChart>
    );
  };

    // ✅ 특정 날짜 강제 저장 실행
    const handleSaveTestData = async () => {
      if (!testDate) {
        alert("날짜를 선택해주세요.");
        return;
      }

      try {
        console.log(`📅 강제 저장 요청: ${testDate}`);
        await jaxios.post(`/api/stats/saveManual?date=${testDate}`);
        alert(`✅ ${testDate} 데이터 강제 저장 완료!`);
        fetchStreamingData(); // ✅ 저장 후 데이터 갱신
      } catch (error) {
        console.error("❌ 강제 저장 실패:", error);
        alert("❌ 데이터 저장 중 오류 발생");
      }
    };


  

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">📊 관리자 대시보드</h1>

        {/* ✅ 일별/월별 선택 버튼 */}
        <div className="dashboard-controls">
          <button className={viewMode === "daily" ? "active" : ""} onClick={() => setViewMode("daily")}>일별</button>
          <button className={viewMode === "monthly" ? "active" : ""} onClick={() => setViewMode("monthly")}>월별</button>
        </div>

        {/* ✅ 강제 데이터 저장 테스트 */}
        <div className="test-controls">
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
            className="test-date-input"
          />
          <button onClick={handleSaveTestData} className="test-save-btn">데이터 저장</button>
        </div>

        {/* ✅ 차트 렌더링 */}
        <Card>
          <CardContent className="chart-card">
            <h2 className="chart-title">📈 {viewMode === "daily" ? "일별" : "월별"} 스트리밍 통계</h2>
            <ResponsiveContainer width="100%" height={400}>
              {getChart()}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ✅ 특정 날짜 클릭 시 모달 창 열기 */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="modal">
        <h2>📆 {selectedDateData?.date} 스트리밍 상세 데이터</h2>
        <p>🎵 총 재생 수: {selectedDateData?.totalPlayCount}</p>
        <p>👨‍👩‍👦‍👦 성별 - 남성: {selectedDateData?.malePlayCount}, 여성: {selectedDateData?.femalePlayCount}</p>
        <p>🔢 연령대 - 10대: {selectedDateData?.teenPlayCount}, 20대: {selectedDateData?.twentiesPlayCount}, 
            30대: {selectedDateData?.thirtiesPlayCount}, 40대: {selectedDateData?.fortiesPlayCount}, 
            50대 이상: {selectedDateData?.fiftiesPlusPlayCount}</p>
        <button onClick={() => setModalIsOpen(false)}>닫기</button>
      </Modal>
    </div>
  );
};

export default Dashboard;
