import NewsletterForm from "@/components/newsletter/NewsletterForm";

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Subscribe to our newsletter
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Get the latest news and offers straight to your inbox.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
} 