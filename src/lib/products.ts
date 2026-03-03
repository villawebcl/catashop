import type { Product } from "@/lib/types";
import { supabaseServer } from "@/lib/supabase/server";

export const getPublicProducts = async (): Promise<Product[]> => {
  if (!supabaseServer) return [];
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Product[];
};

export const getPublicProductById = async (id: string): Promise<Product | null> => {
  if (!supabaseServer) return null;
  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as Product;
};
