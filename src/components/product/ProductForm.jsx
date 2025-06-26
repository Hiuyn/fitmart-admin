import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Tabs, 
  Select,
  Form,
  Input,
  Switch,
  Modal,
  Space,
  Table,
  Tag,
  InputNumber
} from 'antd';
import UploadImage from '../common/UploadImage';
import { getAllProductCategory } from '../../api/product-categories';
import {
  PlusOutlined
} from '@ant-design/icons';
import { jsonToFormData } from '../../util/helpers';
import { createProduct } from '../../api/products';

const LuaChonTabContent = ({ fieldName }) => {
  // const [title, setTitle] = useState(tabData.title)
  // const [values, setValues] = useState(tabData.values)
  // const handleChange = (event) => {
  //   const value = event.target.value;
  //   setTitle(value); 
  // }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Form.Item
        name={[fieldName, 'title']}
        label="Title"
        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
      >
        <Input placeholder="Nhập tiêu đề" />
      </Form.Item>

      <Form.Item
        name={[fieldName, 'values']}
        label="Values"
        rules={[{ required: true, message: 'Vui lòng nhập ít nhất 1 giá trị' }]}
      >
        <Select
          mode="tags"
          style={{ width: '100%' }}
          tokenSeparators={[',']}
          placeholder="Nhập các giá trị, cách nhau bởi dấu phẩy"
        />
      </Form.Item>
    </Space>
    // <div>
    //   <div className="form-group">
        
    //     <label>Title:</label>
    //     <input
    //       type="text"
    //       name="title"
    //       id={tabData.key}
    //       value={title}
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="form-group">
    //     <label>Values:</label>
    //     <Select
    //       mode="tags"
    //       style={{ width: '100%' }}
    //       tokenSeparators={[',']}
    //       options={options}
    //     />
    //   </div>
    // </div>
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

const ProductForm = ({ product, isModalOpen, onSave, onCancel }) => {
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






  const [activeKey, setActiveKey] = useState("");
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
    console.log(action, targetKey);
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  const [form] = Form.useForm();
  const [options, setOptions] = useState([])
  const [image, setImage] = useState(null);

  useEffect(() => {
    getAllProductCategory()
      .then(response => {
        if (response.code === 200) {
          let data = response.data.data;
          const categories = data.map(category => {
            return {
              value: category.uuid,
              label: category.title
            };
          })
          setOptions(categories);
          console.log('Product categories fetched successfully:', response.data);
        }
      }).catch(error => {
        setOptions([]);
      });
  }, []);

  // const options = [
  //   { value: 'jack', label: 'Jack' },
  //   { value: 'lucy', label: 'Lucy' },
  //   { value: 'Yiminghe', label: 'yiminghe' },
  //   { value: 'disabled', label: 'Disabled', disabled: true },
  // ]

  const onFinish = () => {
    // console.log(values);
      form.validateFields().then(values => {
        let temp = {
          "product": {
              "title": values.title,
              "slug": values.slug,
              "description": values.description,
              "thumbnail": image?.length > 0 ? `uploads/${image[0].file.name}` : "",
              "status": values.status ? "acitve" : "inactive",
              "type": "",
              "category_id": values.category_id,
              "collection_id": "",
              "metadata": {}
          },
          "options": {
            "created": values.options,
            "updated": [],
            "deleted": []
          },
          "variants": {
              "created": values.variants,
              "updated": [],
              "deleted": []
          }
        }
        console.log(temp)
        // jsonToFormData(temp, formData)
        createProduct(temp).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      })
  };
  
  const [activeTab, setActiveTab] = useState("1");
  const [maxTab, setMaxTab] = useState("1");
const [variantTable, setVariantTable] = useState([]);

  const changeTab = async (targetKey) => {
    const current = parseInt(activeTab, 10);
    const target = parseInt(targetKey, 10);

    try {
      // Chỉ validate khi muốn tiến tới tab cao hơn chưa từng vào
      console.log(target, maxTab, targetKey, activeTab)
      if (target > current) {
        if (activeTab === "1") {
          await form.validateFields(["title", "slug"]);
        }
        if (activeTab === "2") {
          const fields = form.getFieldValue("options") || [];
          const validateNames = fields.map((_, index) => [ "options", index, "title" ]);
          validateNames.push(...fields.map((_, index) => [ "options", index, "values" ]));

          await form.validateFields(validateNames);
        }

        if (targetKey === "3") {
          const formValues = form.getFieldsValue();
          const options = formValues.options || [];
          const productTitle = formValues.title || "";

          const combinations = generateCombinations(options);
          const formatted = formatCombinations(options, combinations);

          const variants = formatted.map((comboObj, idx) => {
          const comboValues = Object.values(comboObj); // ["M", "Black"]
          const sku = [productTitle, ...comboValues].join("-").toUpperCase();

          return {
            key: idx,
            title: productTitle,
            sku,
            barcode: "",
            height: 0,
            length: 0,
            weight: 0,
            width: 0,
            price: 0,
            inventory_quantity: 0,
            options: comboObj, // Giữ object dạng { Size: "M", Color: "Black" }
          };
        });

          setVariantTable(variants);
          form.setFieldsValue({ variants });
        }
      }

      setActiveTab(targetKey);
      if (target > parseInt(maxTab, 10)) setMaxTab(target);

    } catch (error) {
      console.log("Lỗi validate:", error);
    }
  };

  const generateCombinations = (options) => {
    if (!options || options.length === 0) return [[]];

    const [first, ...rest] = options;
    const restComb = generateCombinations(rest);

    return first.values.length
      ? first.values.flatMap(value =>
          restComb.map(comb => [value, ...comb])
        )
      : restComb;
  };

  const formatCombinations = (options, combinations) => {
    return combinations.map(comb => {
      const obj = {};
      options.forEach((opt, index) => {
        obj[opt.title.toLowerCase()] = comb[index];
      });
      return obj;
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      options: [{ title: '', values: [] }]
    });
    setTimeout(() => {
      setActiveKey("0"); // fields.length là index của item mới
    }, 0)
  }, []);

  const [variantData, setVariantData] = useState([]);

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
      <Modal
        width={1000}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => {
          console.log('Modal OK clicked');
          form.validateFields().then(onFinish).catch((error) => {
            console.error('Validation failed:', error);
          });
        }}
        onCancel={() => {
          form.resetFields()
          setActiveTab("1")
          setMaxTab("1")
          onCancel();
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            {activeTab !== "3" ? <Button type="primary" onClick={() => changeTab((parseInt(activeTab) + 1).toString())}>Tiếp theo</Button> :
            <OkBtn />}
          </>
        )}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Tabs activeKey={activeTab} onChange={changeTab}>
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

              <Form.Item label="Danh mục sản phẩm" name="category_id">
                <Select
                  options={options}
                />
              </Form.Item>

              <Form.Item name="thumbnail" label="Hình ảnh sản phẩm">
                <UploadImage setImage={(file) => {
                  setImage(file)
                  // form.setFieldValue('thumbnail', file)
                }} />
              </Form.Item>
            </TabPane>
            
            <TabPane tab="Lựa chọn" key="2">
              <Form.List name="options">
                {(fields, { add, remove }) => {
                  const handleAdd = () => {
                    add({ title: '', values: [] });
                    setTimeout(() => {
                      setActiveKey(fields.length.toString()); // fields.length là index của item mới
                    }, 0);
                  };

                  const handleRemove = (targetKey) => {
                    if (fields.length !== 1) {
                      const fieldIndex = fields.findIndex(f => f.name.toString() === targetKey);
                      if (fieldIndex > -1) {
                        remove(fieldIndex);
                        if (fields.length) {
                          const nextTab = fieldIndex > 0
                            ? fields[fieldIndex - 1].name.toString()
                            : fields[0].name.toString();
  
                          setActiveKey(nextTab);
                        }
                      }
                    }
                  };

                  const handleEdit = (targetKey, action) => {
                    if (action === 'add') handleAdd();
                    else if (action === 'remove') handleRemove(targetKey);
                  };

                  return(<>
                    <div style={{ marginBottom: 16 }}>
                      <Button type="dashed" onClick={() => handleEdit(null, 'add')} icon={<PlusOutlined />}>
                        Thêm lựa chọn
                      </Button>
                    </div>
                    <Tabs type="editable-card" hideAdd defaultActiveKey="1" activeKey={activeKey} onChange={onChange} onEdit={handleEdit}>
                      {fields.map(({ key, name }) => (
                        <Tabs.TabPane tab={`Choice ${Number(name) + 1}`} key={name.toString()} closable>
                          <LuaChonTabContent fieldName={name} />
                        </Tabs.TabPane>
                      ))}
                    </Tabs>
                  </>)
                }}
              </Form.List>
              {/* <Form.List name="options">
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
                  {choiceList.map((info, index) => {
                    return (
                      <TabPane tab={info.tab} key={info.key}>
                        <LuaChonTabContent fieldName={index}/>
                      </TabPane> 
                    );
                  })}
                </Tabs>
              </Form.List> */}
              {/* <div className="form-actions">
                <Button type="button" onClick={onCancel}>
                  Hủy
                </Button>
                <Button type="button" onClick={nextTab}>
                  Tiếp theo
                </Button>
              </div> */}
            </TabPane>
            <TabPane tab="Variant" key="3">
              {/* <table border="1">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>SKU</th>
                    <th>Barcode</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>Width</th>
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
              </table> */}
              {/* <Form.List name="variants">
                {(fields) => {
                  const columns = [
                    {
                      title: 'Title',
                      dataIndex: 'title',
                      render: (_, record, index) => (
                        <Form.Item
                          name={['variants', index, 'title']}
                          rules={[{ required: true, message: 'Vui lòng nhập Title' }]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'SKU',
                      dataIndex: 'sku',
                      render: (_, record, index) => (
                        <Form.Item
                          name={['variants', index, 'sku']}
                          rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Barcode',
                      dataIndex: 'barcode',
                      render: (_, __, index) => (
                        <Form.Item name={[index, "barcode"]} noStyle>
                          <Input placeholder="Barcode" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Weight',
                      dataIndex: 'weight',
                      render: (_, __, index) => (
                        <Form.Item name={[index, "weight"]} noStyle>
                          <Input placeholder="Weight" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Height',
                      dataIndex: 'height',
                      render: (_, __, index) => (
                        <Form.Item name={[index, "height"]} noStyle>
                          <Input placeholder="Height" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Width',
                      dataIndex: 'width',
                      render: (_, __, index) => (
                        <Form.Item name={[index, "width"]} noStyle>
                          <Input placeholder="Width" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Length',
                      dataIndex: 'length',
                      render: (_, __, index) => (
                        <Form.Item name={[index, "length"]} noStyle>
                          <Input placeholder="Length" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Inventory Quantity',
                      dataIndex: 'inventory_quantity',
                      render: (_, __, index) => (
                        <Form.Item
                          name={['variants', index, 'inventory_quantity']}
                          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Price',
                      dataIndex: 'price',
                      render: (_, __, index) => (
                        <Form.Item
                          name={['variants', index, 'price']}
                          rules={[{ required: true, message: 'Vui lòng nhập Price' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Options',
                      dataIndex: 'options',
                      render: (_, __, index) => (
                        <span>
                          {variantData[index]?.combination?.map((val, idx) => (
                            <Tag key={idx} color="blue">{val}</Tag>
                          ))}
                        </span>
                      )
                    }
                  ];

                  return (
                    <Table
                      pagination={false}
                      columns={columns}
                      dataSource={variantTable}
                      rowKey={(record) => record.key || record.name}
                    />
                  );
                }}
              </Form.List> */}
              <Table
                      pagination={false}
                      columns={[
                    {
                      title: 'Title',
                      dataIndex: 'title',
                      render: (_, record, index) => (
                        <Form.Item
                          name={['variants', index, 'title']}
                          rules={[{ required: true, message: 'Vui lòng nhập Title' }]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'SKU',
                      dataIndex: 'sku',
                      render: (_, record, index) => (
                        <Form.Item
                          name={['variants', index, 'sku']}
                          rules={[{ required: true, message: 'Vui lòng nhập SKU' }]}
                        >
                          <Input />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Barcode',
                      dataIndex: 'barcode',
                      render: (_, __, index) => (
                        <Form.Item name={['variants', index, "barcode"]} noStyle>
                          <Input placeholder="Barcode" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Weight',
                      dataIndex: 'weight',
                      render: (_, __, index) => (
                        <Form.Item name={['variants', index, "weight"]} noStyle>
                          <Input placeholder="Weight" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Height',
                      dataIndex: 'height',
                      render: (_, __, index) => (
                        <Form.Item name={['variants', index, "height"]} noStyle>
                          <Input placeholder="Height" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Width',
                      dataIndex: 'width',
                      render: (_, __, index) => (
                        <Form.Item name={['variants', index, "width"]} noStyle>
                          <Input placeholder="Width" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Length',
                      dataIndex: 'length',
                      render: (_, __, index) => (
                        <Form.Item name={['variants', index, "length"]} noStyle>
                          <Input placeholder="Length" />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Inventory Quantity',
                      dataIndex: 'inventory_quantity',
                      render: (_, __, index) => (
                        <Form.Item
                          name={['variants', index, 'inventory_quantity']}
                          rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Price',
                      dataIndex: 'price',
                      render: (_, __, index) => (
                        <Form.Item
                          name={['variants', index, 'price']}
                          rules={[{ required: true, message: 'Vui lòng nhập Price' }]}
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      )
                    },
                    {
                      title: 'Options',
                      dataIndex: 'options',
                      render: (_, record, index) => (
                        <>
                        <Form.Item
                          name={['variants', index, 'options']}
                        >
                          {Object.values(record.options).map((item, idx) => (
                            <Tag color="blue" key={idx}>
                              {item}
                            </Tag>
                          ))}
                        </Form.Item>
                          {/* {record.combination?.map((item, index) => (
                            // <pre>{item}</pre>
                            <Tag color="blue" key={index}>
                              {item}
                            </Tag>
                          ))} */}
                        </>
                        // <span>
                        //   {record?.combination}
                        //   {/* {variantTable[index]?.combination?.map((val, idx) => (
                        //     <>
                        //     <pre>{val}</pre>
                        //     <Tag key={idx} color="blue">{val}</Tag>
                        //     </>
                        //   ))} */}
                        // </span>
                      )
                    }
                  ]}
                      dataSource={variantTable}
                      rowKey={(record) => record.key || record.name}
                    />

              
            {/* <div className="form-actions">
                <button type="button" className="cancel-button" onClick={onCancel}>
                  Hủy
                </button>
                <button type="submit" className="save-button">
                  {product ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div> */}
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
  );
};

export default ProductForm;
