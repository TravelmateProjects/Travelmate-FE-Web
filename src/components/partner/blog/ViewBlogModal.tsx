import React from "react";
import { Modal, Button, Container } from "react-bootstrap";

interface BlogImage {
  url: string;
}

interface BlogVideo {
  url: string;
}

interface Blog {
  content: string;
  address: string;
  images?: BlogImage[];
  videos?: BlogVideo[];
}

interface ViewBlogModalProps {
  show: boolean;
  onHide: () => void;
  blog: Blog;
}

const ViewBlogModal: React.FC<ViewBlogModalProps> = ({
  show,
  onHide,
  blog,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Blog Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <p>
            <strong>Content:</strong> {blog.content}
          </p>
          <p>
            <strong>Address:</strong> {blog.address}
          </p>
          {blog.images && blog.images.length > 0 && (
            <img
              src={blog.images[0].url}
              alt="Blog"
              style={{ width: "200px" }}
            />
          )}
          {blog.videos && blog.videos.length > 0 && (
            <video controls style={{ width: "200px" }}>
              <source src={blog.videos[0].url} type="video/mp4" />
            </video>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewBlogModal;
