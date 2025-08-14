import React, { useEffect, useState, useCallback } from "react";
import { createId } from "@/utils/random";

type TSize = "md" | "lg" | undefined;
type TColor = "primary" | "success" | undefined;

type Props = {
  children?: React.ReactNode;
  label?: string;
  className?: string;
  id?: string;
  checked?: boolean;
  onChange?: Function;
  disabled?: boolean;
  defaultChecked?: boolean;
  size?: TSize;
  color?: TColor;
};

const idElRandom = createId();

const Switch = ({
  children,
  label,
  className,
  id,
  defaultChecked,
  size = "md",
  color = "primary",
  checked,
  onChange = () => {},
  disabled,
}: Props) => {
  const idEl = id ? id : idElRandom;
  const [isChecked, setIsChecked] = useState(false);
  const isHasDefault: boolean =
    typeof defaultChecked != "undefined" ? true : false;
  const isHasChecked: boolean = typeof checked != "undefined" ? true : false;

  const toggleChecked = () => {
    if (isHasDefault) {
      setIsChecked((value: boolean) => {
        let isValue = !value;
        !isHasChecked && onChange(isValue);
        return isValue;
      });
    } else {
      onChange(!checked);
    }
  };

  useEffect(() => {
    if (isHasChecked) {
      setIsChecked(checked || false);
    }
  }, [checked]);

  useEffect(() => {
    if (isHasDefault) {
      setIsChecked(defaultChecked || false);
    }
  }, [defaultChecked]);

  return (
    <div
      className={`Button-Toggle ${className || ""} Button-Toggle-Size--${size} Button-Toggle-Color--${color} ${disabled ? "Button-Toggle__Disabled" : ""}`}
    >
      <span>
        <input
          type="checkbox"
          id={idEl}
          // ref="toggleInput"
          checked={isChecked}
          onChange={(e: any) => {}}
        />

        <button
          className="Button-Toggle__Slick"
          type="button"
          onClick={() => {
            !disabled && toggleChecked();
          }}
        ></button>
      </span>
      {children
        ? children
        : label && (
            <label
              htmlFor={idEl}
              onClick={() => {
                !disabled && toggleChecked();
              }}
            >
              {label}
            </label>
          )}
    </div>
  );
};

export default Switch;
