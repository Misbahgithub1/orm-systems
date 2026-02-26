"use client";

import React from "react";
import { Container } from "react-bootstrap";
import Image from "next/image";
import styles from "./Portfolio.module.scss";

const Portfolio = () => {
  return (
    <section className={styles.portfolioWrapper}>
      <Container>
        <h2>My Awesome Portfolio</h2>

        {/* First Row: 2 images different widths */}
        <div className={styles.rowImages}>
          <div className={styles.imageWrapper} style={{ flex: "2 1 60%" }}>
            <Image src="/images/portfolio1.png" alt="Portfolio 1" width={800} height={500} />
          </div>
          <div className={styles.imageWrapper} style={{ flex: "1 1 35%" }}>
            <Image src="/images/portfolio2.png" alt="Portfolio 2" width={400} height={500} />
          </div>
        </div>

        {/* Second Row: 2 images different widths */}
        <div className={styles.rowImages}>
          <div className={styles.imageWrapper} style={{ flex: "1 1 35%" }}>
            <Image src="/images/portfolio3.png" alt="Portfolio 3" width={400} height={400} />
          </div>
          <div className={styles.imageWrapper} style={{ flex: "2 1 60%" }}>
            <Image src="/images/portfolio4.png" alt="Portfolio 4" width={800} height={400} />
          </div>
        </div>

        {/* Third Row: 3 images equal width */}
        <div className={styles.rowImages}>
          <div className={styles.imageWrapper} style={{ flex: "1 1 32%" }}>
            <Image src="/images/portfolio5.png" alt="Portfolio 5" width={400} height={400} />
          </div>
          <div className={styles.imageWrapper} style={{ flex: "1 1 32%" }}>
            <Image src="/images/portfolio6.png" alt="Portfolio 6" width={400} height={400} />
          </div>
          <div className={styles.imageWrapper} style={{ flex: "1 1 32%" }}>
            <Image src="/images/portfolio7.png" alt="Portfolio 7" width={400} height={400} />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Portfolio;