import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Statistics = () => {
  // Dữ liệu mẫu cho biểu đồ doanh thu
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

  // Dữ liệu mẫu cho biểu đồ danh mục sản phẩm
  const categoryData = [
    { name: 'Giày', value: 35 },
    { name: 'Quần áo', value: 30 },
    { name: 'Dụng cụ', value: 20 },
    { name: 'Phụ kiện', value: 10 },
    { name: 'Thiết bị tập luyện', value: 5 },
  ];

  // Màu sắc cho biểu đồ tròn
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  // Thống kê tổng quan
  const overviewStats = [
    { id: 1, title: 'Tổng doanh thu', value: '256.800.000 ₫', icon: 'fa-money-bill-wave', color: 'blue' },
    { id: 2, title: 'Tổng sản phẩm', value: '127', icon: 'fa-box', color: 'green' },
    { id: 3, title: 'Tổng đơn hàng', value: '843', icon: 'fa-shopping-cart', color: 'orange' },
    { id: 4, title: 'Khách hàng mới', value: '38', icon: 'fa-users', color: 'purple' },
  ];

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
      
      <div className="stat-charts">
        <div className="chart-container">
          <h2>Doanh thu theo tháng</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => value / 1000000 + 'M'} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
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
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="recent-activity">
        <h2>Hoạt động gần đây</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon green">
              <i className="fas fa-cart-plus"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text"><strong>Đơn hàng mới</strong> từ Nguyễn Văn A</p>
              <p className="activity-time">20 phút trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon blue">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text"><strong>Khách hàng mới</strong> đã đăng ký</p>
              <p className="activity-time">1 giờ trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon orange">
              <i className="fas fa-box"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text"><strong>Sản phẩm mới</strong> đã được thêm vào kho</p>
              <p className="activity-time">3 giờ trước</p>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon red">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="activity-content">
              <p className="activity-text"><strong>Cảnh báo:</strong> Hàng tồn kho thấp cho sản phẩm XYZ</p>
              <p className="activity-time">5 giờ trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 