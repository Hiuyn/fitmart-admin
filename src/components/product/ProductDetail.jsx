import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Row, Table, Tag, notification } from "antd";
import ProductForm from "./ProductForm";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [productOptions, setProductOptions] = useState([]);
  const [productVariants, setProductVariants] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [detailRes, optionsRes, variantsRes] = await Promise.all([
        fetch(`http://localhost:8080/api/v1/products/${id}`, { headers: getHeaders() }),
        fetch(`http://localhost:8080/api/v1/products/${id}/options`, { headers: getHeaders() }),
        fetch(`http://localhost:8080/api/v1/products/${id}/variants`, { headers: getHeaders() }),
      ]);

      const detailData = await detailRes.json();
      const optionsData = await optionsRes.json();
      const variantsData = await variantsRes.json();

      setProduct(detailData.data);
      setProductOptions(optionsData.data.data);
      setProductVariants(variantsData.data.data);
    } catch (error) {
      console.error(error);
      notification.error({ message: "Lỗi khi tải dữ liệu sản phẩm" });
    } finally {
      setLoading(false);
    }
  };

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const handleDelete = () => {
    fetch(`http://localhost:8080/api/v1/products/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    })
      .then((res) => res.json())
      .then(({ code, message }) => {
        if (code === 200) {
          notification.success({ message: "Xoá sản phẩm thành công" });
        } else {
          notification.error({ message });
        }
      })
      .catch(() => notification.error({ message: "Lỗi kết nối server" }));
  };

  const optionColumns = [
    { title: "Tên lựa chọn", dataIndex: "title", key: "title" },
    {
      title: "Giá trị",
      dataIndex: "values",
      key: "values",
      render: (values) => {values.join(", ")},
    },
  ];

  const variantColumns = [
    { title: "Tên biến thể", dataIndex: "title", key: "title" },
    { title: "SKU", dataIndex: "sku", key: "sku" },
    { title: "Barcode", dataIndex: "barcode", key: "barcode" },
    {
      title: "Trọng lượng",
      dataIndex: "weight",
      key: "weight",
      render: (w) => `${w}g`,
    },
    {
      title: "Kích thước (D x R x C)",
      key: "dimensions",
      render: (_, record) =>
        `${record.length || 0} x ${record.width || 0} x ${record.height || 0} cm`,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (p) => (p !== null ? `${p.toLocaleString()}₫` : "0₫"),
    },
    {
      title: "Lựa chọn",
      dataIndex: "options",
      key: "options",
      render: (opts) =>
        opts?.length > 0
          ? opts.map((o, idx) => (
              <Tag color="blue" key={idx}>{o.value}</Tag>
            ))
          : null,
    },
  ];

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="dashboard">
      <Row align="middle" style={{ marginBottom: 20 }}>
        <Col span={12}>
          <h1>Chi tiết sản phẩm</h1>
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

      <Card title="Thông tin sản phẩm" style={{ marginBottom: 20 }}>
        <Row gutter={[16, 8]}>
          <Col span={8}><b>ID:</b> {product.uuid}</Col>
          <Col span={8}><b>Tiêu đề:</b> {product.title}</Col>
          <Col span={8}><b>Slug:</b> {product.slug}</Col>
          <Col span={8}><b>Trạng thái:</b> <Tag color="blue">{product.status}</Tag></Col>
          <Col span={8}><b>Loại:</b> {product.type}</Col>
          <Col span={24}><b>Miêu tả:</b> {product.description}</Col>
        </Row>
      </Card>

      <Card title="Lựa chọn sản phẩm" style={{ marginBottom: 20 }}>
        <Table
          dataSource={productOptions.map((o, idx) => ({ key: o.uuid || idx, ...o }))}
          columns={optionColumns}
          pagination={false}
        />
      </Card>

      <Card title="Danh sách biến thể">
        <Table
          dataSource={productVariants.map((v, idx) => ({ key: v.uuid || idx, ...v }))}
          columns={variantColumns}
          pagination={false}
        />
      </Card>

      {isFormOpen && (
        <ProductForm
          product={product}
          onSave={() => {
            setIsFormOpen(false);
            fetchProductData();
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;
