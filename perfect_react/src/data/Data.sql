-- Bảng KhachHang
CREATE TABLE KhachHang (
    MaKH VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(50),
    Email VARCHAR(100),
    DienThoai VARCHAR(15),
    DiaChi VARCHAR(100),
    NgayDangKy DATE,
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    TongChiTieu DECIMAL(12, 2),
    NgaySinh DATE
);

-- Bảng DonHang
CREATE TABLE DonHang (
    MaDH VARCHAR(10) PRIMARY KEY,
    MaKH VARCHAR(10),
    NgayDat DATE,
    TongTien DECIMAL(12, 2),
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    NgayGiao DATE,
    PhuongThucTT VARCHAR(20),
    MaNV VARCHAR(10),
    TongSP INT,
    FOREIGN KEY (MaKH) REFERENCES KhachHang(MaKH),
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
);

-- Bảng ChiTietDonHang
CREATE TABLE ChiTietDonHang (
    MaDH VARCHAR(10),
    MaSP VARCHAR(10),
    SoLuong INT,
    DonGia DECIMAL(12, 2),
    ThanhTien DECIMAL(12, 2),
    GhiChu VARCHAR(100),
    TrangThai VARCHAR(20),
    NgayCapNhat DATE,
    MaNCC VARCHAR(10),
    MaKho VARCHAR(10),
    PRIMARY KEY (MaDH, MaSP),
    FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH),
    FOREIGN KEY (MaSP) REFERENCES SanPham(MaSP),
    FOREIGN KEY (MaNCC) REFERENCES NhaCungCap(MaNCC),
    FOREIGN KEY (MaKho) REFERENCES Kho(MaKho)
);

-- Bảng SanPham
CREATE TABLE SanPham (
    MaSP VARCHAR(10) PRIMARY KEY,
    TenSP VARCHAR(50),
    DonGia DECIMAL(12, 2),
    SoLuongTon INT,
    MaNCC VARCHAR(10),
    MaKho VARCHAR(10),
    NgayNhap DATE,
    GhiChu VARCHAR(100),
    Size VARCHAR(10),
    MauSac VARCHAR(20),
    FOREIGN KEY (MaNCC) REFERENCES NhaCungCap(MaNCC),
    FOREIGN KEY (MaKho) REFERENCES Kho(MaKho)
);

-- Bảng Kho
CREATE TABLE Kho (
    MaKho VARCHAR(10) PRIMARY KEY,
    TenKho VARCHAR(50),
    DiaChi VARCHAR(100),
    SoLuongTon INT,
    NguoiQuanLy VARCHAR(50),
    NgayKiemKe DATE,
    GhiChu VARCHAR(100),
    DienTich INT,
    TrangThai VARCHAR(20)
);

-- Bảng NhaCungCap
CREATE TABLE NhaCungCap (
    MaNCC VARCHAR(10) PRIMARY KEY,
    TenNCC VARCHAR(50),
    DiaChi VARCHAR(100),
    DienThoai VARCHAR(15),
    Email VARCHAR(100),
    NgayHopTac DATE,
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    TongDonHang INT,
    HanNo DECIMAL(12, 2)
);

-- Bảng NhanVien
CREATE TABLE NhanVien (
    MaNV VARCHAR(10) PRIMARY KEY,
    HoTen VARCHAR(50),
    ChucVu VARCHAR(50),
    PhongBan VARCHAR(50),
    Luong DECIMAL(12, 2),
    NgayVaoLam DATE,
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    SoGioLam INT,
    DiaChi VARCHAR(100)
);

-- Bảng ThanhToan
CREATE TABLE ThanhToan (
    MaTT VARCHAR(10) PRIMARY KEY,
    MaDH VARCHAR(10),
    PhuongThuc VARCHAR(20),
    SoTien DECIMAL(12, 2),
    NgayTT DATE,
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    MaNV VARCHAR(10),
    HanTra DATE,
    PhiDV DECIMAL(12, 2),
    FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH),
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
);

