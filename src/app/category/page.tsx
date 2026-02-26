"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import styles from "./CategoryPage.module.scss";

interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating;
}

type RatingFilterValue = "all" | "4plus" | "3plus" | "2plus";

const CATEGORY_API = "https://fakestoreapi.com/products/categories";
const PRODUCTS_BY_CATEGORY_API = (category: string) =>
  `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await fetch(CATEGORY_API);
        if (!res.ok) throw new Error("Failed to load categories");
        const data: string[] = await res.json();
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

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setError(null);
        const res = await fetch(PRODUCTS_BY_CATEGORY_API(selectedCategory));
        if (!res.ok) throw new Error("Failed to load products");
        const data: Product[] = await res.json();
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

  return (
    <section className={styles.pageWrapper}>
      <Container>
        <Row>
          <Col xs={12} md={3} className={styles.sidebarCol}>
            <div className={styles.filterPanel}>
              <h3 className={styles.filterTitle}>Filter</h3>

              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>Category</div>
                {loadingCategories ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Form>
                    {categories.map((cat) => (
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
                  </Form>
                )}
              </div>

              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>Rating</div>
                <Form>
                  <Form.Check
                    type="radio"
                    name="rating"
                    label="All ratings"
                    id="rating-all"
                    checked={ratingFilter === "all"}
                    onChange={() => handleRatingChange("all")}
                    className={styles.filterOption}
                  />
                  <Form.Check
                    type="radio"
                    name="rating"
                    label="4 ★ & up"
                    id="rating-4"
                    checked={ratingFilter === "4plus"}
                    onChange={() => handleRatingChange("4plus")}
                    className={styles.filterOption}
                  />
                  <Form.Check
                    type="radio"
                    name="rating"
                    label="3 ★ & up"
                    id="rating-3"
                    checked={ratingFilter === "3plus"}
                    onChange={() => handleRatingChange("3plus")}
                    className={styles.filterOption}
                  />
                  <Form.Check
                    type="radio"
                    name="rating"
                    label="2 ★ & up"
                    id="rating-2"
                    checked={ratingFilter === "2plus"}
                    onChange={() => handleRatingChange("2plus")}
                    className={styles.filterOption}
                  />
                </Form>
              </div>

              <div className={styles.filterBlock}>
                <div className={styles.filterBlockHeader}>Price</div>
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
                    <Form.Range
                      min={priceBounds.min}
                      max={priceBounds.max}
                      step={1}
                      value={priceMax ?? priceBounds.max}
                      onChange={(e) => handlePriceMaxChange(Number(e.target.value))}
                    />
                    <div className={styles.priceSelectedRow}>
                      <span>From: ${priceMin?.toFixed(2)}</span>
                      <span>To: ${priceMax?.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <span className={styles.mutedText}>No products to derive price range.</span>
                )}
              </div>
            </div>
          </Col>

          <Col xs={12} md={9} className={styles.productsCol}>
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
                            <Badge bg="success" className={styles.inStockBadge}>
                              In stock
                            </Badge>
                           </div>
                         <div>
                         <Button
                            variant="primary"
                            size="sm"
                            className={styles.addToCartButton}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            Add to Cart
                          </Button>
                         </div>

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

