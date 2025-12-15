import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const PaymentQR = ({ bankCode, accountNumber, amount, info }) => {
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

    return (
        <div className="flex flex-col items-center p-6 bg-white shadow-md rounded-2xl w-fit mx-auto">
            <h2 className="text-xl font-bold mb-2">Quét mã để thanh toán</h2>
            <img src={qrUrl} alt="VietQR" className="w-64 h-64 mb-4 rounded-lg" />
            <p><strong>Ngân hàng:</strong> {bankCode}</p>
            <p><strong>Số tài khoản:</strong> {accountNumber}</p>
            <p><strong>Số tiền:</strong> {amount.toLocaleString("vi-VN")} ₫</p>
            <p><strong>Nội dung:</strong> {info}</p>
        </div>
    );
};

const Order = () => {
    return (
        <PaymentQR
            bankCode="BIDV"
            accountNumber="4605016865"
            amount={1000}
            info="Thanh toan don hang "
        />
    );
};

export default Order;
