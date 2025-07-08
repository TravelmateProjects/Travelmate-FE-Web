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
import { FaImage, FaVideo, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const AddBlog: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: "",
    address: "",
    isAd: false,
    adTargetUrl: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5mtjxpAVAe11WGg2JNdR-imdm04QxHo3QA&s";

  useEffect(() => {}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra nội dung bắt buộc
    if (!formData.content.trim()) {
      setError("Nội dung là bắt buộc!");
      return;
    }
    // Kiểm tra giới hạn 10 ảnh
    if (images.length > 10) {
      setError(`Bạn đã chọn ${images.length} ảnh, tối đa chỉ 10 ảnh!`);
      return;
    }
    // Kiểm tra nếu không có ảnh hoặc video, hỏi người dùng
    if (images.length === 0 && !video) {
      const confirm = window.confirm(
        "Bạn chưa chọn ảnh hoặc video. Bạn có muốn đăng bài không?"
      );
      if (!confirm) return;
    }

    const data = new FormData();
    data.append("content", formData.content.trim());
    if (formData.address.trim())
      data.append("address", formData.address.trim());
    data.append("isAd", formData.isAd.toString());
    if (formData.isAd && formData.adTargetUrl.trim())
      data.append("adTargetUrl", formData.adTargetUrl.trim());
    images.forEach((img) => data.append("images", img));
    if (video) data.append("videos", video);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await API.post("/blog", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Đăng bài thành công!");
      setTimeout(() => {
        navigate("/partner/blog");
        window.location.reload();
      }, 1000);
    } catch {
      setError("Lỗi server, thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setError(null); // Xóa lỗi khi xóa ảnh
  };

  const handleAddImages = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    ); // Chỉ chấp nhận file ảnh
    if (newImages.length === 0) {
      setError("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }
    if (images.length + newImages.length > 10) {
      setError(
        `Bạn đã chọn ${
          images.length + newImages.length
        } ảnh, tối đa chỉ 10 ảnh!`
      );
      return;
    }
    setImages((prev) => [...prev, ...newImages]);
    setError(null); // Xóa lỗi khi thêm ảnh thành công
  };

  const handleAddVideo = (file: FileList | null) => {
    if (!file || !file.length) return;
    if (video) {
      setError("Chỉ được chọn 1 video!");
      return;
    }
    const selectedVideo = file[0];
    if (!selectedVideo.type.startsWith("video/")) {
      setError("Vui lòng chọn file video hợp lệ!");
      return;
    }
    setVideo(selectedVideo);
    setError(null); // Xóa lỗi khi thêm video thành công
  };

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ vị trí!");
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
            address: detailedAddress || "Vị trí không xác định",
          }));
          setError(null);
        } catch {
          setError("Lấy vị trí thất bại, thử lại nhé!");
        }
      },
      () => setError("Quyền vị trí bị từ chối!")
    );
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
          placeholder="Bạn đang nghĩ gì thế?"
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
          required
        />
        {images.length > 0 && (
          <Row className="mb-2">
            {images.map((file, index) => (
              <Col xs={4} key={index} className="position-relative">
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
        {video && (
          <div className="mb-2 position-relative">
            <video
              src={URL.createObjectURL(video)}
              controls
              className="w-100"
            />
            <CloseButton
              onClick={() => setVideo(null)}
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
            <FaImage /> Ảnh
          </Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            id="image-upload"
            hidden
            onChange={(e) =>
              handleAddImages((e.target as HTMLInputElement).files)
            }
          />
          <Form.Label
            htmlFor="video-upload"
            className="btn btn-outline-secondary d-flex align-items-center gap-1 p-1"
            style={{ minWidth: "60px" }}
          >
            <FaVideo /> Video
          </Form.Label>
          <Form.Control
            type="file"
            accept="video/*"
            id="video-upload"
            hidden
            onChange={(e) =>
              handleAddVideo((e.target as HTMLInputElement).files)
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
            <FaMapMarkerAlt /> Vị trí
          </Button>
          <Form.Control
            type="text"
            placeholder="Nhập vị trí"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
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
          label="Đây là bài viết quảng cáo"
          checked={formData.isAd}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              isAd: e.target.checked,
              adTargetUrl: e.target.checked ? prev.adTargetUrl : "",
            }))
          }
          className="mb-2"
        />
        {formData.isAd && (
          <Form.Control
            type="text"
            placeholder="URL quảng cáo"
            value={formData.adTargetUrl}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, adTargetUrl: e.target.value }))
            }
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
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Đang đăng..." : "Đăng bài"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddBlog;
