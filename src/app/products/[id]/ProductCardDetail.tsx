"use client";

import React from "react";
import { Row, Col, Badge } from "react-bootstrap";
import Image from "next/image";
import { StarFill, Star, Heart, HeartFill } from "react-bootstrap-icons";
import styles from "./ProductDetailPage.module.scss";

import { Product } from "@/lib/api/products";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

interface ProductCardDetailProps {
  product: Product;
  quantity: number;
  isFavourite: boolean;
  onDecreaseQuantity: () => void;
  onIncreaseQuantity: () => void;
  onToggleFavourite: () => void;
  onAddToCart: () => void;
}

const ProductCardDetail: React.FC<ProductCardDetailProps> = ({
  product,
  quantity,
  isFavourite,
  onDecreaseQuantity,
  onIncreaseQuantity,
  onToggleFavourite,
  onAddToCart,
}) => {
  const computeDisplayNames = (title?: string, description?: string) => {
    const t = (title ?? "").trim();
    const d = (description ?? "").trim();
    const skuLike = /^[A-Za-z0-9-]{5,}$/.test(t) && !t.includes(" ");
    if (skuLike) {
      return { primary: t.toUpperCase(), secondary: d };
    }
    const primaryCandidate = t.split(/[,-]/)[0]?.trim() || t;
    const secondaryCandidate =
      t.slice(primaryCandidate.length).replace(/^[,–-]\s*/, "").trim() || d;
    return { primary: primaryCandidate.toUpperCase(), secondary: secondaryCandidate };
  };

  const { primary, secondary } = computeDisplayNames(product.title, product.description);

  return (
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
            <h1 className={styles.productName}>{primary}</h1>
            <p className={styles.fullName}>{secondary}</p>
          </div>

          <div className={styles.ratingRow}>
            <span className={styles.starRow}>
              {Array.from({ length: 5 }).map((_, index) =>
                index < Math.round(product.rating?.rate ?? 0) ? (
                  <StarFill key={index} className={styles.starFilled} size={18} />
                ) : (
                  <Star key={index} className={styles.starEmpty} size={18} />
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
            <span className={styles.categoryValue}>{product.category}</span>
          </div>

          <div className={styles.priceAndQuantityRow}>
            <div className={styles.priceRow}>
              <span className={styles.price}>
                ${(product.price * 0.73 * quantity).toFixed(2)}
              </span>
              <Badge bg="success" className={styles.CustomBadge}>
                27% off
              </Badge>
            </div>
            <div className={styles.quantityRow}>
              <div className={styles.quantityControl}>
                <button type="button" className={styles.quantityButton} onClick={onDecreaseQuantity}>
                  -
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button type="button" className={styles.quantityButton} onClick={onIncreaseQuantity}>
                  +
                </button>
              </div>
            </div>
          </div>

          <div className={styles.actionsRow}>
            <div className={styles.addToCartButtonWrapper}>
              <AddToCartButton
                label={`Add ${quantity} to Cart`}
                onClick={onAddToCart}
              />
            </div>
            <button
              type="button"
              className={`${styles.favouriteButton} ${isFavourite ? styles.favouriteActive : ""}`}
              aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
              aria-pressed={isFavourite}
              onClick={onToggleFavourite}
            >
              {isFavourite ? <HeartFill size={18} /> : <Heart size={18} />}
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductCardDetail;