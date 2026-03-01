"use client";

import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import styles from "./SearchBar.module.scss";
import { Product, getAllProducts } from "@/lib/api/products";

interface SearchBarProps {
    onSelect: (productId: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [allProducts, setAllProducts] = useState<Product[] | null>(null);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const isSearching = debouncedSearchTerm.length > 0;

    // Debounce input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm.trim());
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Run search
    useEffect(() => {
        const runSearch = async () => {
            if (!debouncedSearchTerm) {
                setSearchResults([]);
                setSearchError(null);
                setSearchLoading(false);
                return;
            }

            try {
                setSearchLoading(true);
                setSearchError(null);

                let baseProducts = allProducts;
                if (!baseProducts) {
                    baseProducts = await getAllProducts();
                    setAllProducts(baseProducts);
                }

                const q = debouncedSearchTerm.toLowerCase();
                const filtered = baseProducts.filter(
                    (p) =>
                        p.title.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q)
                );

                setSearchResults(filtered);
            } catch (err) {
                console.error(err);
                setSearchError("Unable to search products. Please try again later.");
            } finally {
                setSearchLoading(false);
            }
        };

        runSearch();
    }, [debouncedSearchTerm, allProducts]);

    return (
        <div className={styles.searchWrapper}>
            <div className={styles.searchInputWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <Form.Control
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {searchLoading && <Spinner animation="border" size="sm" />}
            {searchError && <div className={styles.error}>{searchError}</div>}

            {isSearching && searchResults.length > 0 && (
                <div className={styles.searchResultsList}>
                    {searchResults.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={styles.searchResultItem}
                            onClick={() => onSelect(item.id)}
                        >
                            <div className={styles.searchResultThumb}>
                                <img src={item.image} alt={item.title} loading="lazy" />
                            </div>
                            <div className={styles.searchResultText}>{item.title}</div>
                        </button>
                    ))}
                </div>
            )}
            {/* No results message */}
            {isSearching && searchResults.length === 0 && (
                <div className={styles.noResults}>
                    No products found for "{debouncedSearchTerm}"
                </div>
            )}
        </div>
    );
};

export default SearchBar;