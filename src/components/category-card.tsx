import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image?: string;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`}>
      <div className="group relative overflow-hidden rounded-lg">
        <Image
          src={category.image || "/placeholder-image.jpg"}
          alt={category.name}
          width={300}
          height={200}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
}
