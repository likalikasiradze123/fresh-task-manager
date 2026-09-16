'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  priceText: string;
  category: string;
  image: string;
  description: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'ხელნაკეთი ყელსაბამი',
    price: 50,
    priceText: '50 ₾',
    category: 'სამკაულები',
    image: '/necklace1.jpg',
    description: 'ექსკლუზიური ხელნაკეთი ყელსაბამი Lika\'s Workshop-ისგან.',
  },
  {
    id: 2,
    title: 'ძველი ქალაქის პეიზაჟი',
    price: 70,
    priceText: '70 ₾',
    category: 'ნახატები',
    image: '/painting.jpg',
    description: 'ხელით შესრულებული ექსკლუზიური ფერწერული ტილო.',
  },
  {
    id: 3,
    title: 'ხელნაკეთი ყელსაბამი (დიზაინი 2)',
    price: 55,
    priceText: '55 ₾',
    category: 'სამკაულები',
    image: '/necklace2.jpg',
    description: 'უნიკალური დიზაინის ხელნაკეთი აქსესუარი.',
  },
  {
    id: 4,
    title: 'თაბაშირის დეკორატიული ნაკეთობა',
    price: 25,
    priceText: '25 ₾',
    category: 'თაბაშირი',
    image: '/plaster.jpg',
    description: 'ხელით ჩამოსხმული და დამუშავებული თაბაშირის ექსკლუზიური დეკორი.',
  },
];

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('სამკაულები');
  const [image, setImage] = useState('/necklace1.jpg');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('likas_workshop_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('likas_workshop_products', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const numericPrice = Number(price);
    const newProduct: Product = {
      id: Date.now(),
      title,
      price: numericPrice,
      priceText: `${numericPrice} ₾`,
      category,
      image: image || '/necklace1.jpg',
      description,
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('likas_workshop_products', JSON.stringify(updated));

    setTitle('');
    setPrice('');
    setDescription('');
    setImage('/necklace1.jpg');
    alert('პროდუქტი წარმატებით დაემატა!');
  };

  const handleDelete = (id: number) => {
    if (confirm('ნამდვილად გსურთ ამ პროდუქტის წაშლა?')) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem('likas_workshop_products', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#334135] font-sans pb-20">
      <div className="bg-[#3F4E3F] text-white px-6 py-5 flex justify-between items-center shadow-md">
        <h1 className="font-serif text-xl font-bold">ადმინისტრაციული პანელი</h1>
        <Link
          href="/"
          className="bg-[#C98B9B] hover:bg-[#B87D8B] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
        >
          საიტზე დაბრუნება →
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-[#E5DEC9] shadow-sm md:col-span-1 h-fit">
          <h2 className="font-serif text-lg font-bold text-[#3F4E3F] mb-4">ახალი ნივთის დამატება</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#627263] mb-1">დასახელება *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#627263] mb-1">ფასი (ლარი) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#627263] mb-1">კატეგორია</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
              >
                <option value="სამკაულები">სამკაულები</option>
                <option value="ნახატები">ნახატები</option>
                <option value="თაბაშირი">თაბაშირი</option>
                <option value="სხვა">სხვა</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#627263] mb-1">ფოტოს ატვირთვა</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-[#627263] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#3F4E3F] file:text-white hover:file:bg-[#2A342B] file:cursor-pointer cursor-pointer bg-[#F9F6F0] rounded-xl border border-[#E5DEC9] p-1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#627263] mb-1">აღწერა</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C98B9B] hover:bg-[#B87D8B] text-white font-semibold py-3 rounded-xl transition-all shadow-md text-xs cursor-pointer"
            >
              დამატება
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#E5DEC9] shadow-sm md:col-span-2">
          <h2 className="font-serif text-lg font-bold text-[#3F4E3F] mb-4">არსებული ნივთები ({products.length})</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {products.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl border border-[#E5DEC9] bg-[#F9F6F0]/50">
                <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl bg-white" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-sm text-[#2A342B] truncate">{item.title}</h4>
                  <p className="text-xs text-[#3F4E3F] font-semibold">{item.priceText} • <span className="text-[#627263]">{item.category}</span></p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  წაშლა
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}