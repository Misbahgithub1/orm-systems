"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { ArrowRight } from "react-bootstrap-icons";
import styles from "./FeaturesSection.module.scss";

const cardsData = [
  {
    image: "/images/feature1.png",
    heading: "Cutting-Edge Analytics",
    text: "Leverage data-driven insights to optimize your business performance. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac justo sit amet nulla dapibus.",
    link: "#",
  },

  {
    image: "/images/feature2.png",
    heading: "Powering Inclusive Communities Powering Inclusive",
    text: "Delivering seamless connectivity, enhanced security, and high performance for robust and scalable networks. Delivering seamless connectivity, enhanced security, and high performance.  ",
    link: "#",
  },
  {
    image: "/images/feature3.png",
    heading: "Scalable Solutions",
    text: "Our platform grows with your business, ensuring long-term success. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    link: "#",
  },
];

const FeaturesSection = () => {
  return (
    <section className={styles.featuresWrapper}>
      <Container>
        <h2>Cutting-Edge Solutions For Industry Leaders</h2>
        <Row className="g-4">
          {cardsData.map((card, index) => (
            <Col xs={12} md={4} key={index}>
              <div className={styles.cardItem}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={card.image}
                    alt={card.heading}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <div className={styles.cardContent}>
                  <h3>{card.heading}</h3>
                  <p>{card.text}</p>
                  <a href={card.link} className={styles.readMore}>
                    Read More <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};
export default FeaturesSection;