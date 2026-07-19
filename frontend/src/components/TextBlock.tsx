type TextBlockProps = {
  children: React.ReactNode;
};

export default function TextBlock({ children }: TextBlockProps) {
  return (
    <p
      className="
        text-center
        font-quicksand
        text-md
        leading-relaxed
        text-black
        w-full
      "
    >
      {children}
    </p>
  );
}
