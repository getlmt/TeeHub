import React from "react";
import { Label } from "./label";


const AddressSelector = ({ selectedAddressId, onSelectAddress }) => {
  const addresses = [
    { id: 1, label: "Địa chỉ 1: 123 Đường A, Quận B" },
    { id: 2, label: "Địa chỉ 2: 456 Đường C, Quận D" },
  ];

  return (
    <div className="bg-white rounded-lg border shadow p-4">
      <Label className="block mb-3 font-semibold">Địa chỉ giao hàng</Label>
      <div className="space-y-2">
        {addresses.map((a) => (
          <label key={a.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="shipping-address"
              checked={selectedAddressId === a.id}
              onChange={() => onSelectAddress && onSelectAddress(a.id)}
            />
            <span>{a.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AddressSelector;


