import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col, Image, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import API from "../../../services/api";
import { BiImageAdd } from "react-icons/bi";

interface UpdateAlbumProps {
  albumId: string;
  onSuccess: () => void;
}

interface AlbumImage {
  _id: string;
  url: string;
}

const UpdateAlbum: React.FC<UpdateAlbumProps> = ({ albumId, onSuccess }) => {
  const { t } = useTranslation();
  const [albumName, setAlbumName] = useState("");
  const [originalAlbumName, setOriginalAlbumName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<AlbumImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await API.get(`/userAlbum/${albumId}`);
        const name = response.data.album.albumName;
        setAlbumName(name);
        setOriginalAlbumName(name);
        const imagesResponse = await API.get(`/albumImage/album/${albumId}`);
        setExistingImages(imagesResponse.data.images || []);
      } catch (err) {
        console.error("Error fetching album info:", err);
        setError(t("error_load_album_info"));
      }
    };
    fetchAlbum();
  }, [albumId, t]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalImages =
      existingImages.length -
      imagesToDelete.length +
      files.length +
      selectedFiles.length;
    if (totalImages > 20) {
      setError(t("error_max_images"));
      return;
    }
    setFiles([...files, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    if (totalImages === 20) {
      setError(t("error_max_images_reached"));
    } else {
      setError(null);
    }
  };

  const handleRemoveExistingImage = (imageId: string) => {
    setImagesToDelete([...imagesToDelete, imageId]);
    setExistingImages(existingImages.filter((img) => img._id !== imageId));
    setError(null); // Clear error if removal brings total under 20
  };

  const handleRemoveNewImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    setError(null); // Clear error if removal brings total under 20
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName) {
      setError(t("error_no_album_name"));
      return;
    }

    setLoading(true);
    try {
      // Step 1: Update album name
      await API.put(`/userAlbum/${albumId}`, { albumName });

      // Step 2: Delete marked images
      if (imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          await API.delete(`/albumImage/${imageId}`);
        }
      }

      // Step 3: Upload new images if any
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        await API.post(`/albumImage/upload/${albumId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setAlbumName("");
      setFiles([]);
      setPreviews([]);
      setImagesToDelete([]);
      setError(null);
      onSuccess();
    } catch (err) {
      console.error("Error updating album:", err);
      setError(t("error_update_album"));
    } finally {
      setLoading(false);
    }
  };

  const isFormUnchanged =
    albumName === originalAlbumName &&
    files.length === 0 &&
    imagesToDelete.length === 0;

  return (
    <div className="container-fluid" style={{ padding: "20px" }}>
      <div className="row">
        {/* Left side: Input and Upload Section */}
        <div className="col-md-4 p-3 bg-light">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-4">
              <Form.Label>{t("album_name")}</Form.Label>
              <Form.Control
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder={t("enter_album_name")}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>{t("select_new_images")}</Form.Label>
              <div className="custom-file-upload">
                <Button
                  variant="outline-primary"
                  as="label"
                  htmlFor="file-upload"
                  className="d-flex align-items-center"
                >
                  <BiImageAdd className="me-2" /> {t("select_images_button")}
                </Button>
                <Form.Control
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            </Form.Group>
            <div>
              <Button
                variant={isFormUnchanged ? "secondary" : "primary"}
                type="submit"
                disabled={isFormUnchanged || loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    {t("updating")}
                  </>
                ) : isFormUnchanged ? (
                  t("update_album_button")
                ) : (
                  t("update_album_button")
                )}
              </Button>
            </div>
          </Form>
        </div>

        {/* Right side: Image Previews Section */}
        <div className="col-md-8 p-3">
          <h5>{t("selected_images")}</h5>
          {previews.length === 0 && existingImages.length === 0 ? (
            <div
              style={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                color: "#666",
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("no_images_selected")}
            </div>
          ) : (
            <Row>
              {existingImages.map((image) => (
                <Col xs={6} md={4} key={image._id} className="mb-3">
                  <div style={{ position: "relative" }}>
                    <Image
                      src={image.url}
                      alt={t("existing_image")}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        borderRadius: "50%",
                      }}
                      onClick={() => handleRemoveExistingImage(image._id)}
                    >
                      X
                    </Button>
                  </div>
                </Col>
              ))}
              {previews.map((preview, index) => (
                <Col xs={6} md={4} key={index} className="mb-3">
                  <div style={{ position: "relative" }}>
                    <Image
                      src={preview}
                      alt={`${t("preview")} ${index}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Button
                      variant="danger"
                      size="sm"
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        borderRadius: "50%",
                      }}
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      X
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateAlbum;
