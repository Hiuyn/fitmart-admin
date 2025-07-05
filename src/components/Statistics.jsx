import { Badge, Col, notification, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  const [categoryData, setCategoryData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const revenueData = [
    { name: 'T1', revenue: 15000000 },
    { name: 'T2', revenue: 17500000 },
    { name: 'T3', revenue: 16800000 },
    { name: 'T4', revenue: 19200000 },
    { name: 'T5', revenue: 21500000 },
    { name: 'T6', revenue: 22800000 },
    { name: 'T7', revenue: 20100000 },
    { name: 'T8', revenue: 23500000 },
    { name: 'T9', revenue: 24700000 },
    { name: 'T10', revenue: 26200000 },
    { name: 'T11', revenue: 28500000 },
    { name: 'T12', revenue: 31000000 },
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const fetchAllStatistics = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, productsRes, ordersRes, categoryRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/accounts', { headers }),
        fetch('http://localhost:8080/api/v1/products', { headers }),
        fetch('http://localhost:8080/api/v1/orders', { headers }),
        fetch('http://localhost:8080/api/v1/product-categories', { headers }),
      ]);

      const [usersData, productsData, ordersData, categoryData] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        ordersRes.json(),
        categoryRes.json()
      ]);

      setStats({
        totalUsers: usersData.data?.data.filter(item => !item.deleted_at).length ?? 0,
        totalProducts: productsData?.data.data.filter(item => !item.deleted_at).length ?? 0,
        totalOrders: ordersData.data?.data.filter(item => !item.deleted_at).length ?? 0,
        totalRevenue: ordersData.data?.data.reduce((sum, order) => sum + order.total_fee, 0) ?? 0
      });

      setCategoryData(
        categoryData.data?.data.map(item => ({
          name: item?.title,
          value: item?.products.length ?? 0
        }))
      );

      setOrderData(ordersData.data?.data)

    } catch (err) {
      notification.error({ message: 'Lỗi khi lấy dữ liệu thống kê' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStatistics();
  }, []);

  const overviewStats = [
    { id: 1, title: 'Tổng doanh thu', value: formatCurrency(stats.totalRevenue), icon: 'fa-money-bill-wave', color: 'blue' },
    { id: 2, title: 'Tổng sản phẩm', value: stats.totalProducts, icon: 'fa-box', color: 'green' },
    { id: 3, title: 'Tổng đơn hàng', value: stats.totalOrders, icon: 'fa-shopping-cart', color: 'orange' },
    { id: 4, title: 'Khách hàng mới', value: stats.totalUsers, icon: 'fa-users', color: 'purple' },
  ];

  const orderSummary = useMemo(() => {
    let countHoanThanh = 0;
    let countDaHuy = 0;
    let countChoXuLy = 0;

    orderData?.forEach(order => {
      if (order.status === 5) {
        countHoanThanh++;
      } else if (order.status === 99) {
        countDaHuy++;
      } else {
        countChoXuLy++;
      }
    });

    return [
      { name: 'Hoàn thành', value: countHoanThanh, color: "success" },
      { name: 'Đơn huỷ', value: countDaHuy, color: "error" },
      { name: 'Đơn chờ xử lý', value: countChoXuLy, color: "processing" }
    ];
  }, [orderData]);

  return (
    <div className="statistics">
      <h1>Thống kê</h1>

      <div className="stat-overview">
        {overviewStats.map(stat => (
          <div className={`stat-card ${stat.color}`} key={stat.id}>
            <div className="stat-icon">
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-activity" style={{marginBottom: '30px'}}>
        <Row>
          <Col span={4}>
            <h2>Đơn hàng</h2>
          </Col>
          <Col span={20} style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
             {
              orderSummary.map((item, idx) => 
                <ActivityItem key={idx} color={item.color} name={item.name} value={item.value} />
              )
            }
          </Col>
        </Row>
      </div>

      <div className="stat-charts">
        <div className="chart-container">
          <h2>Doanh thu theo tháng</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => value / 1_000_000 + 'M'} />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>Phân bố sản phẩm theo danh mục</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} sản phẩm`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ color, name, value }) => (
  <div>
    <h3>{value}</h3>
    <Badge status={color} text={name} />
  </div>
);

export default Statistics;
