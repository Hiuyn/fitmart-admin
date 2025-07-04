import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Badge, Button, Card, Col, Modal, Row, Table, Tag, notification } from "antd";
import CategoryForm from "./CategoryForm";
import ProductList from "../product/ProductList";

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProductKeys, setSelectedProductKeys] = useState([]);
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

  const fetchAllProducts = () => {
    fetch(`http://localhost:8080/api/v1/products`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(({ code, data }) => {
        if (code === 200) setAllProducts(data.data.filter(item => item.category_id === id && item.category_id));
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

  const handleAddProducts = () => {
    setIsProductModalOpen(true);
    fetchAllProducts();
  };

  const handleConfirmAddProducts = () => {
    const currentSelected = selectedProductKeys;
    const existing = category?.products?.map(p => p.uuid) || [];

    const created = currentSelected.filter(id => !existing.includes(id));
    const deleted = existing.filter(id => !currentSelected.includes(id));

    console.log("Created:", created);
    console.log("Deleted:", deleted);

    if (created.length || deleted.length) {
      const payload = {
        created,
        updated: [],
        deleted
      };

      fetch(`http://localhost:8080/api/v1/product-categories/${id}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(({ code, message }) => {
          if (code === 200) {
            notification.success({ message: "Thêm sản phẩm vào danh mục thành công" });
            setIsProductModalOpen(false);
            setSelectedProductKeys([]);
            fetchCategory();
          } else {
            notification.error({ message });
          }
        })
        .catch(() => notification.error({ message: "Lỗi kết nối server" }))
        .finally(() => {
          setIsProductModalOpen(false);
          setSelectedProductKeys([]);
        });
    }
  };

  const productColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail, record) => {
        const fallbackImg =
          'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/object_cube.png';
        return (
          <Avatar
            shape="square"
            size={64}
            src={thumbnail || fallbackImg}
            alt={record.title}
          />
        );
      },
    },
    { title: "Tên sản phẩm", dataIndex: "title", key: "title" },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
         status === 'active' ? <Badge status="success" text={status} />
        : <Badge status="error" text={status} />
      ),
    },
  ];

  useEffect(() => {
    if (category?.products) {
      const selectedIds = category.products.map(p => p.uuid);
      setSelectedProductKeys(selectedIds);
    }
  }, [category]);

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

      <Card title="Thông tin danh mục" style={{marginBottom: '10px'}}>
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
      <Card title="Thông tin sản phẩm" extra={
        <Button type="primary" onClick={handleAddProducts}>
          <i className="fas fa-plus"></i> Thêm sản phẩm
        </Button>
      }>
        {category?.products && (
          <ProductList products={category?.products} onEdit={() => {}} onDelete={() => {}} isAction={false}/>
        )}
      </Card>

      <Modal
        title="Chọn sản phẩm để thêm vào danh mục"
        open={isProductModalOpen}
        onCancel={() => {
          setIsProductModalOpen(false);
          setSelectedProductKeys(category?.products?.map(p => p.uuid) || []);
        }}
        onOk={handleConfirmAddProducts}
        okText="Xác nhận"
        cancelText="Hủy"
        width={800}
      >
        <Table
          rowKey="uuid"
          rowSelection={{
            selectedRowKeys: selectedProductKeys,
            onChange: setSelectedProductKeys,
          }}
          columns={productColumns}
          dataSource={allProducts}
          pagination={{ pageSize: 5 }}
        />
      </Modal>

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
