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
import { formatSkus, getDateTimeString, jsonToFormData, uploadFile } from '../../util/helpers';
import { createProduct, updateProduct } from '../../api/products';

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

  // useEffect(() => {
  //   if (product) {
  //     setFormData({
  //       id: product.id,
  //       name: product.name,
  //       category: product.category,
  //       price: product.price,
  //       stock: product.stock,
  //       description: product.description || '',
  //       image: product.image
  //     });
  //     setImagePreview(product.image);
  //   }
  // }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleOptionChange = (e) => {
    const { name, value, id } = e.target;

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
    setChoiceList(filteredTabs);
    setActiveKey(newActiveKey);
  };
  const onEdit = (targetKey, action) => {
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
        }
      }).catch(error => {
        setOptions([]);
      });
  }, []);

  const onFinish = () => {
      form.validateFields().then(async values => {
        let thumbnailUrl = '';
        if (image[0].uid !== '-1' && image?.length > 0) {
          thumbnailUrl = await uploadFile(image[0].file);
        } else {
          thumbnailUrl = values.thumbnail
        }

        const variantsWithImage = await Promise.all(
          values.variants.map(async (variant) => {
            if (variant.image[0].uid !== '-1' && variant.image.length > 0) {
              const uploadedUrl = await uploadFile(variant.image[0].file);
              return { ...variant, image: uploadedUrl };
            } else {
              return {...variant, image: variant.image[0].url}
            }
            return variant;
          })
        );
        /** Phân loại options **/
    const currentOptions = values.options || [];
    const createdOptions = currentOptions.filter(opt => !opt.uuid);
    const updatedOptions = currentOptions.filter(opt => {
      const old = originalOptions.find(o => o.uuid === opt.uuid);
      return old && JSON.stringify(old) !== JSON.stringify(opt);
    });
    const deletedOptions = originalOptions.filter(old => !currentOptions.some(opt => opt.uuid === old.uuid)).map(opt => opt.uuid);

    /** Phân loại variants **/
    const createdVariants = variantsWithImage.filter(variant => !variant.uuid);
    const updatedVariants = variantsWithImage.filter(variant => {
      const old = originalVariants.find(v => v.uuid === variant.uuid);
      return old && JSON.stringify(old) !== JSON.stringify(variant);
    });
    const deletedVariants = originalVariants.filter(old => !variantsWithImage.some(variant => variant.uuid === old.uuid)).map(opt => opt.uuid);

    /** Đóng gói dữ liệu gửi API **/
    const payload = {
      product: {
        title: values.title,
        slug: values.slug,
        description: values.description,
        thumbnail: thumbnailUrl,
        status: values.status ? "active" : "inactive",
        type: "",
        category_id: values.category_id,
        collection_id: "",
        metadata: {}
      },
      options: {
        created: createdOptions,
        updated: updatedOptions,
        deleted: deletedOptions
      },
      variants: {
        created: createdVariants,
        updated: updatedVariants,
        deleted: deletedVariants
      }
    };

    if (product?.uuid) {
      updateProduct(product.uuid, payload)
        .then(res => onSave(res))
        .catch(err => console.error(err));
    } else {
      createProduct(payload)
        .then(res => onSave(res))
        .catch(err => console.error(err));
    }
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

          // if (!product?.uuid || product.variants.length === 0) {
          //   const variants = formatted.map((comboObj, idx) => {
          //     const comboValues = Object.values(comboObj);
          //     const sku = [getDateTimeString(), ...comboValues].map(e => e.trim().replace(/\s+/g, '-')).join("-").toUpperCase();
          //     return {
          //       key: idx,
          //       title: productTitle,
          //       sku,
          //       barcode: "",
          //       height: 0,
          //       length: 0,
          //       weight: 0,
          //       width: 0,
          //       price: 0,
          //       inventory_quantity: 0,
          //       image: "",
          //       options: comboObj,
          //     };
          //   });

          //   setVariantTable(variants);
          //   form.setFieldsValue({ variants });
          // } else {
          //   // setVariantTable(product.variants);
          //   // form.setFieldsValue({ variants });
          // }
          const existingVariants = product?.variants || [];

          const newVariants = formatted.map((comboObj, idx) => {
            const comboValues = Object.values(comboObj);
            const sku = [getDateTimeString(), ...comboValues].map(e => e.trim().replace(/\s+/g, '-')).join("-").toUpperCase();
            const formOptions = form.getFieldValue("options") || [];
            // Tìm trong existingVariants có sẵn, nếu có thì giữ nguyên price, image...
            const matchedVariant = existingVariants.find(v => {
              const optionObj = v.options.reduce((acc, opt) => {
                const field = formOptions.find(f => f.uuid === opt.id);
                if (field) {
                  acc[field.title.toLowerCase()] = opt.value;
                }
                return acc;
              }, {});

              return isEqual(optionObj, comboObj);
            });
            return {
              key: idx,
              title: productTitle,
              sku,
              barcode: matchedVariant?.barcode || "",
              height: matchedVariant?.height || 0,
              length: matchedVariant?.length || 0,
              weight: matchedVariant?.weight || 0,
              width: matchedVariant?.width || 0,
              price: matchedVariant?.price || 0,
              inventory_quantity: matchedVariant?.inventory_quantity || 0,
              image: matchedVariant?.image || "",
              options: comboObj,
            };
          });

          setVariantTable(newVariants);
          form.setFieldsValue({ variants: newVariants });
        }
      }

      setActiveTab(targetKey);
      if (target > parseInt(maxTab, 10)) setMaxTab(target);

    } catch (error) {
      console.log("Lỗi validate:", error);
    }
  };

  const isEqual = (a, b) => {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => a[key] === b[key]);
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
    if (isModalOpen) {
      form.setFieldsValue({
        options: [{ title: '', values: [] }]
      });
      setTimeout(() => {
        setActiveKey("0");
      }, 0);
    }
  }, [isModalOpen]);

  const [originalOptions, setOriginalOptions] = useState([]);
  const [originalVariants, setOriginalVariants] = useState([]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product)
      setOriginalOptions(product.options || []);
      setOriginalVariants(product.variants || []);
      setVariantTable(product.variants || []);
    }
  }, [product]);

  return (
      <Modal
        width="90%"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={() => {
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
            </TabPane>
            <TabPane tab="Variant" key="3">
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
                      title: 'Image',
                      dataIndex: 'image',
                      render: (_, __, index) => (
                        <Form.Item
                          name={['variants', index, 'image']}
                          rules={[{ required: true, message: 'Vui lòng nhập hình ảnh' }]}
                        >
                          <UploadImage setImage={(file) => {
                            form.setFieldsValue({
                              variants: form.getFieldValue('variants')?.map((variant, i) => {
                                if (i === index) {
                                  return {
                                    ...variant,
                                    image: file,
                                  };
                                }
                                return variant;
                              }),
                            });
                          }} />
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
                              {typeof item === 'string' ? item : item.value}
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
