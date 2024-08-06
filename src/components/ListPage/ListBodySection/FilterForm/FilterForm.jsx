import React, { useEffect, useState } from "react";
import { Form, Input, Button, Rate, Tag, Select } from "antd";

import styles from "./FilterForm.module.css";

const FilterForm = ({
  onFilter,
  categoryTags,
  placeTypes,
  vicinities,
  filters,
}) => {
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState(filters.tags || []);

  useEffect(() => {
    form.setFieldsValue(filters);
    setSelectedTags(filters.tags || []);
  }, [filters, form]);

  const handleFinish = (values) => {
    onFilter({ ...values, tags: selectedTags });
  };

  const handleTagClick = (tagId) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagId)) {
        return prevSelectedTags.filter((id) => id !== tagId);
      } else {
        return [...prevSelectedTags, tagId];
      }
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item label="Name" name="name">
        <Input placeholder="Place name" />
      </Form.Item>
      <Form.Item label="Google Rating" name="rating">
        <Rate allowHalf />
      </Form.Item>
      {Object.keys(categoryTags).map((category) => (
        <div key={category} style={{ marginBottom: "16px" }}>
          <h3>{category}</h3>
          <div>
            {categoryTags[category].tags.map((tag) => (
              <Tag
                key={tag.tagId}
                color={selectedTags.includes(tag.tagId) ? "blue" : "default"}
                onClick={() => handleTagClick(tag.tagId)}
                style={{ cursor: "pointer", marginBottom: "8px" }}
              >
                {tag.tagName}
              </Tag>
            ))}
          </div>
        </div>
      ))}
      <Form.Item label="Types" name="types">
        <Select mode="multiple" placeholder="Select types">
          {placeTypes.map((type) => (
            <Select.Option key={type} value={type}>
              {type}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Neighborhood" name="vicinity">
        <Select placeholder="Select vicinity">
          {vicinities.map((vicinity) => (
            <Select.Option key={vicinity} value={vicinity}>
              {vicinity}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Apply Filters
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterForm;
