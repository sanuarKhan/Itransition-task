import React from "react";
import {
  Button as BSButton,
  ButtonProps as BSButtonProps,
  Spinner,
} from "react-bootstrap";

interface ButtonProps extends BSButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  loading = false,
  icon,
  children,
  disabled,
  ...props
}) => {
  return (
    <BSButton
      {...props}
      disabled={disabled || loading}
      className={`d-flex align-items-center gap-2 ${props.className || ""}`}
    >
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
    </BSButton>
  );
};
