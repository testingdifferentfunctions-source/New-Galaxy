import { Image } from "@/components/ui/image";

const LOGO_URL =
  "https://media.base44.com/images/public/6a6c4944b538ed6220bdbb1f/ed785f853_image.png";
const ORIGIN_WIDTH = 345;
const ORIGIN_HEIGHT = 249;

export default function Logo({ size = 32, className = "" }) {
  const width = Math.round(size * (ORIGIN_WIDTH / ORIGIN_HEIGHT));
  return (
    <Image
      src={LOGO_URL}
      alt="New Galaxy"
      originWidth={ORIGIN_WIDTH}
      originHeight={ORIGIN_HEIGHT}
      fittingType="fit"
      className={`shrink-0 ${className}`}
      style={{ height: size, width }}
    />
  );
}