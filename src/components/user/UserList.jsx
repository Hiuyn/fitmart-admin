import React from 'react';
import { Table, Avatar, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const UserList = ({ users, onEdit, onDelete }) => {
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
      title: 'Ảnh đại diện',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => (
        url ? (
          <Avatar src={url} icon={<UserOutlined />} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role.toLowerCase() === 'admin' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
      sorter: (a, b) => a.role.localeCompare(b.role),
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
                    onClick={() => navigate(`/admin/users/${record.uuid}`)}
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
      dataSource={users}
      columns={columns}
      rowKey="uuid"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default UserList;