-- Bảng DanhMucSP
CREATE TABLE DanhMucSP (
    MaDMSP VARCHAR(10) PRIMARY KEY,
    TenDMSP VARCHAR(50),
    MoTa VARCHAR(200),
    SoLuongSP INT,
    NgayTao DATE,
    TrangThai VARCHAR(20),
    GhiChu VARCHAR(100),
    MaNV VARCHAR(10),
    ThuTu INT,
    HinhAnh VARCHAR(100),
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
);

-- Bảng GiaoHang
CREATE TABLE GiaoHang (
    MaGH VARCHAR(10) PRIMARY KEY,
    MaDH VARCHAR(10),
    NgayGiao DATE,
    DiaChiGiao VARCHAR(100),
    TrangThai VARCHAR(20),
    PhiGH DECIMAL(12, 2),
    MaNV VARCHAR(10),
    GhiChu VARCHAR(100),
    ThoiGianGiao VARCHAR(10),
    NguoiNhan VARCHAR(50),
    FOREIGN KEY (MaDH) REFERENCES DonHang(MaDH),
    FOREIGN KEY (MaNV) REFERENCES NhanVien(MaNV)
);

-- Chèn dữ liệu vào KhachHang
INSERT INTO KhachHang (MaKH, HoTen, Email, DienThoai, DiaChi, NgayDangKy, TrangThai, GhiChu, TongChiTieu, NgaySinh) VALUES
('KH001', 'Nguyen Van A', 'nva@example.com', '0912345678', 'Ha Noi', '2023-01-15', 'HoatDong', 'Khach VIP', 5000000, '1990-05-10'),
('KH002', 'Tran Thi B', 'ttb@example.com', '0987654321', 'Da Nang', '2023-02-20', 'TamKhoa', 'Moi', 2000000, '1992-07-15'),
('KH003', 'Le Van C', 'lvc@example.com', '0901234567', 'Ho Chi Minh', '2023-03-10', 'HoatDong', 'Khach Thuong', 3000000, '1988-11-20'),
('KH004', 'Pham Thi D', 'ptd@example.com', '0934567890', 'Can Tho', '2023-04-05', 'TamKhoa', '', 1500000, '1995-03-25'),
('KH005', 'Hoang Van E', 'hve@example.com', '0945678901', 'Hai Phong', '2023-05-12', 'HoatDong', '', 4000000, '1991-09-30'),
('KH006', 'Ngo Thi F', 'ntf@example.com', '0956789012', 'Da Lat', '2023-06-18', 'TamKhoa', '', 1000000, '1987-12-05'),
('KH007', 'Duong Van G', 'dvg@example.com', '0967890123', 'Nha Trang', '2023-07-22', 'HoatDong', 'Khach Moi', 2500000, '1993-04-10'),
('KH008', 'Bui Thi H', 'bth@example.com', '0978901234', 'Hue', '2023-08-15', 'TamKhoa', '', 1800000, '1989-06-15'),
('KH009', 'Vo Van I', 'vvi@example.com', '0989012345', 'Vinh', '2023-09-10', 'HoatDong', 'Khach VIP', 6000000, '1994-08-20'),
('KH010', 'Dao Thi J', 'dtj@example.com', '0990123456', 'Quy Nhon', '2023-10-01', 'TamKhoa', '', 1200000, '1990-10-25');

