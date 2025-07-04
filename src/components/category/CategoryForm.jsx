import React, { useEffect } from "react";
import { Form, Input, Switch, Select, Button, Modal } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const CategoryForm = ({ category, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        ...category,
        is_active: category.is_active,
      });
    } else {
      form.resetFields();
    }
  }, [category, form]);

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        let formData = {
          ...values,
          is_active: values.is_active,
          uuid: values.uuid || "",
          rank: 0,
          parent_category_id: values.parent_category_id ?? ""
        }
        onSave(formData);
      })
      .catch(() => {});
  };

  return (
    <Modal
      open
      title={category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={category ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="title"
          rules={[{ required: true, message: "Tên không được để trống" }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea placeholder="Nhập mô tả" rows={3} />
        </Form.Item>

        <Form.Item label="Handle" name="handle">
          <Input placeholder="Nhập handle" />
        </Form.Item>

        {/* <Form.Item label="Danh mục cha" name="parent_category_id">
          <Select allowClear placeholder="Chọn danh mục cha">
            {categories.map(cat => (
              <Option key={cat.uuid} value={cat.uuid}>
                {cat.title}
              </Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item label="Kích hoạt" name="is_active" valuePropName="checked">
          <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
