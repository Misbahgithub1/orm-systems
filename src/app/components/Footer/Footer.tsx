"use client";

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <section className={styles.footerWrapper}>
   

     
      <Container>
        <Row>
          <Col xs={12} md={12} className={styles.heroContent}>
            <h1>Footer</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Duis aute irure dolor in reprehenderit in voluptate velit.
            </p>
           
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Footer;