-- Chèn dữ liệu vào DonHang
INSERT INTO DonHang (MaDH, MaKH, NgayDat, TongTien, TrangThai, GhiChu, NgayGiao, PhuongThucTT, MaNV, TongSP) VALUES
('DH001', 'KH001', '2023-01-20', 2000000, 'DaGiao', '', '2023-01-25', 'COD', 'NV001', 3),
('DH002', 'KH002', '2023-02-25', 1500000, 'DangGiao', '', '2023-03-01', 'ChuyenKhoan', 'NV002', 2),
('DH003', 'KH003', '2023-03-15', 3000000, 'DaHuy', 'Khach Huy', '2023-03-20', 'COD', 'NV003', 4),
('DH004', 'KH004', '2023-04-10', 1000000, 'DangGiao', '', '2023-04-15', 'ChuyenKhoan', 'NV004', 1),
('DH005', 'KH005', '2023-05-15', 2500000, 'DaGiao', '', '2023-05-20', 'COD', 'NV005', 3),
('DH006', 'KH006', '2023-06-20', 800000, 'DangGiao', '', '2023-06-25', 'ChuyenKhoan', 'NV006', 2),
('DH007', 'KH007', '2023-07-25', 1800000, 'DaGiao', '', '2023-07-30', 'COD', 'NV007', 2),
('DH008', 'KH008', '2023-08-10', 1200000, 'DaHuy', 'Loi SanPham', '2023-08-15', 'ChuyenKhoan', 'NV008', 1),
('DH009', 'KH009', '2023-09-15', 4000000, 'DangGiao', '', '2023-09-20', 'COD', 'NV009', 5),
('DH010', 'KH010', '2023-10-01', 900000, 'DaGiao', '', '2023-10-05', 'ChuyenKhoan', 'NV010', 1);

-- Chèn dữ liệu vào ChiTietDonHang
INSERT INTO ChiTietDonHang (MaDH, MaSP, SoLuong, DonGia, ThanhTien, GhiChu, TrangThai, NgayCapNhat, MaNCC, MaKho) VALUES
('DH001', 'SP001', 2, 1000000, 2000000, '', 'HoanTat', '2023-01-25', 'NCC01', 'KHO01'),
('DH002', 'SP002', 1, 1500000, 1500000, '', 'DangXuLy', '2023-02-25', 'NCC02', 'KHO02'),
('DH003', 'SP003', 3, 1000000, 3000000, '', 'DaHuy', '2023-03-15', 'NCC03', 'KHO03'),
('DH004', 'SP004', 1, 1000000, 1000000, '', 'DangXuLy', '2023-04-10', 'NCC04', 'KHO04'),
('DH005', 'SP005', 2, 1250000, 2500000, '', 'HoanTat', '2023-05-15', 'NCC05', 'KHO05'),
('DH006', 'SP006', 1, 800000, 800000, '', 'DangXuLy', '2023-06-20', 'NCC06', 'KHO06'),
('DH007', 'SP007', 2, 900000, 1800000, '', 'HoanTat', '2023-07-25', 'NCC07', 'KHO07'),
('DH008', 'SP008', 1, 1200000, 1200000, 'Loi SP', 'DaHuy', '2023-08-10', 'NCC08', 'KHO08'),
('DH009', 'SP009', 4, 1000000, 4000000, '', 'DangXuLy', '2023-09-15', 'NCC09', 'KHO09'),
('DH010', 'SP010', 1, 900000, 900000, '', 'HoanTat', '2023-10-01', 'NCC10', 'KHO10');

-- Chèn dữ liệu vào SanPham
INSERT INTO SanPham (MaSP, TenSP, DonGia, SoLuongTon, MaNCC, MaKho, NgayNhap, GhiChu, Size, MauSac) VALUES
('SP001', 'Ao Thun', 1000000, 50, 'NCC01', 'KHO01', '2023-01-01', '', 'M', 'Do'),
('SP002', 'Quan Jean', 1500000, 30, 'NCC02', 'KHO02', '2023-02-01', '', 'L', 'Xanh'),
('SP003', 'Ao SoMi', 1000000, 40, 'NCC03', 'KHO03', '2023-03-01', '', 'XL', 'Den'),
('SP004', 'Giay', 1000000, 20, 'NCC04', 'KHO04', '2023-04-01', '', '40', 'Nau'),
('SP005', 'MuSac', 1250000, 25, 'NCC05', 'KHO05', '2023-05-01', '', '38', 'Xam'),
('SP006', 'Non', 800000, 15, 'NCC06', 'KHO06', '2023-06-01', '', 'Free', 'Vang'),
('SP007', 'Balo', 900000, 35, 'NCC07', 'KHO07', '2023-07-01', '', 'M', 'XanhLa'),
('SP008', 'DongHo', 1200000, 10, 'NCC08', 'KHO08', '2023-08-01', 'Loi SP', 'Free', 'Bac'),
('SP009', 'Tui Xach', 1000000, 45, 'NCC09', 'KHO09', '2023-09-01', '', 'L', 'Do'),
('SP010', 'KinhMat', 900000, 20, 'NCC10', 'KHO10', '2023-10-01', '', 'Free', 'Den');

