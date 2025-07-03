export const jsonToFormData = (json, formData, parentKey = '') => {
  for (let key in json) {
    if (json.hasOwnProperty(key)) {
      let nestedKey = parentKey ? `${parentKey}[${key}]` : key

      if (Array.isArray(json[key]) && json[key].length === 0) {
        formData.append(`${nestedKey}[]`, '')
      } else if (typeof json[key] === 'object' && !(json[key] instanceof File)) {
        jsonToFormData(json[key], formData, nestedKey)
      } else {
        formData.append(nestedKey, json[key])
      }
    }
  }
}

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:8080/api/v1/uploads', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.code === 200) {
      return data.data; // Trả về URL hoặc dữ liệu thành công
    } else {
      throw new Error(data.message || 'Lỗi không xác định');
    }
  } catch (err) {
    throw new Error(err.message || 'Lỗi upload file');
  }
};

export const formatSkus = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Bỏ dấu
    .replace(/đ/g, "d")              // đ -> d
    .replace(/Đ/g, "D")              // Đ -> D
    .replace(/[^a-zA-Z0-9]+/g, "-")  // Ký tự không phải chữ/số thành dấu -
    .replace(/^-+|-+$/g, "")         // Bỏ dấu - đầu/cuối chuỗi
    .toUpperCase();                  // Viết hoa
};

export const getDateTimeString = () => {
  const now = new Date();

  const pad = (num) => String(num).padStart(2, '0'); // Đảm bảo luôn có 2 chữ số

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Tháng bắt đầu từ 0
  const day = pad(now.getDate());
  const hour = pad(now.getHours());
  const minute = pad(now.getMinutes());
  const second = pad(now.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};

