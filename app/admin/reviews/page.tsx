"use client";

import { useStore } from "@/components/StoreContext";
import Image from "next/image";

export default function AdminReviews() {
  const { reviews, updateReviewStatus, deleteReview, products } = useStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-serif text-white mb-1">Customer Reviews</h1>
        <p className="text-gray-400 text-sm">Moderate and respond to community feedback.</p>
      </header>

      <div className="bg-black border border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <div className="flex gap-4 text-sm font-medium">
               <button className="text-white border-b-2 border-orange-500 pb-1">All Reviews</button>
               <button className="text-gray-500 hover:text-gray-400 transition-colors">Pending</button>
               <button className="text-gray-500 hover:text-gray-400 transition-colors">Published</button>
            </div>
            <p className="text-gray-400 text-sm">{reviews.length} total reviews</p>
        </div>
        
        <div className="divide-y divide-gray-800">
          {reviews.length === 0 ? (
            <div className="p-20 text-center text-gray-500 font-light italic">
              No reviews have been submitted yet.
            </div>
          ) : (
            reviews.map((review) => {
              const product = products.find(p => p.id === review.productId);
              return (
                <div key={review.id} className="p-8 hover:bg-black/50 transition-colors">
                  <div className="flex gap-8">
                    {/* Product Context */}
                    <div className="w-24 shrink-0">
                      <div className="relative aspect-[3/4] w-full bg-gray-900 mb-3 grayscale opacity-60">
                        {product && <Image src={product.image} alt={product.name} fill className="object-cover" />}
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold truncate">{product?.name || "Unknown Product"}</p>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-white">{review.author}</h4>
                            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold rounded-full ${getStatusColor(review.status)}`}>
                              {review.status}
                            </span>
                          </div>
                          <div className="flex text-amber-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} width="12" height="12" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          {review.status !== "Approved" && (
                            <button 
                              onClick={() => updateReviewStatus(review.id, "Approved")}
                              className="bg-orange-500 text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gray-800 transition-all shadow-sm"
                            >
                              Approve
                            </button>
                          )}
                          {review.status !== "Rejected" && (
                            <button 
                              onClick={() => updateReviewStatus(review.id, "Rejected")}
                              className="bg-black border border-gray-800 text-gray-400 px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-black transition-all"
                            >
                              Reject
                            </button>
                          )}
                          <button 
                            onClick={() => { if(confirm("Delete forever?")) deleteReview(review.id) }}
                            className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                          >
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="bg-black/50 p-4 border border-gray-800 italic text-gray-400 text-sm leading-relaxed">
                        "{review.comment}"
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
