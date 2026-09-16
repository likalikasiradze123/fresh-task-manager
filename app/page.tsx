import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* ჰედერი ლოგოთი და სათაურით */}
      <header className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/Logo.jpg" 
            alt="Lika's Workshop Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-800">Fresh Task Manager</h1>
            <p className="text-sm text-gray-500">Lika's Workshop & Tasks</p>
          </div>
        </div>
      </header>

      {/* ძირითადი კონტენტი */}
      <section className="max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">მიმდინარე დავალებები</h2>
        <p className="text-gray-600">მოგესალმებით! თქვენი CI/CD ავტომატიზაცია და ლოგო წარმატებით ინტეგრირებულია.</p>
      </section>
    </main>
  );
}