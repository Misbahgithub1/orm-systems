"use client";

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import styles from "./Hero.module.scss";

const Hero = () => {
    return (
        <section className={styles.heroWrapper}>

            <Image
                src="/images/hero-bg.png"
                alt="Hero Background"
                fill
                className={styles.heroImage}
                priority
            />
            <div className={styles.heroContent}>
                <p className={styles.heroSubtitle}>Data Center Transformation</p>
                <h1 className={`${styles.heroTitle} heading-xl`}>Revolutionizing Your Data Center
                    Infrastructure</h1>
                <p>
                    Transform outdated systems into scalable, future-ready infrastructures with advanced solutions to boost efficiency, reliability, and security.
                </p>

                <div className={styles.heroActions}>
                    <Button className={styles.ctaButton}>Talk to an expert</Button>
                    <p className={styles.heroExtra}>
                        Get an instant quote
                    </p>
                </div>

            </div>
        </section>
    );
};

export default Hero;