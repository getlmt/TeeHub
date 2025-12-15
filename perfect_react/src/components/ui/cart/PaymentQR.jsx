import React from "react";

const PaymentQR = ({ bankCode, accountNumber, amount, info }) => {
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}`;

    return (
        <div className="flex flex-col items-center p-6 bg-gradient-to-br from-background to-secondary rounded-2xl shadow-lg border border-border w-full">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
            </div>
            <h2 className="text-xl font-bold mb-4 text-foreground">Quét mã để thanh toán</h2>
            <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                <img src={qrUrl} alt="VietQR" className="w-64 h-64 rounded-lg" />
            </div>
            <div className="w-full space-y-2 bg-muted/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Ngân hàng:</span>
                    <span className="font-bold text-foreground">{bankCode}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Số tài khoản:</span>
                    <span className="font-bold text-foreground">{accountNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Số tiền:</span>
                    <span className="font-bold text-primary text-lg">{amount.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-border">
                    <span className="text-muted-foreground font-medium text-sm">Nội dung:</span>
                    <span className="font-medium text-foreground break-all">{info}</span>
                </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
                Vui lòng chuyển khoản chính xác nội dung để đơn hàng được xử lý nhanh nhất
            </p>
        </div>
    );
};

export default PaymentQR;