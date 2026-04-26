"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

export default function ContactPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="bg-black text-white min-h-screen">
        {/* Hero Section */}
        <section className="pt-20 pb-12 px-4 md:px-8 text-center bg-zinc-950 border-b border-gray-900">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6 uppercase tracking-widest">
            Contact Us
          </h1>
          <p className="text-gray-400 font-light max-w-2xl mx-auto text-lg">
            We'd love to hear from you. Whether you have a question about our collections, sizing, or an existing order, our team is ready to assist.
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Contact Form Section */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 border-b border-gray-800 pb-4">
                Send a Message
              </h2>
              
              <form className="space-y-6 flex-grow flex flex-col" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Jane Doe" 
                    className="w-full bg-zinc-900 border border-gray-800 rounded-none px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="jane@example.com" 
                    className="w-full bg-zinc-900 border border-gray-800 rounded-none px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  />
                </div>
                
                <div className="flex-grow">
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Your Message</label>
                  <textarea 
                    id="message" 
                    rows={6}
                    placeholder="How can we help you today?" 
                    className="w-full h-full min-h-[150px] bg-zinc-900 border border-gray-800 rounded-none px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all resize-none"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase tracking-widest text-sm py-4 transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Location & Contact Details Section */}
            <div>
              <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 border-b border-gray-800 pb-4">
                Visit Our Store
              </h2>
              
              <div className="mb-8 overflow-hidden border border-gray-800 group relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13813.567087531776!2d30.9329032!3d29.9825134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145856fcd7425175%3A0x6b77242a4208a50f!2sEl%20Bashayer%2C%20First%206th%20of%20October%2C%20Giza%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0, filter: "grayscale(100%) contrast(1.2) brightness(0.8)" }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="transition-all duration-500 group-hover:filter-none"
                ></iframe>
                {/* Subtle overlay to keep it dark until hovered */}
                <div className="absolute inset-0 bg-orange-900/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-full text-orange-500 shrink-0">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-1">Address</h3>
                    <p className="text-gray-400 font-light text-sm leading-relaxed">
                      El Bashayer<br />
                      First 6th of October<br />
                      Giza Governorate, Egypt
                    </p>
                    <a 
                      href="https://maps.google.com/?q=El+Bashayer,+First+6th+of+October,+Giza+Governorate" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-xs uppercase tracking-widest font-bold text-orange-500 hover:text-white transition-colors"
                    >
                      Get Directions
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-full text-orange-500 shrink-0">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-1">Email</h3>
                    <p className="text-gray-400 font-light text-sm">
                      <a href="mailto:hello@fluvasport.com" className="hover:text-orange-500 transition-colors">hello@fluvasport.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 rounded-full text-orange-500 shrink-0">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-1">Phone</h3>
                    <p className="text-gray-400 font-light text-sm">
                      <a href="tel:+15551234567" className="hover:text-orange-500 transition-colors">+1 (555) 123-4567</a><br />
                      <span className="text-xs text-gray-500">Mon-Fri, 9am - 6pm</span>
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
