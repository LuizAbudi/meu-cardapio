import { getAllMenuItens } from '@/api/menuItems';
import { MenuItemCard } from '@/components/menu-item-card';

export default async function PromotionPage() {
  const items = await getAllMenuItens();

  const itensInPromotion = items.items.filter((item) => item.promotion).map((item) => ({
    ...item,
    image: item.image,
    category: item.category.name,
  }));



  return (
    <>
      <h1 className="mb-6 text-3xl font-bold flex justify-center">Promoções</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {itensInPromotion.filter((item) => item.promotion).map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </>
  )
}