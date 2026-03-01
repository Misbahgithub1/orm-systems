"use client";

import React from "react";
import { Form } from "react-bootstrap";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import styles from "./FilterPanel.module.scss";

export type PriceRangeValue = "0-50" | "50-100" | "100plus";

interface Props {
  expanded: boolean;
  toggle: () => void;
  selectedPrice: PriceRangeValue | null;
  onPriceChange: (value: PriceRangeValue) => void;
}

const priceRanges = [
  { label: "$0 - $50", value: "0-50" as PriceRangeValue },
  { label: "$50 - $100", value: "50-100" as PriceRangeValue },
  { label: "$100+", value: "100plus" as PriceRangeValue },
];

const PriceCheckboxFilter: React.FC<Props> = ({
  expanded,
  toggle,
  selectedPrice,
  onPriceChange,
}) => {
  return (
    <div className={styles.filterBlock}>
      <div
        className={styles.filterBlockHeader}
        onClick={toggle}
      >
        <span>Price</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </div>

      {expanded && (
        <div className={styles.filterContent}>
          <Form>
            {priceRanges.map((range) => (
              <Form.Check
                key={range.value}
                type="radio"   // single select (recommended UX)
                label={range.label}
                checked={selectedPrice === range.value}
                onChange={() => onPriceChange(range.value)}
                className={styles.filterOption}
              />
            ))}
          </Form>
        </div>
      )}
    </div>
  );
};

export default PriceCheckboxFilter;