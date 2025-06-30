import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const ProductDetail = () => {
  const { id } = useParams(); // gets the ":id" from the URL

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [product, setProduct] = useState({});
  const [productOptions, setProductOptions] = useState({});
  const [productVariants, setProductVariants] = useState({});

  useEffect(() => {
      fetchUsers(); // Your API expects 1-based page numbers
    }, []);
    const [ready, setReady] = useState(false);
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      const responseDetail = await fetch(`http://localhost:8080/api/v1/products/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseOptionDetail = await fetch(`http://localhost:8080/api/v1/products/${id}/options`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseVariantDetail = await fetch(`http://localhost:8080/api/v1/products/${id}/variants`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
  
  
      const data = await responseDetail.json();
      const dataOptions = await responseOptionDetail.json();
      const dataVariants = await responseVariantDetail.json();

      console.log(dataOptions.data.data)
      console.log(dataVariants.data.data)
  
      setProduct(data.data)
      setProductOptions(dataOptions.data.data)
      setProductVariants(dataVariants.data.data)

      setReady(true);
    };
  
  const handleEdit = () => {
    setIsFormOpen(true);
  };

  const sampleProduct = {
    product: {
        uuid: "prod123",
        title: "Hoddie",
        slug: "hoddie",
        description: "Comfortable cotton hoddie",
        thumbnail: "hoddie.jpg",
        status: "active",
        type: "physical",
        category_id: "cat123",
        collection_id: "col123",
        metadata: {
            color: "blue"
        }
    },
    options: {
        created: [
            {
                title: "size",
                values: [
                    "S",
                    "M"
                ]
            },
            {
                title: "color",
                values: [
                    "Red",
                    "Blue"
                ]
            }
        ],
        updated: [],
        deleted: []
    },
    variants: {
        created: [
            {
                title: "Small Blue Hoddie",
                sku: "HODDIE-SM-BLUE",
                barcode: "123456789",
                weight: 200,
                height: 0,
                width: 0,
                length: 0,
                inventory_quantity: 50,
                options: {
                    size: "s",
                    color: "blue"
                },
                prices: [
                    {
                        title: "",
                        amount: 0
                    }
                ]
            },
            {
                title: "Large Blue Hoddie",
                sku: "HODDIE-LG-BLUE",
                barcode: "987654321",
                weight: 220,
                height: 0,
                width: 0,
                length: 0,
                inventory_quantity: 30,
                options: {
                    size: "l",
                    color: "blue"
                },
                prices: [
                    {
                        title: "",
                        amount: 0
                    }
                ]
            },
            {
                title: "Small Red Hoddie",
                sku: "HODDIE-SM-RED",
                barcode: "123456798",
                weight: 200,
                height: 0,
                width: 0,
                length: 0,
                inventory_quantity: 50,
                options: {
                    size: "s",
                    color: "red"
                },
                prices: [
                    {
                        title: "",
                        amount: 0
                    }
                ]
            },
            {
                title: "Large Red Hoddie",
                sku: "HODDIE-LG-RED",
                barcode: "987654312",
                weight: 220,
                height: 0,
                width: 0,
                length: 0,
                inventory_quantity: 30,
                options: {
                    size: "l",
                    color: "red"
                },
                prices: [
                    {
                        title: "",
                        amount: 0
                    }
                ]
            }
        ],
        updated: [],
        deleted: []
    }
};


  const handleSave = (order) => {
    setIsFormOpen(false);
  };
  

  if (!ready) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div>
        <h1>Chi tiết sản phẩm: </h1>
      
        <div className='detail-actions'>
          <button className="detail-edit-button" onClick={(e) => {e.stopPropagation(); handleEdit()}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
            <i className="fas fa-edit"></i>
            <div>Sửa</div>
          </button>
          <button className="detail-delete-button" onClick={(e) => {e.stopPropagation();}} style={{display: 'flex', gap: '.5rem', paddingRight: '30px', paddingLeft: '30px'}}>
            <i className="fas fa-trash"></i>
            <div>Xoá</div>
          </button>
        </div>
      </div>

      <div className="product-list" style={{marginBottom: '40px'}}>
        <h2 style={{padding: '20px', backgroundColor: '#D3D3D3'}}>Thông tin sản phẩm</h2>

        <table className='detail-table'>
          <tbody>
            <tr className='head'>
              <th className='id-row' style={{width: '140px'}}>ID Sản phẩm</th>
              <td>{product["uuid"]}</td>
            </tr>
            <tr>
              <th>Tiêu đề</th>
              <td>{product["title"]}</td>
            </tr>
            <tr>
              <th>Slug</th>
              <td>{product["slug"]}</td>
            </tr>
            <tr>
              <th>Miêu tả</th>
              <td>{product["description"]}</td>
            </tr>
            <tr>
              <th>Trạng thái</th>
              <td>{product["status"]}</td>
            </tr>
            <tr>
              <th>Loại</th>
              <td>{product["type"]}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="product-list" style={{marginBottom: '40px'}}>
        <h2 style={{padding: '20px', backgroundColor: '#D3D3D3'}}>Lựa chọn</h2>

        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>Option Type</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {productOptions.map(option => (
              <tr key={option.uuid}>
                <td>{option.title}</td>
                <td>{option.values.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="product-list">
        <h2 style={{padding: '20px', backgroundColor: '#D3D3D3'}}>Biến thể khác nhau</h2>

        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>Weight</th>
              <th>Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {productVariants.map(variant => (
              <tr key={variant.uuid}>
                <td>{variant.title}</td>
                <td>{variant.sku}</td>
                <td>{variant.barcode}</td>
                <td>{variant.weight}g</td>
                <td>{variant.price !== null ? `${variant.price.toLocaleString()}₫` : 'N/A'}</td>
                <td>
                  {variant.options.length > 0
                    ? variant.options.map(opt => opt.value).join(', ')
                    : 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ProductForm 
          product={sampleProduct} 
          onSave={handleSave} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProductDetail; 