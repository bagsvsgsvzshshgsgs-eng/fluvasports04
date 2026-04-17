export default function Newsletter() {
  return (
    <section className="py-24 bg-gray-900 border-t border-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Join The Club</h2>
        <p className="text-gray-400 font-light mb-8 max-w-xl mx-auto">
          Subscribe for early access to new collections, exclusive event invitations, and 10% off your first order.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-black border border-gray-700 px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-0 placeholder:text-gray-500"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-8 py-3.5 tracking-widest uppercase text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
