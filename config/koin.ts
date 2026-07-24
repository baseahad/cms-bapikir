export type KoinPackage = {
  id: string;
  koin: number;
  harga: number;
  label: string;
};

export const KOIN_BP_PACKAGES: KoinPackage[] = [
  { id: "starter", koin: 1_000, harga: 10_000, label: "Starter" },
  { id: "popular", koin: 5_500, harga: 50_000, label: "Popular" },
  { id: "booster", koin: 12_000, harga: 100_000, label: "Booster" },
  { id: "max", koin: 25_000, harga: 200_000, label: "Max" },
];

export function getKoinPackage(id: string): KoinPackage | null {
  return KOIN_BP_PACKAGES.find((p) => p.id === id) ?? null;
}
