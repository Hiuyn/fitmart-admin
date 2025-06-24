import React, { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, message, Upload } from 'antd';

const getBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

const UploadImage = ({onUploadSuccess}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handlePreview = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, url => {
        setLoading(false);
        setImageUrl(url);
        onUploadSuccess(url); 
      });
    }
  };
  
  const beforeUpload = async file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    // console.log(isJpgOrPng, isLt2M, file);

    const fileListCustom = [
      {
        uid: file.uid,
        name: file.name,
        status: 'done',
        url: await getBase64(file),
        file: file,
      },
    ]
    console.log('fileListCustom: ', fileListCustom);
    setImageUrl(fileListCustom)
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
  );
  return (
    <Upload
      action=""
      listType="picture-card"
      showUploadList={false}
      accept=".jpg, .jpeg, .png, .jfif"
      beforeUpload={beforeUpload}
      onPreview={handlePreview}
    >
    {imageUrl ? <img src={imageUrl[0]?.url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
};

export default UploadImage;