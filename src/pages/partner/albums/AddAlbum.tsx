import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, Image, Spinner } from "react-bootstrap";
import API from "../../../services/api";
import { BiImageAdd } from "react-icons/bi";

interface AddAlbumProps {
  onSuccess: () => void;
}

const AddAlbum: React.FC<AddAlbumProps> = ({ onSuccess }) => {
  const [albumName, setAlbumName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = files.length + selectedFiles.length;
    if (totalFiles > 20) {
      setError(
        "Cannot upload more images. The maximum is 20 images per album."
      );
      return;
    }
    setFiles([...files, ...selectedFiles]);
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
    if (totalFiles === 20) {
      setError("Maximum of 20 images reached. No more images can be added.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
    if (files.length + previews.length <= 20) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumName) {
      setError("Please enter an album name.");
      return;
    }
    if (files.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create a new album
      const albumResponse = await API.post("/userAlbum", { albumName });
      const albumId = albumResponse.data.album._id;

      // Step 2: Upload images to the album
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      await API.post(`/albumImage/upload/${albumId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlbumName("");
      setFiles([]);
      setPreviews([]);
      setError(null);
      onSuccess();
    } catch (err) {
      console.error("Error creating album:", err);
      setError("Failed to create album.");
    } finally {
      setLoading(false);
    }
  };

  const isFormEmpty = !albumName && files.length === 0;

  return (
    <div className="container-fluid" style={{ padding: "20px" }}>
      <div className="row">
        {/* Left side: Input and Upload Section */}
        <div className="col-md-4 p-3 bg-light">
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-4">
              <Form.Label>Album Name</Form.Label>
              <Form.Control
                type="text"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
                placeholder="Enter album name"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Select Images (Maximum 20)</Form.Label>
              <div className="custom-file-upload">
                <Button
                  variant="outline-primary"
                  as="label"
                  htmlFor="file-upload"
                  className="d-flex align-items-center"
                >
                  <BiImageAdd className="me-2" /> Select Images
                </Button>
                <Form.Control
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={files.length >= 20}
                  style={{ display: "none" }}
                />
              </div>
            </Form.Group>
            <div>
              <Button
                variant={isFormEmpty ? "secondary" : "primary"}
                type="submit"
                disabled={isFormEmpty || loading}
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
                    Uploading...
                  </>
                ) : isFormEmpty ? (
                  <>Upload Images</>
                ) : (
                  "Upload Images"
                )}
              </Button>
            </div>
          </Form>
        </div>

        {/* Right side: Image Previews Section */}
        <div className="col-md-8 p-3">
          <h5>Selected Images</h5>
          {previews.length === 0 ? (
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
              No images selected
            </div>
          ) : (
            <Row>
              {previews.map((preview, index) => (
                <Col xs={6} md={4} key={index} className="mb-3">
                  <div style={{ position: "relative" }}>
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
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
                      onClick={() => handleRemoveImage(index)}
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

export default AddAlbum;
