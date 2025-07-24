import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import API from '../services/api';
import avatarDefault from '../images/avatar_default.png';
import likeIcon from '../images/like.png';
import hahaIcon from '../images/haha.png';
import angryIcon from '../images/angry.png';
import sadIcon from '../images/sad.png';
import timIcon from '../images/tim.png';
import wowIcon from '../images/wow.png';

const REACTION_ICONS: Record<string, string> = {
  like: likeIcon,
  love: timIcon,
  haha: hahaIcon,
  wow: wowIcon,
  sad: sadIcon,
  angry: angryIcon,
  kiss: timIcon,
};

interface ReactionListModalProps {
  postId: string | null;
  show: boolean;
  onHide: () => void;
}

const ReactionListModal: React.FC<ReactionListModalProps> = ({ postId, show, onHide }) => {
  const [reactions, setReactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!show || !postId) return;
    setLoading(true);
    API.get(`/blog/reactions/${postId}`)
      .then(res => setReactions(res.data.reactions || []))
      .finally(() => setLoading(false));
  }, [postId, show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Danh sách cảm xúc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Đang tải...</div>
        ) : reactions.length === 0 ? (
          <div>Chưa có ai bày tỏ cảm xúc</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reactions.map((r: any) => (
              <div key={r._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={r.userId?.avatar?.url || r.userId?.avatar || avatarDefault}
                  alt="avatar"
                  style={{ width: 32, height: 32, borderRadius: '50%' }}
                />
                <span style={{ fontWeight: 500 }}>{r.userId?.fullName || 'Ẩn danh'}</span>
                <img src={REACTION_ICONS[r.type] || likeIcon} alt={r.type} style={{ width: 22, height: 22 }} />
              </div>
            ))}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ReactionListModal; 