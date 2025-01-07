import { motion } from "framer-motion";
import Container from "../Container";
import classNames from "classnames";

type Props = {
  children: React.ReactNode;
  fullWidth?: boolean;
  size?: "small" | "medium" | "large" | "xlarge";
  padded?: boolean;
  elevated?: boolean;
  onClick?: () => void;
};

function Button({
  children,
  fullWidth = false,
  size = "medium",
  elevated,
  padded,
  onClick,
}: Props) {
  return (
    <div className={classNames(elevated && "shadow-filter-flat")}>
      <div className="shadow-border">
        <motion.button
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          onClick={onClick}
        >
          <Container bg="none" fullWidth={fullWidth}>
            <div
              className={classNames(
                "w-full",
                "flex flex-col items-center justify-center",
                "text-text-primary font-bold p-0 cursor-pointer",
                size === "small" && "text-sm",
                size === "medium" && "text-md",
                size === "large" && "text-lg",
                size === "xlarge" && "text-xl font-extrabold",
                padded && "px-4 py-1"
              )}
            >
              {children}
            </div>
          </Container>
        </motion.button>
      </div>
    </div>
  );
}

export default Button;
