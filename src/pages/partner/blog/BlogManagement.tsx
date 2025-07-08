import React, { useEffect, useState } from "react";
import { Button, Table, Container, Modal, Alert } from "react-bootstrap";
import API from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import AddBlog from "./AddBlog";
import UpdateBlog from "./UpdateBlog";
import ViewBlog from "./ViewBlog";

interface Blog {
  _id: string;
  content: string;
  images?: { url: string }[];
}

const BlogManagement: React.FC = () => {
  useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBlogId, setViewBlogId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await API.get("/blog");
      setBlogs(response.data.blogs);
    } catch {
      setError("Failed to fetch blogs");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await API.delete(`/blog/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch {
        setError("Failed to delete blog");
      }
    }
  };

  const handleAddClick = () => setShowAddModal(true);

  const handleEditClick = (id: string) => {
    setSelectedBlogId(id);
    setShowEditModal(true);
  };

  const handleViewClick = (id: string) => {
    setViewBlogId(id);
    setShowViewModal(true);
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
          Add New Blog
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Content</th>
            <th>Image</th>
            <th>Action</th>
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
                    alt="Blog"
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
                  View
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditClick(blog._id)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
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
          <Modal.Title>Tạo Bài Viết Mới</Modal.Title>
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
          <Modal.Title>Cập Nhật Bài Viết</Modal.Title>
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
        dialogClassName="modal-dialog-light" // Custom class for lighter modal
        style={{ border: "none" }} // Remove modal border
      >
        <Modal.Header
          closeButton
          style={{ border: "none", justifyContent: "center" }}
        >
          <Modal.Title style={{ flex: "1", textAlign: "center" }}>
            Xem Bài Viết
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          {" "}
          {/* Tighter padding */}
          {viewBlogId && <ViewBlog id={viewBlogId} isModal />}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BlogManagement;
