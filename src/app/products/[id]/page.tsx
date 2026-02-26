"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Spinner, Badge } from "react-bootstrap";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { StarFill, Star, Heart, Search } from "react-bootstrap-icons";
import styles from "./ProductDetailPage.module.scss";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import { Product, getAllProducts } from "../../../lib/api/products";
import { getProductById } from "../../../lib/api/productService";

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoadingProduct(true);
        setError(null);
        const data = await getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load product details. Please try again later.");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        setSearchError(null);
        setSearchLoading(false);
        return;
      }

      try {
        setSearchLoading(true);
        setSearchError(null);

        let baseProducts = allProducts;
        if (!baseProducts) {
          baseProducts = await getAllProducts();
          setAllProducts(baseProducts);
        }

        const q = debouncedSearchTerm.toLowerCase();
        const filtered = baseProducts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
        setSearchError("Unable to search products. Please try again later.");
      } finally {
        setSearchLoading(false);
      }
    };

    runSearch();
  }, [debouncedSearchTerm, allProducts]);

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    // Hook into your cart logic here
    console.log(`Add ${quantity} of product ${product.id} to cart`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRelatedClick = (id: number) => {
    router.push(`/products/${id}`);
  };

  const isSearching = debouncedSearchTerm.length > 0;
  const listToShow = isSearching ? searchResults : [];

  if (loadingProduct) {
    return (
      <section className={styles.pageWrapper}>
        <Container>
          <div className={styles.loadingWrapper}>
            <Spinner animation="border" />
          </div>
        </Container>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className={styles.pageWrapper}>
        <Container>
          <div className={styles.errorWrapper}>
            {error ?? "Product not found."}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={styles.pageWrapper}>
      <Container>
        <Row className={styles.backRow}>
          <Col>
            <button
              type="button"
              className={styles.backButton}
              onClick={handleBack}
            >
              ← Back
            </button>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className={styles.contentCard}>
              <Row className="gy-4">
                <Col xs={12} md={5} className={styles.imageCol}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={400}
                      height={400}
                      className={styles.productImage}
                      priority
                    />
                  </div>
                </Col>

                <Col xs={12} md={7} className={styles.detailsCol}>
                  <div className={styles.titleRow}>
                    <h1 className={styles.productName}>{product.title}</h1>
                    <p className={styles.fullName}>{product.description}</p>
                  </div>

                  <div className={styles.ratingRow}>
                    <span className={styles.starRow}>
                      {Array.from({ length: 5 }).map((_, index) =>
                        index < Math.round(product.rating?.rate ?? 0) ? (
                          <StarFill
                            key={index}
                            className={styles.starFilled}
                            size={18}
                          />
                        ) : (
                          <Star
                            key={index}
                            className={styles.starEmpty}
                            size={18}
                          />
                        )
                      )}
                    </span>
                    <span className={styles.ratingValue}>
                      {product.rating?.rate.toFixed(1) ?? "0.0"}
                    </span>
                    <span className={styles.ratingCount}>
                      ({product.rating?.count ?? 0})
                    </span>
                  </div>

                  <hr className={styles.divider} />

                  <div className={styles.categoryRow}>
                    <span className={styles.categoryLabel}>Category:</span>
                    <span className={styles.categoryValue}>
                      {product.category}
                    </span>
                  </div>

                  <div className={styles.priceAndQuantityRow}>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>
                        ${product.price.toFixed(2)}
                      </span>
                      <Badge bg="success" className={styles.CustomBadge}>
      27% off
    </Badge>
                    </div>
                    <div className={styles.quantityRow}>
                      
                      <div className={styles.quantityControl}>
                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={handleDecreaseQuantity}
                        >
                          -
                        </button>
                        <span className={styles.quantityValue}>{quantity}</span>
                        <button
                          type="button"
                          className={styles.quantityButton}
                          onClick={handleIncreaseQuantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionsRow}>
                    <div className={styles.addToCartButtonWrapper}>
                      <AddToCartButton
                        label={`Add ${quantity} to Cart`}
                        onClick={handleAddToCart}
                      />
                    </div>
                    <button
                      type="button"
                      className={styles.favouriteButton}
                      aria-label="Add to favourites"
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <section className={styles.relatedSection}>
          <Row>
            <Col>
              <div className={styles.relatedHeaderRow}>
                <h2 className={styles.relatedTitle}>Products</h2>
              </div>
            </Col>
          </Row>

          <Row className={styles.searchRow}>
            <Col>
              <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <Form.Control
                  type="search"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              {searchLoading ? (
                <div className={styles.loadingWrapper}>
                  <Spinner animation="border" size="sm" />
                </div>
              ) : searchError ? (
                <div className={styles.errorWrapper}>{searchError}</div>
              ) : !isSearching ? null : listToShow.length === 0 ? (
                <div className={styles.emptySearchState}>
                  No products match your search.
                </div>
              ) : (
                <div className={styles.searchResultsList}>
                  {listToShow.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.searchResultItem}
                      onClick={() => handleRelatedClick(item.id)}
                    >
                      <div className={styles.searchResultThumb}>
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.searchResultText}>
                        <span className={styles.searchResultTitle}>
                          {item.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Col>
          </Row>
        </section>
      </Container>
    </section>
  );
};

export default ProductDetailPage;

