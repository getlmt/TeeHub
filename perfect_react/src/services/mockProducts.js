export const MOCK_PRODUCTS = [
  {
    id: 'demo-tee-001',
    name: 'Áo thun Perfect React',
    price: 199000,
    description:
      'Áo thun cotton 100% mềm mịn, form unisex. Phù hợp in thiết kế AI Try-On. Vải dày dặn, thấm hút tốt, co giãn 4 chiều.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    sku: 'PR-Tee-001',
    stock: 42,
    colors: [
      { code: 'white', name: 'Trắng' },
      { code: 'black', name: 'Đen' },
      { code: 'blue', name: 'Xanh navy' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { label: 'Chất liệu', value: '100% Cotton Compact' },
      { label: 'Định lượng vải', value: '220 GSM' },
      { label: 'Form', value: 'Unisex Regular' },
      { label: 'Công nghệ in', value: 'DTF/Screen Printing' },
      { label: 'Bảo hành', value: '30 ngày' },
    ],
    care: [
      'Giặt ở nhiệt độ dưới 30°C',
      'Không dùng thuốc tẩy',
      'Lộn trái khi ủi, ủi ở nhiệt độ thấp',
      'Không sấy khô ở nhiệt độ cao',
    ],
  },
  {
    id: 'demo-tee-002',
    name: 'Áo thun Vintage Classic',
    price: 249000,
    description:
      'Áo thun vintage với thiết kế cổ điển, chất liệu cotton premium. Phù hợp cho phong cách casual và streetwear.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    sku: 'VC-Tee-002',
    stock: 28,
    colors: [
      { code: 'black', name: 'Đen' },
      { code: 'gray', name: 'Xám' },
      { code: 'navy', name: 'Xanh navy' },
      { code: 'maroon', name: 'Đỏ đô' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: [
      { label: 'Chất liệu', value: '100% Cotton Ring Spun' },
      { label: 'Định lượng vải', value: '180 GSM' },
      { label: 'Form', value: 'Oversized Vintage' },
      { label: 'Công nghệ in', value: 'Screen Printing' },
      { label: 'Bảo hành', value: '30 ngày' },
    ],
    care: [
      'Giặt lạnh, không pha trộn màu',
      'Không dùng thuốc tẩy',
      'Sấy khô ở nhiệt độ thấp',
      'Ủi ở nhiệt độ trung bình',
    ],
  },
  {
    id: 'demo-hoodie-001',
    name: 'Hoodie Premium Cotton',
    price: 399000,
    description:
      'Hoodie chất lượng cao với lớp lót mềm mịn, thiết kế hiện đại. Lý tưởng cho thời tiết mát mẻ.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop',
    sku: 'PH-Hoodie-001',
    stock: 15,
    colors: [
      { code: 'black', name: 'Đen' },
      { code: 'white', name: 'Trắng' },
      { code: 'gray', name: 'Xám' },
      { code: 'navy', name: 'Xanh navy' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      { label: 'Chất liệu', value: '80% Cotton, 20% Polyester' },
      { label: 'Định lượng vải', value: '280 GSM' },
      { label: 'Form', value: 'Regular Fit' },
      { label: 'Tính năng', value: 'Có túi kangaroo, dây kéo' },
      { label: 'Bảo hành', value: '30 ngày' },
    ],
    care: [
      'Giặt máy ở nhiệt độ 30°C',
      'Không tẩy trắng',
      'Sấy khô ở nhiệt độ thấp',
      'Ủi ở nhiệt độ thấp',
    ],
  },
];

export function getMockProductById(id) {
  return MOCK_PRODUCTS.find((p) => String(p.id) === String(id));
}

