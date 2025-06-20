import React, { useState, useEffect, useRef } from 'react';
import { Switch } from "antd";


function slugify(text) {
  return text
    .normalize('NFD')                         // Decompose accents
    .replace(/[\u0300-\u036f]/g, '')          // Remove accents
    .replace(/đ/g, 'd')                       // Convert đ
    .replace(/Đ/g, 'd')                       // Convert Đ
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')                     // Replace spaces with -
    .replace(/[^\w\-]+/g, '')                 // Remove special chars
    .replace(/\-\-+/g, '-');                  // Replace multiple hyphens
}

const CategoryForm = ({ category, onSave, onCancel }) => {
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
    title: '',
    handle: '',
    description: '',
    is_active: false,

    rank: 0,
    parent_category_id: '',
  });


  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        title: category.title,
        handle: category.handle,
        description: category.description,
        rank: category.rank,
        is_active: category.is_active
      });
    }
  }, [category]);

  const handleChange = (e) => {
    if (e.target.name == "title") {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
        "handle": slugify(e.target.value),
      })
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tên danh mục không được để trống';
    }

    if (!formData.handle.trim()) {
      newErrors.handle = 'Slug danh mục không được để trống';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả danh mục không được để trống';
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



  return (
    <div className="modal-overlay">
      <div className="product-form-modal" style={{width: '80%'}}>
        <h2>{category ? 'Chỉnh sửa danh mục' : 'Thêm sản danh mục'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên danh mục:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="handle">Slug:</label>
            <input
              type="text"
              id="handle"
              name="handle"
              value={formData.handle}
              onChange={handleChange}
              className={errors.handle ? 'error' : ''}
            />
            {errors.handle && <div className="error-message">{errors.handle}</div>}
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
            <label htmlFor="handle">Is active:</label>
            <input style={{width: '40px'}}
              type="checkbox"
              id="is_active"
              name="is_active"
              value={formData.is_active}
              onChange={handleChange}
              className={errors.is_active ? 'error' : ''}
            />
            {errors.is_active && <div className="error-message">{errors.handle}</div>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="save-button">
              {category ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
