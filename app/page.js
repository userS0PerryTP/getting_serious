export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to My E-Commerce</h1>
        <p className="text-lg mb-8">
          Discover amazing products, sign up to start shopping, or log in to manage your account.
        </p>

        <div className="flex gap-4 justify-center">
          <a
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
          >
            Login
          </a>
        </div>
      </div>
    </main>
  );
}
