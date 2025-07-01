import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Avatar, Button, Space } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

const AccountList = ({ accounts, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
      width: 150,
      sorter: (a, b) => a.uuid.localeCompare(b.uuid),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) =>
        url ? (
          <Avatar src={url} size={40} />
        ) : (
          <Avatar icon={<UserOutlined />} size={40} />
        ),
      width: 100,
    },
    {
      title: 'Tên tài khoản',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div
          style={{
            width: '72px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            justifyItems: 'center', // Căn giữa từng nút theo chiều ngang
            alignItems: 'center',
          }}
        >
          <Button
            color='default'
            variant='filled'
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/accounts/${record.uuid}`)}
          />
          <Button
            color='primary'
            variant='filled'
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
          />
          <Button
            color='danger'
            variant='filled'
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(record);
            }}
          />
        </div>
      ),
      width: 100,
      align: 'center',
    },
  ];

  return (
    <Table
      rowKey="uuid"
      dataSource={accounts}
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default AccountList;
