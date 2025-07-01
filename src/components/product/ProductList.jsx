import React from 'react';
import { Table, Button, Space, Avatar, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price ?? 0);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'uuid',
      key: 'uuid',
      sorter: (a, b) => a.uuid.localeCompare(b.uuid),
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail, record) => {
        const fallbackImg =
          'https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/object_cube.png';
        console.log(thumbnail)
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
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => (a.category || '').localeCompare(b.category || ''),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => formatPrice(price),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
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
            onClick={() => navigate(`/admin/product/${record.uuid}`)}
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
      dataSource={products}
      columns={columns}
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => navigate(`/admin/products/${record.uuid}`),
        style: { cursor: 'pointer' },
      })}
      locale={{ emptyText: 'Không có sản phẩm nào' }}
    />
  );
};

export default ProductList;
