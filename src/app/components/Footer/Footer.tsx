"use client";

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import {
  Telephone,
  Facebook,
  Twitter,
  Linkedin,
} from "react-bootstrap-icons";
import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className={styles.topSection}>
              <div className={styles.logo}>
                <Image
                  src="/images/footer-logo.png"
                  alt="ORM Systems"
                  width={140}
                  height={40}
                />
              </div>
              <p className={styles.description}>
                Maecenas et vestibulum dolor. Proin orci mauris, fermentum quis
                turpis non, consectetur pretium dui. Duis congue sollicitudin
                metus, a volutpat odio accumsan eget.
              </p>

              <div className={styles.infoRow}>
                <div className={styles.contactBlock}>
                  <Telephone className={styles.contactIcon} size={18} />
                  <span className={styles.contactText}>000-000-000</span>
                </div>

                <nav className={styles.navLinks} aria-label="Footer navigation">
                  <Link href="/" className={styles.navLink}>
                    Home
                  </Link>
                  <Link href="/services" className={styles.navLink}>
                    Services
                  </Link>
                  <Link href="/about" className={styles.navLink}>
                    About Us
                  </Link>
                  <Link href="/blog" className={styles.navLink}>
                    Blog
                  </Link>
                </nav>

                <div className={styles.emailBlock}>
                  <a
                    href="mailto:info@ifogroup.com"
                    className={styles.emailLink}
                  >
                    info@ifogroup.com
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row className={styles.bottomRow}>
          <Col lg={8} className={styles.bottomLeft}>
            <p className={styles.copyright}>
              Copyright © 2023 Ifo Group Safety, Risk &amp; Fire Consultants.
              All Rights Reserved.
            </p>
          </Col>
          <Col lg={4} className={styles.bottomRight}>
            <div className={styles.socialRow}>
              <a
                href="#"
                aria-label="Facebook"
                className={styles.socialButton}
              >
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialButton}>
                <Twitter size={14} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className={styles.socialButton}
              >
                <Linkedin size={14} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
