interface CommentButtonIconProps {
  icon: any;
  onClick: any;
}

export default function CommentButtonIcon({
  icon,
  onClick,
}: CommentButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className="text-radix-mintDefault duration-300 hover:text-radix-mintLighter transition-all"
    >
      {icon}
    </button>
  );
}