import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Tabs, 
  Select,
  Form,
  Input,
  Switch
} from 'antd';
import UploadImage from '../common/UploadImage';
import { getAllProductCategory } from '../../api/product-categories';

const LuaChonTabContent = ({ tabData, handleChange }) => {
  const [title, setTitle] = useState(tabData.title)
  const [values, setValues] = useState(tabData.values)
  // const handleChange = (event) => {
  //   const value = event.target.value;
  //   setTitle(value); 
  // }
const options = [];

  return (
    <div>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          id={tabData.key}
          value={title}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Values:</label>
        <Select
          mode="tags"
          style={{ width: '100%' }}
          tokenSeparators={[',']}
          options={options}
        />
      </div>
    </div>
  );
};

const { TabPane } = Tabs;
// const defaultPanes = new Array(2).fill(null).map((_, index) => {
//   const id = String(index + 1);
//   return {
//     label: `Tab ${id}`,
//     children: (
//     <>
//     <LuaChonTabContent tabName={`Tab ${index + 1}`} />
//     </>),
//     key: id,
//   };
// });

const ProductForm = ({ product, onSave, onCancel }) => {
  const fileInputRef = useRef(null);
  
  const [choiceList , setChoiceList] = useState([
    {
      tab: "Choice 1",
      key: 0,
      data: {
        title: 'empty',
        values: [],
      }
    },
  ]);

  const [formData, setFormData] = useState({
    id: product ? product.id : null,
    name: '',
    slug: '',   //ghi nho slugify name va them thoi gian them milisecond

    description: '',
    image: '',



    category: '',
    price: 0,
    stock: 0,
    description: '',
  });


  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image
      });
      setImagePreview(product.image);
    }
  }, [product]);

  const handleChange = (e) => {
    console.log(e.target.value)
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOptionChange = (e) => {
    const { name, value, id } = e.target;
    console.log(name, value, id)
    console.log(e.target)

    console.log(typeof  id)

    console.log(choiceList[id])

    const updatedData = choiceList.map(choice =>
      choice.key == id
        ? {
            ...choice,
            data: {
              ...choice.data,
              [name]: value,
            }
          }
        : choice
    );

    console.log(updatedData)

    setChoiceList(updatedData)
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug sản phẩm không được để trống';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Danh mục không được để trống';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'Số lượng không được âm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const priceFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });

  const categories = [
    'Giày', 'Quần áo', 'Dụng cụ', 'Phụ kiện', 'Thiết bị tập luyện'
  ];






  const [activeKey, setActiveKey] = useState(choiceList[0].key);
  const onChange = newActiveKey => {
    setActiveKey(newActiveKey);
  };
  const add = () => {
    const newKey = `${choiceList.length + 1}`;
    const newTab = {
      key: `${newKey}`,
      tab: `Choice ${choiceList.length + 1}`,
    };
    setChoiceList((prevTabs) => [...prevTabs, newTab]);

    const newChoice = {
      id: newKey,
      size: "idk",
      color: "idk",
    };

    // setChoices((prevChoice) => [...prevChoice, newChoice]);

    setActiveKey(newKey);
  };
  const remove = targetKey => {
    if (choiceList.length === 1) {
      return;
    }
    let newActiveKey = targetKey;
    let lastIndex;

    choiceList.forEach((tab, i) => {
      if (tab.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    console.log(lastIndex)

    const filteredTabs = choiceList.filter((tab) => tab.key !== targetKey);
    if (filteredTabs.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = filteredTabs[lastIndex].key;
      } else {
        newActiveKey = filteredTabs[0].key;
      }
    }
    for (let i = 0; i < filteredTabs.length; i++) {
      filteredTabs[i].tab = `Choice ${i + 1}`;
      filteredTabs[i].key = `${i + 1}`;
    }
    console.log(filteredTabs)
    setChoiceList(filteredTabs);

    // const filteredChoice = choices.filter((choice) => choice.id !== targetKey);
    // for (let i = 0; i < filteredChoice.length; i++) {
    //   filteredChoice[i].id = i + 1;
    // }
    // console.log(filteredChoice)

    // setChoices(filteredChoice);

    setActiveKey(newActiveKey);
  };
  const onEdit = (targetKey, action) => {
    console.log(action);
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

const [form] = Form.useForm();

useEffect(() => {
  getAllProductCategory()
    .then(response => {
      if (response.code === 200) {
        console.log('Product categories fetched successfully:', response.data);
      }
    })
}, []);

  return (
    // <div className="modal-overlay">
    //   <div className="product-form-modal" style={{width: '80%'}}>
    //     <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
    //     <form onSubmit={handleSubmit}>
    //       <Tabs defaultActiveKey="1" onChange={(key) => console.log(key)}>
    //         <TabPane tab="Thông tin sản phẩm" key="1">
    //           <div className="form-group">
    //             <label htmlFor="name">Tên sản phẩm:</label>
    //             <input
    //               type="text"
    //               id="name"
    //               name="name"
    //               value={formData.name}
    //               onChange={handleChange}
    //               className={errors.name ? 'error' : ''}
    //             />
    //             {errors.name && <div className="error-message">{errors.name}</div>}
    //           </div>
              
    //           <div className="form-group">
    //             <label htmlFor="name">Slug:</label>
    //             <input
    //               type="text"
    //               id="slug"
    //               name="slug"
    //               value={formData.slug}
    //               onChange={handleChange}
    //               className={errors.slug ? 'error' : ''}
    //             />
    //             {errors.slug && <div className="error-message">{errors.slug}</div>}
    //           </div>

    //           <div className="form-group">
    //             <label htmlFor="description">Mô tả sản phẩm:</label>
    //             <textarea
    //               id="description"
    //               name="description"
    //               value={formData.description}
    //               onChange={handleChange}
    //               rows="4"
    //               className={errors.description ? 'error' : ''}
    //             ></textarea>
    //             {errors.description && <div className="error-message">{errors.description}</div>}
    //           </div>
              
    //           <div className="form-group">
    //             <label>Hình ảnh sản phẩm:</label>
    //             <input
    //               type="file"
    //               accept="image/*"
    //               ref={fileInputRef}
    //               style={{ display: 'none' }}
    //               onChange={handleImageChange}
    //             />
    //             <div className="file-upload-container">
    //               <button 
    //                 type="button" 
    //                 className="file-upload-button"
    //                 onClick={triggerFileInput}
    //               >
    //                 <i className="fas fa-upload"></i> Chọn ảnh từ máy tính
    //               </button>
    //               <span className="file-name">
    //                 {imagePreview ? 'Đã chọn ảnh' : 'Chưa chọn ảnh nào'}
    //               </span>
    //             </div>

    //             {imagePreview && (
    //               <div className="image-preview">
    //                 <img 
    //                   src={imagePreview} 
    //                   alt="Xem trước"
    //                   onError={(e) => {
    //                     e.target.onerror = null;
    //                     e.target.parentNode.innerHTML = '<div class="image-placeholder"><i class="fas fa-image"></i></div>';
    //                   }}
    //                 />
    //               </div>
    //             )}
    //           </div>

    //           <div className="form-actions">
    //             <button type="button" className="cancel-button" onClick={onCancel}>
    //               Hủy
    //             </button>
    //             <button type="submit" className="save-button">
    //               Tiếp theo
    //             </button>
    //           </div>
    //         </TabPane>
            
    //         <TabPane tab="Lựa chọn" key="2">
    //           <div style={{ marginBottom: 16 }}>
    //             <Button onClick={add}>ADD</Button>
    //           </div>
    //           <Tabs
    //             type="editable-card"
    //             hideAdd
    //             onChange={onChange}
    //             defaultActiveKey="1"
    //             onEdit={onEdit}
    //           >
    //             {choiceList.map((info, x) => {
    //               return (
    //                 <TabPane tab={info.tab} key={info.key}>
    //                   <LuaChonTabContent tabData={info} handleChange={handleOptionChange}></LuaChonTabContent>
    //                 </TabPane> 
    //               );
    //             })}
    //           </Tabs>
    //           <div className="form-actions">
    //             <button type="button" className="cancel-button" onClick={onCancel}>
    //               Hủy
    //             </button>
    //             <button type="submit" className="save-button">
    //               Tiếp theo
    //             </button>
    //           </div>
    //         </TabPane>
    //          header |  title | sku | barcode | weight | height | width | length |inventory_quantity |options |prices|
    //         body  | input  title | input sku | input barcode | input weight | input height | input width | input length | input inventory_quantity | show options | input prices|
            
    //         <TabPane tab="Variant" key="3">
    //           <table border="1">
    //             <thead>
    //               <tr>
    //                 <th>Title</th>
    //                 <th>SKU</th>
    //                 <th>Barcode</th>
    //                 <th>Weight</th>
    //                 <th>Height</th>
    //                 <th>Wwidth</th>
    //                 <th>Length</th>
    //                 <th>Inventory quantity</th>
    //                 <th>Options</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               <tr>
    //                 <td><input type="text" name="title" /></td>
    //                 <td><input type="text" name="sku" /></td>
    //                 <td><input type="text" name="barcode" /></td>
    //                 <td><input type="number" step="any" name="weight" /></td>
    //                 <td><input type="number" step="any" name="height" /></td>
    //                 <td><input type="number" step="any" name="width" /></td>
    //                 <td><input type="number" step="any" name="length" /></td>
    //                 <td><input type="number" name="inventory_quantity" /></td>
    //                 <td><button type="button">Show Options</button></td>
    //               </tr>
    //             </tbody>
    //           </table>
              
    //         <div className="form-actions">
    //             <button type="button" className="cancel-button" onClick={onCancel}>
    //               Hủy
    //             </button>
    //             <button type="submit" className="save-button">
    //               {product ? 'Cập nhật' : 'Thêm mới'}
    //             </button>
    //           </div>
    //         </TabPane>
    //       </Tabs>
    //     </form>
        
    //   </div>
    // </div>
    <Form
            form={form}
            layout="vertical"
          >
          <Tabs defaultActiveKey="1" onChange={(key) => console.log(key)}>
            <TabPane tab="Thông tin sản phẩm" key="1">
              <Form.Item name="title" label="Tên sản phẩm" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="description" label="Mô tả sản phẩm">
                <Input.TextArea />
              </Form.Item>

              <Form.Item name="status" label="Hiển thị" valuePropName="checked">
                <Switch />
              </Form.Item>

              {/* <Form.Item name="thumbnail" label="Hình ảnh sản phẩm">
                <UploadImage onUploadSuccess={(url) => {
                  console.log('Image uploaded:', url);
                }} />
              </Form.Item> */}
              {/* <div className="form-group">
                <label htmlFor="name">Slug:</label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={errors.slug ? 'error' : ''}
                />
                {errors.slug && <div className="error-message">{errors.slug}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả sản phẩm:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={errors.description ? 'error' : ''}
                ></textarea>
                {errors.description && <div className="error-message">{errors.description}</div>}
              </div>
              
              <div className="form-group">
                <label>Hình ảnh sản phẩm:</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <div className="file-upload-container">
                  <button 
                    type="button" 
                    className="file-upload-button"
                    onClick={triggerFileInput}
                  >
                    <i className="fas fa-upload"></i> Chọn ảnh từ máy tính
                  </button>
                  <span className="file-name">
                    {imagePreview ? 'Đã chọn ảnh' : 'Chưa chọn ảnh nào'}
                  </span>
                </div>

                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview} 
                      alt="Xem trước"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentNode.innerHTML = '<div class="image-placeholder"><i class="fas fa-image"></i></div>';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onCancel}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  Tiếp theo
                </button>
              </div> */}
            </TabPane>
            
            <TabPane tab="Lựa chọn" key="2">
              <div style={{ marginBottom: 16 }}>
                <Button onClick={add}>ADD</Button>
              </div>
              <Tabs
                type="editable-card"
                hideAdd
                onChange={onChange}
                defaultActiveKey="1"
                onEdit={onEdit}
              >
                {choiceList.map((info, x) => {
                  return (
                    <TabPane tab={info.tab} key={info.key}>
                      <LuaChonTabContent tabData={info} handleChange={handleOptionChange}></LuaChonTabContent>
                    </TabPane> 
                  );
                })}
              </Tabs>
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onCancel}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  Tiếp theo
                </button>
              </div>
            </TabPane>
             header |  title | sku | barcode | weight | height | width | length |inventory_quantity |options |prices|
            body  | input  title | input sku | input barcode | input weight | input height | input width | input length | input inventory_quantity | show options | input prices|
            
            <TabPane tab="Variant" key="3">
              <table border="1">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>SKU</th>
                    <th>Barcode</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Wwidth</th>
                    <th>Length</th>
                    <th>Inventory quantity</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="text" name="title" /></td>
                    <td><input type="text" name="sku" /></td>
                    <td><input type="text" name="barcode" /></td>
                    <td><input type="number" step="any" name="weight" /></td>
                    <td><input type="number" step="any" name="height" /></td>
                    <td><input type="number" step="any" name="width" /></td>
                    <td><input type="number" step="any" name="length" /></td>
                    <td><input type="number" name="inventory_quantity" /></td>
                    <td><button type="button">Show Options</button></td>
                  </tr>
                </tbody>
              </table>
              
            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onCancel}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  {product ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </TabPane>
          </Tabs>
          </Form>
  );
};

export default ProductForm;
