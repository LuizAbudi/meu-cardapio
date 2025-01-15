import { MenuItemCard } from '@/components/menu-item-card';
import { items } from '../category/[id]/page';

export default function PromotionPage() {
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold flex justify-center">Promoções</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.filter((item) => item.promotion).map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}