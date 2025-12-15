import React from "react";
import "./Order.css";

const Order = () => {
    
    const order = {
        id: 2,
        userId: 4,
        paymentTypeName: "Ví điện tử",
        paymentProvider: "Momo",
        paymentAccountNumber: "0989123456",
        paymentStatus: "Đã thanh toán",
        paymentDate: "2025-09-19T02:46:10.618813Z",
        shippingMethodName: "Giao nhanh",
        shippingPrice: 35000.0,
        orderStatus: "Đang giao",
        orderDate: "2025-09-21T02:46:10.618813Z",
    };

    return (
        <div className="order-container">
            <h1 className="order-title">🧾 Chi tiết đơn hàng #{order.id}</h1>

            {}
            <div className="order-section status">
                <h2>Trạng thái đơn hàng</h2>
                <p>
                    <strong>Trạng thái:</strong> <span className="highlight">{order.orderStatus}</span>
                </p>
                <p>
                    <strong>Ngày đặt hàng:</strong>{" "}
                    {new Date(order.orderDate).toLocaleString("vi-VN")}
                </p>
            </div>

            {}
            <div className="order-section payment">
                <h2>Thông tin thanh toán</h2>
                <p>
                    <strong>Hình thức:</strong> {order.paymentTypeName}
                </p>
                <p>
                    <strong>Nhà cung cấp:</strong> {order.paymentProvider}
                </p>
                <p>
                    <strong>Số tài khoản:</strong> {order.paymentAccountNumber}
                </p>
                <p>
                    <strong>Trạng thái thanh toán:</strong>{" "}
                    <span className="highlight">{order.paymentStatus}</span>
                </p>
                <p>
                    <strong>Ngày thanh toán:</strong>{" "}
                    {new Date(order.paymentDate).toLocaleString("vi-VN")}
                </p>
            </div>

            {}
            <div className="order-section shipping">
                <h2>Thông tin giao hàng</h2>
                <p>
                    <strong>Phương thức giao hàng:</strong> {order.shippingMethodName}
                </p>
                <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {order.shippingPrice.toLocaleString("vi-VN")} ₫
                </p>
            </div>
        </div>
    );
};

export default Order;
