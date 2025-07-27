import { LINK_BUTTON_COLOR } from "@/types/linkButton";
import Link from "next/link";

interface LinkButtonProps {
  href: string;
  text: string;
  className?: string;
  color: LINK_BUTTON_COLOR;
}

const LinkButton = ({ href, text, className, color }: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`text-gray-500 transition-colors cursor-pointer active:scale-95 ${className} ${color}`}
    >
      {text}
    </Link>
  );
};

export default LinkButton;
