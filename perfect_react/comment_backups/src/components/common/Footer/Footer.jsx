import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Giới thiệu', path: '/about' },
      { label: 'Tin tức', path: '/news' },
      { label: 'Tuyển dụng', path: '/careers' },
      { label: 'Liên hệ', path: '/contact' },
    ],
    support: [
      { label: 'Trung tâm trợ giúp', path: '/help' },
      { label: 'Hướng dẫn mua hàng', path: '/guide' },
      { label: 'Chính sách đổi trả', path: '/return-policy' },
      { label: 'Bảo hành', path: '/warranty' },
    ],
    legal: [
      { label: 'Điều khoản sử dụng', path: '/terms' },
      { label: 'Chính sách bảo mật', path: '/privacy' },
      { label: 'Chính sách cookie', path: '/cookies' },
      { label: 'Pháp lý', path: '/legal' },
    ],
  };

  const socialLinks = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: 'https://www.facebook.com/dlongg.1202',
      label: 'Facebook'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: 'https://x.com',
      label: 'Twitter'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
      href: 'https://www.instagram.com/zlong.262/',
      label: 'Instagram'
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M16 3L20 7v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7l4-4M9 3v4h6V3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={styles.logoText}>TeeHub Store</span>
            </Link>
            <p className={styles.description}>
              Chuyên cung cấp áo thun chất lượng cao với công nghệ thử đồ AI tiên tiến.
              Tạo ra những sản phẩm độc đáo và phù hợp với phong cách của bạn.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>3 Phố Cầu Giấy, Đống Đa, Hà Nội</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+84 373 259 560</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>nhom4@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Công ty</h3>
              <ul className={styles.linkList}>
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Hỗ trợ</h3>
              <ul className={styles.linkList}>
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Pháp lý</h3>
              <ul className={styles.linkList}>
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}


        {/* Bottom Footer */}
        <div className={styles.bottomFooter}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} TeeHub Store. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;