"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, StarFill, Star } from "react-bootstrap-icons";
import styles from "./CategoryPage.module.scss";
import AddToCartButton from "../components/AddToCartButton/AddToCartButton";
import { Product, getCategories, getProductsByCategory } from "../../lib/api/products";

type RatingFilterValue = "all" | "4plus" | "3plus" | "2plus";

const PAGE_SIZE = 4;

const CategoryListingPage: React.FC = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [ratingFilter, setRatingFilter] = useState<RatingFilterValue>("all");
  const [priceBounds, setPriceBounds] = useState<{ min: number; max: number } | null>(null);
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  // Collapsible state
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    price: true,
  });

  // See more state
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        setLoadingCategories(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load categories. Please try again later.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setError(null);
        const data = await getProductsByCategory(selectedCategory);
        setProducts(data);
        setVisibleCount(PAGE_SIZE);

        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceBounds({ min, max });
          setPriceMin(min);
          setPriceMax(max);
        } else {
          setPriceBounds(null);
          setPriceMin(null);
          setPriceMax(null);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load products for this category.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setRatingFilter("all");
  };

  const handleRatingChange = (value: RatingFilterValue) => {
    setRatingFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handlePriceMinChange = (value: number) => {
    if (priceMax == null) return;
    const next = Math.min(value, priceMax);
    setPriceMin(next);
    setVisibleCount(PAGE_SIZE);
  };

  const handlePriceMaxChange = (value: number) => {
    if (priceMin == null) return;
    const next = Math.max(value, priceMin);
    setPriceMax(next);
    setVisibleCount(PAGE_SIZE);
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (ratingFilter !== "all") {
      const minRate =
        ratingFilter === "4plus" ? 4 : ratingFilter === "3plus" ? 3 : 2;
      list = list.filter((p) => p.rating?.rate >= minRate);
    }

    if (priceMin != null && priceMax != null && priceBounds != null) {
      list = list.filter(
        (p) => p.price >= priceMin && p.price <= priceMax
      );
    }

    return list;
  }, [products, ratingFilter, priceMin, priceMax, priceBounds]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProducts.length));
  };

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  const isLoadMoreVisible = visibleProducts.length < filteredProducts.length;

  const renderStars = (rating: number) => {
    return (
      <div className={styles.starRow}>
        {[...Array(5)].map((_, i) => (
          i < rating ? (
            <StarFill key={i} className={styles.starFilled} />
          ) : (
            <Star key={i} className={styles.starEmpty} />
          )
        ))}
      </div>
    );
  };

  return (
    <section className={styles.pageWrapper}>
      <Container>
        <Row className="flex-column flex-md-row">
          <Col xs={12} md={3} className={`${styles.sidebarCol} order-1`}>
            <div className={styles.filterPanel}>
              <h3 className={styles.filterTitle}>Filter</h3>

              <div className={styles.filterBlock}>
                <div 
                  className={styles.filterBlockHeader} 
                  onClick={() => toggleSection("category")}
                  style={{ cursor: "pointer" }}
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
                            name="category"
                            id={`cat-${cat}`}
                            label={cat}
                            checked={cat === selectedCategory}
                            onChange={() => handleCategoryChange(cat)}
                            className={styles.filterOption}
                          />
                        ))}
                        {categories.length > 3 && (
                          <div 
                            className={styles.seeMore} 
                            onClick={() => setShowAllCategories(!showAllCategories)}
                          >
                            {showAllCategories ? "See less" : "See more"}
                          </div>
                        )}
                      </Form>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.filterBlock}>
                <div 
                  className={styles.filterBlockHeader} 
                  onClick={() => toggleSection("rating")}
                  style={{ cursor: "pointer" }}
                >
                  <span>Rating</span>
                  {expandedSections.rating ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {expandedSections.rating && (
                  <div className={styles.filterContent}>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        name="rating"
                        id="rating-all"
                        label="All ratings"
                        checked={ratingFilter === "all"}
                        onChange={() => handleRatingChange("all")}
                        className={styles.filterOption}
                      />
                      {[4, 3, 2].map((num) => (
                        <Form.Check
                          key={num}
                          type="checkbox"
                          name="rating"
                          id={`rating-${num}`}
                          label={
                            <div className="d-flex align-items-center gap-2">
                              {renderStars(num)}
                              <span className={styles.ratingLabelText}></span>
                            </div>
                          }
                          checked={ratingFilter === `${num}plus` as RatingFilterValue}
                          onChange={() => handleRatingChange(`${num}plus` as RatingFilterValue)}
                          className={styles.filterOption}
                        />
                      ))}
                      <div className={styles.seeMore}>See more</div>
                    </Form>
                  </div>
                )}
              </div>

              <div className={styles.filterBlock}>
                <div 
                  className={styles.filterBlockHeader} 
                  onClick={() => toggleSection("price")}
                  style={{ cursor: "pointer" }}
                >
                  <span>Price</span>
                  {expandedSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
                {expandedSections.price && (
                  <div className={styles.filterContent}>
                    {priceBounds ? (
                      <>
                        <div className={styles.priceRangeRow}>
                          <span>${priceBounds.min.toFixed(2)}</span>
                          <span>${priceBounds.max.toFixed(2)}</span>
                        </div>
                        <Form.Range
                          min={priceBounds.min}
                          max={priceBounds.max}
                          step={1}
                          value={priceMin ?? priceBounds.min}
                          onChange={(e) => handlePriceMinChange(Number(e.target.value))}
                        />
                        <div className={styles.priceSelectedRow}>
                          <span>${(priceMin ?? priceBounds.min).toFixed(2)}</span>
                          <span>-</span>
                          <span>${(priceMax ?? priceBounds.max).toFixed(2)}</span>
                        </div>
                        <div className={styles.seeMore}>See more</div>
                      </>
                    ) : (
                      <div className={styles.mutedText}>No price data</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col xs={12} md={9} className={`${styles.productsCol} order-2`}>
            <div className={styles.headerRow}>
              <h2 className={styles.pageTitle}>
                {selectedCategory ? selectedCategory : "Products"}
              </h2>
              <span className={styles.resultCount}>
                {filteredProducts.length} results
              </span>
            </div>

            {error && <div className={styles.errorText}>{error}</div>}

            {loadingProducts ? (
              <div className={styles.loadingWrapper}>
                <Spinner animation="border" />
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className={styles.emptyState}>No products found for this filter.</div>
            ) : (
              <>
                <div className={styles.productList}>
                  {visibleProducts.map((product) => (
                    <div
                      key={product.id}
                      className={styles.productCard}
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className={styles.productImageWrapper}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className={styles.productImage}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.productBody}>
                        <div className={styles.productTitleRow}>
                          <h3 className={styles.productTitle}>{product.title}</h3>
                        </div>
                        <p className={styles.productDescription}>
                          {product.description}
                        </p>
                        <div className={styles.productMetaRow}>
                          <div className={styles.ratingWrapper}>
                            <span className={styles.ratingStars}>
                              ★ {product.rating?.rate.toFixed(1)}
                            </span>
                            <span className={styles.ratingCount}>
                              ({product.rating?.count})
                            </span>
                          </div>
                          <div className={styles.priceWrapper}>
                            <div className={styles.priceAlignment}>
                              <span className={styles.price}>
                                ${product.price.toFixed(2)}
                              </span>
                              <Badge
                                bg="success"
                                className={styles.inStockBadge}
                              >
                                In stock
                              </Badge>
                            </div>
                            <AddToCartButton />
                          </div>
                        </div>
                    
                      </div>
                    </div>
                  ))}
                </div>

                {isLoadMoreVisible && (
                  <div className={styles.loadMoreWrapper}>
                    <Button
                      variant="outline-secondary"
                      onClick={handleLoadMore}
                      className={styles.loadMoreButton}
                    >
                      Load More Results
                    </Button>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CategoryListingPage;

