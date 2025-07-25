import React, { useEffect, useState } from 'react';
import API from '../services/api';
import avatarDefault from '../images/avatar_default.png';

interface CommentListProps {
  postId: string;
}

const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/blog/comments/${postId}`);
        setComments(res.data.comments || []);
      } catch {
        setComments([]);
      }
      setLoading(false);
    };
    fetchComments();
  }, [postId]);

  if (loading) return <div style={{ color: '#888', fontSize: 14 }}>Đang tải bình luận...</div>;
  if (!comments.length) return <div style={{ color: '#888', fontSize: 14 }}>Chưa có bình luận nào</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {comments.map((c: any) => {
        let avatarSrc = avatarDefault;
        if (c.commenterId?.avatar?.url && typeof c.commenterId.avatar.url === 'string' && c.commenterId.avatar.url.trim() !== '') {
          avatarSrc = c.commenterId.avatar.url;
        } else if (c.commenterId?.avatar && typeof c.commenterId.avatar === 'string' && c.commenterId.avatar.trim() !== '') {
          avatarSrc = c.commenterId.avatar;
        }
        return (
          <div key={c._id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <img
              src={avatarSrc}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: '50%', marginTop: 2 }}
            />
            <div style={{ background: '#f5f6fa', borderRadius: 10, padding: '8px 14px', flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{c.commenterId?.fullName || 'Ẩn danh'}</div>
              <div style={{ fontSize: 14, color: '#333', margin: '2px 0 2px 0' }}>{c.commentText}</div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList; 