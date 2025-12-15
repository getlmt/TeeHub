--
-- PostgreSQL database dump
--

\restrict PtpA48nnKEz0G0pqtKOM1AgbgChduVFe6cLNT9wM4ZvAYjWgAmIJN9YOfIN0Zze

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-11-21 11:46:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 7 (class 2615 OID 18703)
-- Name: ecommerce; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA ecommerce;


ALTER SCHEMA ecommerce OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 18666)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 18717)
-- Name: address; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.address (
    address_id integer NOT NULL,
    user_id integer,
    unit_number character varying(50),
    street_number character varying(50),
    address_line character varying(255),
    is_default boolean DEFAULT false
);


ALTER TABLE ecommerce.address OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 18716)
-- Name: address_address_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.address_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.address_address_id_seq OWNER TO postgres;

--
-- TOC entry 5043 (class 0 OID 0)
-- Dependencies: 221
-- Name: address_address_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.address_address_id_seq OWNED BY ecommerce.address.address_id;


--
-- TOC entry 248 (class 1259 OID 18957)
-- Name: cart_item_variation_option; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.cart_item_variation_option (
    cart_item_id integer NOT NULL,
    variation_option_id integer NOT NULL
);


ALTER TABLE ecommerce.cart_item_variation_option OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 18991)
-- Name: contact_message; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.contact_message (
    message_id integer NOT NULL,
    user_id integer,
    sender_name character varying(255) NOT NULL,
    sender_email character varying(255) NOT NULL,
    sender_phone character varying(255),
    subject character varying(255) NOT NULL,
    message_body text NOT NULL,
    status character varying(50) DEFAULT 'NEW'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contact_message_status_check CHECK (((status)::text = ANY ((ARRAY['NEW'::character varying, 'READ'::character varying, 'REPLIED'::character varying, 'CLOSED'::character varying])::text[])))
);


ALTER TABLE ecommerce.contact_message OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 18990)
-- Name: contact_message_message_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.contact_message_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.contact_message_message_id_seq OWNER TO postgres;

--
-- TOC entry 5044 (class 0 OID 0)
-- Dependencies: 249
-- Name: contact_message_message_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.contact_message_message_id_seq OWNED BY ecommerce.contact_message.message_id;


--
-- TOC entry 232 (class 1259 OID 18785)
-- Name: custom_product; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.custom_product (
    custom_product_id integer NOT NULL,
    product_item_id integer,
    user_id integer,
    custom_name character varying(255),
    custom_description text,
    custom_color character varying(50),
    custom_text character varying(255),
    custom_image_url character varying(255),
    preview_image character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE ecommerce.custom_product OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 18784)
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.custom_product_custom_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.custom_product_custom_product_id_seq OWNER TO postgres;

--
-- TOC entry 5045 (class 0 OID 0)
-- Dependencies: 231
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.custom_product_custom_product_id_seq OWNED BY ecommerce.custom_product.custom_product_id;


--
-- TOC entry 238 (class 1259 OID 18844)
-- Name: order_line; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.order_line (
    order_line_id integer NOT NULL,
    product_item_id integer,
    order_id integer,
    qty integer NOT NULL,
    price integer,
    custom_product_id integer,
    CONSTRAINT ck_order_line_price CHECK (((price IS NULL) OR ((price)::numeric >= (0)::numeric))),
    CONSTRAINT ck_order_line_qty CHECK ((qty > 0))
);


ALTER TABLE ecommerce.order_line OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 18843)
-- Name: order_line_order_line_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.order_line_order_line_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.order_line_order_line_id_seq OWNER TO postgres;

--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 237
-- Name: order_line_order_line_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.order_line_order_line_id_seq OWNED BY ecommerce.order_line.order_line_id;


--
-- TOC entry 228 (class 1259 OID 18754)
-- Name: product; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.product (
    product_id integer NOT NULL,
    category_id integer,
    name character varying(255) NOT NULL,
    description text,
    product_image character varying(255),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE ecommerce.product OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 18742)
-- Name: product_category; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.product_category (
    category_id integer NOT NULL,
    parent_category_id integer,
    category_name character varying(100)
);


ALTER TABLE ecommerce.product_category OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 18741)
-- Name: product_category_category_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.product_category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.product_category_category_id_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 225
-- Name: product_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.product_category_category_id_seq OWNED BY ecommerce.product_category.category_id;


--
-- TOC entry 245 (class 1259 OID 18911)
-- Name: product_configuration; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.product_configuration (
    product_item_id integer NOT NULL,
    variation_option_id integer NOT NULL
);


ALTER TABLE ecommerce.product_configuration OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 18768)
-- Name: product_item; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.product_item (
    product_item_id integer NOT NULL,
    product_id integer,
    sku character varying(100) NOT NULL,
    qty_in_stock integer DEFAULT 0,
    product_image character varying(255),
    price numeric(10,2),
    CONSTRAINT ck_product_item_price CHECK (((price IS NULL) OR (price >= (0)::numeric))),
    CONSTRAINT ck_product_item_qty CHECK ((qty_in_stock >= 0))
);


ALTER TABLE ecommerce.product_item OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 18767)
-- Name: product_item_product_item_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.product_item_product_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.product_item_product_item_id_seq OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 229
-- Name: product_item_product_item_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.product_item_product_item_id_seq OWNED BY ecommerce.product_item.product_item_id;


--
-- TOC entry 227 (class 1259 OID 18753)
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.product_product_id_seq OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_product_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.product_product_id_seq OWNED BY ecommerce.product.product_id;


--
-- TOC entry 247 (class 1259 OID 18927)
-- Name: promotion; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.promotion (
    promotion_id integer NOT NULL,
    category_id integer,
    name character varying(255),
    description text,
    discount_rate numeric(5,2),
    start_date date,
    end_date date,
    CONSTRAINT ck_promo_dates CHECK (((start_date IS NULL) OR (end_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT promotion_discount_rate_check CHECK (((discount_rate >= (0)::numeric) AND (discount_rate <= (100)::numeric)))
);


ALTER TABLE ecommerce.promotion OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 18926)
-- Name: promotion_promotion_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.promotion_promotion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.promotion_promotion_id_seq OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 246
-- Name: promotion_promotion_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.promotion_promotion_id_seq OWNED BY ecommerce.promotion.promotion_id;


--
-- TOC entry 236 (class 1259 OID 18824)
-- Name: shop_order; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.shop_order (
    order_id integer NOT NULL,
    user_id integer,
    payment_type_name character varying(50),
    payment_provider character varying(100),
    payment_account_number character varying(100),
    payment_status character varying(50),
    payment_date timestamp without time zone,
    shipping_address_id integer,
    shipping_method_name character varying(100),
    shipping_price numeric(10,2),
    order_status character varying(50),
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    order_total numeric(10,2),
    CONSTRAINT ck_order_total CHECK (((order_total IS NULL) OR (order_total >= (0)::numeric))),
    CONSTRAINT ck_shipping_price CHECK (((shipping_price IS NULL) OR (shipping_price >= (0)::numeric)))
);


ALTER TABLE ecommerce.shop_order OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 18823)
-- Name: shop_order_order_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.shop_order_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.shop_order_order_id_seq OWNER TO postgres;

--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 235
-- Name: shop_order_order_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.shop_order_order_id_seq OWNED BY ecommerce.shop_order.order_id;


--
-- TOC entry 224 (class 1259 OID 18730)
-- Name: shopping_cart; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.shopping_cart (
    cart_id integer NOT NULL,
    user_id integer
);


ALTER TABLE ecommerce.shopping_cart OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 18729)
-- Name: shopping_cart_cart_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.shopping_cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.shopping_cart_cart_id_seq OWNER TO postgres;

--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 223
-- Name: shopping_cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.shopping_cart_cart_id_seq OWNED BY ecommerce.shopping_cart.cart_id;


--
-- TOC entry 234 (class 1259 OID 18805)
-- Name: shopping_cart_item; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.shopping_cart_item (
    cart_item_id integer NOT NULL,
    cart_id integer,
    product_item_id integer,
    qty integer DEFAULT 1,
    custom_product_id integer,
    is_customed boolean,
    CONSTRAINT ck_cart_item_qty CHECK ((qty > 0))
);


ALTER TABLE ecommerce.shopping_cart_item OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 18804)
-- Name: shopping_cart_item_cart_item_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.shopping_cart_item_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.shopping_cart_item_cart_item_id_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 233
-- Name: shopping_cart_item_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.shopping_cart_item_cart_item_id_seq OWNED BY ecommerce.shopping_cart_item.cart_item_id;


--
-- TOC entry 220 (class 1259 OID 18705)
-- Name: site_user; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.site_user (
    user_id integer NOT NULL,
    full_name character varying(255),
    user_avatar character varying(255),
    email_address character varying(255) NOT NULL,
    phone_number character varying(20),
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'USER'::character varying NOT NULL
);


ALTER TABLE ecommerce.site_user OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN site_user.role; Type: COMMENT; Schema: ecommerce; Owner: postgres
--

COMMENT ON COLUMN ecommerce.site_user.role IS 'User role: USER, ADMIN, MANAGER, etc.';


--
-- TOC entry 219 (class 1259 OID 18704)
-- Name: site_user_user_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.site_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.site_user_user_id_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 219
-- Name: site_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.site_user_user_id_seq OWNED BY ecommerce.site_user.user_id;


--
-- TOC entry 240 (class 1259 OID 18868)
-- Name: user_review; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.user_review (
    review_id integer NOT NULL,
    user_id integer,
    ordered_product_id integer,
    rating_value integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_review_rating_value_check CHECK (((rating_value >= 1) AND (rating_value <= 5)))
);


ALTER TABLE ecommerce.user_review OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 18867)
-- Name: user_review_review_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.user_review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.user_review_review_id_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 239
-- Name: user_review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.user_review_review_id_seq OWNED BY ecommerce.user_review.review_id;


--
-- TOC entry 242 (class 1259 OID 18888)
-- Name: variation; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.variation (
    variation_id integer NOT NULL,
    category_id integer,
    name character varying(100) NOT NULL
);


ALTER TABLE ecommerce.variation OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 18900)
-- Name: variation_option; Type: TABLE; Schema: ecommerce; Owner: postgres
--

CREATE TABLE ecommerce.variation_option (
    variation_option_id integer NOT NULL,
    variation_id integer,
    value character varying(100) NOT NULL
);


