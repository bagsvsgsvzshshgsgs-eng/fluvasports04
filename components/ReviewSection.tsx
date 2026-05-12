"use client";

import { useState } from "react";
import { useStore } from "./StoreContext";
import { useLanguage } from "./LanguageContext";

export default function ReviewSection({ productId }: { productId: string }) {
  const { reviews, addReview } = useStore();
  const { t, isRTL } = useLanguage();
  const productReviews = reviews.filter(r => r.productId === productId && r.status === "Approved");
  
  const [formData, setFormData] = useState({ author: "", rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    addReview({ ...formData, productId });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowForm(false);
      setFormData({ author: "", rating: 5, comment: "" });
      alert(t("review_success"));
    }, 1000);
  };

  const avgRating = productReviews.length > 0 
    ? (productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length).toFixed(1)
    : "0";

  return (
    <div className="py-24 border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-start">
          <div>
            <h2 className="text-3xl font-serif text-white mb-2">{t("review_title")}</h2>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="16" height="16" fill={i < Math.round(Number(avgRating)) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                ))}
              </div>
              <span className="text-white font-medium">{avgRating} / 5</span>
              <span className="text-gray-500 text-sm">({productReviews.length} {t("review_count")})</span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 text-white px-8 py-4 text-xs uppercase tracking-widest font-medium hover:bg-gray-800 shadow-md transition-all"
          >
            {showForm ? t("review_cancel_btn") : t("review_write_btn")}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-20 bg-black p-8 border border-gray-800 animate-fade-in">
            <h3 className="text-lg font-serif mb-6">{t("review_form_title")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t("review_name_label")}</label>
                <input 
                  required
                  type="text" 
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t("review_rating_label")}</label>
                <select 
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black"
                >
                  <option value={5}>{t("review_rating_5")}</option>
                  <option value={4}>{t("review_rating_4")}</option>
                  <option value={3}>{t("review_rating_3")}</option>
                  <option value={2}>{t("review_rating_2")}</option>
                  <option value={1}>{t("review_rating_1")}</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{t("review_comments_label")}</label>
              <textarea 
                required
                rows={4}
                value={formData.comment}
                onChange={e => setFormData({...formData, comment: e.target.value})}
                className="w-full border border-gray-800 px-4 py-3 text-sm focus:outline-none focus:border-orange-500 bg-black resize-none" 
              />
            </div>
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-orange-500 text-white py-4 text-xs uppercase tracking-widest font-medium hover:bg-gray-800 disabled:bg-gray-600 transition-colors"
            >
              {isSubmitting ? t("review_submitting_btn") : t("review_submit_btn")}
            </button>
          </form>
        )}

        <div className="space-y-12">
          {productReviews.length === 0 ? (
            <p className="text-gray-500 text-center italic font-light py-8">{t("review_empty")}</p>
          ) : (
            productReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-800 pb-12 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} width="14" height="14" fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                      ))}
                    </div>
                    <h4 className="font-medium text-white">{review.author}</h4>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-widest">{review.date}</span>
                </div>
                <p className="text-gray-400 font-light leading-relaxed italic">"{review.comment}"</p>
                {/* Admin Response Mock */}
                {review.id.includes('admin') && (
                  <div className={`mt-6 ${isRTL ? 'mr-8 pr-6 border-r-2' : 'ml-8 pl-6 border-l-2'} border-gray-800`}>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">{t("review_response_title")}</p>
                    <p className="text-sm text-gray-400 italic">"We are so happy you love the fit, {review.author}! Enjoy your summer."</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
