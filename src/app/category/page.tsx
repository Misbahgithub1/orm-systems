"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button, Spinner, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { StarFill, Star, StarHalf } from "react-bootstrap-icons";
import styles from "./CategoryPage.module.scss";
import AddToCartButton from "../components/AddToCartButton/AddToCartButton";
import { Product, getCategories, getProductsByCategory } from "../../lib/api/products";
import FilterPanel from "../components/FilterPanel/FilterPanel";

type RatingFilterValue = "all" | "4plus" | "3plus" | "2plus";
type PriceRangeValue = "0-50" | "50-100" | "100plus";
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
  const [debouncedPriceMin, setDebouncedPriceMin] = useState<number | null>(null);
  const [debouncedPriceMax, setDebouncedPriceMax] = useState<number | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceRangeValue | null>(null);

  // Collapsible state
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    rating: true,
    price: true,
  });

  // See more state
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const shortDescription = useCallback(
    (text: string) => {
      if (!text) return "";
      const limit = isMobile ? 110 : 160;
      const t = text.replace(/\s+/g, " ").trim();
      if (t.length <= limit) return t;
      const sentenceCut = t.slice(0, limit + 40).lastIndexOf(".");
      if (sentenceCut > 40) return t.slice(0, sentenceCut + 1);
      const cut = t.slice(0, limit);
      const lastSpace = cut.lastIndexOf(" ");
      const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
      return base + "…";
    },
    [isMobile]
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceMin(priceMin);
      setDebouncedPriceMax(priceMax);
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [priceMin, priceMax]);




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

    // Price checkbox filter
    // if (priceFilter) {
    //   list = list.filter((p) => {
    //     switch (priceFilter) {
    //       case "0-50":
    //         return p.price >= 0 && p.price <= 50;
    //       case "50-100":
    //         return p.price > 50 && p.price <= 100;
    //       case "100plus":
    //         return p.price > 100;
    //       default:
    //         return true;
    //     }
    //   });
    // }


    //  Rating filter
    if (ratingFilter !== "all") {
      const minRate =
        ratingFilter === "4plus"
          ? 4
          : ratingFilter === "3plus"
            ? 3
            : 2;

      list = list.filter((p) => (p.rating?.rate ?? 0) >= minRate);
    }

    //  Debounced Price filter
    if (
      debouncedPriceMin != null &&
      debouncedPriceMax != null &&
      priceBounds != null
    ) {
      list = list.filter(
        (p) =>
          p.price >= debouncedPriceMin &&
          p.price <= debouncedPriceMax
      );
    }

    return list;
  }, [
    products,
    ratingFilter,
    debouncedPriceMin,
    debouncedPriceMax,
    priceBounds,
    priceFilter
  ]);


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

  const renderProductStars = (rate: number) => {
    const rounded = Math.round((rate ?? 0) * 2) / 2;
    const full = Math.floor(rounded);
    const half = rounded - full === 0.5;
    return (
      <div className={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => {
          if (i <= full) {
            return <StarFill key={i} className={styles.starFilled} />;
          }
          if (half && i === full + 1) {
            return <StarHalf key={i} className={styles.starFilled} />;
          }
          return <Star key={i} className={styles.starEmpty} />;
        })}
      </div>
    );
  };

  return (
    <section className={styles.pageWrapper}>
      <Container>
        <Row className="flex-column flex-md-row">

          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            loadingCategories={loadingCategories}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            handleCategoryChange={handleCategoryChange}
            ratingFilter={ratingFilter}
            handleRatingChange={handleRatingChange}
            priceBounds={priceBounds}
            priceMin={priceMin}
            priceMax={priceMax}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            handlePriceMinChange={handlePriceMinChange}
            handlePriceMaxChange={handlePriceMaxChange}
            showAllCategories={showAllCategories}
            setShowAllCategories={setShowAllCategories}

          />


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
                          {shortDescription(product.description)}
                        </p>
                        <div className={styles.productMetaRow}>
                          <div className={styles.ratingWrapper}>
                            {renderProductStars(product.rating?.rate ?? 0)}
                            <span>{product.rating?.rate.toFixed(1)}</span>
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

