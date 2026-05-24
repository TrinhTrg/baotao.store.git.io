'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Added useRouter
import { AlertCircle, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/constants';

export default function ReviewForm({ productSlug, onReviewAdded }) {
    const router = useRouter(); // Initialize router
    const [formData, setFormData] = useState({
        rating: 5,
        comment: '',
        reviewerName: '',
        reviewerEmail: '',
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${API_URL}/products/${productSlug}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            console.log("Server Response:", data); // Check your browser console!

            if (res.ok && data.success) {
                setMessage({
                    type: 'success',
                    text: 'Review added successfully!',
                });
                setFormData({
                    rating: 5,
                    comment: '',
                    reviewerName: '',
                    reviewerEmail: '',
                });

                // Refresh the server component to show the new review
                router.refresh();

                if (onReviewAdded) {
                    onReviewAdded();
                }
                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            } else {
                console.error("Backend Error Details:", data);
               
                setMessage({
                    type: 'error',
                    text: data.message || 'Failed to add review. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setMessage({
                type: 'error',
                text: 'An error occurred. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Share Your Feedback
            </h3>

            {message.text && (
                <div
                    className={`mb-4 flex items-center gap-3 rounded-lg p-4 ${message.type === 'success'
                            ? 'bg-green-50 text-green-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                >
                    {message.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Rating *
                    </label>
                    <div className="mt-2 flex items-center gap-3">
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#ff5000] focus:outline-none"
                        >
                            {[5, 4, 3, 2, 1].map((num) => (
                                <option key={num} value={num}>
                                    {num} - {num === 5 ? 'Excellent' : num === 4 ? 'Good' : num === 3 ? 'Average' : num === 2 ? 'Poor' : 'Very Poor'}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < formData.rating ? 'text-2xl text-yellow-400' : 'text-2xl text-gray-300'
                                    }
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Your feedback
                    </label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        maxLength={1000}
                        placeholder="Share your experience with this product (optional)"
                        rows={4}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#ff5000] focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        {formData.comment.length}/1000 characters
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#ff5000] px-6 py-3 font-medium text-white transition-colors hover:bg-[#e64500] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}