-- Chèn dữ liệu vào Kho
INSERT INTO Kho (MaKho, TenKho, DiaChi, SoLuongTon, NguoiQuanLy, NgayKiemKe, GhiChu, DienTich, TrangThai) VALUES
('KHO01', 'Kho HN', 'Ha Noi', 100, 'Nguoi1', '2023-01-10', '', 500, 'HoatDong'),
('KHO02', 'Kho DN', 'Da Nang', 80, 'Nguoi2', '2023-02-10', '', 400, 'TamKhoa'),
('KHO03', 'Kho HCM', 'Ho Chi Minh', 120, 'Nguoi3', '2023-03-10', '', 600, 'HoatDong'),
('KHO04', 'Kho CT', 'Can Tho', 50, 'Nguoi4', '2023-04-10', '', 300, 'TamKhoa'),
('KHO05', 'Kho HP', 'Hai Phong', 90, 'Nguoi5', '2023-05-10', '', 450, 'HoatDong'),
('KHO06', 'Kho DL', 'Da Lat', 70, 'Nguoi6', '2023-06-10', '', 350, 'TamKhoa'),
('KHO07', 'Kho NT', 'Nha Trang', 110, 'Nguoi7', '2023-07-10', '', 550, 'HoatDong'),
('KHO08', 'Kho Hue', 'Hue', 60, 'Nguoi8', '2023-08-10', '', 320, 'TamKhoa'),
('KHO09', 'Kho Vinh', 'Vinh', 130, 'Nguoi9', '2023-09-10', '', 700, 'HoatDong'),
('KHO10', 'Kho QN', 'Quy Nhon', 40, 'Nguoi10', '2023-10-10', '', 250, 'TamKhoa');

-- Chèn dữ liệu vào NhaCungCap
INSERT INTO NhaCungCap (MaNCC, TenNCC, DiaChi, DienThoai, Email, NgayHopTac, TrangThai, GhiChu, TongDonHang, HanNo) VALUES
('NCC01', 'NCC A', 'Ha Noi', '0912345678', 'ncca@example.com', '2022-12-01', 'HoatDong', '', 50, 0),
('NCC02', 'NCC B', 'Da Nang', '0987654321', 'nccb@example.com', '2023-01-01', 'TamKhoa', '', 30, 500000),
('NCC03', 'NCC C', 'Ho Chi Minh', '0901234567', 'nccc@example.com', '2023-02-01', 'HoatDong', '', 40, 0),
('NCC04', 'NCC D', 'Can Tho', '0934567890', 'nccd@example.com', '2023-03-01', 'TamKhoa', '', 20, 200000),
('NCC05', 'NCC E', 'Hai Phong', '0945678901', 'ncce@example.com', '2023-04-01', 'HoatDong', '', 35, 0),
('NCC06', 'NCC F', 'Da Lat', '0956789012', 'nccf@example.com', '2023-05-01', 'TamKhoa', '', 15, 300000),
('NCC07', 'NCC G', 'Nha Trang', '0967890123', 'nccg@example.com', '2023-06-01', 'HoatDong', '', 25, 0),
('NCC08', 'NCC H', 'Hue', '0978901234', 'ncch@example.com', '2023-07-01', 'TamKhoa', '', 10, 400000),
('NCC09', 'NCC I', 'Vinh', '0989012345', 'ncci@example.com', '2023-08-01', 'HoatDong', '', 45, 0),
('NCC10', 'NCC J', 'Quy Nhon', '0990123456', 'nccj@example.com', '2023-09-01', 'TamKhoa', '', 20, 100000);

