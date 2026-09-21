export const RESOURCES = {
  inquiries: {
    search: ['name', 'phone', 'city', 'email', 'capacity', 'source', 'message'],
    prefix: 'inq',
  },
  customers: {
    search: ['name', 'phone', 'email', 'city', 'type'],
    prefix: 'cus',
  },
  quotes: {
    search: ['no', 'customer', 'city', 'status'],
    prefix: 'qt',
  },
  projects: {
    search: ['name', 'customer', 'city', 'manager'],
    prefix: 'prj',
  },
  products: {
    search: ['name', 'brand', 'sku', 'catLabel', 'spec'],
    prefix: 'prd',
  },
  services: {
    search: ['title', 'titleHi', 'desc'],
    prefix: 'svc',
  },
  brands: {
    search: ['name'],
    prefix: 'brd',
  },
  banners: {
    search: ['title', 'desc', 'hindi'],
    prefix: 'bnr',
  },
  activity: {
    search: ['text', 'type'],
    prefix: 'act',
    readOnlyCreate: false,
  },
};
