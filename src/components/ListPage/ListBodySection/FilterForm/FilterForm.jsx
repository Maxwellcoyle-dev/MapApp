import React, { useEffect, useState } from "react";
import { Form, Button, Rate, Tag, Select, AutoComplete, Alert } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./FilterForm.module.css";
import { debounce } from "lodash";

const FilterForm = ({
  onFilter,
  categoryTags,
  placeTypes,
  vicinities,
  filters,
  showFilterForm,
  setShowFilterForm,
  handleSearch,
  clearFilters,
  placesData,
}) => {
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState(filters.tags || []);
  const [searchValue, setSearchValue] = useState("");
  const [autoCompleteOptions, setAutoCompleteOptions] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    form.setFieldsValue(filters);
    setSelectedTags(filters.tags || []);
  }, [filters, form]);

  const handleFinish = (values) => {
    onFilter({ ...values, tags: selectedTags });
    setShowFilterForm(false);
  };

  const handleTagClick = (tagId) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
    form.setFieldsValue({ ...form.getFieldsValue(), tags: newTags });
  };

  const debouncedSearch = debounce((value) => {
    handleSearch(value);
    if (placesData && Array.isArray(placesData)) {
      const filteredOptions = placesData.filter((place) =>
        place.name.S.toLowerCase().includes(value.toLowerCase())
      );
      if (filteredOptions.length === 0) {
        setNoResults(true);
        setAlertMessage("No places match your search.");
      } else {
        setNoResults(false);
        setAutoCompleteOptions(filteredOptions.map((place) => place.name.S));
        setAlertMessage("");
      }
    }
  }, 300);

  const handleSearchSelect = (value) => {
    if (!placesData) {
      setAlertMessage("Places data is not available");
      return;
    }

    const place = placesData.find((place) => place.name.S === value);

    let newTags;
    if (place) {
      newTags = [...selectedTags, value];
    } else {
      newTags = [...selectedTags, value];
    }

    setSelectedTags(newTags);
    form.setFieldsValue({ ...form.getFieldsValue(), tags: newTags });
    setSearchValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (searchValue.trim()) {
        handleSearchSelect(searchValue);
      }
    }
  };

  const handleRemoveTag = (tagIdOrName) => {
    const newTags = selectedTags.filter((id) => id !== tagIdOrName);
    setSelectedTags(newTags);
    form.setFieldsValue({ ...form.getFieldsValue(), tags: newTags });
  };

  const resetFilters = () => {
    setSelectedTags([]);
    clearFilters();
    setNoResults(false);
    setSearchValue("");
    setAlertMessage("");
    setShowFilterForm(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className={styles.form}
    >
      <div className={styles.filterOptionsContainer}>
        <Button
          icon={<FilterOutlined />}
          type="dashed"
          onClick={() => setShowFilterForm(!showFilterForm)}
          className={styles.filterButton}
          aria-label="Toggle filter form"
        />
        <AutoComplete
          placeholder="Search by name"
          onSearch={(value) => {
            setSearchValue(value);
            debouncedSearch(value);
          }}
          onKeyPress={handleKeyPress}
          value={searchValue}
          onSelect={handleSearchSelect}
          options={autoCompleteOptions.map((option) => ({
            value: option,
          }))}
          className={styles.searchInput}
        />
        <Button
          icon={<CloseOutlined />}
          onClick={resetFilters}
          className={styles.filterButton}
          disabled={Object.keys(filters).length === 0}
          aria-label="Clear filters"
        />
      </div>
      {alertMessage && (
        <div className={styles.alertContainer}>
          <Alert
            message={alertMessage}
            type="warning"
            showIcon
            action={
              alertMessage === "No places match your search." && (
                <Button size="small" type="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              )
            }
          />
        </div>
      )}
      <div className={styles.appliedFiltersContainer}>
        {selectedTags.map((tagIdOrName) => {
          const tag = Object.values(categoryTags)
            .flatMap((category) => category.tags)
            .find(
              (tag) => tag.tagId === tagIdOrName || tag.tagName === tagIdOrName
            );

          return (
            <Tag
              key={tagIdOrName}
              closable
              onClose={() => {
                handleRemoveTag(tagIdOrName);
              }}
            >
              {tag?.tagName || tagIdOrName}
            </Tag>
          );
        })}
        {filters.types &&
          filters.types.map((type) => (
            <Tag
              key={type}
              closable
              onClose={() => {
                const newTypes = filters.types.filter((t) => t !== type);
                form.setFieldsValue({
                  ...form.getFieldsValue(),
                  types: newTypes,
                });
              }}
            >
              {type}
            </Tag>
          ))}
        {filters.vicinity && (
          <Tag
            closable
            onClose={() => {
              form.setFieldsValue({ ...form.getFieldsValue(), vicinity: "" });
            }}
          >
            {filters.vicinity}
          </Tag>
        )}
      </div>
      {showFilterForm && (
        <div className={styles.mainFilterDiv}>
          <div className={styles.mainBtnDiv}>
            <Form.Item className={styles.mainButtonItem}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.mainButton}
              >
                Apply Filters
              </Button>
            </Form.Item>
            <Form.Item className={styles.mainButtonItem}>
              <Button
                danger
                htmlType="reset"
                className={styles.mainButton}
                onClick={() => {
                  resetFilters();
                  setShowFilterForm(false);
                }}
              >
                Cancel
              </Button>
            </Form.Item>
          </div>
          <Form.Item label="Google Rating" name="rating">
            <Rate allowHalf />
          </Form.Item>
          {Object.keys(categoryTags).map((category) => (
            <div key={category} className={styles.categoryContainer}>
              <h3>{category}</h3>
              <div className={styles.tagList}>
                {categoryTags[category].tags.map((tag) => (
                  <Tag
                    key={tag.tagId}
                    color={
                      selectedTags.includes(tag.tagId) ? "blue" : "default"
                    }
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
        </div>
      )}
    </Form>
  );
};

export default FilterForm;
