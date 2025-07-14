import React, { useState, useEffect } from "react";
import { Button, Card, Image, Row, Col, Stack, Alert } from "react-bootstrap";
import API from "../../../services/api";
import { FaMapMarkerAlt } from "react-icons/fa";

// Lightbox
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "../../../assets/css/ViewBlog.css";

interface ViewBlogProps {
  id: string;
  isModal?: boolean;
}

interface Blog {
  _id: string;
  content: string;
  address?: string;
  isAd: boolean;
  adTargetUrl?: string;
  images: { publicId: string; url: string }[];
  videos: { publicId: string; url: string }[];
}

interface Comment {
  _id: string;
  commentText: string;
  commenterId: { fullName: string; avatar: { url: string; publicId: string } };
  createdAt: string;
}

const reactionEmojis: { [key: string]: string } = {
  like: "👍",
  love: "❤️",
  haha: "😆",
  wow: "😲",
  sad: "😢",
  angry: "😣",
};

const ViewBlog: React.FC<ViewBlogProps> = ({ id, isModal = false }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [reactionSummary, setReactionSummary] = useState<{
    totalReactions: number;
    topReactions: { type: string; count: number }[];
  }>({ totalReactions: 0, topReactions: [] });
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5mtjxpAVAe11WGg2JNdR-imdm04QxHo3QA&s";

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setIsLoading(true);
        // Fetch blog details
        const blogResponse = await API.get(`/blog/${id}`);
        setBlog(blogResponse.data.blog);

        // Fetch reaction summary
        const reactionSummaryResponse = await API.get(
          `/blog/reactions/summary/${id}`
        );
        setReactionSummary(reactionSummaryResponse.data);

        // Fetch comments
        const commentsResponse = await API.get(`/blog/comments/${id}`);
        console.log("Comments:", commentsResponse.data.comments); // Debug
        setComments(commentsResponse.data.comments);
      } catch {
        setError("Không thể tải bài viết hoặc dữ liệu liên quan!");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchBlogData();
  }, [id]);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setOpenLightbox(true);
  };

  const getImageLayout = (images: { publicId: string; url: string }[]) => {
    const count = Math.min(images.length, 10);
    const getColSize = () => {
      if (count === 1) return 12;
      if (count === 2) return 6;
      if (count === 3) return 4;
      if (count <= 4) return 6;
      if (count <= 6) return 4;
      return 3;
    };

    return (
      <Row className="mb-2 g-2">
        {images.slice(0, 10).map((img, idx) => {
          const colSize = getColSize();
          let height = "auto";
          if (count === 1) height = "auto";
          else if (count === 2) height = "280px";
          else if (count === 3) height = "250px";
          else if (count <= 4) height = "220px";
          else height = "200px";

          return (
            <Col xs={12} sm={colSize} key={img.publicId}>
              <Image
                src={img.url}
                onClick={() => handleImageClick(idx)}
                className="w-100"
                style={{
                  objectFit: count === 1 ? "contain" : "cover",
                  height: height,
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              />
            </Col>
          );
        })}
      </Row>
    );
  };

  if (isLoading) {
    return (
      <Card
        className="p-3 shadow-sm"
        style={{ borderRadius: 20, border: "none" }}
      >
        <div className="text-center">Đang tải...</div>
      </Card>
    );
  }

  if (!blog) {
    return (
      <Card
        className="p-3 shadow-sm"
        style={{ borderRadius: 20, border: "none" }}
      >
        <Alert variant="danger">Không tìm thấy bài viết!</Alert>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="p-3 shadow-sm"
        style={{
          maxWidth: isModal ? "100%" : 600,
          margin: isModal ? "0" : "0 auto",
          borderRadius: isModal ? 10 : 20,
          backgroundColor: "#fff",
          color: "#212529",
          border: "none",
        }}
      >
        <Stack
          direction="horizontal"
          gap={2}
          className="mb-3 align-items-center"
        >
          <Image src={defaultAvatar} roundedCircle width={40} height={40} />
        </Stack>

        {blog.address && (
          <div className="mb-2 text-muted d-flex align-items-center gap-2">
            <FaMapMarkerAlt className="text-danger" />
            <span>{blog.address}</span>
          </div>
        )}

        <div
          className="mb-3 p-2"
          style={{
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {blog.content}
        </div>

        {blog.images.length > 0 && getImageLayout(blog.images)}

        {blog.videos.length > 0 && (
          <div className="mb-2 d-flex justify-content-center">
            {blog.videos.slice(0, 1).map((vid) => (
              <video
                key={`video-${vid.publicId}`}
                src={vid.url}
                controls
                style={{
                  maxWidth: "400px",
                  width: "100%",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        )}

        {/* Reaction Summary */}
        {reactionSummary.totalReactions > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-1">
              {reactionSummary.topReactions.map(({ type }) => (
                <span key={type} className="fs-5">
                  {reactionEmojis[type]}
                </span>
              ))}
              <span className="ms-2 text-muted">
                {reactionSummary.totalReactions}
              </span>
            </div>
            {comments.length > 0 && (
              <span className="text-muted">{comments.length} bình luận</span>
            )}
          </div>
        )}

        {/* Comments Section */}
        {comments.length > 0 && (
          <div className="mt-3">
            <hr />
            <h6>Bình luận</h6>
            {comments.map((comment) => (
              <Stack
                key={comment._id}
                direction="horizontal"
                gap={2}
                className="mb-2 align-items-start"
              >
                <Image
                  src={comment.commenterId.avatar?.url || defaultAvatar}
                  roundedCircle
                  width={32}
                  height={32}
                  onError={(e) => {
                    e.currentTarget.src = defaultAvatar; // Fallback nếu ảnh lỗi
                  }}
                />
                <div
                  className="p-2"
                  style={{
                    backgroundColor: "#f0f2f5",
                    borderRadius: 12,
                    flex: 1,
                  }}
                >
                  <strong>{comment.commenterId.fullName}</strong>
                  <div>{comment.commentText}</div>
                  <small className="text-muted">
                    {new Date(comment.createdAt).toLocaleString("vi-VN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                </div>
              </Stack>
            ))}
          </div>
        )}

        {blog.isAd && (
          <div className="mb-2">
            <strong>Quảng cáo:</strong>{" "}
            {blog.adTargetUrl ? (
              <a
                href={blog.adTargetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {blog.adTargetUrl}
              </a>
            ) : (
              "Không có URL quảng cáo"
            )}
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}

        {!isModal && (
          <div className="d-grid mt-3">
            <Button variant="primary" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </div>
        )}
      </Card>

      {/* Lightbox */}
      {openLightbox && (
        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          index={lightboxIndex}
          slides={blog.images.map((img, i) => ({
            src: img.url,
            description: `${i + 1} / ${blog.images.length}`,
          }))}
          plugins={[Captions]}
        />
      )}
    </>
  );
};

export default ViewBlog;
