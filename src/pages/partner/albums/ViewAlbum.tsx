import React, { useEffect, useState } from "react";
import {
  Container,
  Alert,
  Row,
  Col,
  Image,
  Modal as BootstrapModal,
  Button,
} from "react-bootstrap";
import { FaImages, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";

interface ViewAlbumProps {
  id: string;
  isModal?: boolean;
}

interface ImageItem {
  _id: string;
  url: string;
}

const ViewAlbum: React.FC<ViewAlbumProps> = ({ id, isModal }) => {
  const { t } = useTranslation();
  const [album, setAlbum] = useState<{
    albumName: string;
    images: ImageItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const [albumRes, imagesRes] = await Promise.all([
          API.get(`/userAlbum/${id}`),
          API.get(`/albumImage/album/${id}`),
        ]);
        setAlbum({
          albumName: albumRes.data.album.albumName,
          images: imagesRes.data.images || [],
        });
      } catch (err) {
        console.error(err);
        setError(t("error_load_album"));
      }
    };
    fetchAlbum();
  }, [id, t]);

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "image.jpg";
    link.click();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev !== null && album
        ? (prev - 1 + album.images.length) % album.images.length
        : prev
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev !== null && album ? (prev + 1) % album.images.length : prev
    );
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  if (!album) return <div>{t("loading")}</div>;

  return (
    <Container fluid={isModal} className="text-center">
      <h3
        className="mb-2"
        style={{ color: "#4a90e2", fontWeight: "bold", fontSize: "1.8rem" }}
      >
        {album.albumName}
      </h3>

      <div className="mb-3 text-muted d-flex justify-content-center align-items-center">
        <FaImages className="me-1" />
        {album.images.length} {t("photos")}
      </div>

      {album.images.length > 0 ? (
        <Row xs={1} sm={2} md={3} className="g-3">
          {album.images.map((image, idx) => (
            <Col key={image._id}>
              <div
                className="image-wrapper position-relative"
                style={{ cursor: "pointer" }}
                onClick={() => setCurrentIndex(idx)}
              >
                <Image
                  src={image.url}
                  thumbnail
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                />
                <Button
                  variant="light"
                  size="sm"
                  className="download-btn position-absolute"
                  style={{
                    bottom: "8px",
                    right: "8px",
                    opacity: 0,
                    transition: "opacity 0.2s",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(image.url);
                  }}
                >
                  {t("download")}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-muted">{t("no_photos")}</p>
      )}

      {/* Modal to view large image */}
      <BootstrapModal
        show={currentIndex !== null}
        onHide={() => setCurrentIndex(null)}
        centered
        size="xl"
        backdrop
        contentClassName="bg-dark"
      >
        <BootstrapModal.Body className="p-0 position-relative">
          {currentIndex !== null && (
            <>
              <Button
                variant="light"
                className="position-absolute top-50 start-0 translate-middle-y"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
              >
                <FaChevronLeft />
              </Button>

              <Image
                src={album.images[currentIndex].url}
                alt={t("large_view")}
                style={{
                  maxHeight: "80vh",
                  maxWidth: "100%",
                  width: "auto",
                  margin: "0 auto",
                  display: "block",
                  objectFit: "contain",
                }}
              />

              <Button
                variant="light"
                className="position-absolute top-50 end-0 translate-middle-y"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <FaChevronRight />
              </Button>

              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#fff",
                  fontWeight: "bold",
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: "12px",
                  padding: "2px 10px",
                  fontSize: "1rem",
                }}
              >
                {currentIndex + 1}/{album.images.length}
              </div>
            </>
          )}
        </BootstrapModal.Body>
      </BootstrapModal>
    </Container>
  );
};

export default ViewAlbum;
