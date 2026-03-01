"use client";

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useRouter, useParams } from "next/navigation";

import styles from "./ProductDetailPage.module.scss";

import { Product } from "../../../lib/api/products";
import { getProductById } from "@/lib/api/productService";
import { getRelatedProducts } from "@/lib/api/productService";
import SearchBar from "@/app/components/SearchBar/SearchBar";
import ProductCardDetail from "./ProductCardDetail";

const FAV_KEY = "orm:favourites";

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { id: productId } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavourite, setIsFavourite] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
const [relatedLoading, setRelatedLoading] = useState(false);

  // Fetch product by ID

 useEffect(() => {
  if (!productId) return;

  const fetchProductAndRelated = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch main product
      const data = await getProductById(productId);
      setProduct(data);

      //  Check favourites
      const raw = localStorage.getItem(FAV_KEY);
      const ids = raw ? (JSON.parse(raw) as number[]) : [];
      setIsFavourite(ids.includes(data.id));

      // Fetch related products 
      setRelatedLoading(true);
      const related = await getRelatedProducts(data, 3);
      setRelatedProducts(related);

    } catch (err) {
      console.error(err);
      setError("Unable to load product details. Please try again later.");
    } finally {
      setLoading(false);
      setRelatedLoading(false);
    }
  };

  fetchProductAndRelated();
}, [productId]);



  // Handlers
  const handleBack = () => router.back();

  const handleDecreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));
  const handleIncreaseQuantity = () => setQuantity(prev => Math.min(99, prev + 1));

  const handleAddToCart = () => {
    if (!product) return;
    console.log(`Add ${quantity} of product ${product.id} to cart`);
  };

  const handleToggleFavourite = () => {
    if (!product) return;
    try {
      const raw = localStorage.getItem(FAV_KEY);
      let ids: number[] = raw ? JSON.parse(raw) : [];

      if (ids.includes(product.id)) {
        ids = ids.filter(id => id !== product.id);
        setIsFavourite(false);
      } else {
        ids.push(product.id);
        setIsFavourite(true);
      }

      localStorage.setItem(FAV_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRelatedClick = (id: number) => router.push(`/products/${id}`);

  // Loading / Error states
  if (loading) {
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
          <div className={styles.errorWrapper}>{error ?? "Product not found."}</div>
        </Container>
      </section>
    );
  }

  return (
 <section className={styles.pageWrapper}>
  <Container>
    {/* Back button */}
    <Row className={styles.backRow}>
      <Col>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          ← Back
        </button>
      </Col>
    </Row>

    {/* Product detail card */}
    <Row>
      <Col>
        <ProductCardDetail
          product={product}
          quantity={quantity}
          isFavourite={isFavourite}
          onDecreaseQuantity={handleDecreaseQuantity}
          onIncreaseQuantity={handleIncreaseQuantity}
          onToggleFavourite={handleToggleFavourite}
          onAddToCart={handleAddToCart}
        />
      </Col>
    </Row>

    {/* Related products / You may also like */}
    <section className={styles.relatedSection}>
      <Row>
        <Col>
          <div className={styles.relatedHeaderRow}>
            <h2 className={styles.relatedTitle}>You May Also Like</h2>
          </div>
        </Col>
      </Row>

      {/* Related product list */}
      {relatedLoading ? (
        <div className={styles.relatedLoading}>
          <Spinner animation="border" size="sm" />
        </div>
      ) : relatedProducts.length === 0 ? (
        <div className={styles.noRelated}>
          No related products found.
        </div>
      ) : (
        <div className={styles.relatedList}>
          {relatedProducts.map((item) => (
            <div
              key={item.id}
              className={styles.relatedListItem}
              onClick={() => handleRelatedClick(item.id)}
            >
              <div className={styles.relatedThumb}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <div className={styles.relatedText}>
                <h6>{item.title}</h6>
                <span>${item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search bar below related products */}
      <Row className={styles.searchRow}>
        <Col>
          <SearchBar onSelect={handleRelatedClick} />
        </Col>
      </Row>
    </section>
  </Container>
</section>
  );
};

export default ProductDetailPage;