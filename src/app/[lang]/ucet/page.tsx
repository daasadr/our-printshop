import { getDictionary } from '@/lib/getDictionary';

interface AccountPageProps {
  params: {
    lang: string;
  };
}

export default async function AccountPage({ params: { lang } }: AccountPageProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Můj účet
              </h1>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Vítejte ve vašem účtu
                  </h2>
                  <p className="text-gray-600">
                    Zde můžete spravovat své objednávky, adresy a nastavení účtu.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Objednávky
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Zobrazte historii vašich objednávek
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Zobrazit objednávky
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Adresy
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Spravujte své dodací a fakturační adresy
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Spravovat adresy
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Oblíbené
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Zobrazte vaše oblíbené produkty
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Zobrazit oblíbené
                    </button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nastavení
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upravte své osobní údaje a heslo
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Upravit nastavení
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    Odhlásit se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 