import React, { useEffect, useState, useCallback } from "react";
import { Button, Table, Container, Modal, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import AddBlog from "./AddBlog";
import UpdateBlog from "./UpdateBlog";
import ViewBlog from "./ViewBlog";
import StatisticsModal from "./StatisticsModal";

interface Blog {
  _id: string;
  content: string;
  images?: { url: string }[];
}

const BlogManagement: React.FC = () => {
  useAuth();
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBlogId, setViewBlogId] = useState<string | null>(null);

  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [statisticsBlogId, setStatisticsBlogId] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await API.get("/blog");
      setBlogs(response.data.blogs);
    } catch {
      setError(t("error_fetch_blogs"));
    }
  }, [t]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleAddClick = () => setShowAddModal(true);

  const handleEditClick = (id: string) => {
    setSelectedBlogId(id);
    setShowEditModal(true);
  };

  const handleViewClick = (id: string) => {
    setViewBlogId(id);
    setShowViewModal(true);
  };

  const handleStatisticsClick = (id: string) => {
    setStatisticsBlogId(id);
    setShowStatisticsModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setBlogIdToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!blogIdToDelete) return;
    try {
      await API.delete(`/blog/${blogIdToDelete}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogIdToDelete));
      setShowDeleteConfirm(false);
      setBlogIdToDelete(null);
    } catch {
      setError(t("error_delete_blog"));
      setShowDeleteConfirm(false);
    }
  };

  const truncateContent = (content: string) => {
    const words = content.trim().split(/\s+/);
    return words.length > 30 ? words.slice(0, 30).join(" ") + "..." : content;
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleAddClick}>
          {t("add_new_blog")}
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>{t("content")}</th>
            <th>{t("image")}</th>
            <th>{t("action")}</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog._id}>
              <td>{index + 1}</td>
              <td>{truncateContent(blog.content)}</td>
              <td>
                {blog.images && blog.images.length > 0 && (
                  <img
                    src={blog.images[0].url}
                    alt={t("blog_image")}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td>
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleViewClick(blog._id)}
                  className="me-2"
                >
                  {t("view")}
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditClick(blog._id)}
                  className="me-2"
                >
                  {t("edit")}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClick(blog._id)}
                  className="me-2"
                >
                  {t("delete")}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStatisticsClick(blog._id)}
                >
                  {t("statistics")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("add_new_blog_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddBlog />
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("update_blog_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBlogId && <UpdateBlog blogId={selectedBlogId} />}
        </Modal.Body>
      </Modal>

      {/* View Modal */}
      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
        dialogClassName="modal-dialog-light"
        style={{ border: "none" }}
      >
        <Modal.Header
          closeButton
          style={{ border: "none", justifyContent: "center" }}
        >
          <Modal.Title style={{ flex: "1", textAlign: "center" }}>
            {t("view_blog_title")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          {viewBlogId && <ViewBlog id={viewBlogId} isModal />}
        </Modal.Body>
      </Modal>

      {/* Statistics Modal */}
      <Modal
        show={showStatisticsModal}
        onHide={() => setShowStatisticsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("statistics_title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {statisticsBlogId && <StatisticsModal blogId={statisticsBlogId} />}
        </Modal.Body>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_delete_blog")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("confirm_delete_blog_message")}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            {t("delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BlogManagement;
