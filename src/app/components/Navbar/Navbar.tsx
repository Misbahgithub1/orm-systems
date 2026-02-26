import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import styles from "./Navbar.module.scss";
import Link from "next/link";

const NavbarComponent = () => {
  const navItems = [
    { name: "Brands", href: "/brands" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Resource Hub", href: "/resources" },
    { name: "Support", href: "/support" },
    { name: "Categories", href: "/category" },
  ];

  return (
    <Container fluid className={styles.navbarContainer}>
      <Row className="w-100 align-items-center">
        {/* Logo */}
        <Col xs={12} md={2} className={styles.logo}>
          <Link href="/">LOGO</Link>
        </Col>

        {/* Nav Items */}
        <Col xs={12} md={8}>
          <Nav className={styles.navItems}>
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="nav-item">
                {item.name}
              </Link>
            ))}
          </Nav>
        </Col>

        {/* CTA Button */}
        <Col xs={12} md={2} className="text-end">
          <button className={styles.ctaButton}>Get a Quote</button>
        </Col>
      </Row>
    </Container>
  );
};

export default NavbarComponent;