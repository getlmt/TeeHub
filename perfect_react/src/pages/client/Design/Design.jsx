import React, { useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import designService from '../../../services/designService.js';
import CartService from '../../../services/cart_service.js';
import { getUserId } from '../../../utils/auth';


import styles from './design.module.css';


import shirt1 from '../../../data/1a.png';
import shirt2 from '../../../data/2a.png';
import shirt3 from '../../../data/3a.png';
import shirt5 from '../../../data/5a.png';
import shirt7 from '../../../data/7a.png';


const Icons = {
    Text: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>,
    Image: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    Save: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
    Cart: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
};


function broadcastCartChange() {
    try {
        window.dispatchEvent(new Event('cartUpdated')); 
        window.dispatchEvent(new Event('cart-updated')); 
    } catch (e) {  }
    try {
        localStorage.setItem('cart', String(Date.now())); 
    } catch (e) {  }
}

const TShirtDesigner = () => {
    
    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [nextId, setNextId] = useState(1);
    const [dragData, setDragData] = useState(null);
    const canvasRef = useRef(null);

    const [name, setName] = useState('Áo thiết kế của tôi');
    const [myDesigns, setMyDesigns] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const userId = getUserId();

    const baseImages = [
        { src: shirt1, label: 'Basic Tee' },
        { src: shirt2, label: 'Slim Fit' },
        { src: shirt3, label: 'V-Neck' },
        { src: shirt5, label: 'Long Sleeve' },
        { src: shirt7, label: 'Polo' },
    ];
    const [baseIndex, setBaseIndex] = useState(0);

    const decorationImages = [
        { id: 'star', name: 'Star', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
        { id: 'heart', name: 'Heart', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
        { id: 'music', name: 'Note', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' },
        { id: 'smile', name: 'Smile', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>' },
        { id: 'flash', name: 'Flash', svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>' },
    ];

    
    const loadMyDesigns = useCallback(() => {
        if (userId) {
            designService.getMyDesigns(userId)
                .then(data => setMyDesigns(Array.isArray(data) ? [...data].reverse() : []))
                .catch(err => console.error("Load error:", err));
        }
    }, [userId]);

    useEffect(() => { loadMyDesigns(); }, [loadMyDesigns]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
                if (document.activeElement.tagName !== 'INPUT') {
                    deleteElement(selectedElement);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedElement]);

    
    const addTextElement = () => {
        const el = { id: nextId, type: 'text', content: 'Double click to edit', x: 150, y: 200, fontSize: 24, fontFamily: 'Arial', color: '#1f2937', fontWeight: 'bold', fontStyle: 'normal', rotation: 0 };
        setElements(p => [...p, el]);
        setSelectedElement(el.id);
        setNextId(p => p + 1);
    };

    const addImageElement = () => {
        const input = document.createElement('input');
        input.type = 'file'; input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files?.[0]; if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => {
                const el = { id: nextId, type: 'image', src: ev.target.result, x: 140, y: 140, width: 120, height: 120, rotation: 0 };
                setElements(p => [...p, el]);
                setSelectedElement(el.id);
                setNextId(p => p + 1);
            };
            reader.readAsDataURL(file);
        };
        input.click();
    };

    const addDecorationElement = (d) => {
        const el = { id: nextId, type: 'decoration', svg: d.svg, name: d.name, x: 180, y: 180, width: 80, height: 80, color: '#6366f1', rotation: 0 };
        setElements(p => [...p, el]);
        setSelectedElement(el.id);
        setNextId(p => p + 1);
    };

    const updateElement = (id, updates) => setElements(p => p.map(el => el.id === id ? { ...el, ...updates } : el));
    
    const deleteElement = (id) => {
        setElements(p => p.filter(el => el.id !== id));
        if (selectedElement === id) setSelectedElement(null);
    };

    
    const handleMouseDown = useCallback((e, elementId) => {
        e.preventDefault(); e.stopPropagation();
        setSelectedElement(elementId);
        const rect = canvasRef.current?.getBoundingClientRect();
        const el = elements.find(x => x.id === elementId);
        if (rect && el) {
            setDragData({ elementId, startX: e.clientX - rect.left - el.x, startY: e.clientY - rect.top - el.y });
        }
    }, [elements]);

    const handleMouseMove = useCallback((e) => {
        if (!dragData) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            let newX = e.clientX - rect.left - dragData.startX;
            let newY = e.clientY - rect.top - dragData.startY;
            newX = Math.max(-100, Math.min(newX, 400));
            newY = Math.max(-100, Math.min(newY, 500));
            updateElement(dragData.elementId, { x: newX, y: newY });
        }
    }, [dragData]);

    const handleMouseUp = useCallback(() => setDragData(null), []);

    useEffect(() => {
        if (dragData) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragData, handleMouseMove, handleMouseUp]);

    
    const exportCanvasBlob = async (node) => {
        const prevSelected = selectedElement;
        setSelectedElement(null);
        await new Promise(r => setTimeout(r, 100));

        try {
            const canvas = await html2canvas(node, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true
            });
            setSelectedElement(prevSelected);
            return await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.9));
        } catch (error) {
            setSelectedElement(prevSelected);
            throw error;
        }
    };

    const saveDesignToServer = async () => {
        if (!getUserId()) return alert("Vui lòng đăng nhập để lưu!");
        setIsSaving(true);
        try {
            const blob = await exportCanvasBlob(canvasRef.current);
            const payload = {
                name: name.trim() || `Design ${Date.now()}`,
                description: 'Custom Design',
                price: '400000',
                baseImage: baseImages[baseIndex]?.label,
                designJson: JSON.stringify(elements)
            };
            const res = await designService.createCustomProductWithImage(payload, blob, { filename: `d_${Date.now()}.png` });
            if (res?.id) {
                alert('🎉 Đã lưu thành công!');
                loadMyDesigns();
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lưu thiết kế!');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadDesign = async () => {
        if (!canvasRef.current) return;
        const blob = await exportCanvasBlob(canvasRef.current);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `my_design_${Date.now()}.png`;
        link.click();
    };

    
    const handleAddToCart = async (design) => {
        const currentUserId = getUserId();
        if (!currentUserId) {
            alert("⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        if (!confirm(`Thêm mẫu "${design.customName || 'này'}" vào giỏ hàng?`)) return;

        try {
            
            const cartPayload = {
                userId: currentUserId,
                qty: 1,
                
                
                isCustomed: true, is_customed: true,
                customProductId: design.id, custom_product_id: design.id,
                
                
                productItemId: null, product_item_id: null,
                
                selectedOptions: []
            };

            console.log("🛒 Payload gửi đi:", cartPayload);

            await CartService.addToCart(currentUserId, cartPayload);

            
            broadcastCartChange();

            
            if(confirm("✅ Đã thêm vào giỏ thành công! Đi tới giỏ hàng ngay?")) {
                window.location.href = '/cart';
            }
        } catch (error) {
            console.error("❌ Lỗi thêm giỏ hàng:", error);
            const msg = error.response?.data?.message || error.message;
            if (msg && msg.includes("409")) {
                alert("⚠️ Sản phẩm này đã có trong giỏ hàng rồi!");
            } else {
                alert(`❌ Lỗi thêm giỏ hàng: ${msg}`);
            }
        }
    };

    const handleDeleteDesign = async (id) => {
        if (!confirm("Bạn chắc chắn muốn xóa?")) return;
        try {
            await designService.deleteDesign(id);
            setMyDesigns(p => p.filter(i => i.id !== id));
        } catch (e) { alert("Không thể xóa (có thể đang có trong đơn hàng)."); }
    };

    const selectedData = elements.find(el => el.id === selectedElement);

    
    return (
        <div className={styles.container}>
            {}
            <header className={styles.header}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <div className={styles.brand}>Studio</div>
                    <div className={styles.metaInfo}>
                        <input className={styles.inputName} value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên thiết kế..." />
                        <span className={styles.priceTag}>400,000 đ</span>
                    </div>
                </div>
                
                <div className={styles.actions}>
                    <button className={`${styles.btnAction} ${styles.btnSecondary}`} onClick={downloadDesign}>
                        <Icons.Download /> Tải ảnh
                    </button>
                    <button className={`${styles.btnAction} ${styles.btnPrimary}`} onClick={saveDesignToServer} disabled={isSaving}>
                        <Icons.Save /> {isSaving ? 'Đang lưu...' : 'Lưu thiết kế'}
                    </button>
                </div>
            </header>

            {}
            <div className={styles.workspace}>
                {}
                <aside className={styles.leftPanel}>
                    <div className={styles.sectionTitle}>Công cụ</div>
                    <div className={styles.toolGrid}>
                        <button className={styles.toolBtn} onClick={addTextElement}>
                            <div className={styles.toolIcon}><Icons.Text /></div>
                            <span className={styles.toolLabel}>Thêm Chữ</span>
                        </button>
                        <button className={styles.toolBtn} onClick={addImageElement}>
                            <div className={styles.toolIcon}><Icons.Image /></div>
                            <span className={styles.toolLabel}>Thêm Ảnh</span>
                        </button>
                    </div>

                    <div className={styles.sectionTitle}>Stickers</div>
                    <div className={styles.stickerGrid}>
                        {decorationImages.map(d => (
                            <div key={d.id} className={styles.stickerItem} onClick={() => addDecorationElement(d)} title={d.name}
                                dangerouslySetInnerHTML={{ __html: d.svg.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="28" height="28"') }} />
                        ))}
                    </div>

                    <div className={styles.sectionTitle}>Chọn Mẫu Áo</div>
                    <div className={styles.shirtList}>
                        {baseImages.map((img, idx) => (
                            <div key={idx} className={`${styles.shirtThumb} ${baseIndex === idx ? styles.shirtThumbActive : ''}`} onClick={() => setBaseIndex(idx)}>
                                <img src={img.src} alt={img.label} />
                            </div>
                        ))}
                    </div>
                </aside>

                {}
                <main className={styles.centerArea} onClick={() => setSelectedElement(null)}>
                    <div className={styles.canvasContainer}>
                        <div ref={canvasRef} className={styles.canvasPaper}>
                            <img src={baseImages[baseIndex].src} alt="shirt" className={styles.baseImage} draggable={false} />
                            {elements.map((el) => (
                                <div key={el.id}
                                    className={styles.draggable}
                                    style={{ left: el.x, top: el.y, transform: `rotate(${el.rotation}deg)` }}
                                    onMouseDown={(e) => handleMouseDown(e, el.id)}>
                                    
                                    {el.type === 'text' ? (
                                        <span style={{ fontSize: `${el.fontSize}px`, fontFamily: el.fontFamily, color: el.color, fontWeight: el.fontWeight, fontStyle: el.fontStyle, padding: '4px 8px', display: 'block', whiteSpace: 'nowrap', textShadow: '0 0 2px rgba(255,255,255,0.5)' }}>
                                            {el.content}
                                        </span>
                                    ) : el.type === 'decoration' ? (
                                        <div style={{ width: el.width, height: el.height, color: el.color, display: 'flex' }}
                                            dangerouslySetInnerHTML={{ __html: el.svg.replace('viewBox="0 0 24 24"', `viewBox="0 0 24 24" width="${el.width}" height="${el.height}"`) }} />
                                    ) : (
                                        <img src={el.src} style={{ width: el.width, height: el.height, objectFit: 'contain', display: 'block' }} draggable={false} alt="" />
                                    )}

                                    {selectedElement === el.id && (
                                        <div className={styles.selectionBox}>
                                            <div className={`${styles.corner} ${styles.tl}`}></div>
                                            <div className={`${styles.corner} ${styles.tr}`}></div>
                                            <div className={`${styles.corner} ${styles.bl}`}></div>
                                            <div className={`${styles.corner} ${styles.br}`}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {}
                <aside className={styles.rightPanel}>
                    <div className={styles.sectionTitle}>Thuộc tính</div>
                    {selectedData ? (
                        <div className="animate-fade-in">
                            {selectedData.type === 'text' && (
                                <div className={styles.propGroup}>
                                    <label className={styles.propLabel}>Nội dung</label>
                                    <input className={styles.formControl} value={selectedData.content} onChange={e => updateElement(selectedElement, { content: e.target.value })} autoFocus />
                                    
                                    <div style={{marginTop: 12}}>
                                        <label className={styles.propLabel}>Font chữ</label>
                                        <select className={styles.formControl} value={selectedData.fontFamily} onChange={e => updateElement(selectedElement, { fontFamily: e.target.value })}>
                                            <option value="Arial">Arial</option>
                                            <option value="Times New Roman">Times New Roman</option>
                                            <option value="Courier New">Courier New</option>
                                            <option value="Verdana">Verdana</option>
                                            <option value="Impact">Impact</option>
                                        </select>
                                    </div>

                                    <div style={{marginTop: 12}}>
                                        <label className={styles.propLabel}>Màu sắc</label>
                                        <div className={styles.colorPickerWrapper}>
                                            <div className={styles.colorCircle} style={{background: selectedData.color}}>
                                                <input type="color" className={styles.nativeColorInput} value={selectedData.color} onChange={e => updateElement(selectedElement, { color: e.target.value })} />
                                            </div>
                                            <span className={styles.colorValue}>{selectedData.color}</span>
                                        </div>
                                    </div>

                                    <div style={{marginTop: 12}}>
                                        <label className={styles.propLabel}>Định dạng</label>
                                        <div className={styles.btnGroup}>
                                            <button className={`${styles.btnToggle} ${selectedData.fontWeight === 'bold' ? styles.btnToggleActive : ''}`}
                                                onClick={() => updateElement(selectedElement, { fontWeight: selectedData.fontWeight === 'bold' ? 'normal' : 'bold' })}>B</button>
                                            <button className={`${styles.btnToggle} ${selectedData.fontStyle === 'italic' ? styles.btnToggleActive : ''}`}
                                                onClick={() => updateElement(selectedElement, { fontStyle: selectedData.fontStyle === 'italic' ? 'normal' : 'italic' })}>I</button>
                                        </div>
                                    </div>

                                    <div style={{marginTop: 15}}>
                                        <label className={styles.propLabel}>Cỡ chữ: {selectedData.fontSize}</label>
                                        <input type="range" className={styles.rangeInput} min="12" max="120" value={selectedData.fontSize} onChange={e => updateElement(selectedElement, { fontSize: parseInt(e.target.value) })} />
                                    </div>
                                </div>
                            )}

                            {(selectedData.type === 'image' || selectedData.type === 'decoration') && (
                                <div className={styles.propGroup}>
                                    <label className={styles.propLabel}>Kích thước: {selectedData.width}px</label>
                                    <input type="range" className={styles.rangeInput} min="20" max="400" value={selectedData.width} 
                                        onChange={e => {
                                            const w = parseInt(e.target.value);
                                            const h = selectedData.type === 'decoration' ? w : (w * (selectedData.height / selectedData.width));
                                            updateElement(selectedElement, { width: w, height: h });
                                        }} />
                                    
                                    {selectedData.type === 'decoration' && (
                                        <div style={{marginTop: 15}}>
                                            <label className={styles.propLabel}>Màu sắc</label>
                                            <div className={styles.colorPickerWrapper}>
                                                <div className={styles.colorCircle} style={{background: selectedData.color}}>
                                                    <input type="color" className={styles.nativeColorInput} value={selectedData.color} onChange={e => updateElement(selectedElement, { color: e.target.value })} />
                                                </div>
                                                <span className={styles.colorValue}>{selectedData.color}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={styles.propGroup}>
                                <label className={styles.propLabel}>Xoay: {selectedData.rotation}°</label>
                                <input type="range" className={styles.rangeInput} min="-180" max="180" value={selectedData.rotation} onChange={e => updateElement(selectedElement, { rotation: parseInt(e.target.value) })} />
                            </div>

                            <button className={styles.btnDelete} onClick={() => deleteElement(selectedElement)}>
                                <Icons.Trash /> Xóa đối tượng
                            </button>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>🎨</div>
                            <p>Chọn đối tượng trên áo<br/>để chỉnh sửa</p>
                        </div>
                    )}
                </aside>
            </div>

            {}
            {myDesigns.length > 0 && (
                <div className={styles.filmStrip}>
                    <div className={styles.stripHeader}>
                        <span className={styles.stripTitle}>Bộ sưu tập của bạn</span>
                        <span style={{fontSize: 12, color: '#999'}}>{myDesigns.length} thiết kế</span>
                    </div>
                    <div className={styles.stripList}>
                        {myDesigns.map(d => (
                            <div key={d.id} className={styles.stripItem} title={d.customName}>
                                <img src={d.customImageUrl?.startsWith('http') ? d.customImageUrl : `/CustomProduct/${d.customImageUrl}`} 
                                     alt="design" 
                                     onError={e => e.target.src = 'https://via.placeholder.com/150'} />
                                <div className={styles.stripActions}>
                                    <button className={`${styles.stripBtn} danger`} onClick={(e) => {e.stopPropagation(); handleDeleteDesign(d.id)}} title="Xóa"><Icons.Trash /></button>
                                    <button className={styles.stripBtn} onClick={(e) => {e.stopPropagation(); handleAddToCart(d)}} title="Thêm vào giỏ" style={{color: '#6366f1'}}><Icons.Cart /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TShirtDesigner;