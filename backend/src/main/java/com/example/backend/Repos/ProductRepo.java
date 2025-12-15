package com.example.backend.Repos;

import com.example.backend.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Integer> {

    //chi tiết sản phẩm
    @Query(value = """
    SELECT jsonb_build_object(
        'productId', p.product_id,
        'productName', p.name,
        'productDescription', p.description,
        'productMainImage', p.product_image,
        'totalSold', COALESCE(sales.total_sold, 0), 
        'category', jsonb_build_object(
            'categoryId', pc.category_id,
            'categoryName', pc.category_name,
            'parentCategoryId', pc.parent_category_id
        ),
        'items', COALESCE(jsonb_agg(DISTINCT jsonb_build_object(
            'productItemId', pi.product_item_id,
            'sku', pi.sku,
            'qtyInStock', pi.qty_in_stock,
            'itemImage', pi.product_image,
            'originalPrice', pi.price, 
            
            -- Lấy mức giảm giá (nếu có nhiều KM thì group by sẽ tách dòng, ở đây chấp nhận lấy dòng đầu tiên hoặc logic group by bên dưới)
            'discountRate', promo.discount_rate, 
            
            -- Tính giá sau giảm
            'price', (pi.price * (1 - COALESCE(promo.discount_rate, 0.0) / 100.0)),
            
            'configurations', (
                SELECT json_agg(jsonb_build_object(
                    'variationOptionId', pconf.variation_option_id,
                    'variationName', v.name,
                    'value', vo.value
                ))
                FROM ecommerce.product_configuration pconf
                JOIN ecommerce.variation_option vo ON pconf.variation_option_id = vo.variation_option_id
                JOIN ecommerce.variation v ON vo.variation_id = v.variation_id
                WHERE pconf.product_item_id = pi.product_item_id
            )
        )) FILTER (WHERE pi.product_item_id IS NOT NULL), '[]'::jsonb)
    )::text as json_data
    FROM ecommerce.product p
    LEFT JOIN ecommerce.product_category pc ON p.category_id = pc.category_id
    LEFT JOIN ecommerce.product_item pi ON p.product_id = pi.product_id
    
    -- Join Promotion qua product_id
    LEFT JOIN ecommerce.promotion promo ON p.product_id = promo.product_id
        AND CURRENT_DATE >= promo.start_date 
        AND CURRENT_DATE <= promo.end_date
        
    LEFT JOIN (
        SELECT 
            pi_sales.product_id, 
            SUM(ol.qty) AS total_sold
        FROM ecommerce.product_item pi_sales
        JOIN ecommerce.order_line ol ON pi_sales.product_item_id = ol.product_item_id
        JOIN ecommerce.shop_order so ON ol.order_id = so.order_id AND so.payment_status = 'Đã thanh toán'
        WHERE pi_sales.product_id = :productId 
        GROUP BY pi_sales.product_id
    ) AS sales ON p.product_id = sales.product_id
    
    WHERE p.product_id = :productId
    
    GROUP BY p.product_id, p.name, p.description, p.product_image,
             pc.category_id, pc.category_name, pc.parent_category_id,
             promo.discount_rate, 
             sales.total_sold
    """, nativeQuery = true)
    String getProductDetailAsJson(@Param("productId") Integer productId);


    // danh sách sản phẩm có phân trang
    @Query(value = """
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'productId', p.product_id,
            'productName', p.name,
            'productDescription', p.description,
            'productMainImage', p.product_image,
            'totalSold', p.total_sold,
            
            'category', jsonb_build_object(
                'categoryId', p.category_id,
                'categoryName', p.category_name,
                'parentCategoryId', p.parent_category_id
            ),
            
            'items', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'productItemId', pi.product_item_id,
                    'sku', pi.sku,
                    'qtyInStock', pi.qty_in_stock,
                    'itemImage', pi.product_image,
                    
                    'originalPrice', pi.price,
                    
                    
                    'discountRate', p.discount_rate,
                    
                   
                    'price', (pi.price * (1 - COALESCE(p.discount_rate, 0.0) / 100.0)),

                    'configurations', COALESCE((
                        SELECT jsonb_agg(jsonb_build_object(
                            'variationOptionId', pconf.variation_option_id,
                            'variationName', v.name,
                            'value', vo.value
                        ))
                        FROM ecommerce.product_configuration pconf
                        JOIN ecommerce.variation_option vo ON pconf.variation_option_id = vo.variation_option_id
                        JOIN ecommerce.variation v ON vo.variation_id = v.variation_id
                        WHERE pconf.product_item_id = pi.product_item_id
                    ), '[]'::jsonb)
                ))
                FROM ecommerce.product_item pi
                WHERE pi.product_id = p.product_id
            ), '[]'::jsonb)
        )
    ), '[]'::jsonb)::text as json_data
    
    FROM (
        SELECT 
            p_sub.product_id,
            p_sub.name,
            p_sub.description,
            p_sub.product_image,
            p_sub.created_at,
            
            pc.category_id,
            pc.category_name,
            pc.parent_category_id,
            
           
            COALESCE(MAX(promo.discount_rate), 0) as discount_rate,
            
            COALESCE(sales.total_sold, 0) AS total_sold
            
        FROM ecommerce.product p_sub
        
        LEFT JOIN ecommerce.product_category pc ON p_sub.category_id = pc.category_id
        
        -- Join Promotion qua product_id
        LEFT JOIN ecommerce.promotion promo ON p_sub.product_id = promo.product_id
            AND CURRENT_DATE >= promo.start_date
            AND CURRENT_DATE <= promo.end_date
            
        LEFT JOIN (
            SELECT 
                pi_sales.product_id, 
                SUM(ol.qty) AS total_sold
            FROM ecommerce.product_item pi_sales
            JOIN ecommerce.order_line ol ON pi_sales.product_item_id = ol.product_item_id
            JOIN ecommerce.shop_order so ON ol.order_id = so.order_id AND so.payment_status = 'Đã thanh toán'
            GROUP BY pi_sales.product_id
        ) AS sales ON p_sub.product_id = sales.product_id

        WHERE
            (?3 IS NULL OR p_sub.category_id = ?3)
            AND (?4 IS NULL OR LOWER(p_sub.name) LIKE LOWER(CONCAT('%', ?4, '%')))
        
        GROUP BY 
            p_sub.product_id, 
            pc.category_id,
           
            sales.total_sold
            
        ORDER BY p_sub.created_at DESC 
        
        LIMIT ?1 
        OFFSET ?2 
    ) p
    """, nativeQuery = true)
    String getAllProductsAsJsonPaged(int limit, int offset, Integer categoryId, String searchTerm);


    // đếm tổng sản phẩm
    @Query(value = """
            SELECT count(*)
            FROM ecommerce.product p
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
            """, nativeQuery = true)
    long countAllProducts(
            @Param("categoryId") Integer categoryId,
            @Param("searchTerm") String searchTerm
    );

    // lấy sản phẩm bán chạy
    @Query(value = """
    SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
            'productId', p.product_id,
            'productName', p.name,
            'productDescription', p.description,
            'productMainImage', p.product_image,
            'totalSold', p.total_sold,
            
            'category', jsonb_build_object(
                'categoryId', p.category_id,
                'categoryName', p.category_name,
                'parentCategoryId', p.parent_category_id
            ),
            
            'items', COALESCE((
                SELECT jsonb_agg(jsonb_build_object(
                    'productItemId', pi.product_item_id,
                    'sku', pi.sku,
                    'qtyInStock', pi.qty_in_stock,
                    'itemImage', pi.product_image,
                    
                    'originalPrice', pi.price,
                    
                    'discountRate', p.discount_rate,
                    
                    'price', (pi.price * (1 - COALESCE(p.discount_rate, 0.0) / 100.0)),

                    'configurations', COALESCE((
                        SELECT jsonb_agg(jsonb_build_object(
                            'variationOptionId', pconf.variation_option_id,
                            'variationName', v.name,
                            'value', vo.value
                        ))
                        FROM ecommerce.product_configuration pconf
                        JOIN ecommerce.variation_option vo ON pconf.variation_option_id = vo.variation_option_id
                        JOIN ecommerce.variation v ON vo.variation_id = v.variation_id
                        WHERE pconf.product_item_id = pi.product_item_id
                    ), '[]'::jsonb)
                ))
                FROM ecommerce.product_item pi
                WHERE pi.product_id = p.product_id
            ), '[]'::jsonb)
        )
    ), '[]'::jsonb)::text as json_data
    
    FROM (
        SELECT 
            p_sub.product_id,
            p_sub.name,
            p_sub.description,
            p_sub.product_image,
            
            pc.category_id,
            pc.category_name,
            pc.parent_category_id,
            
            COALESCE(MAX(promo.discount_rate), 0) as discount_rate,
            
            COALESCE(SUM(ol.qty), 0) AS total_sold
            
        FROM ecommerce.product p_sub
        
        LEFT JOIN ecommerce.product_category pc ON p_sub.category_id = pc.category_id
        
        -- Join Promotion qua product_id
        LEFT JOIN ecommerce.promotion promo ON p_sub.product_id = promo.product_id
            AND CURRENT_DATE >= promo.start_date 
            AND CURRENT_DATE <= promo.end_date
            
        LEFT JOIN ecommerce.product_item pi_sales ON p_sub.product_id = pi_sales.product_id
        LEFT JOIN ecommerce.order_line ol ON pi_sales.product_item_id = ol.product_item_id
        LEFT JOIN ecommerce.shop_order so ON ol.order_id = so.order_id AND so.payment_status = 'Đã thanh toán'

        WHERE
            (?3 IS NULL OR p_sub.category_id = ?3) 
            AND (?4 IS NULL OR LOWER(p_sub.name) LIKE LOWER(CONCAT('%', ?4, '%'))) 
        
        GROUP BY 
            p_sub.product_id, 
            pc.category_id
            
        ORDER BY total_sold DESC 
        
        LIMIT ?1 
        OFFSET ?2 
    ) p
    """, nativeQuery = true)
    String getHottestProductsAsJsonPaged(int limit, int offset, Integer categoryId, String searchTerm);

    @Query(value = """
            SELECT count(*)
            FROM ecommerce.product p
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:searchTerm IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
            """, nativeQuery = true)
    long countHottestProducts(
            @Param("categoryId") Integer categoryId,
            @Param("searchTerm") String searchTerm
    );

    long countByCategoryId(Integer categoryId);

    @Query(value = "SELECT name FROM ecommerce.product WHERE product_id = :productItemId", nativeQuery = true)
    String findNameById(Integer productItemId);
}