import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Row, Tag } from 'antd';
import AccountForm from './AccountForm';

const AccountDetail = () => {
  const { id } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAccount();
  }, [id]);

  const fetchAccount = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/accounts/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.code === 200) {
        setAccount(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsFormOpen(true);

  const handleSave = () => {
    setIsFormOpen(false);
    fetchAccount(); // Reload sau khi lưu
  };

  const renderInfoRow = (label, value) => (
    <Row key={label} style={{ marginBottom: '8px' }}>
      <Col span={12} style={{ fontWeight: 600 }}>{label}:</Col>
      <Col span={12}>{value}</Col>
    </Row>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <Row align="center">
        <Col span={12}>
          <h1>Chi tiết tài khoản</h1>
        </Col>
        <Col span={12} style={{textAlign: 'end'}}>
          <Button type="primary" onClick={handleEdit} style={{ marginRight: '10px' }}>
            <i className="fas fa-edit"></i> Sửa
          </Button>
          <Button danger><i className="fas fa-trash"></i> Xoá</Button>
        </Col>
      </Row>

      <Card title="Thông tin tài khoản" bordered={false}>
        {renderInfoRow("Mã tài khoản", account.uuid)}
        {renderInfoRow("Tên người dùng", account.user_name)}
        {renderInfoRow("Email", account.email)}
        {renderInfoRow("Ảnh đại diện", account.avatar_url ? (
          <img src={account.avatar_url} alt="Avatar" style={{ width: 60, height: 60, borderRadius: '50%' }} />
        ) : 'Chưa có')}
        {renderInfoRow("Địa chỉ", account.address)}
        {renderInfoRow("Số điện thoại", account.phone)}
      </Card>

      {isFormOpen && (
        <AccountForm
          account={account}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AccountDetail;
