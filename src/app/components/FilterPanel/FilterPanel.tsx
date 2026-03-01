"use client";

import React from "react";
import { Col, Form, Spinner } from "react-bootstrap";
import { ChevronUp, ChevronDown, StarFill, Star } from "react-bootstrap-icons";
import styles from "./FilterPanel.module.scss";
import PriceFilter from "./PriceFilter";
import PriceCheckboxFilter from "./PriceCheckboxFilter";


  type PriceRangeValue = "0-50" | "50-100" | "100plus";
type RatingFilterValue = "all" | "4plus" | "3plus" | "2plus";

interface Props {
  categories: string[];
  selectedCategory: string | null;
  loadingCategories: boolean;
  expandedSections: {
    category: boolean;
    rating: boolean;
    price: boolean;
  };
  toggleSection: (section: "category" | "rating" | "price") => void;
  handleCategoryChange: (category: string) => void;
  ratingFilter: RatingFilterValue;
  handleRatingChange: (value: RatingFilterValue) => void;
  priceBounds: { min: number; max: number } | null;
  priceMin: number | null;
  priceMax: number | null;
  handlePriceMinChange: (value: number) => void;
  showAllCategories: boolean;
  setShowAllCategories: React.Dispatch<React.SetStateAction<boolean>>;
  priceFilter: PriceRangeValue | null;
setPriceFilter: React.Dispatch<React.SetStateAction<PriceRangeValue | null>>;
}

const FilterPanel: React.FC<Props> = ({
  categories,
  selectedCategory,
  loadingCategories,
  expandedSections,
  toggleSection,
  handleCategoryChange,
  ratingFilter,
  handleRatingChange,
  priceBounds,
  priceFilter,
  priceMin,
  priceMax,
  handlePriceMinChange,
  showAllCategories,
  setShowAllCategories,
    setPriceFilter,
}) => {


    
  const renderStars = (rating: number) => (
    <div className={styles.starRow}>
      {[...Array(5)].map((_, i) =>
        i < rating ? (
          <StarFill key={i} className={styles.starFilled} />
        ) : (
          <Star key={i} className={styles.starEmpty} />
        )
      )}
    </div>
  );


  

  return (
    <Col xs={12} md={3} className={`${styles.sidebarCol} order-1`}>
      <div className={styles.filterPanel}>
        <h3 className={styles.filterTitle}>Filter</h3>

        {/* CATEGORY */}
        <div className={styles.filterBlock}>
          <div
            className={styles.filterBlockHeader}
            onClick={() => toggleSection("category")}
          >
            <span>Category</span>
            {expandedSections.category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          {expandedSections.category && (
            <div className={styles.filterContent}>
              {loadingCategories ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form>
                  {(showAllCategories ? categories : categories.slice(0, 3)).map((cat) => (
                    <Form.Check
                      key={cat}
                      type="radio"
                      label={cat}
                      checked={cat === selectedCategory}
                      onChange={() => handleCategoryChange(cat)}
                      className={styles.filterOption}
                    />
                  ))}

                  {categories.length > 3 && (
                    <div
                      className={styles.seeMore}
                      onClick={() => setShowAllCategories((prev) => !prev)}
                    >
                      {showAllCategories ? "See less" : "See more"}
                    </div>
                  )}
                </Form>
              )}
            </div>
          )}
        </div>

        {/* RATING */}
        <div className={styles.filterBlock}>
          <div
            className={styles.filterBlockHeader}
            onClick={() => toggleSection("rating")}
          >
            <span>Rating</span>
            {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>

          {expandedSections.rating && (
            <div className={styles.filterContent}>
              <Form>
                <Form.Check
                  type="checkbox"
                  label="All ratings"
                  checked={ratingFilter === "all"}
                  onChange={() => handleRatingChange("all")}
                  className={styles.filterOption}
                />

                {[4, 3, 2].map((num) => (
                  <Form.Check
                    key={num}
                    type="checkbox"
                    label={
                      <div className="d-flex align-items-center gap-2">
                        {renderStars(num)}
                      </div>
                    }
                    checked={ratingFilter === `${num}plus` as RatingFilterValue}
                    onChange={() => handleRatingChange(`${num}plus` as RatingFilterValue)}
                    className={styles.filterOption}
                  />
                ))}
              </Form>
            </div>
          )}
        </div>

        {/* PRICE */}
      
        
<PriceFilter
  expanded={expandedSections.price}
  toggle={() => toggleSection("price")}
  priceBounds={priceBounds}
  priceMin={priceMin}
  onPriceMinChange={handlePriceMinChange}
/>

{/* <PriceCheckboxFilter
  expanded={expandedSections.price}
  toggle={() => toggleSection("price")}
  selectedPrice={priceFilter}
  onPriceChange={setPriceFilter}
/> */}

      </div>
    </Col>
  );
};

export default FilterPanel;