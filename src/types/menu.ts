export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  halfPrice: number;
  image: string;
  category: string;
  promotion?: {
    promotionPrice: number;
    inPromotion: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface WhiteLabelConfig {
  restaurantName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}
