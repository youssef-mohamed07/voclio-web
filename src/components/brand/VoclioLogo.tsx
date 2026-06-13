import Image from 'next/image';

interface VoclioLogoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

export default function VoclioLogo({
  size = 40,
  className = '',
  priority = false,
}: VoclioLogoProps) {
  return (
    <Image
      src="/voclio-logo.png"
      alt="Voclio"
      width={size}
      height={size}
      priority={priority}
      className={`object-contain ${className}`.trim()}
    />
  );
}
