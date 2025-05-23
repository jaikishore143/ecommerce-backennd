// No need to import Decimal anymore as we're using native number type

// Product types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stock: number;
  categoryId: string;
  subcategoryId?: string;
  brand?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  images?: string[];
  tags?: string[];
  specifications?: { key: string; value: string }[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  salePrice?: number | null;
  stock?: number;
  categoryId?: string;
  subcategoryId?: string | null;
  brand?: string | null;
  isNew?: boolean;
  isFeatured?: boolean;
  images?: string[];
  tags?: string[];
  specifications?: { key: string; value: string }[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  images: {
    id: string;
    url: string;
    isMain: boolean;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand?: string | null;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  specifications: {
    key: string;
    value: string;
  }[];
}

// Category types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: string;
  slug: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string | null;
  image?: string | null;
  slug?: string;
}

// Subcategory types
export interface CreateSubcategoryRequest {
  name: string;
  slug: string;
  categoryId: string;
}

export interface UpdateSubcategoryRequest {
  name?: string;
  slug?: string;
  categoryId?: string;
}

// Product filter types
export interface ProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStock?: boolean;
  onSale?: boolean;
  tags?: string[];
  search?: string;
}

// Tag types
export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name?: string;
}
