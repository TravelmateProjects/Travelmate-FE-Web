import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import API from "../../../services/api";

interface StatisticsModalProps {
  blogId: string;
}

const REACTION_TYPES = ["like", "love", "wow", "haha", "sad", "angry"] as const;
type ReactionType = typeof REACTION_TYPES[number];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#d72660", "#6c757d"];

const StatisticsModal: React.FC<StatisticsModalProps> = ({ blogId }) => {
  const [reactions, setReactions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reacRes, commRes] = await Promise.all([
          API.get(`/blog/reactions/${blogId}`),
          API.get(`/blog/comments/${blogId}`),
        ]);
        setReactions(reacRes.data.reactions || []);
        setComments(commRes.data.comments || []);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      setLoading(false);
    };
    fetchData();
  }, [blogId]);

  // Group reactions by date and type
  const groupReactions = (items: any[], range: 'day' | 'week' | 'month') => {
    const map: Record<string, Record<ReactionType, number>> = {};
    items.forEach(item => {
      const d = new Date(item.createdAt);
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
      if (!map[key]) map[key] = { like: 0, love: 0, wow: 0, haha: 0, sad: 0, angry: 0 };
      if (REACTION_TYPES.includes(item.type as ReactionType)) {
        const type = item.type as ReactionType;
        map[key][type] = (map[key][type] || 0) + 1;
      }
    });
    // Convert to array
    return Object.entries(map)
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  // Group comments by date
  const groupComments = (items: any[], range: 'day' | 'week' | 'month') => {
    const map: Record<string, number> = {};
    items.forEach(item => {
      const d = new Date(item.createdAt);
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
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  const reactionLineData = groupReactions(reactions, range);
  const commentLineData = groupComments(comments, range);

  // Tính tổng số reaction theo loại cho PieChart
  const reactionCounts: Record<ReactionType, number> = { like: 0, love: 0, wow: 0, haha: 0, sad: 0, angry: 0 };
  reactions.forEach(item => {
    const type = String(item.type) as ReactionType;
    if (REACTION_TYPES.includes(type)) {
      reactionCounts[type] = (reactionCounts[type] || 0) + 1;
    }
  });
  const pieData: { name: ReactionType; value: number }[] = REACTION_TYPES.map((type) => ({
    name: type as ReactionType,
    value: reactionCounts[type as ReactionType]
  }));

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

  // Helper: tự động ẩn bớt nhãn nếu quá nhiều mốc
  const getXAxisInterval = (dataLen: number) => {
    if (dataLen <= 10) return 0;
    if (dataLen <= 20) return 1;
    if (dataLen <= 40) return 2;
    return Math.ceil(dataLen / 15);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <span style={{ fontWeight: 500, marginRight: 8 }}>Xem theo:</span>
        <button
          onClick={() => setRange('day')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: range === 'day' ? '2px solid #8884d8' : '1px solid #ccc',
            background: range === 'day' ? '#f3f6ff' : '#fff',
            fontWeight: range === 'day' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Ngày</button>
        <button
          onClick={() => setRange('week')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: range === 'week' ? '2px solid #82ca9d' : '1px solid #ccc',
            background: range === 'week' ? '#f3fff6' : '#fff',
            fontWeight: range === 'week' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Tuần</button>
        <button
          onClick={() => setRange('month')}
          style={{
            padding: '6px 14px',
            borderRadius: 5,
            border: range === 'month' ? '2px solid #0088FE' : '1px solid #ccc',
            background: range === 'month' ? '#f3faff' : '#fff',
            fontWeight: range === 'month' ? 'bold' : 'normal',
            cursor: 'pointer',
          }}
        >Tháng</button>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <h5>Biểu đồ lượng tương tác (reaction)</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={reactionLineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={getXAxisInterval(reactionLineData.length)} height={30} tickFormatter={formatDate} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              {REACTION_TYPES.map((type, idx) => (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={COLORS[idx % COLORS.length]}
                  name={type}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          {/* Biểu đồ tròn reaction */}
          <h5 style={{ marginTop: 32 }}>Tỷ lệ các loại cảm xúc (Pie Chart)</h5>
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
          <h5 style={{ marginTop: 32 }}>Biểu đồ lượng bình luận</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={commentLineData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={getXAxisInterval(commentLineData.length)} height={30} tickFormatter={formatDate} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Bình luận" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default StatisticsModal; 