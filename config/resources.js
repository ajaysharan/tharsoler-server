export const RESOURCES = {
  inquiries: {
    search: ['name', 'phone', 'city', 'email', 'capacity', 'source', 'message'],
  },
  customers: {
    search: ['name', 'phone', 'email', 'city', 'type'],
  },
  quotes: {
    search: ['no', 'customer', 'city', 'status'],
  },
  projects: {
    search: ['name', 'customer', 'city', 'manager'],
  },
  products: {
    search: ['name', 'brand', 'sku', 'catLabel', 'spec', 'slug'],
  },
  services: {
    search: ['title', 'titleHi', 'desc', 'slug'],
  },
  brands: {
    search: ['name', 'slug'],
  },
  banners: {
    search: ['title', 'desc', 'hindi'],
  },
  activity: {
    search: ['text', 'type'],
  },
};
