interface GraphicImageProps {
  src: string;
  alt: string;
}

const GraphicImage = ({ src, alt }: GraphicImageProps) => {
  return (
    <div className="w-full mx-auto">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
};

export default GraphicImage;
