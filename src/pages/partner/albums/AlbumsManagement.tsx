import React, { useEffect, useState } from "react";
import {
  Container,
  Modal,
  Alert,
  Dropdown,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";
import { useAuth } from "../../../hooks/useAuth";
import AddAlbum from "./AddAlbum";
import UpdateAlbum from "./UpdateAlbum";
import ViewAlbum from "./ViewAlbum";

interface AlbumImage {
  _id: string;
  url: string;
  timestamp: string;
}

interface Album {
  _id: string;
  albumName: string;
  images: AlbumImage[];
}

const AlbumsManagement: React.FC = () => {
  useAuth();
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewAlbumId, setViewAlbumId] = useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [albumIdToDelete, setAlbumIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await API.get("/userAlbum");
        const albumsData: Album[] = response.data.albums || [];

        const albumsWithImages = await Promise.all(
          albumsData.map(async (album): Promise<Album> => {
            try {
              const imagesResponse = await API.get(
                `/albumImage/album/${album._id}`
              );
              const images: AlbumImage[] = imagesResponse.data.images || [];
              const sortedImages = images.sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              );
              return { ...album, images: sortedImages };
            } catch (error) {
              console.error(`Cannot load images for album ${album._id}`, error);
              return { ...album, images: [] };
            }
          })
        );

        setAlbums(albumsWithImages);
      } catch (error) {
        console.error("Cannot load album list", error);
        setError(t("error_load_albums"));
      }
    };

    fetchAlbums();
  }, [t]);

  const handleDeleteClick = (id: string) => {
    setAlbumIdToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!albumIdToDelete) return;
    try {
      await API.delete(`/userAlbum/${albumIdToDelete}`);
      setAlbums(albums.filter((a) => a._id !== albumIdToDelete));
      setShowDeleteConfirm(false);
      setAlbumIdToDelete(null);
    } catch (error) {
      console.error("Cannot delete album", error);
      setError(t("error_delete_album"));
      setShowDeleteConfirm(false);
    }
  };

  const reloadAlbums = () => {
    // Helper để gọi lại fetchAlbums khi cần
    const fetchAlbums = async () => {
      try {
        const response = await API.get("/userAlbum");
        const albumsData: Album[] = response.data.albums || [];

        const albumsWithImages = await Promise.all(
          albumsData.map(async (album): Promise<Album> => {
            try {
              const imagesResponse = await API.get(
                `/albumImage/album/${album._id}`
              );
              const images: AlbumImage[] = imagesResponse.data.images || [];
              const sortedImages = images.sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              );
              return { ...album, images: sortedImages };
            } catch (error) {
              console.error(`Cannot load images for album ${album._id}`, error);
              return { ...album, images: [] };
            }
          })
        );

        setAlbums(albumsWithImages);
      } catch (error) {
        console.error("Cannot reload album list", error);
        setError(t("error_load_albums"));
      }
    };

    fetchAlbums();
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="d-flex justify-content-between align-items-center my-3">
        <h4>{t("albums")}</h4>
      </div>

      <Row xs={2} sm={3} md={4} lg={5} className="g-3">
        {/* Create Album Card */}
        <Col>
          <Card
            className="h-100 d-flex align-items-center justify-content-center border"
            onClick={() => setShowAddModal(true)}
            style={{ cursor: "pointer", minHeight: 180 }}
          >
            <div className="fs-1 text-muted">+</div>
            <div className="text-muted">{t("create_album")}</div>
          </Card>
        </Col>

        {/* Albums */}
        {albums.map((album) => (
          <Col key={album._id}>
            <Card
              className="position-relative h-100"
              style={{ cursor: "pointer" }}
            >
              {/* Menu 3 chấm */}
              <Dropdown className="position-absolute top-0 end-0 m-1">
                <Dropdown.Toggle
                  as="div"
                  bsPrefix="custom-dropdown-toggle"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                    border: "none",
                  }}
                >
                  <BsThreeDots />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlbumId(album._id);
                      setShowEditModal(true);
                    }}
                  >
                    {t("edit")}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(album._id);
                    }}
                  >
                    {t("delete")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Album content */}
              <div
                onClick={() => {
                  setViewAlbumId(album._id);
                  setShowViewModal(true);
                }}
              >
                <Card.Img
                  variant="top"
                  src={
                    album.images.length > 0
                      ? album.images[0].url
                      : "https://via.placeholder.com/300x180?text=" +
                        t("no_image")
                  }
                  style={{ height: 180, objectFit: "cover" }}
                />
                <Card.Body className="px-2 py-2">
                  <div className="fw-bold text-truncate">{album.albumName}</div>
                  <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                    {album.images.length} {t("items")}
                  </div>
                </Card.Body>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Album Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("add_new_album")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAlbum
            onSuccess={() => {
              setShowAddModal(false);
              reloadAlbums();
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Edit Album Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("update_album")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAlbumId && (
            <UpdateAlbum
              albumId={selectedAlbumId}
              onSuccess={() => {
                setShowEditModal(false);
                reloadAlbums();
              }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* View Album Modal */}
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
          <Modal.Title style={{ flex: 1, textAlign: "center" }}></Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "10px" }}>
          {viewAlbumId && <ViewAlbum id={viewAlbumId} isModal />}
        </Modal.Body>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("confirm_delete_album")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("confirm_delete_message")}</Modal.Body>
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

export default AlbumsManagement;
