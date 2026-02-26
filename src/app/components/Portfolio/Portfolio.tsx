"use client";

import React from "react";
import { Container } from "react-bootstrap";
import Image, { type StaticImageData } from "next/image";
import styles from "./Portfolio.module.scss";

export interface PortfolioItem {
  src: StaticImageData;
  alt: string;
  layout?: "default" | "wide" | "tall" | "square";
}

export interface PortfolioProps {
  title?: string;
  items: PortfolioItem[];
  containerFluid?: boolean;
}

const getCardLayoutClass = (layout: PortfolioItem["layout"]) => {
  switch (layout) {
    case "wide":
      return styles.imageCardWide;
    case "tall":
      return styles.imageCardTall;
    case "square":
      return styles.imageCardSquare;
    default:
      return "";
  }
};

const PortfolioSection: React.FC<PortfolioProps> = ({
  title = "My Awesome Portfolio",
  items,
  containerFluid = false,
}) => {
  return (
    <section className={styles.portfolioWrapper}>
      <Container fluid={containerFluid}>
        <h2>{title}</h2>

        <div className={styles.portfolioGrid}>
          {items.map((item, index) => (
            <div
              key={`${item.alt}-${index}`}
              className={`${styles.imageCard} ${getCardLayoutClass(
                item.layout
              )}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PortfolioSection;
export { PortfolioSection };