-- Chèn dữ liệu vào NhanVien
INSERT INTO NhanVien (MaNV, HoTen, ChucVu, PhongBan, Luong, NgayVaoLam, TrangThai, GhiChu, SoGioLam, DiaChi) VALUES
('NV001', 'Nguyen A', 'QuanLy', 'BanHang', 15000000, '2022-01-01', 'HoatDong', '', 160, 'Ha Noi'),
('NV002', 'Tran B', 'NhanVien', 'Kho', 8000000, '2022-02-01', 'TamKhoa', '', 140, 'Da Nang'),
('NV003', 'Le C', 'KeToan', 'TaiChinh', 12000000, '2022-03-01', 'HoatDong', '', 150, 'Ho Chi Minh'),
('NV004', 'Pham D', 'NhanVien', 'VanPhong', 7000000, '2022-04-01', 'TamKhoa', '', 130, 'Can Tho'),
('NV005', 'Hoang E', 'QuanLy', 'Kho', 14000000, '2022-05-01', 'HoatDong', '', 160, 'Hai Phong'),
('NV006', 'Ngo F', 'NhanVien', 'BanHang', 9000000, '2022-06-01', 'TamKhoa', '', 140, 'Da Lat'),
('NV007', 'Duong G', 'KeToan', 'TaiChinh', 11000000, '2022-07-01', 'HoatDong', '', 150, 'Nha Trang'),
('NV008', 'Bui H', 'NhanVien', 'VanPhong', 7500000, '2022-08-01', 'TamKhoa', '', 130, 'Hue'),
('NV009', 'Vo I', 'QuanLy', 'BanHang', 13000000, '2022-09-01', 'HoatDong', '', 160, 'Vinh'),
('NV010', 'Dao J', 'NhanVien', 'Kho', 8500000, '2022-10-01', 'TamKhoa', '', 140, 'Quy Nhon');

-- Chèn dữ liệu vào ThanhToan
INSERT INTO ThanhToan (MaTT, MaDH, PhuongThuc, SoTien, NgayTT, TrangThai, GhiChu, MaNV, HanTra, PhiDV) VALUES
('TT001', 'DH001', 'COD', 2000000, '2023-01-25', 'HoanTat', '', 'NV001', '2023-02-25', 0),
('TT002', 'DH002', 'ChuyenKhoan', 1500000, '2023-02-25', 'DangXuLy', '', 'NV002', '2023-03-25', 50000),
('TT003', 'DH003', 'COD', 3000000, '2023-03-15', 'DaHuy', 'Khach Huy', 'NV003', '2023-04-15', 0),
('TT004', 'DH004', 'ChuyenKhoan', 1000000, '2023-04-10', 'DangXuLy', '', 'NV004', '2023-05-10', 30000),
('TT005', 'DH005', 'COD', 2500000, '2023-05-15', 'HoanTat', '', 'NV005', '2023-06-15', 0),
('TT006', 'DH006', 'ChuyenKhoan', 800000, '2023-06-20', 'DangXuLy', '', 'NV006', '2023-07-20', 20000),
('TT007', 'DH007', 'COD', 1800000, '2023-07-25', 'HoanTat', '', 'NV007', '2023-08-25', 0),
('TT008', 'DH008', 'ChuyenKhoan', 1200000, '2023-08-10', 'DaHuy', 'Loi SP', 'NV008', '2023-09-10', 40000),
('TT009', 'DH009', 'COD', 4000000, '2023-09-15', 'DangXuLy', '', 'NV009', '2023-10-15', 0),
('TT010', 'DH010', 'ChuyenKhoan', 900000, '2023-10-01', 'HoanTat', '', 'NV010', '2023-11-01', 10000);

