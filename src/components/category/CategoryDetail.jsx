import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Row, Tag, notification } from "antd";
import CategoryForm from "./CategoryForm";

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) fetchCategory();
  }, [id]);

  const fetchCategory = () => {
    fetch(`http://localhost:8080/api/v1/product-categories/${id}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(({ code, data }) => {
        if (code === 200) setCategory(data);
      })
      .catch(console.error);
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/v1/product-categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(({ code, message }) => {
        if (code === 200) {
          notification.success({ message: "Xoá danh mục thành công" });
        } else {
          notification.error({ message });
        }
      })
      .catch(() => notification.error({ message: "Lỗi kết nối server" }));
  };

  const renderInfoRow = (label, value) => (
    <Row key={label} style={{ marginBottom: 8 }}>
      <Col span={8} style={{ fontWeight: 600 }}>{label}:</Col>
      <Col span={16}>{value}</Col>
    </Row>
  );

  return (
    <div className="dashboard">
      <Row align="middle">
        <Col span={12}>
          <h1>Chi tiết danh mục</h1>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <Button type="primary" onClick={() => setIsFormOpen(true)} style={{ marginRight: 10 }}>
            <i className="fas fa-edit"></i> Sửa
          </Button>
          <Button danger onClick={handleDelete}>
            <i className="fas fa-trash"></i> Xoá
          </Button>
        </Col>
      </Row>

      <Card title="Thông tin danh mục">
        {category ? (
          <>
            {renderInfoRow("ID", category.uuid)}
            {renderInfoRow("Tên danh mục", category.title)}
            {renderInfoRow("Mô tả", category.description)}
            {renderInfoRow("Handle", category.handle)}
            {renderInfoRow("Trạng thái", category.deleted_at ? <Tag color="red">Đã xoá</Tag> : <Tag color="green">Hoạt động</Tag>)}
          </>
        ) : (
          <div>Đang tải dữ liệu...</div>
        )}
      </Card>

      {isFormOpen && (
        <CategoryForm
          category={category}
          onSave={() => {
            setIsFormOpen(false);
            fetchCategory();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default CategoryDetail;
