import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutFlow from "./CheckoutFlow";

export const metadata = {
  title: "Checkout | Fluva Sport",
};

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-8 pb-24">
        <CheckoutFlow />
      </main>
      <Footer />
    </>
  );
}
