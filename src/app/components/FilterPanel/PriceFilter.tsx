"use client";

import React from "react";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ChevronUp, ChevronDown } from "react-bootstrap-icons";
import styles from "./FilterPanel.module.scss";

interface Props {
  expanded: boolean;
  toggle: () => void;
  priceBounds: { min: number; max: number } | null;
  priceMin: number | null;
  priceMax: number | null;
  onPriceMinChange: (value: number) => void;
  onPriceMaxChange: (value: number) => void;
}

const PriceFilter: React.FC<Props> = ({
  expanded,
  toggle,
  priceBounds,
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
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
          {priceBounds ? (
            <>
              <div className={styles.priceRangeRow}>
                <span>${priceBounds.min.toFixed(2)}</span>
                <span>${priceBounds.max.toFixed(2)}</span>
              </div>

              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="min-price-tooltip">
                    ${(priceMin ?? priceBounds.min).toFixed(2)}
                  </Tooltip>
                }
              >
                <Form.Range
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMin ?? priceBounds.min}
                  onChange={(e) =>
                    onPriceMinChange(Number(e.target.value))
                  }
                />
              </OverlayTrigger>

              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="max-price-tooltip">
                    ${(priceMax ?? priceBounds.max).toFixed(2)}
                  </Tooltip>
                }
              >
                <Form.Range
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={priceMax ?? priceBounds.max}
                  onChange={(e) =>
                    onPriceMaxChange(Number(e.target.value))
                  }
                />
              </OverlayTrigger>
            </>
          ) : (
            <div className={styles.mutedText}>No price data</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PriceFilter;