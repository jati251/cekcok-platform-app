import imageCompression from "browser-image-compression";

const ImageUploader = ({ onChange }) => {
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2, // Maximum size of the compressed image (1MB in this example)
          maxWidthOrHeight: 800, // Maximum width or height of the compressed image
          useWebWorker: true, // Use web workers to offload compression process (optional)
        };

        const compressedFile = await imageCompression(file, options);

        // Convert compressedFile to Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  return (
    <label className="text-gray-500 text-sm cursor-pointer">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <span className="px-5 py-1.5 bg-gray-200 rounded-full text-sm text-gray-700">
        Upload Image
      </span>
    </label>
  );
};

export default ImageUploader;
