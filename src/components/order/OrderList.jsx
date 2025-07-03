import { Table, Button, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const OrderList = ({ orders, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: 'Tài khoản',
      dataIndex: 'account_id',
      key: 'account_id',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_txt',
      key: 'status_txt',
      render: (text, record) => {
        let color = 'blue';
        if (record.status === 99) color = 'red';
        else if (record.status === 1) color = 'orange';
        else if (record.status === 2) color = 'green';

        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_fee',
      key: 'total_fee',
      render: (fee) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(fee),
    },
    {
      title: 'Thao tác',
      key: 'action',
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
            onClick={() => navigate(`/admin/order/${record.uuid}`)}
          />
          {/* <Button
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
          /> */}
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="uuid"
      columns={columns}
      dataSource={orders}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrderList;