ALTER TABLE ecommerce.variation_option OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 18899)
-- Name: variation_option_variation_option_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.variation_option_variation_option_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.variation_option_variation_option_id_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 243
-- Name: variation_option_variation_option_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.variation_option_variation_option_id_seq OWNED BY ecommerce.variation_option.variation_option_id;


--
-- TOC entry 241 (class 1259 OID 18887)
-- Name: variation_variation_id_seq; Type: SEQUENCE; Schema: ecommerce; Owner: postgres
--

CREATE SEQUENCE ecommerce.variation_variation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE ecommerce.variation_variation_id_seq OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 241
-- Name: variation_variation_id_seq; Type: SEQUENCE OWNED BY; Schema: ecommerce; Owner: postgres
--

ALTER SEQUENCE ecommerce.variation_variation_id_seq OWNED BY ecommerce.variation.variation_id;


--
-- TOC entry 4759 (class 2604 OID 18953)
-- Name: address address_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.address ALTER COLUMN address_id SET DEFAULT nextval('ecommerce.address_address_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 18994)
-- Name: contact_message message_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.contact_message ALTER COLUMN message_id SET DEFAULT nextval('ecommerce.contact_message_message_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 18788)
-- Name: custom_product custom_product_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.custom_product ALTER COLUMN custom_product_id SET DEFAULT nextval('ecommerce.custom_product_custom_product_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 18986)
-- Name: order_line order_line_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.order_line ALTER COLUMN order_line_id SET DEFAULT nextval('ecommerce.order_line_order_line_id_seq'::regclass);


--
-- TOC entry 4763 (class 2604 OID 18757)
-- Name: product product_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product ALTER COLUMN product_id SET DEFAULT nextval('ecommerce.product_product_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 18745)
-- Name: product_category category_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_category ALTER COLUMN category_id SET DEFAULT nextval('ecommerce.product_category_category_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 18987)
-- Name: product_item product_item_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_item ALTER COLUMN product_item_id SET DEFAULT nextval('ecommerce.product_item_product_item_id_seq'::regclass);


--
-- TOC entry 4779 (class 2604 OID 18930)
-- Name: promotion promotion_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.promotion ALTER COLUMN promotion_id SET DEFAULT nextval('ecommerce.promotion_promotion_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 18985)
-- Name: shop_order order_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shop_order ALTER COLUMN order_id SET DEFAULT nextval('ecommerce.shop_order_order_id_seq'::regclass);


--
-- TOC entry 4761 (class 2604 OID 18984)
-- Name: shopping_cart cart_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart ALTER COLUMN cart_id SET DEFAULT nextval('ecommerce.shopping_cart_cart_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 18983)
-- Name: shopping_cart_item cart_item_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart_item ALTER COLUMN cart_item_id SET DEFAULT nextval('ecommerce.shopping_cart_item_cart_item_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 18708)
-- Name: site_user user_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.site_user ALTER COLUMN user_id SET DEFAULT nextval('ecommerce.site_user_user_id_seq'::regclass);


--
-- TOC entry 4775 (class 2604 OID 18871)
-- Name: user_review review_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.user_review ALTER COLUMN review_id SET DEFAULT nextval('ecommerce.user_review_review_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 18891)
-- Name: variation variation_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation ALTER COLUMN variation_id SET DEFAULT nextval('ecommerce.variation_variation_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 18903)
-- Name: variation_option variation_option_id; Type: DEFAULT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation_option ALTER COLUMN variation_option_id SET DEFAULT nextval('ecommerce.variation_option_variation_option_id_seq'::regclass);


--
-- TOC entry 5008 (class 0 OID 18717)
-- Dependencies: 222
-- Data for Name: address; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.address VALUES (1, 1, NULL, '12', 'Đường Lê Lợi, P. Bến Nghé, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (2, 2, NULL, '45', 'Đường Trần Hưng Đạo, P. Phú Nhuận, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (3, 3, NULL, '78', 'Đường Nguyễn Trãi, P. Mỹ Đình, Hà Nội', false);
INSERT INTO ecommerce.address VALUES (4, 4, NULL, '21', 'Đường Hoàng Diệu, P. Hải Châu 1, Đà Nẵng', false);
INSERT INTO ecommerce.address VALUES (5, 5, NULL, '56', 'Đường Trần Phú, P. Lộc Thọ, Nha Trang', false);
INSERT INTO ecommerce.address VALUES (6, 6, NULL, '33', 'Đường Điện Biên Phủ, P. 25, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (7, 7, NULL, '14', 'Đường Nguyễn Huệ, P. Bến Nghé, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (8, 8, NULL, '90', 'Đường Lý Thường Kiệt, P. Cửa Nam, Hà Nội', false);
INSERT INTO ecommerce.address VALUES (9, 9, NULL, '27', 'Đường Bạch Đằng, P. Hải Châu 2, Đà Nẵng', false);
INSERT INTO ecommerce.address VALUES (10, 10, NULL, '63', 'Đường Nguyễn Thái Học, P. Phước Tiến, Nha Trang', false);
INSERT INTO ecommerce.address VALUES (11, 11, NULL, '18', 'Đường Quang Trung, P. Hồng Bàng, Hải Phòng', false);
INSERT INTO ecommerce.address VALUES (12, 12, NULL, '52', 'Đường Cách Mạng Tháng 8, P. An Thới, Cần Thơ', false);
INSERT INTO ecommerce.address VALUES (13, 13, NULL, '36', 'Đường Hùng Vương, P. Trường An, Huế', false);
INSERT INTO ecommerce.address VALUES (14, 14, NULL, '11', 'Đường Lê Duẩn, P. Tràng Tiền, Hà Nội', false);
INSERT INTO ecommerce.address VALUES (15, 15, NULL, '75', 'Đường 30/4, P. Hưng Lợi, Cần Thơ', false);
INSERT INTO ecommerce.address VALUES (16, 16, NULL, '29', 'Đường Trần Quang Khải, P. Thống Nhất, Biên Hòa', false);
INSERT INTO ecommerce.address VALUES (17, 17, NULL, '44', 'Đường Nguyễn Công Trứ, P. Vĩnh Ninh, Huế', false);
INSERT INTO ecommerce.address VALUES (18, 18, NULL, '68', 'Đường Phan Chu Trinh, P. Hải Cảng, Quy Nhơn', false);
INSERT INTO ecommerce.address VALUES (19, 19, NULL, '22', 'Đường Nguyễn Văn Cừ, P. An Khánh, Cần Thơ', false);
INSERT INTO ecommerce.address VALUES (20, 20, NULL, '39', 'Phố Huế, P. Phố Huế, Hà Nội', false);
INSERT INTO ecommerce.address VALUES (21, 21, NULL, '47', 'Đường Trường Chinh, P. Tây Thạnh, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (22, 22, NULL, '58', 'Đường Võ Văn Tần, P. 6, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (23, 23, NULL, '13', 'Đường Kim Mã, P. Kim Mã, Hà Nội', false);
INSERT INTO ecommerce.address VALUES (24, 24, NULL, '41', 'Đường Nguyễn Trãi, P. Lộc Thọ, Nha Trang', false);
INSERT INTO ecommerce.address VALUES (25, 25, NULL, '24', 'Đường Nguyễn Đình Chiểu, P. Đa Kao, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (26, 26, NULL, '34', 'Đường Lạch Tray, P. Lạch Tray, Hải Phòng', false);
INSERT INTO ecommerce.address VALUES (27, 27, NULL, '55', 'Đường Trần Hưng Đạo, P. Quyết Thắng, Biên Hòa', false);
INSERT INTO ecommerce.address VALUES (28, 28, NULL, '17', 'Đường Bà Triệu, P. Vĩnh Ninh, Huế', false);
INSERT INTO ecommerce.address VALUES (29, 29, NULL, '66', 'Đường Nguyễn Thị Minh Khai, P. Bến Thành, TP. Hồ Chí Minh', false);
INSERT INTO ecommerce.address VALUES (51, 30, '', '1999 Quan Nhân', '1999 Quan Nhân, Xã Tây Vinh, Huyện Tây Sơn, Tỉnh Bình Định', false);
INSERT INTO ecommerce.address VALUES (52, 31, '', '19 Quan Nhân', '19 Quan Nhân, Xã Bình Ba, Huyện Châu Đức, Tỉnh Bà Rịa - Vũng Tàu', false);
INSERT INTO ecommerce.address VALUES (53, 39, '', '19 Quan Nhân', '19 Quan Nhân, Xã An Phúc, Huyện Đông Hải, Tỉnh Bạc Liêu', false);
INSERT INTO ecommerce.address VALUES (55, 31, '', '19 Quan Nhân', '19 Quan Nhân, Phường Hòa Hiệp Bắc, Quận Liên Chiểu, Thành phố Đà Nẵng', false);
INSERT INTO ecommerce.address VALUES (56, 41, '', '19 Quan Nhân', '19 Quan Nhân, Phường Láng Tròn, Thị xã Giá Rai, Tỉnh Bạc Liêu', false);
INSERT INTO ecommerce.address VALUES (60, 46, '', '199', '199, Xã An Ngãi Tây, Huyện Ba Tri, Tỉnh Bến Tre', false);
INSERT INTO ecommerce.address VALUES (49, 30, '', '19 Quan Nhân', '19 Quan Nhân, Xã Điền Hải, Huyện Đông Hải, Tỉnh Bạc Liêu', false);


--
-- TOC entry 5034 (class 0 OID 18957)
-- Dependencies: 248
-- Data for Name: cart_item_variation_option; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.cart_item_variation_option VALUES (90, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (90, 13);
INSERT INTO ecommerce.cart_item_variation_option VALUES (91, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (91, 13);
INSERT INTO ecommerce.cart_item_variation_option VALUES (97, 4);
INSERT INTO ecommerce.cart_item_variation_option VALUES (97, 12);
INSERT INTO ecommerce.cart_item_variation_option VALUES (98, 8);
INSERT INTO ecommerce.cart_item_variation_option VALUES (98, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (99, 1);
INSERT INTO ecommerce.cart_item_variation_option VALUES (99, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (100, 6);
INSERT INTO ecommerce.cart_item_variation_option VALUES (100, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (101, 4);
INSERT INTO ecommerce.cart_item_variation_option VALUES (101, 12);
INSERT INTO ecommerce.cart_item_variation_option VALUES (42, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (42, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (102, 7);
INSERT INTO ecommerce.cart_item_variation_option VALUES (102, 12);
INSERT INTO ecommerce.cart_item_variation_option VALUES (190, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (190, 10);
INSERT INTO ecommerce.cart_item_variation_option VALUES (47, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (47, 13);
INSERT INTO ecommerce.cart_item_variation_option VALUES (48, 3);
INSERT INTO ecommerce.cart_item_variation_option VALUES (48, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (192, 2);
INSERT INTO ecommerce.cart_item_variation_option VALUES (192, 11);
INSERT INTO ecommerce.cart_item_variation_option VALUES (193, 1);
INSERT INTO ecommerce.cart_item_variation_option VALUES (193, 13);
INSERT INTO ecommerce.cart_item_variation_option VALUES (200, 7);
INSERT INTO ecommerce.cart_item_variation_option VALUES (200, 12);
INSERT INTO ecommerce.cart_item_variation_option VALUES (202, 1);
INSERT INTO ecommerce.cart_item_variation_option VALUES (202, 11);


--
-- TOC entry 5036 (class 0 OID 18991)
-- Dependencies: 250
-- Data for Name: contact_message; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.contact_message VALUES (1, NULL, 'Tan Nguyen', 'wangtaocaibong@gmail.com', '0972415526', 'ai-tryon', 'aaa', 'NEW', '2025-11-13 09:40:13.070991');
INSERT INTO ecommerce.contact_message VALUES (2, 31, 'Tan Nguyen', 'wangtaocaibong@gmail.com', '0972415526', 'ai-tryon', 'Thử như nào vậy', 'NEW', '2025-11-13 17:10:33.582019');
INSERT INTO ecommerce.contact_message VALUES (3, 31, 'Tan Nguyen', 'wangtaocaibong@gmail.com', '0972415526', 'custom-design', 'abcde
', 'NEW', '2025-11-14 03:56:40.366823');
INSERT INTO ecommerce.contact_message VALUES (4, 46, 'Tan Nguyen', 'wangtaocaibong@gmail.com', '0972415526', 'order', 'how to create a order ?', 'NEW', '2025-11-14 06:41:25.33311');
INSERT INTO ecommerce.contact_message VALUES (5, 30, 'Nguyễn Văn Tân', 'vantann0509@gmail.com', '0972415526', 'ai-tryon', 'aaa', 'NEW', '2025-11-14 08:56:35.095488');


--
-- TOC entry 5018 (class 0 OID 18785)
-- Dependencies: 232
-- Data for Name: custom_product; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.custom_product VALUES (1, 1, 3, 'Áo Hello World', NULL, NULL, NULL, 'cp1.png', NULL, '2025-09-21 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (3, 3, 5, 'Áo Brown Mood', NULL, NULL, NULL, 'cp3.png', NULL, '2025-09-25 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (4, 8, 6, 'Áo Hoa Cúc Peace', NULL, NULL, NULL, 'cp4.png', NULL, '2025-09-26 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (5, 9, 7, 'Áo Goku Fire', NULL, NULL, NULL, 'cp5.png', NULL, '2025-09-28 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (6, 10, 8, 'Áo Pepe Chill', NULL, NULL, NULL, 'cp6.png', NULL, '2025-10-01 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (7, 13, 9, 'Áo Guts Hero', NULL, NULL, NULL, 'cp7.png', NULL, '2025-10-02 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (8, 15, 10, 'Áo Red Daisy', NULL, NULL, NULL, 'cp8.png', NULL, '2025-10-04 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (9, 16, 11, 'Áo White Daisy', NULL, NULL, NULL, 'cp9.png', NULL, '2025-10-06 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (11, 14, 13, 'Áo Goku Spirit', NULL, NULL, NULL, 'cp11.png', NULL, '2025-10-10 13:12:57.872657');
INSERT INTO ecommerce.custom_product VALUES (2, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/bcdd48605de74711bf53c5b98261345a.png', NULL, '2025-11-12 16:47:16.988951');
INSERT INTO ecommerce.custom_product VALUES (10, NULL, NULL, 'Áo của tôii', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/165b7c42f5a040de933385808fe31f43.png', NULL, '2025-11-12 16:48:47.096055');
INSERT INTO ecommerce.custom_product VALUES (12, NULL, NULL, 'Áo của tôii', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/063bd85d09694fb49cc9144b56a5b056.png', NULL, '2025-11-12 16:48:59.902791');
INSERT INTO ecommerce.custom_product VALUES (13, NULL, NULL, 'Áo của tôii', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/2c1bcbb1980e4764bc7eabe8c35eef1d.png', NULL, '2025-11-12 16:49:02.256099');
INSERT INTO ecommerce.custom_product VALUES (14, NULL, NULL, 'Áo của tôii', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/67845d340eeb4f6bb1e0727341f3dfab.png', NULL, '2025-11-12 16:49:03.997791');
INSERT INTO ecommerce.custom_product VALUES (15, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/a67a87b26d6c455aac46774d6a30b2c3.png', NULL, '2025-11-12 16:54:15.150544');
INSERT INTO ecommerce.custom_product VALUES (16, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/69d3463b42714500b31b78716a0f7bbe.png', NULL, '2025-11-13 00:14:07.525531');
INSERT INTO ecommerce.custom_product VALUES (17, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/b80b0517b7584815bc8104dbefdf8d24.png', NULL, '2025-11-13 09:53:26.87223');
INSERT INTO ecommerce.custom_product VALUES (18, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/827f0193e15e4504bc6a2e620f38741b.png', NULL, '2025-11-13 18:29:25.430427');
INSERT INTO ecommerce.custom_product VALUES (19, NULL, 31, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/0dacccd979f6476696bccf215681f178.png', NULL, '2025-11-13 20:15:23.987657');
INSERT INTO ecommerce.custom_product VALUES (20, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/8d01f2c29b4848018763b9f1b2f3e642.png', NULL, '2025-11-13 20:20:18.38354');
INSERT INTO ecommerce.custom_product VALUES (21, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/4bf7b06d1d934431b412b5528b6a6d24.png', NULL, '2025-11-13 21:41:11.663747');
INSERT INTO ecommerce.custom_product VALUES (22, NULL, NULL, 'Áo của tôi', NULL, NULL, NULL, 'http://localhost:8080/CustomProduct/5f4d3f5998914342909b54b6e2aa4bfe.png', NULL, '2025-11-13 21:49:39.835928');


--
-- TOC entry 5024 (class 0 OID 18844)
-- Dependencies: 238
-- Data for Name: order_line; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.order_line VALUES (1, 1, 1, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (2, 8, 2, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (3, 9, 3, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (5, 11, 5, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (7, 10, 7, 1, 260000, NULL);
INSERT INTO ecommerce.order_line VALUES (8, 4, 8, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (9, 6, 9, 1, 195000, NULL);
INSERT INTO ecommerce.order_line VALUES (10, 12, 10, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (11, 13, 11, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (12, 14, 12, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (13, 7, 13, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (14, 15, 14, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (15, 16, 15, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (30, 3, 30, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (6, NULL, 6, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (4, NULL, 4, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (31, 15, 40, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (26, NULL, 26, 1, 230000, NULL);
INSERT INTO ecommerce.order_line VALUES (16, NULL, 16, 1, 230000, NULL);
INSERT INTO ecommerce.order_line VALUES (17, NULL, 17, 1, 230000, NULL);
INSERT INTO ecommerce.order_line VALUES (18, NULL, 18, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (19, NULL, 19, 1, 300000, NULL);
INSERT INTO ecommerce.order_line VALUES (20, NULL, 20, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (21, NULL, 21, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (22, NULL, 22, 1, 220000, NULL);
INSERT INTO ecommerce.order_line VALUES (23, NULL, 23, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (24, NULL, 24, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (25, NULL, 25, 1, 230000, NULL);
INSERT INTO ecommerce.order_line VALUES (27, NULL, 27, 1, 230000, NULL);
INSERT INTO ecommerce.order_line VALUES (28, NULL, 28, 1, 240000, NULL);
INSERT INTO ecommerce.order_line VALUES (29, NULL, 29, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (32, 4, 41, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (33, 4, 42, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (34, 1, 43, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (35, 1, 43, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (36, 9, 43, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (37, 10, 44, 1, 260000, NULL);
INSERT INTO ecommerce.order_line VALUES (38, 12, 44, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (39, 13, 45, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (40, 13, 46, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (41, 13, 47, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (42, 13, 48, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (45, 10, 50, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (46, 10, 51, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (47, 1, 52, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (48, 16, 53, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (49, 9, 54, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (50, 4, 55, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (51, 13, 56, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (52, 13, 57, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (53, 10, 58, 1, 260000, NULL);
INSERT INTO ecommerce.order_line VALUES (54, 16, 59, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (55, 13, 59, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (56, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (57, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (58, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (59, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (60, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (61, 16, 60, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (62, 13, 60, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (63, 13, 60, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (64, 13, 61, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (65, 13, 62, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (66, 13, 63, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (67, 12, 64, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (68, 12, 65, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (69, 12, 66, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (70, 12, 67, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (74, 12, 71, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (75, 13, 72, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (76, 13, 73, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (77, 13, 74, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (78, 1, 75, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (79, 13, 75, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (82, 3, 78, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (84, 3, 80, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (85, 4, 81, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (87, 9, 83, 1, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (88, 3, 84, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (83, NULL, 79, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (86, NULL, 82, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (89, 13, 85, 1, 290000, NULL);
INSERT INTO ecommerce.order_line VALUES (90, 34, 86, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (91, 15, 86, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (92, 34, 87, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (93, 15, 87, 1, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (94, 34, 88, 3, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (95, 15, 88, 4, 250000, NULL);
INSERT INTO ecommerce.order_line VALUES (96, 34, 89, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (97, 4, 90, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (98, 4, 91, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (99, 4, 92, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (100, 34, 93, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (101, 4, 94, 1, 185000, NULL);
INSERT INTO ecommerce.order_line VALUES (102, 14, 95, 4, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (103, 1, 96, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (104, 1, 97, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (105, 1, 98, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (106, 1, 99, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (107, 1, 100, 6, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (108, 1, 101, 19, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (109, 34, 102, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (110, 34, 103, 4, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (111, 34, 104, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (112, 34, 105, 7, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (113, 34, 106, 1, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (114, 34, 107, 2, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (115, 34, 108, 4, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (116, 34, 109, 4, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (117, 11, 109, 4, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (118, 9, 110, 3, 280000, NULL);
INSERT INTO ecommerce.order_line VALUES (119, 34, 111, 3, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (120, 34, 112, 2, 200000, NULL);
INSERT INTO ecommerce.order_line VALUES (121, 1, 113, 2, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (122, 1, 114, 4, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (123, 1, 115, 3, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (124, 1, 116, 1, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (125, 1, 117, 2, 190000, NULL);
INSERT INTO ecommerce.order_line VALUES (126, 1, 118, 1, 190000, NULL);


--
-- TOC entry 5014 (class 0 OID 18754)
-- Dependencies: 228
-- Data for Name: product; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.product VALUES (1, 1, 'Áo thun trơn trắng', 'Áo thun cotton 100%, trơn màu trắng, chất vải dày mịn, thấm hút mồ hôi tốt, ảnh mặt trước áo trơn.', '1a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (51, 1, 'anh ', 'aa', '9eb9e87b-8890-47a2-b669-05dcc696a358_AAA.jpg', '2025-11-14 15:51:16.60706', '2025-11-14 15:51:16.600869');
INSERT INTO ecommerce.product VALUES (3, 1, 'Áo thun trơn nâu', 'Áo thun cotton màu nâu đất, không in hình, phong cách tối giản.', '3a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (4, 1, 'Áo thun trơn hồng', 'Áo thun cotton màu hồng pastel, trơn, mềm mại, phù hợp nữ.', '4a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (6, 1, 'Áo thun trơn xanh nước biển', 'Áo thun cotton màu xanh nước biển, trơn, chất vải thoáng mát.', '6a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (7, 1, 'Áo thun trơn xanh lá', 'Áo thun cotton màu xanh lá cây, trơn, năng động và trẻ trung.', '7a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (12, 1, 'Áo thun trơn đỏ', 'Áo thun cotton đỏ, trơn, không hình in, form unisex.', '12a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (8, 4, 'Áo thun đen logo hoa cúc', 'Áo thun đen cotton, logo hoa cúc nhỏ in ở ngực trái, ảnh mặt trước logo nhỏ.', '8a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (9, 2, 'Áo thun đen hình Goku', 'Áo thun đen cotton, in hình Goku to chính giữa áo, ảnh mặt trước hình rõ nét.', '9a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (10, 3, 'Áo thun đen hình Pepe', 'Áo thun đen cotton, in hình Pepe ở giữa áo, phong cách vui nhộn.', '10a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (11, 2, 'Áo thun đỏ hình Goku', 'Áo thun đỏ cotton, in hình Goku ở trung tâm áo, hình in to.', '11a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (13, 2, 'Áo thun đỏ hình Guts', 'Áo thun đỏ cotton, in hình Guts (Berserk) giữa áo, ảnh mặt trước hình rõ.', '13a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (14, 2, 'Áo thun trắng hình Goku', 'Áo thun trắng cotton, in hình Goku ở giữa ngực, ảnh chính diện.', '14a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (15, 4, 'Áo thun đỏ hoa cúc', 'Áo thun đỏ cotton, logo hoa cúc nhỏ in ở ngực trái.', '15a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (16, 4, 'Áo thun trắng hoa cúc', 'Áo thun trắng cotton, logo hoa cúc nhỏ in ở ngực trái.', '16a.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');
INSERT INTO ecommerce.product VALUES (32, 1, 'Áo thun trơn đen', 'Áo cotton 100%', 'a1871bde-fb33-4eb2-ae07-10f4fd9a53a4_design_Mẫu_2_1762542583675.png', '2025-11-08 07:25:16.446585', '2025-11-08 07:25:16.446585');


--
-- TOC entry 5012 (class 0 OID 18742)
-- Dependencies: 226
-- Data for Name: product_category; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.product_category VALUES (1, NULL, 'Áo thun trơn');
INSERT INTO ecommerce.product_category VALUES (2, NULL, 'Áo thun anime');
INSERT INTO ecommerce.product_category VALUES (3, NULL, 'Áo thun pepe');
INSERT INTO ecommerce.product_category VALUES (4, NULL, 'Áo thun hoạ tiết đơn giản');


--
-- TOC entry 5031 (class 0 OID 18911)
-- Dependencies: 245
-- Data for Name: product_configuration; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.product_configuration VALUES (1, 1);
INSERT INTO ecommerce.product_configuration VALUES (1, 11);
INSERT INTO ecommerce.product_configuration VALUES (3, 6);
INSERT INTO ecommerce.product_configuration VALUES (3, 11);
INSERT INTO ecommerce.product_configuration VALUES (4, 4);
INSERT INTO ecommerce.product_configuration VALUES (4, 12);
INSERT INTO ecommerce.product_configuration VALUES (8, 6);
INSERT INTO ecommerce.product_configuration VALUES (8, 13);
INSERT INTO ecommerce.product_configuration VALUES (6, 7);
INSERT INTO ecommerce.product_configuration VALUES (6, 12);
INSERT INTO ecommerce.product_configuration VALUES (7, 8);
INSERT INTO ecommerce.product_configuration VALUES (7, 11);
INSERT INTO ecommerce.product_configuration VALUES (9, 2);
INSERT INTO ecommerce.product_configuration VALUES (9, 11);
INSERT INTO ecommerce.product_configuration VALUES (10, 2);
INSERT INTO ecommerce.product_configuration VALUES (10, 10);
INSERT INTO ecommerce.product_configuration VALUES (11, 10);
INSERT INTO ecommerce.product_configuration VALUES (12, 3);
INSERT INTO ecommerce.product_configuration VALUES (12, 10);
INSERT INTO ecommerce.product_configuration VALUES (11, 3);
INSERT INTO ecommerce.product_configuration VALUES (13, 3);
INSERT INTO ecommerce.product_configuration VALUES (13, 11);
INSERT INTO ecommerce.product_configuration VALUES (15, 3);
INSERT INTO ecommerce.product_configuration VALUES (15, 10);
INSERT INTO ecommerce.product_configuration VALUES (34, 2);
INSERT INTO ecommerce.product_configuration VALUES (34, 10);
INSERT INTO ecommerce.product_configuration VALUES (16, 1);
INSERT INTO ecommerce.product_configuration VALUES (16, 13);
INSERT INTO ecommerce.product_configuration VALUES (14, 1);
INSERT INTO ecommerce.product_configuration VALUES (14, 10);
INSERT INTO ecommerce.product_configuration VALUES (57, 1);
INSERT INTO ecommerce.product_configuration VALUES (57, 11);


--
-- TOC entry 5016 (class 0 OID 18768)
-- Dependencies: 230
-- Data for Name: product_item; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.product_item VALUES (1, 1, 'AT-TRON-TRANG', 120, '1a.png', 190000.00);
INSERT INTO ecommerce.product_item VALUES (57, 51, 'aaa', 12, '72b31872-3b41-4d70-895c-9fa77d57bbde_AAA.jpg', 12.00);
INSERT INTO ecommerce.product_item VALUES (3, 3, 'AT-TRON-NAU', 80, '3a.png', 190000.00);
INSERT INTO ecommerce.product_item VALUES (4, 4, 'AT-TRON-HONG', 90, '4a.png', 185000.00);
INSERT INTO ecommerce.product_item VALUES (6, 6, 'AT-TRON-XANH-NB', 110, '6a.png', 195000.00);
INSERT INTO ecommerce.product_item VALUES (7, 7, 'AT-TRON-XANH-LA', 95, '7a.png', 185000.00);
INSERT INTO ecommerce.product_item VALUES (9, 9, 'AT-DEN-GOKU', 60, '9a.png', 280000.00);
INSERT INTO ecommerce.product_item VALUES (10, 10, 'AT-DEN-PEPE', 50, '10a.png', 260000.00);
INSERT INTO ecommerce.product_item VALUES (11, 11, 'AT-DO-GOKU', 55, '11a.png', 280000.00);
INSERT INTO ecommerce.product_item VALUES (12, 12, 'AT-TRON-DO', 120, '12a.png', 190000.00);
INSERT INTO ecommerce.product_item VALUES (13, 13, 'AT-DO-GUTS', 50, '13a.png', 290000.00);
INSERT INTO ecommerce.product_item VALUES (14, 14, 'AT-TRANG-GOKU', 65, '14a.png', 280000.00);
INSERT INTO ecommerce.product_item VALUES (15, 15, 'AT-DO-HOA-CUC', 85, '15a.png', 250000.00);
INSERT INTO ecommerce.product_item VALUES (16, 16, 'AT-TRANG-HOA-CUC', 100, '16a.png', 250000.00);
INSERT INTO ecommerce.product_item VALUES (8, 8, 'AT-DEN-HOA-CUC', 70, '8a.png', 249999.99);
INSERT INTO ecommerce.product_item VALUES (34, 32, 'PREM-BLK-M', 100, 'c6c0ad31-c1b6-4a3a-a234-eb70b425d5d5_2a.png', 200000.00);


--
-- TOC entry 5033 (class 0 OID 18927)
-- Dependencies: 247
-- Data for Name: promotion; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.promotion VALUES (6, 2, 'Sale 04/11', 'Giảm giá 20% cho toàn bộ Áo thun', 20.00, '2025-11-08', '2025-11-08');


--
-- TOC entry 5022 (class 0 OID 18824)
-- Dependencies: 236
-- Data for Name: shop_order; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.shop_order VALUES (1, 3, 'Thẻ tín dụng', 'VISA', '4111111111111111', 'Đã thanh toán', '2025-09-16 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-09-19 13:12:57.872657', 255000.00);
INSERT INTO ecommerce.shop_order VALUES (2, 4, 'Ví điện tử', 'Momo', '0989123456', 'Đã thanh toán', '2025-09-18 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-09-20 13:12:57.872657', 290000.00);
INSERT INTO ecommerce.shop_order VALUES (3, 5, 'Chuyển khoản', 'Techcombank', '1903219988888', 'Đã thanh toán', '2025-09-21 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-09-23 13:12:57.872657', 310000.00);
INSERT INTO ecommerce.shop_order VALUES (4, 6, 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang xử lý', '2025-09-24 13:12:57.872657', 215000.00);
INSERT INTO ecommerce.shop_order VALUES (5, 7, 'Thẻ tín dụng', 'MasterCard', '5555555555554444', 'Đã thanh toán', '2025-09-25 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đã giao', '2025-09-27 13:12:57.872657', 320000.00);
INSERT INTO ecommerce.shop_order VALUES (6, 8, 'Ví điện tử', 'ZaloPay', '0908999222', 'Đã thanh toán', '2025-09-26 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-09-28 13:12:57.872657', 260000.00);
INSERT INTO ecommerce.shop_order VALUES (8, 10, 'Ví điện tử', 'ShopeePay', '0903777333', 'Đã thanh toán', '2025-09-28 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-09-30 13:12:57.872657', 210000.00);
INSERT INTO ecommerce.shop_order VALUES (9, 11, 'Chuyển khoản', 'Vietcombank', '1019988777', 'Đã thanh toán', '2025-09-29 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-01 13:12:57.872657', 295000.00);
INSERT INTO ecommerce.shop_order VALUES (10, 12, 'Thẻ ghi nợ', 'JCB', '3530111333300000', 'Đã thanh toán', '2025-09-30 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-10-02 13:12:57.872657', 330000.00);
INSERT INTO ecommerce.shop_order VALUES (11, 13, 'Ví điện tử', 'Momo', '0905666888', 'Đã thanh toán', '2025-10-01 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-03 13:12:57.872657', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (12, 14, 'Thẻ tín dụng', 'VISA', '4111333344445555', 'Đã thanh toán', '2025-10-02 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-10-04 13:12:57.872657', 320000.00);
INSERT INTO ecommerce.shop_order VALUES (13, 15, 'Ví điện tử', 'Momo', '0905222111', 'Đã thanh toán', '2025-10-03 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-05 13:12:57.872657', 270000.00);
INSERT INTO ecommerce.shop_order VALUES (14, 16, 'Chuyển khoản', 'Agribank', '220011110000', 'Đã thanh toán', '2025-10-04 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đã giao', '2025-10-06 13:12:57.872657', 310000.00);
INSERT INTO ecommerce.shop_order VALUES (15, 17, 'Thẻ tín dụng', 'VISA', '4000000000000002', 'Đã thanh toán', '2025-10-05 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-07 13:12:57.872657', 260000.00);
INSERT INTO ecommerce.shop_order VALUES (16, 18, 'Ví điện tử', 'ZaloPay', '0909999000', 'Đã thanh toán', '2025-10-06 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-10-08 13:12:57.872657', 275000.00);
INSERT INTO ecommerce.shop_order VALUES (17, 19, 'Chuyển khoản', 'MB Bank', '9704228888888', 'Đã thanh toán', '2025-10-07 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-09 13:12:57.872657', 300000.00);
INSERT INTO ecommerce.shop_order VALUES (18, 20, 'Thẻ tín dụng', 'MasterCard', '5105105105105100', 'Đã thanh toán', '2025-10-08 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-10-10 13:12:57.872657', 315000.00);
INSERT INTO ecommerce.shop_order VALUES (19, 21, 'Ví điện tử', 'Momo', '0909777666', 'Đã thanh toán', '2025-10-09 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-11 13:12:57.872657', 295000.00);
INSERT INTO ecommerce.shop_order VALUES (20, 22, 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang xử lý', '2025-10-12 13:12:57.872657', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (21, 23, 'Thẻ tín dụng', 'VISA', '4111444455556666', 'Đã thanh toán', '2025-10-12 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-10-13 13:12:57.872657', 310000.00);
INSERT INTO ecommerce.shop_order VALUES (22, 24, 'Ví điện tử', 'ShopeePay', '0903888999', 'Đã thanh toán', '2025-10-13 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang giao', '2025-10-14 13:12:57.872657', 265000.00);
INSERT INTO ecommerce.shop_order VALUES (23, 25, 'Chuyển khoản', 'Techcombank', '1903123456789', 'Đã thanh toán', '2025-10-14 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-15 13:12:57.872657', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (24, 26, 'Ví điện tử', 'Momo', '0909123123', 'Đã thanh toán', '2025-10-15 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang xử lý', '2025-10-16 13:12:57.872657', 250000.00);
INSERT INTO ecommerce.shop_order VALUES (25, 27, 'Thẻ tín dụng', 'VISA', '4000000000000005', 'Đã thanh toán', '2025-10-15 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đã giao', '2025-10-16 13:12:57.872657', 295000.00);
INSERT INTO ecommerce.shop_order VALUES (26, 28, 'Ví điện tử', 'ZaloPay', '0909456789', 'Đã thanh toán', '2025-10-15 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-16 13:12:57.872657', 280000.00);
INSERT INTO ecommerce.shop_order VALUES (27, 29, 'Thẻ ghi nợ', 'JCB', '3530111333300009', 'Đã thanh toán', '2025-10-16 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'Đang giao', '2025-10-16 13:12:57.872657', 310000.00);
INSERT INTO ecommerce.shop_order VALUES (28, 30, 'Ví điện tử', 'ShopeePay', '0904777666', 'Đã thanh toán', '2025-10-16 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-10-16 13:12:57.872657', 290000.00);
INSERT INTO ecommerce.shop_order VALUES (29, 19, 'Chuyển khoản', 'VietinBank', '1009999999', 'Đã thanh toán', '2025-10-16 13:12:57.872657', NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang xử lý', '2025-10-16 13:12:57.872657', 270000.00);
INSERT INTO ecommerce.shop_order VALUES (30, 20, 'Thanh toán khi nhận hàng', 'COD', NULL, 'Chờ thanh toán', NULL, NULL, 'Giao hàng tiêu chuẩn', 25000.00, 'Đang xử lý', '2025-10-16 13:12:57.872657', 215000.00);
INSERT INTO ecommerce.shop_order VALUES (44, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'shipped', '2025-11-12 03:28:12.614006', 485000.00);
INSERT INTO ecommerce.shop_order VALUES (43, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 53, 'Giao nhanh', 35000.00, 'completed', '2025-11-11 05:37:50.40145', 695000.00);
INSERT INTO ecommerce.shop_order VALUES (40, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'completed', '2025-11-08 04:23:29.960949', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (45, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'undefined', '2025-11-12 03:42:02.838887', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (52, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 53, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 15:11:14.76671', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (46, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 13:49:34.710607', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (7, 9, 'Thẻ tín dụng', 'VISA', '4111222233334444', 'Đã thanh toán', '2025-09-27 13:12:57.872657', NULL, 'Giao nhanh', 35000.00, 'shipped', '2025-09-29 13:12:57.872657', 275000.00);
INSERT INTO ecommerce.shop_order VALUES (47, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 53, 'Giao nhanh', 35000.00, 'completed', '2025-11-12 14:18:32.630365', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (48, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 53, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 14:27:36.585425', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (49, 3, 'Ví điện tử', 'Momo', '0912345670', 'Đã thanh toán', '2025-11-07 21:51:55.554289', 1, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-11-09 21:51:55.554289', 215000.00);
INSERT INTO ecommerce.shop_order VALUES (50, 3, 'Ví điện tử', 'Momo', '0912345670', 'Đã thanh toán', '2025-11-07 21:57:20.95609', 1, 'Giao hàng tiêu chuẩn', 25000.00, 'Đã giao', '2025-11-09 21:57:20.95609', 215000.00);
INSERT INTO ecommerce.shop_order VALUES (42, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'shipped', '2025-11-08 06:43:19.527862', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (51, 38, 'Ví điện tử', 'Momo', '0912345670', 'Đã thanh toán', '2025-11-07 21:59:58.784585', 1, 'Giao hàng tiêu chuẩn', 25000.00, 'shipped', '2025-11-09 21:59:58.784585', 215000.00);
INSERT INTO ecommerce.shop_order VALUES (53, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 53, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 15:16:54.062638', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (54, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-12 15:21:57.731897', 53, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 15:21:57.712759', 315000.00);
INSERT INTO ecommerce.shop_order VALUES (55, 39, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-12 15:29:09.415582', 53, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 15:29:09.391182', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (56, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 17:48:12.36251', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (57, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 17:51:24.679429', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (58, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 17:51:50.086271', 295000.00);
INSERT INTO ecommerce.shop_order VALUES (59, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-12 18:07:44.34029', 575000.00);
INSERT INTO ecommerce.shop_order VALUES (61, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 03:25:22.791015', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (62, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 05:24:52.806272', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (63, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 05:49:55.151918', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (64, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 05:59:41.412553', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (65, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 06:18:27.142572', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (41, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 52, 'Giao tiêu chuẩn', 20000.00, 'CANCELLED', '2025-11-08 06:42:20.678512', 205000.00);
INSERT INTO ecommerce.shop_order VALUES (88, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:14:21.617153', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:14:21.609037', 1635000.00);
INSERT INTO ecommerce.shop_order VALUES (89, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:04.031304', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:04.029278', 235000.00);
INSERT INTO ecommerce.shop_order VALUES (66, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 55, 'Giao nhanh', 35000.00, 'CANCELLED', '2025-11-13 06:56:40.785777', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (67, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, 55, 'Giao nhanh', 35000.00, 'CANCELLED', '2025-11-13 06:56:59.530972', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (71, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 11:05:13.848686', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 11:05:13.837122', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (72, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 11:27:38.646057', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 11:27:38.641676', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (90, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:24.794886', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:24.789312', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (73, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 11:39:43.283559', 55, 'Giao nhanh', 35000.00, 'undefined', '2025-11-13 11:39:43.265918', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (74, 31, 'Thanh toán khi nhận hàng', 'Tiền mặt', '', 'Chưa thanh toán', NULL, 55, 'Giao nhanh', 35000.00, 'undefined', '2025-11-13 11:41:57.493878', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (60, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đang chờ', NULL, NULL, 'Giao nhanh', 35000.00, 'undefined', '2025-11-12 18:07:53.894746', 2115000.00);
INSERT INTO ecommerce.shop_order VALUES (75, 41, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 14:48:02.972229', 56, 'Giao nhanh', 35000.00, 'completed', '2025-11-13 14:48:02.95633', 515000.00);
INSERT INTO ecommerce.shop_order VALUES (79, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 18:45:39.616596', 55, 'Giao nhanh', 35000.00, 'completed', '2025-11-13 18:45:39.609014', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (78, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 17:17:41.48153', 55, 'Giao nhanh', 35000.00, 'shipped', '2025-11-13 17:17:41.479784', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (80, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 18:47:54.069596', 55, 'Giao nhanh', 35000.00, 'shipped', '2025-11-13 18:47:54.065093', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (81, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 19:00:56.652673', 55, 'Giao nhanh', 35000.00, 'completed', '2025-11-13 19:00:56.650631', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (82, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 19:04:40.270535', 55, 'Giao nhanh', 35000.00, 'shipped', '2025-11-13 19:04:40.261316', 285000.00);
INSERT INTO ecommerce.shop_order VALUES (83, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 19:04:49.461022', 55, 'Giao nhanh', 35000.00, 'shipped', '2025-11-13 19:04:49.454818', 315000.00);
INSERT INTO ecommerce.shop_order VALUES (84, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 19:46:42.918714', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 19:46:42.917207', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (85, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 21:17:03.576072', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 21:17:03.570745', 325000.00);
INSERT INTO ecommerce.shop_order VALUES (86, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:12:13.381314', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:12:13.371355', 485000.00);
INSERT INTO ecommerce.shop_order VALUES (87, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:12:22.197227', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:12:22.194199', 485000.00);
INSERT INTO ecommerce.shop_order VALUES (91, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:33.377176', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:33.373008', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (92, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:40.255179', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:40.250724', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (93, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:45.461395', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:45.459359', 235000.00);
INSERT INTO ecommerce.shop_order VALUES (94, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-13 22:15:52.172577', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-13 22:15:52.170576', 220000.00);
INSERT INTO ecommerce.shop_order VALUES (95, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:38:04.343937', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:38:04.3293', 1155000.00);
INSERT INTO ecommerce.shop_order VALUES (96, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:38:27.571381', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:38:27.559318', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (97, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:38:39.771197', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:38:39.760147', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (98, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:42:58.432674', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:42:58.419914', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (99, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:43:11.477273', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:43:11.465559', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (100, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:49:10.227609', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:49:10.222484', 1175000.00);
INSERT INTO ecommerce.shop_order VALUES (101, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 01:59:45.817961', 52, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 01:59:45.81142', 3645000.00);
INSERT INTO ecommerce.shop_order VALUES (102, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:00:11.720873', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:00:11.718329', 235000.00);
INSERT INTO ecommerce.shop_order VALUES (103, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:00:28.869723', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:00:28.866687', 835000.00);
INSERT INTO ecommerce.shop_order VALUES (104, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:13:33.999255', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:13:33.994098', 235000.00);
INSERT INTO ecommerce.shop_order VALUES (105, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:13:47.605379', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:13:47.602254', 1435000.00);
INSERT INTO ecommerce.shop_order VALUES (106, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:19:46.151692', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:19:46.148335', 235000.00);
INSERT INTO ecommerce.shop_order VALUES (107, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:19:57.780655', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:19:57.774805', 435000.00);
INSERT INTO ecommerce.shop_order VALUES (110, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:36:09.796377', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:36:09.794366', 875000.00);
INSERT INTO ecommerce.shop_order VALUES (111, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:36:15.05081', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 02:36:15.048253', 635000.00);
INSERT INTO ecommerce.shop_order VALUES (109, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:35:37.058932', 55, 'Giao nhanh', 35000.00, 'cancelled', '2025-11-14 02:35:37.051842', 1955000.00);
INSERT INTO ecommerce.shop_order VALUES (112, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 03:26:17.824436', 55, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 03:26:17.80224', 435000.00);
INSERT INTO ecommerce.shop_order VALUES (113, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 03:56:58.277108', 52, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 03:56:58.267238', 415000.00);
INSERT INTO ecommerce.shop_order VALUES (108, 31, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 02:35:07.569209', 55, 'Giao nhanh', 35000.00, 'completed', '2025-11-14 02:35:07.565165', 835000.00);
INSERT INTO ecommerce.shop_order VALUES (114, 46, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 04:04:49.628305', 60, 'Giao nhanh', 35000.00, 'completed', '2025-11-14 04:04:49.628305', 795000.00);
INSERT INTO ecommerce.shop_order VALUES (115, 46, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 06:29:58.31482', 60, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 06:29:58.255301', 605000.00);
INSERT INTO ecommerce.shop_order VALUES (116, 46, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 06:32:27.965058', 60, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 06:32:27.933401', 225000.00);
INSERT INTO ecommerce.shop_order VALUES (117, 46, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 08:48:39.424835', 60, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 08:48:39.378384', 415000.00);
INSERT INTO ecommerce.shop_order VALUES (118, 30, 'Chuyển khoản ngân hàng', 'VietQR', '4605016865', 'Đã thanh toán', '2025-11-14 08:55:10.189678', 51, 'Giao nhanh', 35000.00, 'Đang xử lý', '2025-11-14 08:55:10.167326', 225000.00);


--
-- TOC entry 5010 (class 0 OID 18730)
-- Dependencies: 224
-- Data for Name: shopping_cart; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.shopping_cart VALUES (1, 3);
INSERT INTO ecommerce.shopping_cart VALUES (2, 4);
INSERT INTO ecommerce.shopping_cart VALUES (3, 5);
INSERT INTO ecommerce.shopping_cart VALUES (4, 6);
INSERT INTO ecommerce.shopping_cart VALUES (5, 7);
INSERT INTO ecommerce.shopping_cart VALUES (6, 8);
INSERT INTO ecommerce.shopping_cart VALUES (7, 9);
INSERT INTO ecommerce.shopping_cart VALUES (8, 10);
INSERT INTO ecommerce.shopping_cart VALUES (9, 11);
INSERT INTO ecommerce.shopping_cart VALUES (10, 12);
INSERT INTO ecommerce.shopping_cart VALUES (11, 13);
INSERT INTO ecommerce.shopping_cart VALUES (12, 14);
INSERT INTO ecommerce.shopping_cart VALUES (13, 15);
INSERT INTO ecommerce.shopping_cart VALUES (14, 16);
INSERT INTO ecommerce.shopping_cart VALUES (15, 17);
INSERT INTO ecommerce.shopping_cart VALUES (16, 18);
INSERT INTO ecommerce.shopping_cart VALUES (17, 19);
INSERT INTO ecommerce.shopping_cart VALUES (18, 20);
INSERT INTO ecommerce.shopping_cart VALUES (19, 21);
INSERT INTO ecommerce.shopping_cart VALUES (20, 22);
INSERT INTO ecommerce.shopping_cart VALUES (21, 23);
INSERT INTO ecommerce.shopping_cart VALUES (22, 24);
INSERT INTO ecommerce.shopping_cart VALUES (23, 25);
INSERT INTO ecommerce.shopping_cart VALUES (24, 26);
INSERT INTO ecommerce.shopping_cart VALUES (25, 27);
INSERT INTO ecommerce.shopping_cart VALUES (26, 28);
INSERT INTO ecommerce.shopping_cart VALUES (27, 29);
INSERT INTO ecommerce.shopping_cart VALUES (28, 30);
INSERT INTO ecommerce.shopping_cart VALUES (29, 31);
INSERT INTO ecommerce.shopping_cart VALUES (30, 39);
INSERT INTO ecommerce.shopping_cart VALUES (31, 38);
INSERT INTO ecommerce.shopping_cart VALUES (33, 41);
INSERT INTO ecommerce.shopping_cart VALUES (37, 46);
INSERT INTO ecommerce.shopping_cart VALUES (38, 47);


--
-- TOC entry 5020 (class 0 OID 18805)
-- Dependencies: 234
-- Data for Name: shopping_cart_item; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.shopping_cart_item VALUES (1, 1, 1, 2, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (3, 3, 8, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (4, 4, 9, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (6, 6, 11, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (7, 7, 10, 2, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (8, 8, 4, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (9, 9, 6, 2, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (10, 10, 12, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (11, 11, 13, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (12, 12, 14, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (13, 13, 15, 2, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (14, 14, 16, 1, NULL, NULL);
INSERT INTO ecommerce.shopping_cart_item VALUES (90, 33, 13, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (91, 33, 13, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (97, 31, 4, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (98, 31, 7, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (99, 31, 1, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (42, 31, 12, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (100, 31, 3, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (101, 31, 4, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (102, 31, 6, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (47, 30, 13, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (48, 30, 12, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (190, 29, 12, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (192, 29, 9, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (193, 29, 16, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (200, 38, 6, 1, NULL, false);
INSERT INTO ecommerce.shopping_cart_item VALUES (202, 29, 57, 2, NULL, false);


--
-- TOC entry 5006 (class 0 OID 18705)
-- Dependencies: 220
-- Data for Name: site_user; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.site_user VALUES (1, 'Nguyễn Văn An', NULL, 'an.nguyen@gmail.com', '0912345670', 'AnNguyen#2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (2, 'Trần Thị Bích', NULL, 'bich.tran@gmail.com', '0938123456', 'BichTran!2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (3, 'Lê Hoàng Long', NULL, 'long.le@gmail.com', '0973555123', 'LongLe@123', 'USER');
INSERT INTO ecommerce.site_user VALUES (4, 'Phạm Minh Đức', NULL, 'duc.pham@gmail.com', '0906789123', 'DucPham*2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (5, 'Hoàng Thị Lan', NULL, 'lan.hoang@gmail.com', '0886123456', 'LanHoang_2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (6, 'Bùi Quang Huy', NULL, 'huy.bui@gmail.com', '0967123987', 'HuyBui#987', 'USER');
INSERT INTO ecommerce.site_user VALUES (7, 'Đỗ Thị Hương', NULL, 'huong.do@gmail.com', '0357891234', 'HuongDo!88', 'USER');
INSERT INTO ecommerce.site_user VALUES (8, 'Phan Anh Tuấn', NULL, 'tuan.phan@gmail.com', '0794567891', 'TuanPhan@2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (9, 'Đặng Thu Trang', NULL, 'trang.dang@gmail.com', '0812233445', 'TrangDang#12', 'USER');
INSERT INTO ecommerce.site_user VALUES (10, 'Vũ Minh Anh', NULL, 'anh.vu@gmail.com', '0849988776', 'AnhVu*2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (11, 'Ngô Thanh Hà', NULL, 'ha.ngo@gmail.com', '0912233446', 'HaNgo!456', 'USER');
INSERT INTO ecommerce.site_user VALUES (12, 'Đinh Quang Vinh', NULL, 'vinh.dinh@gmail.com', '0934667788', 'VinhDinh@2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (13, 'Cao Thị Mai', NULL, 'mai.cao@gmail.com', '0978111222', 'MaiCao#321', 'USER');
INSERT INTO ecommerce.site_user VALUES (14, 'Ngô Văn Hiếu', NULL, 'hieu.ngo@gmail.com', '0905111555', 'HieuNgo*abc', 'USER');
INSERT INTO ecommerce.site_user VALUES (15, 'Trương Mỹ Linh', NULL, 'linh.truong@gmail.com', '0885333777', 'LinhTruong!2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (16, 'Hà Tuấn Kiệt', NULL, 'kiet.ha@gmail.com', '0967444333', 'KietHa@888', 'USER');
INSERT INTO ecommerce.site_user VALUES (17, 'Mai Phương Thảo', NULL, 'thao.mai@gmail.com', '0359001122', 'ThaoMai#2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (18, 'Lý Gia Bảo', NULL, 'bao.ly@gmail.com', '0796007788', 'BaoLy!777', 'USER');
INSERT INTO ecommerce.site_user VALUES (19, 'Lâm Thu Thảo', NULL, 'thao.lam@gmail.com', '0815566778', 'ThaoLam@xyz', 'USER');
INSERT INTO ecommerce.site_user VALUES (20, 'Võ Trường Sơn', NULL, 'son.vo@gmail.com', '0847008899', 'SonVo#2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (21, 'Nguyễn Thị Thu', NULL, 'thu.nguyen@gmail.com', '0914555666', 'ThuNguyen!abc', 'USER');
INSERT INTO ecommerce.site_user VALUES (22, 'Trần Đức Anh', NULL, 'anh.tran@gmail.com', '0934111999', 'AnhTran@2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (23, 'Lê Khánh Linh', NULL, 'linh.le@gmail.com', '0973004455', 'LinhLe#@12', 'USER');
INSERT INTO ecommerce.site_user VALUES (24, 'Phạm Quốc Việt', NULL, 'viet.pham@gmail.com', '0908333555', 'VietPham*2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (25, 'Hoàng Bảo Ngọc', NULL, 'ngoc.hoang@gmail.com', '0886444666', 'NgocHoang!999', 'USER');
INSERT INTO ecommerce.site_user VALUES (26, 'Bùi Hữu Nghĩa', NULL, 'nghia.bui@gmail.com', '0967999666', 'NghiaBui@pass', 'USER');
INSERT INTO ecommerce.site_user VALUES (27, 'Đỗ Anh Khoa', NULL, 'khoa.do@gmail.com', '0355677788', 'KhoaDo#2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (28, 'Phan Gia Hân', NULL, 'han.phan@gmail.com', '0794777889', 'HanPhan!456', 'USER');
INSERT INTO ecommerce.site_user VALUES (29, 'Đặng Khả Nhi', NULL, 'nhi.dang@gmail.com', '0814666999', 'NhiDang@2025', 'USER');
INSERT INTO ecommerce.site_user VALUES (46, 'abcd', 'http://localhost:8080/avatars/7f6764bc-1077-4355-8ec6-7e190269ba4d.webp', 'phong.vuu@gmail.com', '0972415526', 'Tan@0509', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (47, 'Nguyễn Văn Long', NULL, 'gdragon@gmail.com', NULL, '123456', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (30, 'Vũ Thanh Phong', '', 'phong.vu@gmail.com', '0844555666', '123456', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (38, 'Tân', '', 'phong@gmail.com', '', '123456', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (39, 'ádfasd', NULL, 'addddmin@gmail.com', NULL, 'Admin#2025!', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (33, 'Nguyen van Tan', NULL, 'vantann050904@gmail.com', NULL, '123456', 'ROLE_USER');
INSERT INTO ecommerce.site_user VALUES (31, NULL, 'http://localhost:8080/avatars/2f5af8f0-a7e7-4846-90be-1979185de480.jfif', 'admin@gmail.com', '0901999000', 'Admin#2025!', 'ADMIN');
INSERT INTO ecommerce.site_user VALUES (41, 'abc', 'http://localhost:8080/avatars/15b788b5-0470-4390-a44e-ea221c73e917.png', 'phongggg@gmail.com', NULL, '123456', 'ROLE_USER');


--
-- TOC entry 5026 (class 0 OID 18868)
-- Dependencies: 240
-- Data for Name: user_review; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.user_review VALUES (1, 3, 1, 5, 'Áo đẹp, vải dày dặn, mặc thoải mái lắm.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (2, 4, 8, 4, 'Chất vải ok, logo hoa cúc in rõ, nhưng giao hơi chậm.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (3, 5, 9, 5, 'Hình Goku in rất đẹp, màu chuẩn như hình.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (5, 7, 11, 5, 'Áo đỏ Goku nhìn ngoài còn đẹp hơn ảnh.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (7, 9, 10, 5, 'Hình Pepe dễ thương, vải co giãn tốt.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (8, 10, 4, 4, 'Áo hồng pastel nhẹ nhàng, giao hàng nhanh.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (9, 11, 6, 5, 'Màu xanh navy sang trọng, form áo đẹp.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (10, 12, 12, 5, 'Áo đỏ trơn đơn giản mà chất lượng tốt.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (11, 13, 13, 5, 'Hình in Guts cực chất, fan Berserk ưng lắm!', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (12, 14, 14, 4, 'Áo trắng in Goku đẹp, nhưng hơi dễ dính bẩn.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (13, 15, 15, 5, 'Áo đỏ hoa cúc xinh, vải mịn, logo nhỏ tinh tế.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (14, 16, 16, 5, 'Áo trắng hoa cúc form chuẩn, logo sắc nét.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (29, 20, 7, 4, 'Áo xanh lá tươi, chất ổn, mặc thoáng mát.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (30, 23, 3, 5, 'Áo nâu vintage, chất dày, form rộng vừa đẹp.', '2025-10-28 13:27:31.652358');
INSERT INTO ecommerce.user_review VALUES (4, 38, 10, 5, 'Test bình luận từ Postman, sản phẩm rất cặc!', '2025-11-12 22:02:07.133277');
INSERT INTO ecommerce.user_review VALUES (6, 39, 9, 4, 'a', '2025-11-12 22:24:11.296403');
INSERT INTO ecommerce.user_review VALUES (32, 39, 4, 5, 'final', '2025-11-12 22:34:09.2507');
INSERT INTO ecommerce.user_review VALUES (34, 31, 13, 5, '10', '2025-11-13 18:27:54.242845');
INSERT INTO ecommerce.user_review VALUES (36, 31, 3, 5, 'abcd', '2025-11-14 00:17:53.383848');
INSERT INTO ecommerce.user_review VALUES (37, 31, 4, 5, '10', '2025-11-14 02:01:34.201408');
INSERT INTO ecommerce.user_review VALUES (38, 31, 9, 5, '10', '2025-11-14 04:07:06.739769');
INSERT INTO ecommerce.user_review VALUES (39, 31, 34, 5, '10', '2025-11-14 05:14:40.00916');
INSERT INTO ecommerce.user_review VALUES (40, 31, 1, 5, 'Áo quá rẻ so với chất lượng', '2025-11-14 09:39:36.727288');
INSERT INTO ecommerce.user_review VALUES (41, 46, 1, 5, 'Giao hàng nhanh', '2025-11-14 13:31:25.100296');
INSERT INTO ecommerce.user_review VALUES (42, 30, 1, 5, 'ok', '2025-11-14 15:55:31.755836');


--
-- TOC entry 5028 (class 0 OID 18888)
-- Dependencies: 242
-- Data for Name: variation; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.variation VALUES (1, 1, 'Màu sắc');
INSERT INTO ecommerce.variation VALUES (2, 1, 'Kích cỡ');


--
-- TOC entry 5030 (class 0 OID 18900)
-- Dependencies: 244
-- Data for Name: variation_option; Type: TABLE DATA; Schema: ecommerce; Owner: postgres
--

INSERT INTO ecommerce.variation_option VALUES (1, 1, 'Trắng');
INSERT INTO ecommerce.variation_option VALUES (2, 1, 'Đen');
INSERT INTO ecommerce.variation_option VALUES (3, 1, 'Đỏ');
INSERT INTO ecommerce.variation_option VALUES (4, 1, 'Hồng');
INSERT INTO ecommerce.variation_option VALUES (5, 1, 'Xám');
INSERT INTO ecommerce.variation_option VALUES (6, 1, 'Nâu');
INSERT INTO ecommerce.variation_option VALUES (7, 1, 'Xanh nước biển');
INSERT INTO ecommerce.variation_option VALUES (8, 1, 'Xanh lá');
INSERT INTO ecommerce.variation_option VALUES (9, 1, 'Navy');
INSERT INTO ecommerce.variation_option VALUES (10, 2, 'S');
INSERT INTO ecommerce.variation_option VALUES (11, 2, 'M');
INSERT INTO ecommerce.variation_option VALUES (12, 2, 'L');
INSERT INTO ecommerce.variation_option VALUES (13, 2, 'XL');
INSERT INTO ecommerce.variation_option VALUES (14, 2, 'XXL');


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 221
-- Name: address_address_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.address_address_id_seq', 60, true);


--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 249
-- Name: contact_message_message_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.contact_message_message_id_seq', 5, true);


--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 231
-- Name: custom_product_custom_product_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.custom_product_custom_product_id_seq', 22, true);


--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 237
-- Name: order_line_order_line_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.order_line_order_line_id_seq', 126, true);


--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 225
-- Name: product_category_category_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.product_category_category_id_seq', 5, true);


--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 229
-- Name: product_item_product_item_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.product_item_product_item_id_seq', 57, true);


--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.product_product_id_seq', 51, true);


--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 246
-- Name: promotion_promotion_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.promotion_promotion_id_seq', 7, true);


--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 235
-- Name: shop_order_order_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.shop_order_order_id_seq', 118, true);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 223
-- Name: shopping_cart_cart_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.shopping_cart_cart_id_seq', 38, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 233
-- Name: shopping_cart_item_cart_item_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.shopping_cart_item_cart_item_id_seq', 202, true);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 219
-- Name: site_user_user_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.site_user_user_id_seq', 47, true);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 239
-- Name: user_review_review_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.user_review_review_id_seq', 42, true);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 243
-- Name: variation_option_variation_option_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.variation_option_variation_option_id_seq', 1, false);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 241
-- Name: variation_variation_id_seq; Type: SEQUENCE SET; Schema: ecommerce; Owner: postgres
--

SELECT pg_catalog.setval('ecommerce.variation_variation_id_seq', 1, false);


--
-- TOC entry 4801 (class 2606 OID 18723)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);


--
-- TOC entry 4835 (class 2606 OID 19001)
-- Name: contact_message contact_message_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.contact_message
    ADD CONSTRAINT contact_message_pkey PRIMARY KEY (message_id);


--
-- TOC entry 4817 (class 2606 OID 18793)
-- Name: custom_product custom_product_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.custom_product
    ADD CONSTRAINT custom_product_pkey PRIMARY KEY (custom_product_id);


--
-- TOC entry 4823 (class 2606 OID 18851)
-- Name: order_line order_line_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.order_line
    ADD CONSTRAINT order_line_pkey PRIMARY KEY (order_line_id);


--
-- TOC entry 4805 (class 2606 OID 18747)
-- Name: product_category product_category_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_category
    ADD CONSTRAINT product_category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4831 (class 2606 OID 18915)
-- Name: product_configuration product_configuration_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_configuration
    ADD CONSTRAINT product_configuration_pkey PRIMARY KEY (product_item_id, variation_option_id);


--
-- TOC entry 4811 (class 2606 OID 18776)
-- Name: product_item product_item_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_item
    ADD CONSTRAINT product_item_pkey PRIMARY KEY (product_item_id);


--
-- TOC entry 4807 (class 2606 OID 18761)
-- Name: product product_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4833 (class 2606 OID 18936)
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (promotion_id);


--
-- TOC entry 4821 (class 2606 OID 18832)
-- Name: shop_order shop_order_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shop_order
    ADD CONSTRAINT shop_order_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4819 (class 2606 OID 18812)
-- Name: shopping_cart_item shopping_cart_item_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart_item
    ADD CONSTRAINT shopping_cart_item_pkey PRIMARY KEY (cart_item_id);


--
-- TOC entry 4803 (class 2606 OID 18735)
-- Name: shopping_cart shopping_cart_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart
    ADD CONSTRAINT shopping_cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4795 (class 2606 OID 18715)
-- Name: site_user site_user_email_address_key; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.site_user
    ADD CONSTRAINT site_user_email_address_key UNIQUE (email_address);


--
-- TOC entry 4797 (class 2606 OID 18713)
-- Name: site_user site_user_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.site_user
    ADD CONSTRAINT site_user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4799 (class 2606 OID 18956)
-- Name: site_user uk7saivi9oorovjanktiwf61vfy; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.site_user
    ADD CONSTRAINT uk7saivi9oorovjanktiwf61vfy UNIQUE (email_address);


--
-- TOC entry 4813 (class 2606 OID 18976)
-- Name: product_item uk_product_item_sku; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_item
    ADD CONSTRAINT uk_product_item_sku UNIQUE (sku);


--
-- TOC entry 4809 (class 2606 OID 18978)
-- Name: product uk_product_name; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product
    ADD CONSTRAINT uk_product_name UNIQUE (name);


--
-- TOC entry 4815 (class 2606 OID 18778)
-- Name: product_item uq_product_item_sku; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_item
    ADD CONSTRAINT uq_product_item_sku UNIQUE (sku);


--
-- TOC entry 4825 (class 2606 OID 18876)
-- Name: user_review user_review_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.user_review
    ADD CONSTRAINT user_review_pkey PRIMARY KEY (review_id);


--
-- TOC entry 4829 (class 2606 OID 18905)
-- Name: variation_option variation_option_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation_option
    ADD CONSTRAINT variation_option_pkey PRIMARY KEY (variation_option_id);


--
-- TOC entry 4827 (class 2606 OID 18893)
-- Name: variation variation_pkey; Type: CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation
    ADD CONSTRAINT variation_pkey PRIMARY KEY (variation_id);


--
-- TOC entry 4836 (class 2606 OID 18724)
-- Name: address address_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.address
    ADD CONSTRAINT address_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 4859 (class 2606 OID 19002)
-- Name: contact_message contact_message_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.contact_message
    ADD CONSTRAINT contact_message_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE SET NULL;


--
-- TOC entry 4841 (class 2606 OID 18794)
-- Name: custom_product custom_product_product_item_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.custom_product
    ADD CONSTRAINT custom_product_product_item_id_fkey FOREIGN KEY (product_item_id) REFERENCES ecommerce.product_item(product_item_id) ON DELETE CASCADE;


--
-- TOC entry 4842 (class 2606 OID 18799)
-- Name: custom_product custom_product_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.custom_product
    ADD CONSTRAINT custom_product_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 4838 (class 2606 OID 18748)
-- Name: product_category fk_product_category_parent; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_category
    ADD CONSTRAINT fk_product_category_parent FOREIGN KEY (parent_category_id) REFERENCES ecommerce.product_category(category_id) ON DELETE SET NULL;


--
-- TOC entry 4857 (class 2606 OID 18970)
-- Name: cart_item_variation_option fkc79hjhx61l88pv5hvl47s3saq; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.cart_item_variation_option
    ADD CONSTRAINT fkc79hjhx61l88pv5hvl47s3saq FOREIGN KEY (cart_item_id) REFERENCES ecommerce.shopping_cart_item(cart_item_id);


--
-- TOC entry 4858 (class 2606 OID 18965)
-- Name: cart_item_variation_option fktetqnyyv6m24r0te4i7pn4m49; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.cart_item_variation_option
    ADD CONSTRAINT fktetqnyyv6m24r0te4i7pn4m49 FOREIGN KEY (variation_option_id) REFERENCES ecommerce.variation_option(variation_option_id);


--
-- TOC entry 4847 (class 2606 OID 18862)
-- Name: order_line order_line_custom_product_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.order_line
    ADD CONSTRAINT order_line_custom_product_id_fkey FOREIGN KEY (custom_product_id) REFERENCES ecommerce.custom_product(custom_product_id) ON DELETE SET NULL;


--
-- TOC entry 4848 (class 2606 OID 18857)
-- Name: order_line order_line_order_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.order_line
    ADD CONSTRAINT order_line_order_id_fkey FOREIGN KEY (order_id) REFERENCES ecommerce.shop_order(order_id) ON DELETE CASCADE;


--
-- TOC entry 4849 (class 2606 OID 18852)
-- Name: order_line order_line_product_item_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.order_line
    ADD CONSTRAINT order_line_product_item_id_fkey FOREIGN KEY (product_item_id) REFERENCES ecommerce.product_item(product_item_id) ON DELETE SET NULL;


--
-- TOC entry 4839 (class 2606 OID 18762)
-- Name: product product_category_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product
    ADD CONSTRAINT product_category_id_fkey FOREIGN KEY (category_id) REFERENCES ecommerce.product_category(category_id) ON DELETE SET NULL;


--
-- TOC entry 4854 (class 2606 OID 18916)
-- Name: product_configuration product_configuration_product_item_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_configuration
    ADD CONSTRAINT product_configuration_product_item_id_fkey FOREIGN KEY (product_item_id) REFERENCES ecommerce.product_item(product_item_id) ON DELETE CASCADE;


--
-- TOC entry 4855 (class 2606 OID 18921)
-- Name: product_configuration product_configuration_variation_option_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_configuration
    ADD CONSTRAINT product_configuration_variation_option_id_fkey FOREIGN KEY (variation_option_id) REFERENCES ecommerce.variation_option(variation_option_id) ON DELETE CASCADE;


--
-- TOC entry 4840 (class 2606 OID 18779)
-- Name: product_item product_item_product_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.product_item
    ADD CONSTRAINT product_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES ecommerce.product(product_id) ON DELETE CASCADE;


--
-- TOC entry 4856 (class 2606 OID 18937)
-- Name: promotion promotion_category_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.promotion
    ADD CONSTRAINT promotion_category_id_fkey FOREIGN KEY (category_id) REFERENCES ecommerce.product_category(category_id) ON DELETE SET NULL;


--
-- TOC entry 4845 (class 2606 OID 18838)
-- Name: shop_order shop_order_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shop_order
    ADD CONSTRAINT shop_order_shipping_address_id_fkey FOREIGN KEY (shipping_address_id) REFERENCES ecommerce.address(address_id) ON DELETE SET NULL;


--
-- TOC entry 4846 (class 2606 OID 18833)
-- Name: shop_order shop_order_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shop_order
    ADD CONSTRAINT shop_order_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 4843 (class 2606 OID 18813)
-- Name: shopping_cart_item shopping_cart_item_cart_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart_item
    ADD CONSTRAINT shopping_cart_item_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES ecommerce.shopping_cart(cart_id) ON DELETE CASCADE;


--
-- TOC entry 4844 (class 2606 OID 18818)
-- Name: shopping_cart_item shopping_cart_item_product_item_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart_item
    ADD CONSTRAINT shopping_cart_item_product_item_id_fkey FOREIGN KEY (product_item_id) REFERENCES ecommerce.product_item(product_item_id) ON DELETE CASCADE;


--
-- TOC entry 4837 (class 2606 OID 18736)
-- Name: shopping_cart shopping_cart_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.shopping_cart
    ADD CONSTRAINT shopping_cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 4850 (class 2606 OID 18882)
-- Name: user_review user_review_ordered_product_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.user_review
    ADD CONSTRAINT user_review_ordered_product_id_fkey FOREIGN KEY (ordered_product_id) REFERENCES ecommerce.product_item(product_item_id) ON DELETE CASCADE;


--
-- TOC entry 4851 (class 2606 OID 18877)
-- Name: user_review user_review_user_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.user_review
    ADD CONSTRAINT user_review_user_id_fkey FOREIGN KEY (user_id) REFERENCES ecommerce.site_user(user_id) ON DELETE CASCADE;


--
-- TOC entry 4852 (class 2606 OID 18894)
-- Name: variation variation_category_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation
    ADD CONSTRAINT variation_category_id_fkey FOREIGN KEY (category_id) REFERENCES ecommerce.product_category(category_id) ON DELETE CASCADE;


--
-- TOC entry 4853 (class 2606 OID 18906)
-- Name: variation_option variation_option_variation_id_fkey; Type: FK CONSTRAINT; Schema: ecommerce; Owner: postgres
--

ALTER TABLE ONLY ecommerce.variation_option
    ADD CONSTRAINT variation_option_variation_id_fkey FOREIGN KEY (variation_id) REFERENCES ecommerce.variation(variation_id) ON DELETE CASCADE;


-- 1. Xóa cột liên kết cũ (liên kết với danh mục)
ALTER TABLE ecommerce.promotion 
DROP COLUMN IF EXISTS category_id CASCADE;

-- 2. Thêm cột liên kết mới (liên kết với sản phẩm)
ALTER TABLE ecommerce.promotion 
ADD COLUMN product_id INTEGER;

-- 3. Tạo khóa ngoại để nối sang bảng Product
ALTER TABLE ecommerce.promotion 
ADD CONSTRAINT fk_promotion_product 
FOREIGN KEY (product_id) 
REFERENCES ecommerce.product(product_id)
ON DELETE CASCADE; 
-- (ON DELETE CASCADE: nghĩa là nếu xóa Sản phẩm thì xóa luôn Khuyến mãi của nó)

-- Completed on 2025-11-21 11:46:54

--
-- PostgreSQL database dump complete
--

\unrestrict PtpA48nnKEz0G0pqtKOM1AgbgChduVFe6cLNT9wM4ZvAYjWgAmIJN9YOfIN0Zze

