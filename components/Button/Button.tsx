import { PropsWithChildren } from "react"
import classNames from "../../utils/classnames"
import { ButtonProps } from "./types"

export const Button: React.FC<PropsWithChildren<ButtonProps>> = (props) => {
  return (
    <button
      onClick={!Boolean(props.disabled) ? props.onClick : undefined}
      disabled={Boolean(props.disabled)}
      className={classNames(
        props.className || "",
        "whitespace-nowrap",
        "inline-flex",
        "items-center",
        "justify-center",
        "px-4",
        "py-2",
        "border",
        "border-transparent",
        "rounded-md",
        "shadow-sm",
        "text-base",
        "font-medium",
        "text-white",
        props.disabled
          ? "bg-gray-200"
          : "bg-amber-500 hover:bg-amber-500 cursor-pointer"
      )}>
      {props.children}
    </button>
  )
}

export default Button
