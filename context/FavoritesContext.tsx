import { createContext, useState, ReactNode } from "react";

type Plant = { id: number; [key: string]: any };

type FavoritesContextType = {
  favorites: Plant[];
  addFavorite: (plant: Plant) => void;
  removeFavorite: (plantId: number) => void;
};

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
});

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Plant[]>([]);

  const addFavorite = (plant: Plant) => {
    setFavorites((prev) => [...prev, plant]);
  };

  const removeFavorite = (plantId: number) => {
    setFavorites((prev) => prev.filter((plant) => plant.id !== plantId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}
