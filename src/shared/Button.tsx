import type { FC } from 'react';

type ButtonProps = {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "outline" | "ghost";
    fullWidth?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const Button: FC<ButtonProps> = ({ label, onClick, variant = "primary", fullWidth}) => {
    const base = "px-4 py-2 rounded-lg font-medium transition";
    const styles =
        variant === "primary"
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "border border-blue-600 text-blue-600 hover:bg-blue-50";

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles} ${fullWidth ? "w-full" : ""}`}
    >
      {label}
    </button>
  );
  
}

export default Button