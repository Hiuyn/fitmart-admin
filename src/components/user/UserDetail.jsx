import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Col, Row, Tag } from 'antd';
import UserForm from './UserForm';

const UserDetail = () => {
  const { id } = useParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.code === 200) setUser(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsFormOpen(true);
  const handleSave = () => {
    setIsFormOpen(false);
    fetchUser(); // Load lại data sau khi edit
  };

  const renderInfoRow = (label, value) => (
    <Row key={label} style={{ marginBottom: '8px' }}>
      <Col span={8} style={{ fontWeight: 600 }}>{label}:</Col>
      <Col span={16}>{value}</Col>
    </Row>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <Row align="center">
        <Col span={12}>
          <h1>Chi tiết người dùng</h1>
        </Col>
        <Col span={12} style={{textAlign: 'end'}}>
          <Button type="primary" onClick={handleEdit} style={{ marginRight: '10px' }}>
            <i className="fas fa-edit"></i> Sửa
          </Button>
          <Button danger><i className="fas fa-trash"></i> Xoá</Button>
        </Col>
      </Row>

      <Card title="Thông tin người dùng" bordered={false}>
        {renderInfoRow("Mã người dùng", user.uuid)}
        {renderInfoRow("Tên người dùng", user.user_name)}
        {renderInfoRow("Email", user.email)}
        {renderInfoRow("Role", user.role)}
        <Row style={{ marginBottom: '8px' }}>
          <Col span={8} style={{ fontWeight: 600 }}>Permissions:</Col>
          <Col span={16}>
            {user.permissions && user.permissions.length > 0 ? (
              user.permissions.map((per, idx) => (
                <Tag key={idx} color="blue">{per}</Tag>
              ))
            ) : ''}
          </Col>
        </Row>
        {renderInfoRow("Avatar", user.avatar_url ? (
          <img src={user.avatar_url} alt="Avatar" style={{ width: 60, height: 60, borderRadius: '50%' }} />
        ) : 'Chưa có')}
      </Card>

      {isFormOpen && (
        <UserForm 
          user={user} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default UserDetail;
