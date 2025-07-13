import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/userService';
import { getAllTravelHistories } from '../../services/travelHistoryService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminHome: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [travelHistories, setTravelHistories] = useState<any[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [planningCount, setPlanningCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [inprogressCount, setInprogressCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState<'user' | 'plan' | 'pie'>('user');
  const [chartRange, setChartRange] = useState<'day' | 'week' | 'month'>('day');

  // Helper: group by day/week/month
  const groupByDate = (items: any[], dateField: string, range: 'day' | 'week' | 'month') => {
    const map: Record<string, number> = {};
    items.forEach(item => {
      const d = new Date(item[dateField]);
      let key = '';
      if (range === 'day') {
        key = d.toISOString().slice(0, 10);
      } else if (range === 'week') {
        // ISO week: yyyy-Www
        const year = d.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        // Week number (ISO):
        const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `${year}-W${week.toString().padStart(2, '0')}`;
      } else if (range === 'month') {
        key = d.toISOString().slice(0, 7); // yyyy-mm
      }
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  };

  // Helper: tự động ẩn bớt nhãn nếu quá nhiều mốc
  const getXAxisInterval = (dataLen: number) => {
    if (dataLen <= 10) return 0;
    if (dataLen <= 20) return 1;
    if (dataLen <= 40) return 2;
    return Math.ceil(dataLen / 15);
  };

  // Thêm hàm formatDate
  const formatDate = (dateStr: string) => {
    // Nếu là tuần: yyyy-Wxx
    const weekMatch = dateStr.match(/^(\d{4})-W(\d{2})$/);
    if (weekMatch) {
      const year = parseInt(weekMatch[1], 10);
      const week = parseInt(weekMatch[2], 10);
      // Tính ngày đầu tuần (thứ 2)
      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset = ((firstDayOfYear.getDay() + 6) % 7); // chuyển chủ nhật thành 6, thứ 2 thành 0
      const firstMonday = new Date(year, 0, 1 + (daysOffset ? 7 - daysOffset : 0));
      const startDate = new Date(firstMonday);
      startDate.setDate(firstMonday.getDate() + (week - 1) * 7);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(startDate.getDate())}/${pad(startDate.getMonth() + 1)} - ${pad(endDate.getDate())}/${pad(endDate.getMonth() + 1)}`;
    }
    // Nếu là tháng: yyyy-MM
    const monthMatch = dateStr.match(/^(\d{4})-(\d{2})$/);
    if (monthMatch) {
      return `${monthMatch[2]}`;
    }
    // Nếu là ngày: yyyy-MM-dd
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate().toString().padStart(2, '0');
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${day}/${month}`;
    }
    return dateStr;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Users
        const userRes = await getAllUsers();
        setUsers(userRes.data.data || []);
        // 2. Travel Histories (for chart)
        const allHistoriesRes = await getAllTravelHistories({ limit: 1000 });
        setTravelHistories(allHistoriesRes.data.data || []);
        // 3. Travel Histories (for status)
        const completedRes = await getAllTravelHistories({ status: 'completed', limit: 1_000 });
        setCompletedCount(completedRes.data.totalRecords || 0);
        const planningRes = await getAllTravelHistories({ status: 'planing', limit: 1_000 });
        setPlanningCount(planningRes.data.totalRecords || 0);
        const cancelledRes = await getAllTravelHistories({ status: 'cancelled', limit: 1_000 });
        setCancelledCount(cancelledRes.data.totalRecords || 0);
        const inprogressRes = await getAllTravelHistories({ status: 'inprogress', limit: 1_000 });
        setInprogressCount(inprogressRes.data.totalRecords || 0);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Chuẩn bị data cho biểu đồ
  const userLineData = groupByDate(users, 'createdAt', chartRange);
  const planLineData = groupByDate(travelHistories, 'createdAt', chartRange);
  const pieData = [
    { name: 'Đã hoàn thành', value: completedCount },
    { name: 'Đã huỷ', value: cancelledCount },
    { name: 'Đang diễn ra', value: inprogressCount },
    { name: 'Đang lên kế hoạch', value: planningCount },
  ];

  return (
    <div style={{ padding: 32, marginLeft: 32 }}>
      {/* Tabs chọn biểu đồ */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <button
          onClick={() => setSelectedChart('user')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: selectedChart === 'user' ? '2px solid #8884d8' : '1px solid #ccc',
            background: selectedChart === 'user' ? '#f3f6ff' : '#fff',
            fontWeight: selectedChart === 'user' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Số người dùng mới
        </button>
        <button
          onClick={() => setSelectedChart('plan')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: selectedChart === 'plan' ? '2px solid #82ca9d' : '1px solid #ccc',
            background: selectedChart === 'plan' ? '#f3fff6' : '#fff',
            fontWeight: selectedChart === 'plan' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Số chuyến đi mới
        </button>
        <button
          onClick={() => setSelectedChart('pie')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: selectedChart === 'pie' ? '2px solid #0088FE' : '1px solid #ccc',
            background: selectedChart === 'pie' ? '#f3faff' : '#fff',
            fontWeight: selectedChart === 'pie' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Tỷ lệ trạng thái chuyến đi
        </button>
      </div>

      {/* Filter chọn ngày/tuần/tháng */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <span style={{ fontWeight: 500, marginRight: 8 }}>Xem theo:</span>
        <button
          onClick={() => setChartRange('day')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: chartRange === 'day' ? '2px solid #8884d8' : '1px solid #ccc',
            background: chartRange === 'day' ? '#f3f6ff' : '#fff',
            fontWeight: chartRange === 'day' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Ngày</button>
        <button
          onClick={() => setChartRange('week')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: chartRange === 'week' ? '2px solid #82ca9d' : '1px solid #ccc',
            background: chartRange === 'week' ? '#f3fff6' : '#fff',
            fontWeight: chartRange === 'week' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Tuần</button>
        <button
          onClick={() => setChartRange('month')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: chartRange === 'month' ? '2px solid #0088FE' : '1px solid #ccc',
            background: chartRange === 'month' ? '#f3faff' : '#fff',
            fontWeight: chartRange === 'month' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Tháng</button>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ minWidth: 350 }}>
           {selectedChart === 'user' && (
             <>
               <h3>Số người dùng mới theo ngày</h3>
               <ResponsiveContainer width="100%" height={250}>
                 <LineChart data={userLineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis
                     dataKey="date"
                     interval={getXAxisInterval(userLineData.length)}
                     height={30}
                     tickFormatter={formatDate}
                   />
                   <YAxis allowDecimals={false} />
                   <Tooltip />
                   <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                   <Line type="monotone" dataKey="count" stroke="#8884d8" name="User mới" />
                 </LineChart>
               </ResponsiveContainer>
             </>
           )}
           {selectedChart === 'plan' && (
             <>
               <h3>Số chuyến đi được tạo theo ngày</h3>
               <ResponsiveContainer width="100%" height={250}>
                 <LineChart data={planLineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis
                     dataKey="date"
                     interval={getXAxisInterval(planLineData.length)}
                     height={30}
                     tickFormatter={formatDate}
                   />
                   <YAxis allowDecimals={false} />
                   <Tooltip />
                   <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                   <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Chuyến đi mới" />
                 </LineChart>
               </ResponsiveContainer>
             </>
           )}
           {selectedChart === 'pie' && (
             <>
               <h3>Tỷ lệ trạng thái chuyến đi (Pie Chart)</h3>
               <ResponsiveContainer width="100%" height={250}>
                 <PieChart>
                   <Pie
                     data={pieData}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     outerRadius={80}
                     label={({ name, value }) => {
                       const total = pieData.reduce((sum, entry) => sum + entry.value, 0);
                       const val = typeof value === 'number' ? value : 0;
                       const percent = total ? ((val / total) * 100).toFixed(1) : 0;
                       return `${name} (${percent}%)`;
                     }}
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
             </>
           )}
         </div>
        )}
      </div>
    );
};

export default AdminHome;
