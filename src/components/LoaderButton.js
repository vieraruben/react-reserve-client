import React from "react";
import { Button } from "react-bootstrap";
import "./LoaderButton.css";

// import Spinner from 'react-bootstrap/Spinner'
export default function LoaderButton({
  isLoading,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >}
      {props.children}
    </Button>
  );
}