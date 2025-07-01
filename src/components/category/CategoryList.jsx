import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tooltip, Space, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [sorter, setSorter] = useState({ field: 'id', order: 'ascend' });

  const handleTableChange = (pagination, filters, sorterObj) => {
    if (sorterObj.order) {
      setSorter({
        field: sorterObj.field,
        order: sorterObj.order,
      });
    } else {
      setSorter({ field: 'id', order: 'ascend' });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
      sorter: (a, b) => a.uuid.localeCompare(b.uuid),
      sortOrder: sorter.field === 'uuid' ? sorter.order : null,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sorter.field === 'title' ? sorter.order : null,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => (a.description || '').localeCompare(b.description || ''),
      sortOrder: sorter.field === 'description' ? sorter.order : null,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) =>
        is_active ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng hoạt động</Tag>
        ),
      filters: [
        { text: 'Hoạt động', value: true },
        { text: 'Ngừng hoạt động', value: false },
      ],
      onFilter: (value, record) => record.is_active === value,
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
            onClick={() => navigate(`/admin/category/${record.uuid}`)}
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
      dataSource={categories}
      columns={columns}
      pagination={true}
      onChange={handleTableChange}
      onRow={(record) => ({
        onClick: () => navigate(`/admin/category/${record.uuid}`),
        style: { cursor: 'pointer' },
      })}
      locale={{ emptyText: 'Không có danh mục nào' }}
    />
  );
};

export default CategoryList;
