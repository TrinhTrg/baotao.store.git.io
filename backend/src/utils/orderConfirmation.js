const crypto = require('crypto');
const { sendEmail } = require('./sendMail.js');

/**
 * Generate a secure confirmation token
 * @returns {string} Unique confirmation token
 */
const generateConfirmationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Create HTML content for shipment confirmation email
 * @param {Object} order - Order object
 * @param {string} confirmationUrl - URL for confirm received button
 * @returns {string} HTML email content
 */
const createShipmentEmailHTML = (order, confirmationUrl) => {
    const productsList = order.products
        .map(p => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.product_id}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${p.price.toFixed(2)}</td>
            </tr>
        `)
        .join('');

    const totalAmount = order.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #2c3e50;
                    color: white;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 30px 20px;
                }
                .section-title {
                    font-size: 18px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    border-bottom: 2px solid #e74c3c;
                    padding-bottom: 10px;
                }
                .info-row {
                    margin: 10px 0;
                    line-height: 1.6;
                }
                .info-label {
                    font-weight: bold;
                    color: #2c3e50;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                th {
                    background-color: #ecf0f1;
                    padding: 10px;
                    text-align: left;
                    font-weight: bold;
                    color: #2c3e50;
                    border-bottom: 2px solid #bdc3c7;
                }
                td {
                    padding: 10px;
                }
                .total-section {
                    background-color: #ecf0f1;
                    padding: 15px;
                    margin-top: 15px;
                    border-radius: 5px;
                    text-align: right;
                }
                .total-amount {
                    font-size: 20px;
                    font-weight: bold;
                    color: #e74c3c;
                }
                .confirm-button {
                    display: inline-block;
                    background-color: #27ae60;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    font-weight: bold;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                .confirm-button:hover {
                    background-color: #229954;
                }
                .footer {
                    background-color: #ecf0f1;
                    padding: 15px 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #7f8c8d;
                    border-top: 1px solid #bdc3c7;
                }
                .warning {
                    background-color: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 10px;
                    margin-top: 15px;
                    border-radius: 3px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚚 Your Order Has Been Shipped!</h1>
                </div>
                <div class="content">
                    <p>Hello <span class="info-label">${order.userInfo.fullName}</span>,</p>
                    
                    <p>Great news! Your order has been shipped and is on its way to you. Please find the details below:</p>

                    <div class="section-title">Order Information</div>
                    <div class="info-row">
                        <span class="info-label">Order ID:</span> ${order._id}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Order Date:</span> ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span> <strong style="color: #3498db;">Shipped</strong>
                    </div>

                    <div class="section-title">Shipping Address</div>
                    <div class="info-row">
                        <span class="info-label">Name:</span> ${order.userInfo.fullName}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Phone:</span> ${order.userInfo.phone}
                    </div>
                    <div class="info-row">
                        <span class="info-label">Address:</span> ${order.userInfo.address}
                    </div>
                    ${order.userInfo.note ? `<div class="info-row"><span class="info-label">Note:</span> ${order.userInfo.note}</div>` : ''}

                    <div class="section-title">Order Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productsList}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div>Total Amount</div>
                        <div class="total-amount">$${totalAmount.toFixed(2)}</div>
                    </div>

                    <div class="section-title">Confirm Delivery</div>
                    <p>Once you receive your order, please click the button below to confirm that you've received it. This helps us ensure everything arrived safely:</p>
                    
                    <center>
                        <a href="${confirmationUrl}" class="confirm-button">✓ Confirm Received</a>
                    </center>

                    <div class="warning">
                        <strong>⚠️ Important:</strong> This link will expire in 30 days. Please confirm receipt as soon as you receive your package.
                    </div>

                    <p style="margin-top: 20px; color: #7f8c8d;">
                        If you did not receive this email or have any questions, please contact our customer support team.
                    </p>
                </div>
                <div class="footer">
                    <p>&copy; 2025 Web Sản Phẩm Thương Mại. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply to this address.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

/**
 * Send shipment confirmation email to customer
 * @param {Object} order - Order object from database
 * @param {string} baseUrl - Base URL for confirmation link (e.g., http://localhost:3000)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const sendShipmentConfirmationEmail = async (order, baseUrl) => {
    try {
        if (!order.userInfo || !order.userInfo.fullName) {
            throw new Error('Invalid order or missing user information');
        }

        // Get customer email - try multiple sources
        let customerEmail = null;

        if (order.user_id && typeof order.user_id === 'object' && order.user_id.email) {
            customerEmail = order.user_id.email;
        } else if (order.userInfo && order.userInfo.email) {
            customerEmail = order.userInfo.email;
        }

        if (!customerEmail) {
            throw new Error('Could not find customer email address');
        }

        // Generate unique confirmation token
        const confirmationToken = generateConfirmationToken();

        // Create confirmation URL
        const confirmationUrl = `${baseUrl}/api/v1/checkout/order/${order._id}/confirm?token=${confirmationToken}`;

        // Create email HTML
        const htmlContent = createShipmentEmailHTML(order, confirmationUrl);

        // Send email
        const emailSent = await sendEmail(
            customerEmail,
            '🚚 Your Order Has Been Shipped! - Please Confirm Receipt',
            htmlContent
        );

        if (!emailSent) {
            throw new Error('Failed to send email');
        }

        return {
            success: true,
            confirmationToken
        };
    } catch (error) {
        console.error('❌ Error sending shipment confirmation email:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    generateConfirmationToken,
    createShipmentEmailHTML,
    sendShipmentConfirmationEmail
};
