import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Image,
  Row,
  Col,
  Stack,
  CloseButton,
  Alert,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FaImage, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

interface UpdateBlogProps {
  blogId?: string | null;
}

interface Media {
  publicId: string;
  url: string;
}

const UpdateBlog: React.FC<UpdateBlogProps> = ({ blogId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    content: "",
    address: "",
    isAd: false,
    adTargetUrl: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<Media[]>([]);
  const [existingVideos, setExistingVideos] = useState<Media[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5mtjxpAVAe11WGg2JNdR-imdm04QxHo3QA&s";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await API.get(`/blog/${id || blogId}`);
        const blog = response.data.blog;
        setFormData({
          content: blog.content,
          address: blog.address || "",
          isAd: blog.isAd,
          adTargetUrl: blog.adTargetUrl || "",
        });
        setExistingImages(
          blog.images.map((img: { publicId: string; url: string }) => ({
            publicId: img.publicId,
            url: img.url,
          }))
        );
        setExistingVideos(
          blog.videos.map((vid: { publicId: string; url: string }) => ({
            publicId: vid.publicId,
            url: vid.url,
          }))
        );
      } catch {
        setError(t("error_load_blog"));
      }
    };
    if (id || blogId) fetchBlog();
  }, [id, blogId, t]);

  const handleImageChange = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (newImages.length === 0) {
      setError(t("error_invalid_image"));
      return;
    }
    if (images.length + existingImages.length + newImages.length > 10) {
      setError(
        t("error_max_images", {
          count: images.length + existingImages.length + newImages.length,
        })
      );
      return;
    }
    setImages((prev) => [...prev, ...newImages]);
    setIsDirty(true);
    setError(null);
  };

  const handleVideoChange = (file: FileList | null) => {
    if (!file || !file.length) return;
    if (video || existingVideos.length > 0) {
      setError(t("error_one_video"));
      return;
    }
    const selectedVideo = file[0];
    if (!selectedVideo.type.startsWith("video/")) {
      setError(t("error_invalid_video"));
      return;
    }
    setVideo(selectedVideo);
    setIsDirty(true);
    setError(null);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
    setError(null);
  };

  const handleVideoRemove = () => {
    setVideo(null);
    setIsDirty(true);
    setError(null);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
    setError(null);
  };

  const handleRemoveExistingVideo = (index: number) => {
    setExistingVideos((prev) => prev.filter((_, i) => i !== index));
    setIsDirty(true);
    setError(null);
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setError(t("error_no_geolocation"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          if (!res.ok) throw new Error("Lấy vị trí thất bại!");
          const { address } = await res.json();
          const detailedAddress = [
            address.road,
            address.suburb || address.neighbourhood,
            address.city_district || address.town || address.village,
            address.state || address.county,
            address.country,
          ]
            .filter(Boolean)
            .join(", ")
            .trim();
          setFormData((prev) => ({
            ...prev,
            address: detailedAddress || t("unknown_location"),
          }));
          setIsDirty(true);
          setError(null);
        } catch {
          setError(t("error_geolocation_failed"));
        }
      },
      () => setError(t("error_geolocation_denied"))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDirty) {
      setError(t("error_no_changes"));
      return;
    }
    if (!formData.content.trim()) {
      setError(t("error_required_content"));
      return;
    }
    if (images.length + existingImages.length > 10) {
      setError(
        t("error_max_images", {
          count: images.length + existingImages.length,
        })
      );
      return;
    }
    if (
      images.length + existingImages.length === 0 &&
      !video &&
      existingVideos.length === 0
    ) {
      const confirm = window.confirm(t("confirm_no_media"));
      if (!confirm) return;
    }

    const data = new FormData();
    data.append("content", formData.content.trim());
    if (formData.address.trim())
      data.append("address", formData.address.trim());
    data.append("isAd", formData.isAd.toString());
    if (formData.isAd && formData.adTargetUrl.trim())
      data.append("adTargetUrl", formData.adTargetUrl.trim());
    data.append(
      "existingImagePublicIds",
      JSON.stringify(existingImages.map((img) => img.publicId))
    );
    data.append(
      "existingVideoPublicIds",
      JSON.stringify(existingVideos.map((vid) => vid.publicId))
    );
    images.forEach((image) => data.append("images", image));
    if (video) data.append("videos", video);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await API.put(`/blog/${id || blogId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(t("success_update"));
      setTimeout(() => {
        navigate("/partner/blog");
        window.location.reload();
      }, 1000);
    } catch {
      setError(t("error_server"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      className="p-3 shadow-sm"
      style={{
        maxWidth: 600,
        margin: "20px auto",
        borderRadius: 20,
        backgroundColor: "#fff",
        color: "#212529",
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Stack
          direction="horizontal"
          gap={2}
          className="mb-3 align-items-center"
        >
          <Image src={defaultAvatar} roundedCircle width={40} height={40} />
        </Stack>
        <Form.Control
          as="textarea"
          placeholder={t("placeholder_thoughts")}
          className="border-0 shadow-none mb-3"
          style={{
            resize: "none",
            height: "80px",
            backgroundColor: "#f0f2f5",
            color: "#212529",
            borderRadius: 12,
          }}
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          onBlur={() => setIsDirty(true)}
          required
        />
        {existingImages.length > 0 && (
          <Row className="mb-2">
            {existingImages.map((img, index) => (
              <Col
                xs={4}
                key={`existing-${img.publicId}`}
                className="position-relative"
              >
                <Image
                  src={img.url}
                  thumbnail
                  className="w-100 h-100"
                  style={{ objectFit: "cover", aspectRatio: "1/1" }}
                />
                <CloseButton
                  onClick={() => handleRemoveExistingImage(index)}
                  style={{ position: "absolute", top: 5, right: 5 }}
                />
              </Col>
            ))}
          </Row>
        )}
        {images.length > 0 && (
          <Row className="mb-2">
            {images.map((file, index) => (
              <Col xs={4} key={`new-${index}`} className="position-relative">
                <Image
                  src={URL.createObjectURL(file)}
                  thumbnail
                  className="w-100 h-100"
                  style={{ objectFit: "cover", aspectRatio: "1/1" }}
                />
                <CloseButton
                  onClick={() => handleImageRemove(index)}
                  style={{ position: "absolute", top: 5, right: 5 }}
                />
              </Col>
            ))}
          </Row>
        )}
        {existingVideos.length > 0 && (
          <div className="mb-2 position-relative">
            {existingVideos.map((vid, index) => (
              <div
                key={`existing-video-${vid.publicId}`}
                className="position-relative"
              >
                <video src={vid.url} controls className="w-100" />
                <CloseButton
                  onClick={() => handleRemoveExistingVideo(index)}
                  style={{ position: "absolute", top: 5, right: 5 }}
                />
              </div>
            ))}
          </div>
        )}
        {video && (
          <div className="mb-2 position-relative">
            <video
              src={URL.createObjectURL(video)}
              controls
              className="w-100"
            />
            <CloseButton
              onClick={handleVideoRemove}
              style={{ position: "absolute", top: 5, right: 5 }}
            />
          </div>
        )}
        <div className="d-flex gap-1 mb-2">
          <Form.Label
            htmlFor="image-upload"
            className="btn btn-outline-secondary d-flex align-items-center gap-1 p-1"
            style={{ minWidth: "60px" }}
          >
            <FaImage /> {t("image")}
          </Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            id="image-upload"
            hidden
            onChange={(e) =>
              handleImageChange((e.target as HTMLInputElement).files)
            }
          />
          <Form.Label
            htmlFor="video-upload"
            className="btn btn-outline-secondary d-flex align-items-center gap-1 p-1"
            style={{ minWidth: "60px" }}
          >
            <FaVideo /> {t("video")}
          </Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            id="video-upload"
            hidden
            onChange={(e) =>
              handleVideoChange((e.target as HTMLInputElement).files)
            }
          />
        </div>
        <div className="d-flex gap-1 mb-2 align-items-center">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-1 p-1"
            onClick={handleUpdateLocation}
            style={{ minWidth: "80px" }}
          >
            <FaMapMarkerAlt /> {t("location")}
          </Button>
          <Form.Control
            type="text"
            placeholder={t("placeholder_location")}
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            onBlur={() => setIsDirty(true)}
            className="flex-grow-1"
            style={{
              minWidth: "200px",
              maxWidth: "400px",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          />
        </div>
        <Form.Check
          type="checkbox"
          label={t("ad_checkbox")}
          checked={formData.isAd}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isAd: e.target.checked,
              adTargetUrl: e.target.checked ? prev.adTargetUrl : "",
            }))
          }
          onBlur={() => setIsDirty(true)}
          className="mb-2"
        />
        {formData.isAd && (
          <Form.Control
            type="text"
            placeholder={t("ad_url_placeholder")}
            value={formData.adTargetUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, adTargetUrl: e.target.value }))
            }
            onBlur={() => setIsDirty(true)}
            className="mb-2"
          />
        )}
        {error && (
          <Alert variant="danger" className="mt-2">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mt-2">
            {success}
          </Alert>
        )}
        <div className="d-grid mt-3" style={{ textAlign: "center" }}>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? t("submitting") : t("update_button")}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default UpdateBlog;
