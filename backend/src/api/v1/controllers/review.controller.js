const Product = require("../../../models/product.model");
const ResponseFormatter = require("../../../utils/response");
const ApiError = require("../../../utils/apiError");

/**
 * @desc    Add a review to a product
 * @route   POST /api/v1/products/:slug/reviews
 * @access  Public
 */
const addProductReview = async (req, res, next) => {
    try {
        // 1. Destructure request data
        const { slug } = req.params;
        const { rating, comment, reviewerName, reviewerEmail } = req.body;

        // 2. Validate
        if (!rating || !reviewerName || !reviewerEmail) {
            throw new ApiError(400, "Please provide all required fields");
        }

        // 3. Find product
        const product = await Product.findOne({
            slug,
            deleted: false,
            status: "active",
        });

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Create review object
        const newReview = {
            rating: parseInt(rating),
            comment: comment || "",
            reviewerName,
            reviewerEmail,
            date: new Date(),
        };

        // Add review to product
        if (!product.reviews) {
            product.reviews = [];
        }
        product.reviews.push(newReview);

        // Update product rating (average of all reviews)
        let newRating = product.rating;
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
            newRating = parseFloat((totalRating / product.reviews.length).toFixed(1));
        }

        // Update product with reviews and rating using updateOne to bypass validation issues
        await Product.updateOne(
            { _id: product._id },
            { 
                reviews: product.reviews,
                rating: newRating
            }
        );

        return ResponseFormatter.success(
            res,
            {
                review: newReview,
                averageRating: newRating,
                totalReviews: product.reviews.length,
            },
            "Review added successfully",
            201
        );
    } catch (error) {
        console.error("❌ Add review error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to add review"));
    }
};

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/v1/products/:slug/reviews
 * @access  Public
 * @query   ?page=1&limit=10&sort=-date
 */
const getProductReviews = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const { page = 1, limit = 10, sort = "-date" } = req.query;

        // Find product
        const product = await Product.findOne({
            slug,
            deleted: false,
            status: "active",
        })
            .select("title slug reviews rating")
            .lean();

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Handle pagination
        const reviews = product.reviews || [];
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Sort reviews
        let sortedReviews = [...reviews];
        if (sort === "-date") {
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === "date") {
            sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sort === "-rating") {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (sort === "rating") {
            sortedReviews.sort((a, b) => a.rating - b.rating);
        }

        // Apply pagination
        const paginatedReviews = sortedReviews.slice(
            skip,
            skip + parseInt(limit)
        );

        // Pagination metadata
        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(reviews.length / parseInt(limit)),
            totalItems: reviews.length,
            limit: parseInt(limit),
        };

        // Calculate rating stats
        const ratingStats = {
            average: product.rating || 0,
            total: reviews.length,
            distribution: {
                5: reviews.filter((r) => r.rating === 5).length,
                4: reviews.filter((r) => r.rating === 4).length,
                3: reviews.filter((r) => r.rating === 3).length,
                2: reviews.filter((r) => r.rating === 2).length,
                1: reviews.filter((r) => r.rating === 1).length,
            },
        };

        return ResponseFormatter.paginated(
            res,
            {
                product: {
                    title: product.title,
                    slug: product.slug,
                },
                reviews: paginatedReviews,
                stats: ratingStats,
            },
            pagination,
            "Reviews retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get reviews error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to fetch reviews"));
    }
};

/**
 * @desc    Delete a review from a product
 * @route   DELETE /api/v1/products/:slug/reviews/:reviewIndex
 * @access  Public (in real app, should be admin/user who posted review)
 */
const deleteProductReview = async (req, res, next) => {
    try {
        const { slug, reviewIndex } = req.params;

        // Find product
        const product = await Product.findOne({
            slug,
            deleted: false,
            status: "active",
        });

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        const index = parseInt(reviewIndex);
        if (isNaN(index) || index < 0 || index >= (product.reviews?.length || 0)) {
            throw new ApiError(400, "Invalid review index");
        }

        // Remove review
        const removedReview = product.reviews.splice(index, 1)[0];

        // Update product rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
            product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
        } else {
            product.rating = 0;
        }

        // Save product
        await product.save();

        return ResponseFormatter.success(
            res,
            {
                removedReview,
                averageRating: product.rating,
                totalReviews: product.reviews.length,
            },
            "Review deleted successfully"
        );
    } catch (error) {
        console.error("❌ Delete review error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to delete review"));
    }
};

/**
 * @desc    Update a review
 * @route   PATCH /api/v1/products/:slug/reviews/:reviewIndex
 * @access  Public (in real app, should be user who posted review)
 */
const updateProductReview = async (req, res, next) => {
    try {
        const { slug, reviewIndex } = req.params;
        const { rating, comment, reviewerName, reviewerEmail } = req.body;

        // Find product
        const product = await Product.findOne({
            slug,
            deleted: false,
            status: "active",
        });

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        const index = parseInt(reviewIndex);
        if (isNaN(index) || index < 0 || index >= (product.reviews?.length || 0)) {
            throw new ApiError(400, "Invalid review index");
        }

        // Update review fields
        if (rating !== undefined) product.reviews[index].rating = parseInt(rating);
        if (comment !== undefined) product.reviews[index].comment = comment;
        if (reviewerName !== undefined) product.reviews[index].reviewerName = reviewerName;
        if (reviewerEmail !== undefined) product.reviews[index].reviewerEmail = reviewerEmail;

        // Update product rating
        if (product.reviews.length > 0) {
            const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
            product.rating = parseFloat((totalRating / product.reviews.length).toFixed(1));
        }

        // Save product
        await product.save();

        return ResponseFormatter.success(
            res,
            {
                review: product.reviews[index],
                averageRating: product.rating,
                totalReviews: product.reviews.length,
            },
            "Review updated successfully"
        );
    } catch (error) {
        console.error("❌ Update review error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to update review"));
    }
};

module.exports = {
    addProductReview,
    getProductReviews,
    deleteProductReview,
    updateProductReview,
};
