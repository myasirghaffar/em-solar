interface ProductImagesProps {
  product: any;
  images: string[];
  selectedImage: number;
  setSelectedImage: (v: number) => void;
  getImageUrl: (i: number) => string;
  onImageError: () => void;
}

export function ProductImages({ product, images, selectedImage, setSelectedImage, getImageUrl, onImageError }: ProductImagesProps) {
  return (
    <div>
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
        <img src={getImageUrl(selectedImage)} alt={product.name} onError={onImageError} className="w-full aspect-square object-cover" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((_: string, index: number) => (
            <button key={index} onClick={() => setSelectedImage(index)} className={`rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-[#FF7A00]" : "border-transparent"}`}>
              <img src={getImageUrl(index)} alt={`${product.name} ${index + 1}`} className="w-full aspect-square object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
