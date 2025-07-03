import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Row, Table, Tag, notification } from "antd";
import OrderForm from "./OrderForm";

const STATUS = {
  CHO_DONG_HANG: 1,
  CHO_GIAO_HANG: 2,
  DANG_GIAO_HANG: 3,
  CHO_THANH_TOAN: 4,
  DA_THANH_TOAN: 5,
  DA_HUY: 99,
};

const statusText = {
  [STATUS.CHO_DONG_HANG]: "Đang chờ đóng hàng",
  [STATUS.CHO_GIAO_HANG]: "Đang chờ giao hàng",
  [STATUS.DANG_GIAO_HANG]: "Đang giao hàng",
  [STATUS.CHO_THANH_TOAN]: "Đang chờ thanh toán",
  [STATUS.DA_THANH_TOAN]: "Đã thanh toán",
  [STATUS.DA_HUY]: "Đã huỷ",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [account, setAccount] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order?.account_id) fetchAccount(order.account_id);
  }, [order?.account_id]);

  const fetchOrder = () => {
    fetch(`http://localhost:8080/api/v1/orders/${id}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(({ code, data }) => {
        if (code === 200) {
          setOrder(data);
          setDataSource(data.items?.map((item, idx) => ({ key: item.uuid || idx, ...item })) || []);
        }
      })
      .catch(console.error);
  };

  const fetchAccount = (accountId) => {
    fetch(`http://localhost:8080/api/v1/accounts/${accountId}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(({ code, data }) => {
        if (code === 200) setAccount(data);
      })
      .catch(console.error);
  };

  const handleUpdateStatus = (newStatus) => {
    fetch(`http://localhost:8080/api/v1/orders/${order.uuid}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(res => res.json())
      .then(({ code, message }) => {
        if (code === 200) {
          notification.success({ message: "Cập nhật trạng thái thành công" });
          fetchOrder();
        } else {
          notification.error({ message });
        }
      })
      .catch(() => notification.error({ message: "Lỗi kết nối server" }));
  };

  const renderInfoRow = (label, value) => (
    <Row key={label}>
      <Col span={12} style={{ fontWeight: 600 }}>{label}:</Col>
      <Col span={12}>{value}</Col>
    </Row>
  );

  const columns = [
    { title: "Tên sản phẩm", dataIndex: ["variant", "title"], key: "title" },
    { title: "SKU", dataIndex: ["variant", "sku"], key: "sku" },
    { title: "Barcode", dataIndex: ["variant", "barcode"], key: "barcode" },
    {
      title: "Giá từng sản phẩm",
      dataIndex: ["variant", "price"],
      key: "unit_price",
      render: (price) => `${price?.toLocaleString()} đ`,
    },
    {
      title: "Kiểu",
      dataIndex: ["variant", "options"],
      key: "options",
      render: (options) =>
        options?.map((option, idx) => (
          <Tag key={idx} color="blue">{option.value}</Tag>
        )),
    },
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Tổng tiền",
      dataIndex: "price",
      key: "total_price",
      render: (price) => `${price?.toLocaleString()} đ`,
    },
  ];

  const statusButtons = [
    {
      label: "Đã đóng hàng",
      status: STATUS.CHO_GIAO_HANG,
      disabled: order?.status !== STATUS.CHO_DONG_HANG,
    },
    {
      label: "Đã giao hàng",
      status: STATUS.DANG_GIAO_HANG,
      disabled: order?.status !== STATUS.CHO_GIAO_HANG,
    },
    {
      label: "Huỷ đơn",
      status: STATUS.DA_HUY,
      disabled: order?.status >= STATUS.DANG_GIAO_HANG || order?.status === STATUS.DA_HUY,
      danger: true,
    },
  ];

  return (
    <div className="dashboard">
      <Row align="center">
        <Col span={12}>
          <h1>Chi tiết hàng đặt</h1>
        </Col>
        <Col span={12} style={{textAlign: 'end'}}>
          {/* <Button type="primary" onClick={() => setIsFormOpen(true)} style={{ marginRight: 10 }}>
            <i className="fas fa-edit"></i> Sửa
          </Button>
          <Button danger><i className="fas fa-trash"></i> Xoá</Button> */}
        </Col>
      </Row>

      <Card title="Thông tin người đặt" style={{ marginBottom: 10 }}>
        {account && (
          <>
            {renderInfoRow("Tên người đặt", account.user_name)}
            {renderInfoRow("Địa chỉ", account.address)}
            {renderInfoRow("Điện thoại", account.phone)}
            {renderInfoRow("Email", account.email)}
          </>
        )}
      </Card>

      <Card title="Thông tin sản phẩm" style={{ marginBottom: 10 }}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Card>

      <Card
        title="Thông tin đặt hàng"
        style={{ marginBottom: 10 }}
        extra={
          <div style={{ display: "flex", gap: 8 }}>
            {statusButtons.map((btn) => (
              <Button
                key={btn.label}
                type="primary"
                danger={btn.danger}
                disabled={btn.disabled}
                onClick={() => handleUpdateStatus(btn.status)}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        }
      >
        {order && (
          <>
            {renderInfoRow("Mã đặt hàng", order.uuid)}
            {renderInfoRow("Phương thức thanh toán", order.payment_method)}
            {renderInfoRow("Trạng thái", <Tag color={order.status === STATUS.DA_HUY ? "red" : "blue"}>
              {statusText[order.status]}
            </Tag>)}
          </>
        )}
      </Card>

      {isFormOpen && (
        <OrderForm order={order} onSave={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
      )}
    </div>
  );
};

export default OrderDetail;
