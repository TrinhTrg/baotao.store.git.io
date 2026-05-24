const Account = require('../../models/account.model');
const Product = require('../../models/product.model');
const User = require('../../models/user.model.js');
const ProductCategory = require('../../models/product-category.model');
const Order = require('../../models/order.model');

// [GET] admin/dashboard
module.exports.dashboard = async (req, res) => {
    try {
        // --- 1. Thống kê cơ bản ---
        const statisticBase = {
            products: {
                total: await Product.countDocuments({ deleted: false }),
                active: await Product.countDocuments({ deleted: false, status: 'active' }),
                inactive: await Product.countDocuments({ deleted: false, status: 'inactive' }),
                outOfStock: await Product.countDocuments({ deleted: false, stock: 0 }),
            },
            users: {
                total: await User.countDocuments({ deleted: false }),
                active: await User.countDocuments({ deleted: false, status: 'active' }),
            },
            categories: {
                total: await ProductCategory.countDocuments({ deleted: false }),
                active: await ProductCategory.countDocuments({ deleted: false, status: 'active' }),
            },
            accounts: {
                total: await Account.countDocuments({ deleted: false }),
                active: await Account.countDocuments({ deleted: false, status: 'active' }),
            }
        };

        // --- 2. Thống kê doanh thu (Ước tính giá trị kho) ---
        const products = await Product.find({ deleted: false }).select('price discountPercentage stock');
        let totalRevenue = 0; // Giá trị thực tế (sau giảm giá)
        let totalValue = 0;   // Giá trị gốc

        products.forEach(item => {
            const price = item.price || 0;
            const discount = item.discountPercentage || 0;
            const stock = item.stock || 0;
            
            totalValue += price * stock;
            totalRevenue += (price * (100 - discount) / 100) * stock;
        });

        // --- 3. Dữ liệu biểu đồ & Danh sách ---
        
        // Top 5 sản phẩm mới
        const latestProducts = await Product.find({ deleted: false, status: 'active' })
            .sort({ createdAt: -1 }).limit(5).select('title price thumbnail createdAt stock slug');

        // Sản phẩm sắp hết hàng (< 10)
        const lowStockProducts = await Product.find({ 
            deleted: false, status: 'active', stock: { $gt: 0, $lte: 10 } 
        }).sort({ stock: 1 }).limit(5).select('title stock thumbnail price');

        // Thống kê danh mục cho biểu đồ
        const categoryStatsRaw = await Product.aggregate([
            { $match: { deleted: false } },
            { $group: { _id: '$product_category_id', count: { $sum: 1 } } }
        ]);

        // Map tên danh mục vào thống kê
        const categories = await ProductCategory.find({ deleted: false }).select('title _id');
        const categoryStats = categoryStatsRaw.map(stat => {
            const cat = categories.find(c => c._id.toString() == stat._id?.toString());
            return {
                name: cat ? cat.title : 'Chưa phân loại',
                count: stat.count
            };
        });

        // Người dùng mới trong tuần
        const sevenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 7));
        const newUsers = await User.countDocuments({ deleted: false, createdAt: { $gte: sevenDaysAgo } });
        const newProducts = await Product.countDocuments({ deleted: false, createdAt: { $gte: sevenDaysAgo } });

        // --- 4. Thống kê doanh thu từ đơn hàng ---
        let totalOrderRevenue = 0;
        let totalOrders = 0;
        let completedOrders = 0;
        let pendingOrders = 0;
        let cancelledOrders = 0;
        let monthlyRevenue = 0;
        let recentOrders = [];
        
        const revenueByStatus = {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0
        };

        try {
          const orders = await Order.find({ deleted: false });
          
          orders.forEach(order => {
            totalOrders += 1;
            
            // Calculate order total
            let orderTotal = 0;
            if (order.products && order.products.length > 0) {
              order.products.forEach(product => {
                const price = product.price || 0;
                const discount = product.discountPercentage || 0;
                const quantity = product.quantity || 0;
                const finalPrice = price * (100 - discount) / 100;
                orderTotal += finalPrice * quantity;
              });
            }

            // Update status counters
            if (order.status === 'delivered') {
              completedOrders += 1;
              totalOrderRevenue += orderTotal;
            } else if (order.status === 'cancelled') {
              cancelledOrders += 1;
            } else if (order.status === 'pending') {
              pendingOrders += 1;
            }

            revenueByStatus[order.status] = (revenueByStatus[order.status] || 0) + orderTotal;
          });

          // Monthly revenue (current month)
          const currentDate = new Date();
          const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          
          const monthlyOrders = await Order.find({
            deleted: false,
            createdAt: { $gte: monthStart, $lte: monthEnd }
          });

          monthlyOrders.forEach(order => {
            if (order.products && order.products.length > 0) {
              order.products.forEach(product => {
                const price = product.price || 0;
                const discount = product.discountPercentage || 0;
                const quantity = product.quantity || 0;
                const finalPrice = price * (100 - discount) / 100;
                monthlyRevenue += finalPrice * quantity;
              });
            }
          });

          // Recent orders
          recentOrders = await Order.find({ deleted: false })
            .populate('user_id', 'fullName email') // Populate vào user_id
            .sort({ createdAt: -1 })
            .limit(8)
            // SỬA DÒNG NÀY: Chọn user_id thay vì userInfo, hoặc bỏ hẳn .select() để lấy hết
            .select('status createdAt user_id products method totalAmount');
        } catch (orderError) {
          console.log('Order statistics error:', orderError.message);
          // Continue with default values if order stats fail
        }

        const statistics = {
            ...statisticBase,
            revenue: {
                total: totalRevenue.toFixed(0),
                original: totalValue.toFixed(0),
                fromOrders: totalOrderRevenue.toFixed(2),
                monthly: monthlyRevenue.toFixed(2)
            },
            orders: {
                total: totalOrders,
                completed: completedOrders,
                pending: pendingOrders,
                cancelled: cancelledOrders,
                byStatus: revenueByStatus
            },
            latestProducts,
            lowStockProducts,
            categoryStats,
            recentOrders: recentOrders || [],
            newThisWeek: { users: newUsers, products: newProducts }
        };

        res.render("admin/pages/dashboard/index.pug", {
            pageTitle: "Tổng quan hệ thống",
            statistics
        });

    } catch (error) {
        console.log(error);
        res.redirect('/admin/auth/login');
    }
}