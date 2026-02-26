"use client";

import React from "react";
import { Button, ButtonProps } from "react-bootstrap";
import styles from "./AddToCartButton.module.scss";

export interface AddToCartButtonProps
  extends Omit<ButtonProps, "variant" | "size"> {
  label?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  label = "Add to Cart",
  className,
  onClick,
  ...rest
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      variant="primary"
      size="sm"
      className={`${styles.addToCartButton} ${className ?? ""}`}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </Button>
  );
};

export default AddToCartButton;