-- Chèn dữ liệu vào DanhMucSP
INSERT INTO DanhMucSP (MaDMSP, TenDMSP, MoTa, SoLuongSP, NgayTao, TrangThai, GhiChu, MaNV, ThuTu, HinhAnh) VALUES
('DM001', 'QuanAo', 'Cac loai quan ao', 50, '2023-01-01', 'HoatDong', '', 'NV001', 1, 'img1.jpg'),
('DM002', 'GiaDung', 'Do gia dung', 30, '2023-02-01', 'TamKhoa', '', 'NV002', 2, 'img2.jpg'),
('DM003', 'PhuKien', 'Phu kien thoi trang', 40, '2023-03-01', 'HoatDong', '', 'NV003', 3, 'img3.jpg'),
('DM004', 'DienTu', 'San pham dien tu', 20, '2023-04-01', 'TamKhoa', '', 'NV004', 4, 'img4.jpg'),
('DM005', 'MyPham', 'San pham my pham', 25, '2023-05-01', 'HoatDong', '', 'NV005', 5, 'img5.jpg'),
('DM006', 'TheThao', 'Do the thao', 15, '2023-06-01', 'TamKhoa', '', 'NV006', 6, 'img6.jpg'),
('DM007', 'Sach', 'Cac loai sach', 35, '2023-07-01', 'HoatDong', '', 'NV007', 7, 'img7.jpg'),
('DM008', 'DoCho', 'Do cho cho', 10, '2023-08-01', 'TamKhoa', '', 'NV008', 8, 'img8.jpg'),
('DM009', 'DoTreEm', 'Do tre em', 45, '2023-09-01', 'HoatDong', '', 'NV009', 9, 'img9.jpg'),
('DM010', 'DoGiaDinh', 'Do gia dinh', 20, '2023-10-01', 'TamKhoa', '', 'NV010', 10, 'img10.jpg');

-- Chèn dữ liệu vào GiaoHang
INSERT INTO GiaoHang (MaGH, MaDH, NgayGiao, DiaChiGiao, TrangThai, PhiGH, MaNV, GhiChu, ThoiGianGiao, NguoiNhan) VALUES
('GH001', 'DH001', '2023-01-25', 'Ha Noi', 'HoanTat', 50000, 'NV001', '', '2h', 'Nguoi1'),
('GH002', 'DH002', '2023-03-01', 'Da Nang', 'DangGiao', 40000, 'NV002', '', '3h', 'Nguoi2'),
('GH003', 'DH003', '2023-03-20', 'Ho Chi Minh', 'DaHuy', 60000, 'NV003', 'Khach Huy', '2h', 'Nguoi3'),
('GH004', 'DH004', '2023-04-15', 'Can Tho', 'DangGiao', 30000, 'NV004', '', '4h', 'Nguoi4'),
('GH005', 'DH005', '2023-05-20', 'Hai Phong', 'HoanTat', 45000, 'NV005', '', '2h', 'Nguoi5'),
('GH006', 'DH006', '2023-06-25', 'Da Lat', 'DangGiao', 35000, 'NV006', '', '3h', 'Nguoi6'),
('GH007', 'DH007', '2023-07-30', 'Nha Trang', 'HoanTat', 50000, 'NV007', '', '2h', 'Nguoi7'),
('GH008', 'DH008', '2023-08-15', 'Hue', 'DaHuy', 32000, 'NV008', 'Loi SP', '4h', 'Nguoi8'),
('GH009', 'DH009', '2023-09-20', 'Vinh', 'DangGiao', 70000, 'NV009', '', '2h', 'Nguoi9'),
('GH010', 'DH010', '2023-10-05', 'Quy Nhon', 'HoanTat', 25000, 'NV010', '', '3h', 'Nguoi10');