const { body, validationResult } = require('express-validator');

/**
 * Validator cho việc tạo/cập nhật review sản phẩm
 */
const createReviewValidator = [
    body('rating')
        .trim()
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Comment must not exceed 1000 characters'),
    
    body('reviewerName')
        .trim()
        .notEmpty()
        .withMessage('Reviewer name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Reviewer name must be between 2 and 100 characters'),
    
    body('reviewerEmail')
        .trim()
        .notEmpty()
        .withMessage('Reviewer email is required')
        .isEmail()
        .withMessage('Invalid email format'),
];

/**
 * Middleware để kiểm tra validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

module.exports = {
    createReviewValidator,
    handleValidationErrors
};
