import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from './UserProfile.module.css';
import {
    getMyProfile,
    updateUser,
    uploadAvatar,
    createMyAddress,
    getMyAddresses,
    updateMyProfile,
    changeMyPassword,
    updateMyAddress,
    deleteMyAddress,
} from '../../../services/user_profile_service.js';



const VN_API_BASE = 'https://vn-public-apis.fpo.vn';

const locationService = {
    
    getProvinces: async () => {
        try {
            const response = await fetch(`${VN_API_BASE}/provinces/getAll?limit=-1`);
            if (!response.ok) throw new Error('Không thể tải danh sách tỉnh/thành phố');
            const data = await response.json();
            
            return data.data?.data || [];
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    },

    
    getDistricts: async (provinceCode) => {
        if (!provinceCode) return [];
        try {
            const response = await fetch(`${VN_API_BASE}/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`);
            if (!response.ok) throw new Error('Không thể tải danh sách quận/huyện');
            const data = await response.json();
            return data.data?.data || [];
        } catch (error) {
            console.error('Error fetching districts:', error);
            return [];
        }
    },

    
    getWards: async (districtCode) => {
        if (!districtCode) return [];
        try {
            const response = await fetch(`${VN_API_BASE}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`);
            if (!response.ok) throw new Error('Không thể tải danh sách phường/xã');
            const data = await response.json();
            return data.data?.data || [];
        } catch (error) {
            console.error('Error fetching wards:', error);
            return [];
        }
    },
};


const getFullAddressName = (address, locationData) => {
    const { provinces, districtsMap, wardsMap } = locationData;

    if (!address?.provinceId) return address?.addressLine || 'Địa chỉ không đầy đủ';

    const findNameById = (id, options) => {
        const item = options.find(opt => opt.code === id || opt._id === id);
        return item?.name_with_type || item?.name || '';
    };

    
    const provinceName = findNameById(address.provinceId, provinces);
    const districtName = findNameById(address.districtId, districtsMap[address.provinceId] || []);
    const wardName = findNameById(address.wardId, wardsMap[address.districtId] || []);

    const street = address.streetNumber || '';

    const parts = [street, wardName, districtName, provinceName].filter(p => p);
    return parts.join(', ') || address.addressLine || 'Địa chỉ không hợp lệ';
};



const AddressItem = ({ address, onSave, onDelete, locationData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(address ?? {});
    const [isSaving, setIsSaving] = useState(false);
    const [addressError, setAddressError] = useState(null);

    
    const [editDistricts, setEditDistricts] = useState([]);
    const [editWards, setEditWards] = useState([]);
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    
    useEffect(() => {
        if (isEditing && formData.provinceId) {
            const fetchDistricts = async () => {
                setIsLocationLoading(true);
                const districts = await locationService.getDistricts(formData.provinceId);
                setEditDistricts(districts);
                setIsLocationLoading(false);
            };
            fetchDistricts();
        }
    }, [isEditing, formData.provinceId]);

    
    useEffect(() => {
        if (isEditing && formData.districtId) {
            const fetchWards = async () => {
                setIsLocationLoading(true);
                const wards = await locationService.getWards(formData.districtId);
                setEditWards(wards);
                setIsLocationLoading(false);
            };
            fetchWards();
        }
    }, [isEditing, formData.districtId]);

    useEffect(() => setFormData(address ?? {}), [address]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        
        if (name === 'provinceId') {
            setFormData(prev => ({ ...prev, districtId: '', wardId: '' }));
            setEditDistricts([]);
            setEditWards([]);
        } else if (name === 'districtId') {
            setFormData(prev => ({ ...prev, wardId: '' }));
            setEditWards([]);
        }
    };

    const handleSave = async () => {
        setAddressError(null);
        if (!formData.provinceId || !formData.districtId || !formData.wardId || !formData.streetNumber) {
            setAddressError('Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã và nhập Số nhà/Đường.');
            return;
        }

        setIsSaving(true);
        try {
            
            const tempLocationData = {
                provinces: locationData.provinces,
                districtsMap: { [formData.provinceId]: editDistricts },
                wardsMap: { [formData.districtId]: editWards }
            };

            const dataToSave = {
                provinceId: formData.provinceId,
                districtId: formData.districtId,
                wardId: formData.wardId,
                streetNumber: formData.streetNumber,
                addressLine: getFullAddressName(formData, tempLocationData)
            };

            if(window.confirm(`Bạn có chắc muốn lưu địa chỉ này?`)){
                const updated = await updateMyAddress(formData.addressId ?? formData.id, dataToSave);
                onSave(updated);
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Address save error', err);
            setAddressError(err.message || 'Lỗi khi lưu địa chỉ.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                await deleteMyAddress(formData.addressId ?? formData.id);
                onDelete(formData.addressId ?? formData.id);
            } catch (err) {
                console.error('Address delete error', err);
                alert('Lỗi khi xóa địa chỉ.');
            }
        }
    };

    
    const currentDistricts = editDistricts.length > 0 ? editDistricts : locationData.districtsMap[formData.provinceId] || [];
    const currentWards = editWards.length > 0 ? editWards : locationData.wardsMap[formData.districtId] || [];

    const isReady = locationData.isLoaded && !isLocationLoading;

    if (isEditing) {
        return (
            <div className={styles.addressItemEditing}>
                <div className={styles.editingHeader}>
                    <span className={styles.editingIcon}>✏️</span>
                    <h4>Chỉnh sửa địa chỉ</h4>
                </div>
                {isLocationLoading && <div className={styles.loadingTiny}>Đang tải vị trí...</div>}
                <div className={`${styles.formGrid} ${styles.addressSelectGrid}`}>
                    {}
                    <div className={styles.formGroup}>
                        <label className={styles.label}><span className={styles.labelIcon}>🗺️</span>Tỉnh/Thành phố</label>
                        <select name="provinceId" value={formData.provinceId || ''} onChange={handleInputChange} className={styles.input}>
                            <option value="">Chọn Tỉnh/Thành phố</option>
                            {locationData.provinces.map(p => (
                                <option key={p._id || p.code} value={p.code}>{p.name_with_type || p.name}</option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className={styles.formGroup}>
                        <label className={styles.label}><span className={styles.labelIcon}>🏙️</span>Quận/Huyện</label>
                        <select name="districtId" value={formData.districtId || ''} onChange={handleInputChange} className={styles.input} disabled={!formData.provinceId || isLocationLoading}>
                            <option value="">Chọn Quận/Huyện</option>
                            {currentDistricts.map(d => (
                                <option key={d._id || d.code} value={d.code}>{d.name_with_type || d.name}</option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className={styles.formGroup}>
                        <label className={styles.label}><span className={styles.labelIcon}>🏡</span>Phường/Xã</label>
                        <select name="wardId" value={formData.wardId || ''} onChange={handleInputChange} className={styles.input} disabled={!formData.districtId || isLocationLoading}>
                            <option value="">Chọn Phường/Xã</option>
                            {currentWards.map(w => (
                                <option key={w._id || w.code} value={w.code}>{w.name_with_type || w.name}</option>
                            ))}
                        </select>
                    </div>

                    {}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}><span className={styles.labelIcon}>🏠</span>Số nhà, Tên đường</label>
                        <input
                            type="text"
                            name="streetNumber"
                            value={formData.streetNumber || ''}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ví dụ: 123 Nguyễn Trãi"
                        />
                    </div>
                </div>
                {addressError && <div className={styles.errorText}>{addressError}</div>}
                <div className={styles.addressActions}>
                    <button onClick={handleSave} className={styles.btnSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <span className={styles.spinner}></span>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <span>💾</span>
                                Lưu thay đổi
                            </>
                        )}
                    </button>
                    <button onClick={() => setIsEditing(false)} className={styles.btnCancel} disabled={isSaving}>
                        <span>❌</span>
                        Hủy bỏ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.addressItem}>
            <div className={styles.addressHeader}>
                <span className={styles.addressBadge}>Địa chỉ giao hàng</span>
            </div>
            <div className={styles.addressContent}>
                <div className={styles.addressRow}>
                    <span className={styles.addressIcon}>🏠</span>
                    <div className={styles.addressDetail}>
                        <span className={styles.addressLabel}>Địa chỉ chi tiết:</span>
                        <span className={styles.addressValue}>{getFullAddressName(address, locationData)}</span>
                    </div>
                </div>
            </div>
            <div className={styles.addressActions}>
                <button onClick={() => setIsEditing(true)} className={styles.btnEdit}>
                    <span>✏️</span>
                    Chỉnh sửa
                </button>
                <button onClick={handleDelete} className={styles.btnDelete}>
                    <span>🗑️</span>
                    Xóa
                </button>
            </div>
        </div>
    );
};


const UserProfile = () => {
    const loggedInUserId = useSelector((state) => state.auth?.user?.userId);

    const [userProfile, setUserProfile] = useState(null);
    const [userFormData, setUserFormData] = useState({});
    const [isEditingUser, setIsEditingUser] = useState(false);
    const [isSavingUser, setIsSavingUser] = useState(false);

    const [addresses, setAddresses] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddressData, setNewAddressData] = useState({
        provinceId: '',
        districtId: '',
        wardId: '',
        streetNumber: ''
    });
    const [newAddressError, setNewAddressError] = useState(null);

    
    const [newDistricts, setNewDistricts] = useState([]);
    const [newWards, setNewWards] = useState([]);
    const [isNewLocationLoading, setIsNewLocationLoading] = useState(false);

    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const [locationData, setLocationData] = useState({
        provinces: [],
        districtsMap: {},
        wardsMap: {},
        isLoaded: false,
    });

    
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const provinces = await locationService.getProvinces();
                setLocationData({
                    provinces,
                    districtsMap: {},
                    wardsMap: {},
                    isLoaded: true,
                });
            } catch (e) {
                console.error("Lỗi tải dữ liệu vị trí:", e);
                setError("Không thể tải dữ liệu địa điểm.");
            }
        };
        fetchLocationData();
    }, []);

    
    useEffect(() => {
        if (!loggedInUserId || !locationData.isLoaded) {
            if (!loggedInUserId) setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const userDto = await getMyProfile();
                const addrList = await getMyAddresses();

                setUserProfile(userDto);
                setUserFormData(userDto);
                setAddresses(addrList || []);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Không thể tải dữ liệu.');
                setUserProfile(null);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [loggedInUserId, locationData.isLoaded]);

    
    useEffect(() => {
        if (isAddingAddress && newAddressData.provinceId) {
            const fetchDistricts = async () => {
                setIsNewLocationLoading(true);
                const districts = await locationService.getDistricts(newAddressData.provinceId);
                setNewDistricts(districts);
                setIsNewLocationLoading(false);
            };
            fetchDistricts();
        }
    }, [isAddingAddress, newAddressData.provinceId]);

    
    useEffect(() => {
        if (isAddingAddress && newAddressData.districtId) {
            const fetchWards = async () => {
                setIsNewLocationLoading(true);
                const wards = await locationService.getWards(newAddressData.districtId);
                setNewWards(wards);
                setIsNewLocationLoading(false);
            };
            fetchWards();
        }
    }, [isAddingAddress, newAddressData.districtId]);

    
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isLoading) return;

    try {
        setIsLoading(true);

        
        const avatarUrl = await uploadAvatar(file);

        
        setUserProfile(prev => ({ ...prev, userAvatar: avatarUrl }));
        setUserFormData(prev => ({ ...prev, userAvatar: avatarUrl }));

        
    } catch (err) {
        console.error('Avatar upload failed', err);
        alert(err?.message || 'Không thể tải lên ảnh.');
    } finally {
        setIsLoading(false);
    }
    };
    


    const handleSaveUser = async () => {
        if (!userFormData.fullName || !userFormData.emailAddress) {
            alert('Họ và tên, email là bắt buộc');
            return;
        }
        try {
            setIsSavingUser(true);
            const resp = await updateMyProfile(userFormData);
            setUserProfile(resp);
            setUserFormData(resp);
            setIsEditingUser(false);
        } catch (err) {
            console.error(err);
            alert(err.message || 'Lỗi khi lưu thông tin');
        } finally {
            setIsSavingUser(false);
        }
    };

    const handleCancelUser = () => {
        setUserFormData(userProfile ?? {});
        setIsEditingUser(false);
    };

    
    const handleAddressSaved = (updatedAddress) => {
        const updatedId = updatedAddress?.addressId ?? updatedAddress?.id;
        setAddresses(prev => prev.map(a => (a?.addressId ?? a?.id) === updatedId ? updatedAddress : a));
    };

    const handleAddressDeleted = (deletedAddressId) => {
        setAddresses(prev => prev.filter(a => (a?.addressId ?? a?.id) !== deletedAddressId));
    };

    const handleAddNewAddressChange = (e) => {
        const { name, value } = e.target;
        setNewAddressData(prev => ({ ...prev, [name]: value }));

        
        if (name === 'provinceId') {
            setNewAddressData(prev => ({ ...prev, districtId: '', wardId: '' }));
            setNewDistricts([]);
            setNewWards([]);
        } else if (name === 'districtId') {
            setNewAddressData(prev => ({ ...prev, wardId: '' }));
            setNewWards([]);
        }
    };

    const handleSaveNewAddress = async () => {
        setNewAddressError(null);
        const { provinceId, districtId, wardId, streetNumber } = newAddressData;

        if (!provinceId || !districtId || !wardId || !streetNumber) {
            setNewAddressError('Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã và nhập Số nhà/Đường.');
            return;
        }

        try {
            const dataToSend = {
                provinceId,
                districtId,
                wardId,
                streetNumber,
                addressLine: getFullAddressName(newAddressData, {
                    provinces: locationData.provinces,
                    districtsMap: { [provinceId]: newDistricts },
                    wardsMap: { [districtId]: newWards }
                })
            };

            const created = await createMyAddress(dataToSend);
            setAddresses(prev => [...prev, created]);
            setNewAddressData({ provinceId: '', districtId: '', wardId: '', streetNumber: '' });
            setNewDistricts([]);
            setNewWards([]);
            setIsAddingAddress(false);
        } catch (err) {
            console.error(err);
            setNewAddressError(err.message || 'Lỗi khi thêm địa chỉ mới');
        }
    };

    const handleCancelNewAddress = () => {
        setNewAddressData({ provinceId: '', districtId: '', wardId: '', streetNumber: '' });
        setNewAddressError(null);
        setNewDistricts([]);
        setNewWards([]);
        setIsAddingAddress(false);
    };

    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('Vui lòng nhập đầy đủ thông tin.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('Xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            setIsChangingPassword(true);
            if(window.confirm('Bạn có chắc muốn đổi mật khẩu?')){
                await changeMyPassword(passwordData.oldPassword, passwordData.newPassword);
                setPasswordSuccess('Đổi mật khẩu thành công.');
                setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (err) {
            console.error(err);
            setPasswordError(err.message || 'Lỗi khi đổi mật khẩu.');
        } finally {
            setIsChangingPassword(false);
        }
    };

    
    if (isLoading || !locationData.isLoaded) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Đang tải thông tin cá nhân và địa điểm...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>⚠️</div>
                <h2>Có lỗi xảy ra</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorIcon}>👤</div>
                <h2>Không tìm thấy thông tin</h2>
                <p>Vui lòng đăng nhập để xem trang này.</p>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {}
                <div className={styles.pageHeader}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.pageTitle}>
                            <span className={styles.titleIcon}>👤</span>
                            Thông tin cá nhân
                        </h1>
                        <p className={styles.pageSubtitle}>Quản lý thông tin tài khoản của bạn</p>

                        {}
                        <div style={{ marginTop: '1rem' }}>
                            <Link to="/OrderHistory" className={styles.btnPrimary} style={{ textDecoration: 'none' }}>
                                <span>📦</span>&nbsp; Xem lịch sử đơn hàng
                            </Link>
                        </div>
                    </div>
                </div>

                {}
                <div className={styles.section}>
                    <div className={styles.card}>
                        <div className={styles.profileContainer}>
                            {}
                            <div className={styles.profileLeft}>
                                <div className={styles.avatarWrapper}>
                                    <div className={styles.avatarContainer}>
                                        <img
                                            src={userProfile.userAvatar || '../src/assets/avt.png'}
                                            alt="Avatar"
                                            className={styles.avatar}
                                            onError={(e) => { e.currentTarget.src = '../src/assets/avt.png'; }}
                                        />
                                        <div className={styles.avatarOverlay}>
                                            <label htmlFor="avatarUpload" className={styles.avatarLabel}>
                                                <span className={styles.cameraIcon}>📷</span>
                                                Thay đổi
                                            </label>
                                        </div>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        id="avatarUpload"
                                        className={styles.fileInput}
                                    />
                                </div>

                                <div className={styles.profileInfo}>
                                    <h2 className={styles.userName}>{userProfile.fullName || 'Chưa cập nhật'}</h2>
                                    <p className={styles.userEmail}>{userProfile.emailAddress || 'Chưa cập nhật'}</p>
                                    <div className={styles.userBadge}>
                                        <span className={styles.badgeIcon}>✨</span>
                                        Thành viên
                                    </div>
                                </div>
                            </div>

                            {}
                            <div className={styles.profileRight}>
                                {!isEditingUser ? (
                                    <button className={styles.btnPrimary} onClick={() => setIsEditingUser(true)}>
                                        <span>✏️</span>
                                        Chỉnh sửa thông tin
                                    </button>
                                ) : (
                                    <div className={styles.buttonGroup}>
                                        <button className={styles.btnSuccess} onClick={handleSaveUser} disabled={isSavingUser}>
                                            {isSavingUser ? (
                                                <>
                                                    <span className={styles.spinner}></span>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <span>💾</span>
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </button>
                                        <button className={styles.btnSecondary} onClick={handleCancelUser} disabled={isSavingUser}>
                                            <span>❌</span>
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className={styles.section}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>📋</span>
                                Thông tin chi tiết
                            </h3>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>👤</span>
                                        Họ và tên
                                    </label>
                                    {isEditingUser ? (
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={userFormData.fullName || ''}
                                            onChange={handleUserInputChange}
                                            className={styles.input}
                                            placeholder="Nhập họ và tên..."
                                        />
                                    ) : (
                                        <div className={styles.infoValue}>{userProfile.fullName || 'Chưa cập nhật'}</div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>📧</span>
                                        Email
                                    </label>
                                    {isEditingUser ? (
                                        <input
                                            type="email"
                                            name="emailAddress"
                                            value={userFormData.emailAddress || ''}
                                            onChange={handleUserInputChange}
                                            className={styles.input}
                                            placeholder="Nhập email..."
                                        />
                                    ) : (
                                        <div className={styles.infoValue}>{userProfile.emailAddress || 'Chưa cập nhật'}</div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>📱</span>
                                        Số điện thoại
                                    </label>
                                    {isEditingUser ? (
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={userFormData.phoneNumber || ''}
                                            onChange={handleUserInputChange}
                                            className={styles.input}
                                            placeholder="Nhập số điện thoại..."
                                        />
                                    ) : (
                                        <div className={styles.infoValue}>{userProfile.phoneNumber || 'Chưa cập nhật'}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className={styles.section}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>🔒</span>
                                Đổi mật khẩu
                            </h3>
                            <p className={styles.cardSubtitle}>Cập nhật mật khẩu để bảo mật tài khoản</p>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>🔑</span>
                                        Mật khẩu cũ
                                    </label>
                                    <input
                                        type="password"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                        placeholder="Nhập mật khẩu cũ..."
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>🆕</span>
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                        placeholder="Nhập mật khẩu mới..."
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        <span className={styles.labelIcon}>✅</span>
                                        Xác nhận mật khẩu
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className={styles.input}
                                        placeholder="Nhập lại mật khẩu mới..."
                                    />
                                </div>
                            </div>

                            {passwordError && (
                                <div className={styles.alert} data-type="error">
                                    <span className={styles.alertIcon}>⚠️</span>
                                    <span>{passwordError}</span>
                                </div>
                            )}

                            {passwordSuccess && (
                                <div className={styles.alert} data-type="success">
                                    <span className={styles.alertIcon}>✅</span>
                                    <span>{passwordSuccess}</span>
                                </div>
                            )}

                            <button
                                onClick={handleSavePassword}
                                disabled={isChangingPassword}
                                className={styles.btnPrimary}
                            >
                                {isChangingPassword ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <span>🔐</span>
                                        Đổi mật khẩu
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {}
                <div className={styles.section}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>
                                <span className={styles.cardIcon}>📍</span>
                                Địa chỉ giao hàng
                            </h3>
                            <p className={styles.cardSubtitle}>Quản lý địa chỉ nhận hàng của bạn</p>
                        </div>
                        <div className={styles.cardBody}>
                            {addresses.length === 0 && !isAddingAddress && (
                                <div className={styles.emptyState}>
                                    <span className={styles.emptyIcon}>📦</span>
                                    <p className={styles.emptyText}>Chưa có địa chỉ nào</p>
                                    <p className={styles.emptySubtext}>Thêm địa chỉ để nhận hàng dễ dàng hơn</p>
                                </div>
                            )}

                            {addresses.map(addr => (
                                <AddressItem
                                    key={addr.addressId ?? addr.id}
                                    address={addr}
                                    onSave={handleAddressSaved}
                                    onDelete={handleAddressDeleted}
                                    locationData={locationData}
                                />
                            ))}

                            {isAddingAddress && (
                                <div className={styles.addressItemEditing}>
                                    <div className={styles.editingHeader}>
                                        <span className={styles.editingIcon}>➕</span>
                                        <h4>Thêm địa chỉ mới</h4>
                                    </div>
                                    {isNewLocationLoading && <div className={styles.loadingTiny}>Đang tải vị trí...</div>}
                                    <div className={`${styles.formGrid} ${styles.addressSelectGrid}`}>
                                        {}
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}><span className={styles.labelIcon}>🗺️</span>Tỉnh/Thành phố</label>
                                            <select
                                                name="provinceId"
                                                value={newAddressData.provinceId || ''}
                                                onChange={handleAddNewAddressChange}
                                                className={styles.input}
                                                disabled={!locationData.isLoaded}
                                            >
                                                <option value="">Chọn Tỉnh/Thành phố</option>
                                                {locationData.provinces.map(p => (
                                                    <option key={p._id || p.code} value={p.code}>
                                                        {p.name_with_type || p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {}
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}><span className={styles.labelIcon}>🏙️</span>Quận/Huyện</label>
                                            <select
                                                name="districtId"
                                                value={newAddressData.districtId || ''}
                                                onChange={handleAddNewAddressChange}
                                                className={styles.input}
                                                disabled={!newAddressData.provinceId || isNewLocationLoading}
                                            >
                                                <option value="">Chọn Quận/Huyện</option>
                                                {newDistricts.map(d => (
                                                    <option key={d._id || d.code} value={d.code}>
                                                        {d.name_with_type || d.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {}
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}><span className={styles.labelIcon}>🏡</span>Phường/Xã</label>
                                            <select
                                                name="wardId"
                                                value={newAddressData.wardId || ''}
                                                onChange={handleAddNewAddressChange}
                                                className={styles.input}
                                                disabled={!newAddressData.districtId || isNewLocationLoading}
                                            >
                                                <option value="">Chọn Phường/Xã</option>
                                                {newWards.map(w => (
                                                    <option key={w._id || w.code} value={w.code}>
                                                        {w.name_with_type || w.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {}
                                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                            <label className={styles.label}><span className={styles.labelIcon}>🏠</span>Số nhà, Tên đường</label>
                                            <input
                                                type="text"
                                                name="streetNumber"
                                                value={newAddressData.streetNumber || ''}
                                                onChange={handleAddNewAddressChange}
                                                className={styles.input}
                                                placeholder="Ví dụ: 123 Nguyễn Trãi"
                                            />
                                        </div>
                                    </div>
                                    {newAddressError && <div className={styles.errorText}>{newAddressError}</div>}
                                    <div className={styles.addressActions}>
                                        <button onClick={handleSaveNewAddress} className={styles.btnSave}>
                                            <span>💾</span>
                                            Lưu địa chỉ
                                        </button>
                                        <button onClick={handleCancelNewAddress} className={styles.btnCancel}>
                                            <span>❌</span>
                                            Hủy bỏ
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!isAddingAddress && (
                                <button
                                    onClick={() => setIsAddingAddress(true)}
                                    className={styles.btnAddAddress}
                                >
                                    <span>➕</span>
                                    Thêm địa chỉ mới
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
