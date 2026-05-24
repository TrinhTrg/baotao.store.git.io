const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/review.controller');
const { createReviewValidator, handleValidationErrors } = require('../validators/review.validator');

/**
 * @swagger
 * /api/v1/products/{slug}/reviews:
 *   post:
 *     summary: Add a review to a product
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - reviewerName
 *               - reviewerEmail
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *               reviewerName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               reviewerEmail:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Product not found
 *   get:
 *     summary: Get all reviews for a product
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: ["-date", "date", "-rating", "rating"]
 *           default: "-date"
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *       404:
 *         description: Product not found
 */
router.post(
    '/:slug/reviews',
    createReviewValidator,
    handleValidationErrors,
    reviewController.addProductReview
);

router.get(
    '/:slug/reviews',
    reviewController.getProductReviews
);

/**
 * @swagger
 * /api/v1/products/{slug}/reviews/{reviewIndex}:
 *   delete:
 *     summary: Delete a review from a product
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *       - in: path
 *         name: reviewIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review index in array
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid review index
 *   patch:
 *     summary: Update a review
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewIndex
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *               reviewerName:
 *                 type: string
 *               reviewerEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Product not found
 */
router.delete(
    '/:slug/reviews/:reviewIndex',
    reviewController.deleteProductReview
);

router.patch(
    '/:slug/reviews/:reviewIndex',
    reviewController.updateProductReview
);

module.exports = router;
