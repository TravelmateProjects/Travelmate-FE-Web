
import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import Modal from 'react-bootstrap/Modal';
import ViewBlog from './blog/ViewBlog';
import AlbumStoriesModal from '../../components/AlbumStoriesModal';
import { useTranslation } from 'react-i18next';
import CommentList from '../../components/CommentList';
import ReactionListModal from '../../components/ReactionListModal';
import likeIcon from '../../images/like.png';
import timIcon from '../../images/tim.png';
import avatarDefault from '../../images/avatar_default.png';

const PartnerHome: React.FC = () => {
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<any[]>([]);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [viewAlbumId, setViewAlbumId] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [, setLoading] = useState(true);
  const [blogStats, setBlogStats] = useState<{ [blogId: string]: { reactions: number; comments: number } }>({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBlogId, setViewBlogId] = useState<string | null>(null);
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [openReactionPostId, setOpenReactionPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [albumRes, blogRes] = await Promise.all([
          API.get('/userAlbum/all'),
          API.get('/blog/all')
        ]);
        const blogsArr = blogRes.data.blogs || [];
        const albumsArr = albumRes.data.albums || [];

        // Fetch images for each album
        const albumsWithImages = await Promise.all(
          albumsArr.map(async (album: any) => {
            try {
              const imgRes = await API.get(`/albumImage/album/${album._id}`);
              return { ...album, images: imgRes.data.images || [] };
            } catch {
              return { ...album, images: [] };
            }
          })
        );
        setAlbums(albumsWithImages);
        setBlogs(blogsArr);

        // Fetch reactions and comments for each blog
        const stats: { [blogId: string]: { reactions: number; comments: number } } = {};
        if (Array.isArray(blogsArr) && blogsArr.length > 0) {
          await Promise.all(blogsArr.map(async (blog: any) => {
            try {
              const [reactionRes, commentRes] = await Promise.all([
                API.get(`/blog/reactions/summary/${blog._id}`),
                API.get(`/blog/comments/${blog._id}`)
              ]);
              stats[blog._id] = {
                reactions: reactionRes.data.totalReactions || 0,
                comments: (commentRes.data.comments || []).length
              };
            } catch {
              stats[blog._id] = { reactions: 0, comments: 0 };
            }
          }));
        }
        setBlogStats(stats);
      } catch (e) {
        setAlbums([]);
        setBlogs([]);
        setBlogStats({});
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgb(245, 245, 245)',
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 700,
          margin: '0 auto',
          padding: '32px 16px 64px 16px',
        }}
      >
        {/* Album Stories */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 16 }}>{t('albums')}</h2>
          <div
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: 24,
              padding: '8px 0',
              scrollbarWidth: 'thin',
            }}
          >
            {albums.map((album) => (
              <div
                key={album._id}
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  width: 90,
                }}
                onClick={() => {
                  setViewAlbumId(album._id);
                  setShowAlbumModal(true);
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #0dcaf0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    marginBottom: 8,
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <img
                    src={album.images && album.images.length > 0 ? album.images[0].url : 'https://via.placeholder.com/72x72?text=No+Image'}
                    alt={album.albumName || t('no_name')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      right: 4,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      borderRadius: 8,
                      fontSize: 11,
                      padding: '1px 6px',
                      zIndex: 2,
                    }}
                  >
                    {album.images ? album.images.length : 0}
                  </span>
                </div>
                <div
                  style={{
                    maxWidth: 80,
                    fontSize: 13,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={album.albumName}
                >
                  {album.albumName || t('no_name')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Feed */}
        <div>
          <h2 style={{ marginBottom: 16 }}>{t('blogs')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {blogs.map((blog: any) => (
              <div
                key={blog._id}
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 16,
                  background: '#fff',
                  padding: 20,
                  marginBottom: 0,
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setViewBlogId(blog._id);
                  setShowViewModal(true);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                  <img
                    src={
                      blog.userId?.avatar?.url && blog.userId.avatar.url.trim() !== ''
                        ? blog.userId.avatar.url
                        : blog.userId?.avatar && typeof blog.userId.avatar === 'string' && blog.userId.avatar.trim() !== ''
                        ? blog.userId.avatar
                        : avatarDefault
                    }
                    alt="avatar"
                    style={{ width: 44, height: 44, borderRadius: '50%', marginRight: 12, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{blog.userId?.fullName || t('unknown')}</div>
                    <div style={{ fontSize: 12, color: '#aaa' }}>{new Date(blog.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 10, fontSize: 15, whiteSpace: 'pre-line' }}>{blog.content}</div>
                {blog.images && blog.images.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    {blog.images.map((img: any, idx: number) => (
                      <img
                        key={img._id || idx}
                        src={img.url}
                        alt={`blog-img-${idx}`}
                        style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ))}
                  </div>
                )}
                {blog.videos && blog.videos.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    {blog.videos.map((vid: any, idx: number) => (
                      <video
                        key={vid._id || idx}
                        src={vid.url}
                        controls
                        style={{ width: '100%', maxHeight: 220, borderRadius: 8, marginBottom: 4 }}
                      />
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 8, fontSize: 15 }}>
                  <span
                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={e => {
                      e.stopPropagation();
                      setOpenReactionPostId(blog._id);
                    }}
                  >
                    {/* Hiển thị icon like và tim đè lên nhau bằng ảnh */}
                    <span style={{ display: 'inline-block', position: 'relative', width: 32, height: 24 }}>
                      <img src={timIcon} alt="love" style={{ width: 22, height: 22, position: 'absolute', left: 0, zIndex: 1, borderRadius: '50%', background: '#fff', border: '1.5px solid #fff' }} />
                      <img src={likeIcon} alt="like" style={{ width: 22, height: 22, position: 'absolute', left: 12, zIndex: 2, borderRadius: '50%', background: '#fff', border: '1.5px solid #fff' }} />
                    </span>
                    {blogStats[blog._id]?.reactions ?? 0}
                  </span>
                  <span
                    style={{ cursor: 'pointer', color: openCommentPostId === blog._id ? '#0dcaf0' : undefined }}
                    onClick={e => {
                      e.stopPropagation();
                      setOpenCommentPostId(openCommentPostId === blog._id ? null : blog._id);
                    }}
                  >
                    {blogStats[blog._id]?.comments ?? 0} bình luận
                  </span>
                </div>
                {openCommentPostId === blog._id && (
                  <div style={{ marginTop: 12 }}>
                    <CommentList postId={blog._id} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal các loại ... */}
      <AlbumStoriesModal
        show={showAlbumModal}
        onHide={() => setShowAlbumModal(false)}
        images={
          viewAlbumId
            ? (albums.find((a) => a._id === viewAlbumId)?.images || [])
            : []
        }
        albumName={
          viewAlbumId
            ? albums.find((a) => a._id === viewAlbumId)?.albumName
            : ''
        }
      />
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        dialogClassName="modal-dialog-light"
        style={{ border: 'none' }}
      >
        <Modal.Header closeButton style={{ border: 'none', justifyContent: 'center' }}>
          <Modal.Title style={{ flex: '1', textAlign: 'center' }}>{t('view_blog')}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '10px' }}>
          {viewBlogId && <ViewBlog id={viewBlogId} isModal />}
        </Modal.Body>
      </Modal>
      {/* Modal tạo blog, tạo album ... */}
      <ReactionListModal
        postId={openReactionPostId}
        show={!!openReactionPostId}
        onHide={() => setOpenReactionPostId(null)}
      />
    </div>
  );
}

export default PartnerHome;
