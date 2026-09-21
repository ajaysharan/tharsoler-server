import { PRODUCTS } from './catalog.js';

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function daysAgo(n, hours = 10) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hours, (n * 7) % 60, 0, 0);
  return d.toISOString();
}

export function buildSeed() {
  const users = [
    {
      id: 'u_admin',
      name: 'Rajesh Sharma',
      email: 'admin@tharsolar.com',
      phone: '9328222520',
      role: 'admin',
      status: 'active',
      password: 'Admin@123',
      lastLogin: daysAgo(0, 9),
      createdAt: daysAgo(420),
    },
    {
      id: 'u_meena',
      name: 'Meena Rathore',
      email: 'meena@tharsolar.com',
      phone: '9829011122',
      role: 'manager',
      status: 'active',
      password: 'Staff@123',
      lastLogin: daysAgo(1, 18),
      createdAt: daysAgo(200),
    },
    {
      id: 'u_vikram',
      name: 'Vikram Singh',
      email: 'vikram@tharsolar.com',
      phone: '9414123344',
      role: 'staff',
      status: 'active',
      password: 'Staff@123',
      lastLogin: daysAgo(0, 11),
      createdAt: daysAgo(90),
    },
    {
      id: 'u_pooja',
      name: 'Pooja Choudhary',
      email: 'pooja@tharsolar.com',
      phone: '9982114455',
      role: 'staff',
      status: 'active',
      password: 'Staff@123',
      lastLogin: daysAgo(3, 16),
      createdAt: daysAgo(60),
    },
    {
      id: 'u_anil',
      name: 'Anil Joshi',
      email: 'anil@tharsolar.com',
      phone: '9782116677',
      role: 'staff',
      status: 'inactive',
      password: 'Staff@123',
      lastLogin: daysAgo(40, 12),
      createdAt: daysAgo(310),
    },
  ];

  const inquiries = [
    ['Hari Ram', '9829011001', 'Badi Khatu', 'Residential', 2800, '3 kW', 'new', 'Website', 'u_vikram', 0],
    ['Suman Devi', '9414112233', 'Nagaur', 'Residential', 4200, '5 kW', 'contacted', 'WhatsApp', 'u_meena', 1],
    ['Ganesh Traders', '9829123456', 'Kuchaman', 'Commercial', 18000, '10 kW+', 'quoted', 'Call', 'u_meena', 2],
    ['Ramesh Jakhar', '9982110099', 'Didwana', 'Farm', 0, 'Not sure — please suggest', 'qualified', 'Walk-in', 'u_vikram', 2],
    ['Khatu Public School', '9414007788', 'Badi Khatu', 'Institutional', 32000, '10 kW+', 'won', 'Referral', 'u_admin', 8],
    ['Mohit Soni', '9782001122', 'Merta', 'Residential', 3500, '3 kW', 'lost', 'Website', 'u_pooja', 12],
    ['Ladnun Hardware', '9828445566', 'Ladnun', 'Commercial', 9500, '5 kW', 'quoted', 'WhatsApp', 'u_meena', 4],
    ['Bhagirath', '9414556677', 'Jayal', 'Residential', 2100, '1 kW', 'new', 'Website', 'u_pooja', 0],
    ['Shree Flour Mill', '9982778899', 'Nagaur', 'Industrial', 45000, '10 kW+', 'qualified', 'Call', 'u_admin', 5],
    ['Anita Kanwar', '9828332211', 'Parbatsar', 'Residential', 5100, '5 kW', 'contacted', 'WhatsApp', 'u_vikram', 1],
    ['Om Prakash', '9414221100', 'Makrana', 'Residential', 1900, '1 kW', 'new', 'Website', '', 0],
    ['Desert Agro Farm', '9782665544', 'Degana', 'Farm', 0, 'Not sure — please suggest', 'quoted', 'Referral', 'u_meena', 6],
    ['City Mart', '9828003344', 'Nagaur', 'Commercial', 12000, '10 kW+', 'won', 'Walk-in', 'u_admin', 18],
    ['Kamla Devi', '9982001123', 'Badi Khatu', 'Residential', 2600, '3 kW', 'contacted', 'Call', 'u_pooja', 3],
    ['New India Workshop', '9414887766', 'Kuchaman', 'Industrial', 22000, '10 kW+', 'new', 'Website', 'u_vikram', 1],
    ['Suresh Choudhary', '9829112234', 'Mundwa', 'Residential', 3300, '3 kW', 'qualified', 'WhatsApp', 'u_meena', 4],
    ['Gram Panchayat Hall', '9414009900', 'Jayal', 'Institutional', 8000, '5 kW', 'quoted', 'Referral', 'u_admin', 9],
    ['Priya Sharma', '9782110098', 'Nagaur', 'Residential', 4700, '5 kW', 'new', 'Website', '', 0],
    ['Thar Motors', '9828221100', 'Badi Khatu', 'Commercial', 15000, '10 kW+', 'won', 'Walk-in', 'u_admin', 28],
    ['Baldev Singh', '9982445566', 'Nawa', 'Farm', 0, 'Not sure — please suggest', 'lost', 'Call', 'u_vikram', 20],
    ['Asha Boutique', '9414332211', 'Merta', 'Commercial', 6200, '5 kW', 'contacted', 'WhatsApp', 'u_pooja', 2],
    ['Hanuman Temple Trust', '9828776655', 'Khatu', 'Institutional', 11000, '5 kW', 'qualified', 'Referral', 'u_meena', 7],
    ['Jagdish Tailor', '9782009988', 'Didwana', 'Residential', 1500, '1 kW', 'new', 'Website', 'u_pooja', 1],
    ['RK Petrol Pump', '9414667788', 'Nagaur', 'Commercial', 28000, '10 kW+', 'quoted', 'Call', 'u_admin', 11],
    ['Sunita Yadav', '9982112233', 'Parbatsar', 'Residential', 3900, '3 kW', 'contacted', 'WhatsApp', 'u_vikram', 0],
    ['Green Valley Farm', '9828441122', 'Degana', 'Farm', 0, 'Not sure — please suggest', 'new', 'Walk-in', '', 2],
    ['Mohan Lal', '9414110099', 'Badi Khatu', 'Residential', 2400, '3 kW', 'won', 'Website', 'u_meena', 35],
    ['Shakti Hardware', '9782334455', 'Ladnun', 'Commercial', 8700, '5 kW', 'lost', 'Call', 'u_pooja', 16],
  ].map((row, i) => {
    const [name, phone, city, propertyType, bill, capacity, status, source, assignedTo, ago] = row;
    return {
      id: `inq_${String(i + 1).padStart(3, '0')}`,
      name,
      phone,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@mail.test`,
      city,
      propertyType,
      bill,
      capacity,
      message: bill ? `Monthly bill around ₹${bill}. Need ${capacity} system.` : 'Need solar pump / farm system sizing.',
      status,
      source,
      assignedTo,
      notes: status === 'won' ? 'Deposit received. Site survey scheduled.' : '',
      createdAt: daysAgo(ago, 9 + (i % 8)),
      updatedAt: daysAgo(Math.max(0, ago - 1), 14),
    };
  });

  const customers = inquiries
    .filter((q) => ['won', 'quoted', 'qualified'].includes(q.status))
    .map((q, i) => ({
      id: `cus_${String(i + 1).padStart(3, '0')}`,
      name: q.name,
      phone: q.phone,
      email: q.email,
      city: q.city,
      type: q.propertyType,
      inquiryId: q.id,
      tags: q.status === 'won' ? ['Customer'] : ['Prospect'],
      createdAt: q.createdAt,
    }));

  const quotes = [
    { no: 'TSQ-1042', customer: 'Ganesh Traders', city: 'Kuchaman', kw: 12, amount: 648000, status: 'sent', ago: 2 },
    { no: 'TSQ-1041', customer: 'Khatu Public School', city: 'Badi Khatu', kw: 20, amount: 1080000, status: 'accepted', ago: 8 },
    { no: 'TSQ-1040', customer: 'Ladnun Hardware', city: 'Ladnun', kw: 6, amount: 318000, status: 'sent', ago: 4 },
    { no: 'TSQ-1038', customer: 'Desert Agro Farm', city: 'Degana', kw: 7.5, amount: 420000, status: 'draft', ago: 6 },
    { no: 'TSQ-1035', customer: 'City Mart', city: 'Nagaur', kw: 15, amount: 795000, status: 'accepted', ago: 18 },
    { no: 'TSQ-1031', customer: 'Gram Panchayat Hall', city: 'Jayal', kw: 5, amount: 265000, status: 'sent', ago: 9 },
    { no: 'TSQ-1028', customer: 'Thar Motors', city: 'Badi Khatu', kw: 18, amount: 945000, status: 'accepted', ago: 28 },
    { no: 'TSQ-1022', customer: 'RK Petrol Pump', city: 'Nagaur', kw: 25, amount: 1325000, status: 'sent', ago: 11 },
    { no: 'TSQ-1019', customer: 'Hanuman Temple Trust', city: 'Khatu', kw: 8, amount: 424000, status: 'draft', ago: 7 },
    { no: 'TSQ-1011', customer: 'Mohan Lal', city: 'Badi Khatu', kw: 3, amount: 165000, status: 'accepted', ago: 35 },
    { no: 'TSQ-1008', customer: 'Shakti Hardware', city: 'Ladnun', kw: 5, amount: 275000, status: 'expired', ago: 16 },
    { no: 'TSQ-1004', customer: 'Baldev Singh', city: 'Nawa', kw: 5, amount: 285000, status: 'expired', ago: 20 },
  ].map((q, i) => ({
    id: `qt_${i + 1}`,
    ...q,
    validTill: daysAgo(q.ago - 14),
    createdAt: daysAgo(q.ago),
    assignedTo: i % 2 === 0 ? 'u_meena' : 'u_admin',
  }));

  const projects = [
    { name: 'Khatu Public School 20 kW', customer: 'Khatu Public School', kw: 20, status: 'install', city: 'Badi Khatu', ago: 6 },
    { name: 'City Mart 15 kW Rooftop', customer: 'City Mart', kw: 15, status: 'commissioned', city: 'Nagaur', ago: 10 },
    { name: 'Thar Motors 18 kW', customer: 'Thar Motors', kw: 18, status: 'commissioned', city: 'Badi Khatu', ago: 20 },
    { name: 'Mohan Lal 3 kW Home', customer: 'Mohan Lal', kw: 3, status: 'commissioned', city: 'Badi Khatu', ago: 25 },
    { name: 'Ganesh Traders 12 kW', customer: 'Ganesh Traders', kw: 12, status: 'survey', city: 'Kuchaman', ago: 1 },
    { name: 'RK Petrol Pump 25 kW', customer: 'RK Petrol Pump', kw: 25, status: 'design', city: 'Nagaur', ago: 8 },
    { name: 'Desert Agro 7.5 HP Pump', customer: 'Desert Agro Farm', kw: 7.5, status: 'onhold', city: 'Degana', ago: 5 },
  ].map((p, i) => ({
    id: `prj_${i + 1}`,
    ...p,
    startDate: daysAgo(p.ago),
    value: p.kw * 53000,
    manager: i % 2 ? 'Meena Rathore' : 'Rajesh Sharma',
  }));

  const products = PRODUCTS.map((p, i) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    cat: p.cat,
    catLabel: p.catLabel,
    spec: p.spec,
    warranty: p.warranty,
    sku: `TS-${p.cat.slice(0, 3).toUpperCase()}-${String(i + 101)}`,
    price: 8000 + (i % 9) * 2500 + (p.cat === 'kits' ? 40000 : 0) + (p.cat === 'inverters' ? 18000 : 0) + (p.cat === 'batteries' ? 4000 : 0),
    stock: [4, 12, 0, 28, 7, 15, 3, 9][i % 8],
    active: i % 11 !== 0,
    updatedAt: daysAgo(i % 12),
  }));

  const activity = [
    { text: 'New inquiry from Priya Sharma (Website)', type: 'inquiry' },
    { text: 'Quote TSQ-1042 sent to Ganesh Traders', type: 'quote' },
    { text: 'Vikram Singh called Suman Devi', type: 'call' },
    { text: 'Project City Mart marked commissioned', type: 'project' },
    { text: 'User Pooja Choudhary logged in', type: 'user' },
    { text: 'Inquiry Khatu Public School moved to Won', type: 'inquiry' },
    { text: 'Stock updated: Adani Mono PERC 540W', type: 'product' },
    { text: 'Quote TSQ-1008 expired', type: 'quote' },
  ].map((a, i) => ({ id: uid('act'), ...a, at: daysAgo(0, 8 + i) }));

  return {
    users,
    inquiries,
    customers,
    quotes,
    projects,
    products,
    activity,
    settings: {
      company: 'THAR SOLAR',
      unit: 'A unit of Ganesh Motor',
      city: 'Badi Khatu, Nagaur, Rajasthan',
      phone: '+91 93282 22520',
      email: 'info@tharsolar.com',
      gst: '08AAAAA0000A1Z5',
    },
  };
}
