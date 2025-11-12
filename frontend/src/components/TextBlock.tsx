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
        max-w-sm
        mx-auto
      "
    >
      {children}
    </p>
  );
}
