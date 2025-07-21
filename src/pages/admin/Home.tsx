import React, { useEffect, useState } from 'react';
import { getAllUsers, getAllProAccounts, getProRevenueStats } from '../../services/userService';
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
  const [selectedChart, setSelectedChart] = useState('user'); // string type để tránh lỗi so sánh
  const [chartRange, setChartRange] = useState<'day' | 'week' | 'month'>('day');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [proRevenue, setProRevenue] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Helper: group by day/week/month
  const groupByDate = (items: any[], dateField: string, range: 'day' | 'week' | 'month') => {
    const map: Record<string, number> = {};
    items.forEach(item => {
      // Hỗ trợ truy cập nested field như 'proInfo.activatedAt'
      const value = dateField.includes('.') 
        ? dateField.split('.').reduce((obj, key) => obj && obj[key], item)
        : item[dateField];
      const d = new Date(value);
      if (!value || isNaN(d.getTime())) return; // Bỏ qua nếu không hợp lệ
      let key = '';
      if (range === 'day') {
        key = d.toISOString().slice(0, 10);
      } else if (range === 'week') {
        const year = d.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `${year}-W${week.toString().padStart(2, '0')}`;
      } else if (range === 'month') {
        key = d.toISOString().slice(0, 7);
      }
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
        // 1b. Accounts (for Pro user chart)
        // const accountRes = await getAllAccounts();
        // setAccounts(accountRes.data.data || []);
        // Lấy riêng danh sách pro accounts
        const proAccountRes = await getAllProAccounts();
        setAccounts(proAccountRes.data.data || []);
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
        // 4. Pro revenue
        const revenueRes = await getProRevenueStats();
        setProRevenue(revenueRes.data.data || []);
        setTotalRevenue((revenueRes.data.data || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0));
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
  // Biểu đồ Pro user dựa vào account.proInfo.activatedAt
  const proUserLineData = groupByDate(accounts, 'proInfo.activatedAt', chartRange);
  // Biểu đồ doanh thu pro theo ngày/tháng, phân biệt theo gói
  const revenueByDate = (() => {
    // Lấy tất cả các mốc thời gian xuất hiện ở cả 2 gói
    const allDates = Array.from(new Set(
      proRevenue.flatMap(t => {
        const d = new Date(t.createdAt);
        if (isNaN(d.getTime())) return [];
        if (chartRange === 'day') return [d.toISOString().slice(0, 10)];
        if (chartRange === 'week') {
          const year = d.getFullYear();
          const firstDayOfYear = new Date(year, 0, 1);
          const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
          const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          return [`${year}-W${week.toString().padStart(2, '0')}`];
        }
        if (chartRange === 'month') return [d.toISOString().slice(0, 7)];
        return [];
      })
    )).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return allDates.map(date => {
      const monthTotal = proRevenue
        .filter(t => t.plan === 'month')
        .filter(t => {
          const d = new Date(t.createdAt);
          if (isNaN(d.getTime())) return false;
          let key = '';
          if (chartRange === 'day') key = d.toISOString().slice(0, 10);
          else if (chartRange === 'week') {
            const year = d.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
            const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            key = `${year}-W${week.toString().padStart(2, '0')}`;
          } else if (chartRange === 'month') key = d.toISOString().slice(0, 7);
          return key === date;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const yearTotal = proRevenue
        .filter(t => t.plan === 'year')
        .filter(t => {
          const d = new Date(t.createdAt);
          if (isNaN(d.getTime())) return false;
          let key = '';
          if (chartRange === 'day') key = d.toISOString().slice(0, 10);
          else if (chartRange === 'week') {
            const year = d.getFullYear();
            const firstDayOfYear = new Date(year, 0, 1);
            const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
            const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            key = `${year}-W${week.toString().padStart(2, '0')}`;
          } else if (chartRange === 'month') key = d.toISOString().slice(0, 7);
          return key === date;
        })
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      return { date, monthTotal, yearTotal };
    });
  })();

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
          onClick={() => setSelectedChart('proUser')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: selectedChart === 'proUser' ? '2px solid #f39c12' : '1px solid #ccc',
            background: selectedChart === 'proUser' ? '#fffbe6' : '#fff',
            fontWeight: selectedChart === 'proUser' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Số người dùng Pro
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
        <button
          onClick={() => setSelectedChart('proRevenue')}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: selectedChart === 'proRevenue' ? '2px solid #f39c12' : '1px solid #ccc',
            background: selectedChart === 'proRevenue' ? '#fffbe6' : '#fff',
            fontWeight: selectedChart === 'proRevenue' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >
          Doanh thu
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
           {selectedChart === 'proUser' && (
             <>
               <ResponsiveContainer width="100%" height={250}>
                 <LineChart data={proUserLineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis
                     dataKey="date"
                     interval={getXAxisInterval(proUserLineData.length)}
                     height={30}
                     tickFormatter={formatDate}
                   />
                   <YAxis allowDecimals={false} />
                   <Tooltip />
                   <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                   <Line type="monotone" dataKey="count" stroke="#f39c12" name="User Pro" />
                 </LineChart>
               </ResponsiveContainer>
               {/* Bảng chi tiết người dùng Pro */}
               <div style={{ margin: '16px 0 24px 0', fontWeight: 600, fontSize: 18 }}>
                 Danh sách người dùng Pro
               </div>
               <div style={{ overflowX: 'auto', marginBottom: 32 }}>
                 <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 600 }}>
                   <thead>
                     <tr style={{ background: '#f3f6ff' }}>
                       <th style={{ padding: 8, border: '1px solid #e0e7ef' }}>Username</th>
                       <th style={{ padding: 8, border: '1px solid #e0e7ef' }}>Gói</th>
                       <th style={{ padding: 8, border: '1px solid #e0e7ef' }}>Ngày mua</th>
                       <th style={{ padding: 8, border: '1px solid #e0e7ef' }}>Ngày hết hạn</th>
                     </tr>
                   </thead>
                   <tbody>
                     {accounts.map((acc: any) => (
                       <tr key={acc._id || acc.id}>
                         <td style={{ padding: 8, border: '1px solid #e0e7ef' }}>{acc.username}</td>
                         <td style={{ padding: 8, border: '1px solid #e0e7ef' }}>{acc.proInfo?.plan === 'year' ? 'Năm' : 'Tháng'}</td>
                         <td style={{ padding: 8, border: '1px solid #e0e7ef' }}>{acc.proInfo?.activatedAt ? new Date(acc.proInfo.activatedAt).toLocaleString('vi-VN') : ''}</td>
                         <td style={{ padding: 8, border: '1px solid #e0e7ef' }}>{acc.proInfo?.expireAt ? new Date(acc.proInfo.expireAt).toLocaleString('vi-VN') : ''}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </>
           )}
           {selectedChart === 'plan' && (
             <>
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
                     {pieData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                   <Legend />
                 </PieChart>
               </ResponsiveContainer>
             </>
           )}
           {/* Tổng doanh thu Pro và biểu đồ doanh thu Pro chuyển sang tab riêng */}
           {selectedChart === 'proRevenue' && (
             <div style={{ minWidth: 350, marginBottom: 32 }}>
               <div style={{ marginBottom: 24, fontWeight: 600, fontSize: 18, color: '#f39c12' }}>
                 Tổng doanh thu: {totalRevenue.toLocaleString()} VND
               </div>
               <ResponsiveContainer width="100%" height={220}>
                 <LineChart data={revenueByDate} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis
                     dataKey="date"
                     interval={getXAxisInterval(revenueByDate.length)}
                     height={30}
                     tickFormatter={formatDate}
                   />
                   <YAxis allowDecimals={false} />
                   <Tooltip formatter={(value: any) => value.toLocaleString() + ' VND'} />
                   <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                   <Line type="monotone" dataKey="monthTotal" stroke="#2F80ED" name="Doanh thu Pro tháng" />
                   <Line type="monotone" dataKey="yearTotal" stroke="#F2C94C" name="Doanh thu Pro năm" />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           )}
         </div>
        )}
      </div>
    );
};

export default AdminHome;
