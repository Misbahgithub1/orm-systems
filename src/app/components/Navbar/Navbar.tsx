"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";
import Link from "next/link";
import { List } from "react-bootstrap-icons";
import styles from "./Navbar.module.scss";
import Image from "next/image";

const NavbarComponent = () => {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Brands", href: "/brands" },
    { name: "About us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Resource Hub", href: "/resources" },
    { name: "Support", href: "/support" },
    { name: "Categories", href: "/category" },
  ];

  return (
    <>
      {/* Sticky Wrapper */}
      <div
        className={`${styles.navbarWrapper} ${
          scrolled ? styles.scrolled : ""
        }`}
      >
        <Container fluid className={styles.navbarContainer}>
          <Row className="w-100 align-items-center">

            {/* Logo */}
            <Col xs={6} md={2} className={styles.logo}>
              <Link href="/" className="logo-wrapper">
                <Image
                  src="/images/logo.png"
                  alt="Company Logo"
                  width={100}
                  height={40}
                  className={styles.logoImage}
                   
                  priority
                />
              </Link>
            </Col>

            {/* Desktop Nav */}
            <Col
              md={8}
              className={`d-none d-md-flex ${styles.navItems}`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={styles.navItem}
                >
                  {item.name}
                </Link>
              ))}
            </Col>

            {/* Desktop CTA */}
            <Col
              md={2}
              className="d-none d-md-flex justify-content-end"
            >
              <button className={styles.ctaButton}>
                Get a Quote
              </button>
            </Col>

            {/* Mobile Hamburger */}
            <Col
              xs={6}
              className="d-flex d-md-none justify-content-end"
            >
              <Button
                variant="link"
                onClick={() => setShow(true)}
                className={styles.hamburger}
              >
                <List size={28} />
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {/* LEFT SIDEBAR */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="start"
        className={styles.mobileSidebar}
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} mb-3`}
                onClick={() => setShow(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Sidebar CTA */}
            <button
              className={`${styles.ctaButton} ${styles.sidebarCta}`}
            >
              Get a Quote
            </button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default NavbarComponent;