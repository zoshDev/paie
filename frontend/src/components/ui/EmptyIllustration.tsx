type IllustrationProps = {
  src: string;
  alt: string;
};

export const EmptyIllustration = ({ src, alt }: IllustrationProps) => (
  <div className="w-full flex justify-center items-center py-10">
    <img src={src} alt={alt} className="max-h-64 object-contain opacity-80" />
  </div>
);
