
├── backend
│   ├── .mvn
│   │   └── wrapper
│   │       └── maven-wrapper.properties
│   ├── com
│   │   └── sun
│   │       └── tools
│   │           └── javac
│   │               └── code
│   │                   └── annotations.xml
│   ├── src
│   │   ├── main
│   │   │   ├── java
│   │   │   │   └── com
│   │   │   │       └── example
│   │   │   │           └── backend
│   │   │   │               ├── Config
│   │   │   │               │   ├── Configuration_Documentation.md
│   │   │   │               │   ├── CorsConfig.java
│   │   │   │               │   ├── WebConfig.java
│   │   │   │               │   └── WebSocketConfig.java
│   │   │   │               ├── Controller
│   │   │   │               │   ├── AddressController.java
│   │   │   │               │   ├── AuthController.java
│   │   │   │               │   ├── CategoryController.java
│   │   │   │               │   ├── ChatController.java
│   │   │   │               │   ├── ChatRestController.java
│   │   │   │               │   ├── ContactController.java
│   │   │   │               │   ├── CustomProductController.java
│   │   │   │               │   ├── OrderController.java
│   │   │   │               │   ├── ProductController.java
│   │   │   │               │   ├── PromotionController.java
│   │   │   │               │   ├── ShoppingCartController.java
│   │   │   │               │   ├── UserController.java
│   │   │   │               │   └── UserReviewController.java
│   │   │   │               ├── DTO
│   │   │   │               │   ├── Request
│   │   │   │               │   │   ├── Cart
│   │   │   │               │   │   ├── AddressRequest.java
│   │   │   │               │   │   ├── ChangeRoleRequest.java
│   │   │   │               │   │   ├── ContactRequest.java
│   │   │   │               │   │   ├── CreateCustomProductRequest.java
│   │   │   │               │   │   ├── CreateOrderRequest.java
│   │   │   │               │   │   ├── CreateProductRequest.java
│   │   │   │               │   │   ├── CreateUpdateCategoryRequest.java
│   │   │   │               │   │   ├── PromotionRequest.java
│   │   │   │               │   │   ├── RegisterRequest.java
│   │   │   │               │   │   ├── SiteUserRequest.java
│   │   │   │               │   │   ├── UpdateProductRequest.java
│   │   │   │               │   │   └── UserReviewCreateRequest.java
│   │   │   │               │   ├── Response
│   │   │   │               │   │   ├── Cart
│   │   │   │               │   │   ├── Order
│   │   │   │               │   │   ├── AddressResponse.java
│   │   │   │               │   │   ├── CategoryResponse.java
│   │   │   │               │   │   ├── CategoryWithCountResponse.java
│   │   │   │               │   │   ├── ChatRoomResponse.java
│   │   │   │               │   │   ├── ContactMessageResponse.java
│   │   │   │               │   │   ├── CustomProductResponse.java
│   │   │   │               │   │   ├── ProductPageResponse.java
│   │   │   │               │   │   ├── ProductResponse.java
│   │   │   │               │   │   ├── PromotionResponse.java
│   │   │   │               │   │   ├── ReviewStatsResponse.java
│   │   │   │               │   │   ├── SiteUserResponse.java
│   │   │   │               │   │   ├── UserAddressDTO.java
│   │   │   │               │   │   ├── UserDetailsDTO.java
│   │   │   │               │   │   ├── UserReviewResponse.java
│   │   │   │               │   │   ├── UserReviewUserResponse.java
│   │   │   │               │   │   ├── VariationOptionResponse.java
│   │   │   │               │   │   └── VariationResponse.java
│   │   │   │               │   └── DTO_Documentation.md
│   │   │   │               ├── Entity
│   │   │   │               │   ├── Address.java
│   │   │   │               │   ├── ChatMessage.java
│   │   │   │               │   ├── ChatRoom.java
│   │   │   │               │   ├── ContactMessage.java
│   │   │   │               │   ├── CustomProduct.java
│   │   │   │               │   ├── OrderLine.java
│   │   │   │               │   ├── Product.java
│   │   │   │               │   ├── ProductCategory.java
│   │   │   │               │   ├── ProductConfiguration.java
│   │   │   │               │   ├── ProductConfigurationId.java
│   │   │   │               │   ├── ProductItem.java
│   │   │   │               │   ├── Promotion.java
│   │   │   │               │   ├── ShopOrder.java
│   │   │   │               │   ├── ShoppingCart.java
│   │   │   │               │   ├── ShoppingCartItem.java
│   │   │   │               │   ├── SiteUser.java
│   │   │   │               │   ├── UserReview.java
│   │   │   │               │   ├── Variation.java
│   │   │   │               │   └── VariationOption.java
│   │   │   │               ├── Exception
│   │   │   │               │   ├── CategoryNameAlreadyExistsException.java
│   │   │   │               │   ├── Exception_Handling_Documentation.md
│   │   │   │               │   ├── GlobalExceptionHandler.java
│   │   │   │               │   ├── InvalidDataException.java
│   │   │   │               │   ├── OAuth2AuthenticationProcessingException.java
│   │   │   │               │   ├── PromotionAlreadyExistsException.java
│   │   │   │               │   └── ResourceNotFoundException.java
│   │   │   │               ├── Repos
│   │   │   │               │   ├── AddressRepo.java
│   │   │   │               │   ├── CartItemRepo.java
│   │   │   │               │   ├── ChatMessageRepository.java
│   │   │   │               │   ├── ChatRoomRepository.java
│   │   │   │               │   ├── ContactMessageRepository.java
│   │   │   │               │   ├── CustomProductRepo.java
│   │   │   │               │   ├── OrderLineRepo.java
│   │   │   │               │   ├── OrderRepo.java
│   │   │   │               │   ├── ProductCategoryRepo.java
│   │   │   │               │   ├── ProductConfigurationRepo.java
│   │   │   │               │   ├── ProductItemRepo.java
│   │   │   │               │   ├── ProductRepo.java
│   │   │   │               │   ├── PromotionRepo.java
│   │   │   │               │   ├── Repository_Documentation.md
│   │   │   │               │   ├── ShopOrderRepository.java
│   │   │   │               │   ├── ShoppingCartItemRepo.java
│   │   │   │               │   ├── ShoppingCartRepo.java
│   │   │   │               │   ├── SiteUserRepo.java
│   │   │   │               │   ├── UserCartRepo.java
│   │   │   │               │   ├── UserReviewRepo.java
│   │   │   │               │   ├── VariationOptionRepo.java
│   │   │   │               │   └── VariationRepo.java
│   │   │   │               ├── Sercurity
│   │   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │   │               │   ├── JwtUtil.java
│   │   │   │               │   ├── MyUserDetails.java
│   │   │   │               │   ├── MyUserDetailsService.java
│   │   │   │               │   ├── OAuth2AuthenticationSuccessHandler.java
│   │   │   │               │   ├── OwnershipService.java
│   │   │   │               │   ├── SecurityConfig.java
│   │   │   │               │   ├── Security_Configuration_Documentation.md
│   │   │   │               │   └── UserPrincipal.java
│   │   │   │               ├── Sercurity_config
│   │   │   │               │   └── Security_Configuration_Documentation.md
│   │   │   │               ├── Service
│   │   │   │               │   ├── Not_Done
│   │   │   │               │   │   ├── OrderLineService.java
│   │   │   │               │   │   ├── ProductCategoryService.java
│   │   │   │               │   │   ├── ProductConfigurationService.java
│   │   │   │               │   │   └── Service_Documentation.md
│   │   │   │               │   ├── AddressService.java
│   │   │   │               │   ├── CategoryCUDService.java
│   │   │   │               │   ├── CategoryService.java
│   │   │   │               │   ├── ChatService.java
│   │   │   │               │   ├── ContactService.java
│   │   │   │               │   ├── CustomOAuth2UserService.java
│   │   │   │               │   ├── CustomProductService.java
│   │   │   │               │   ├── FileStorageService.java
│   │   │   │               │   ├── OrderService.java
│   │   │   │               │   ├── ProductCreateService.java
│   │   │   │               │   ├── ProductService.java
│   │   │   │               │   ├── ProductUpdateService.java
│   │   │   │               │   ├── PromotionService.java
│   │   │   │               │   ├── ShoppingCartItemService.java
│   │   │   │               │   ├── ShoppingCartService.java
│   │   │   │               │   ├── SiteUserService.java
│   │   │   │               │   ├── UserAddressService.java
│   │   │   │               │   └── UserReviewService.java
│   │   │   │               ├── Utils
│   │   │   │               │   └── Utils_Documentation.markdown
│   │   │   │               └── BackendApplication.java
│   │   │   └── resources
│   │   │       └── application.yaml
│   │   └── test
│   │       └── java
│   │           └── com
│   │               └── example
│   │                   └── backend
│   │                       └── BackendApplicationTests.java
│   ├── .gitattributes
│   ├── .gitignore
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── order-requests.json
│   ├── pom.xml
│   └── test-order-creation.json
├── perfect_react
│   ├── comment_backups
│   │   └── src
│   │       ├── components
│   │       │   ├── CartSync
│   │       │   │   └── CartAuthSync.jsx
│   │       │   ├── ChatWidget
│   │       │   │   ├── ChatWidget.jsx
│   │       │   │   └── ChatWidget.module.css
│   │       │   ├── admin
│   │       │   │   ├── AdminHeader
│   │       │   │   │   ├── AdminHeader.jsx
│   │       │   │   │   └── AdminHeader.module.css
│   │       │   │   ├── AdminLayout
│   │       │   │   │   ├── AdminLayout.jsx
│   │       │   │   │   └── AdminLayout.module.css
│   │       │   │   └── AdminSidebar
│   │       │   │       ├── AdminSidebar.jsx
│   │       │   │       └── AdminSidebar.module.css
│   │       │   ├── ai-tryon
│   │       │   │   └── ImageUploader.css
│   │       │   ├── common
│   │       │   │   ├── Footer
│   │       │   │   │   ├── Footer.jsx
│   │       │   │   │   └── Footer.module.css
│   │       │   │   └── Header
│   │       │   │       ├── Header.jsx
│   │       │   │       └── Header.module.css
│   │       │   ├── dev
│   │       │   │   └── CartMockHelper.jsx
│   │       │   └── ui
│   │       │       ├── Button
│   │       │       │   ├── Button.jsx
│   │       │       │   └── Button.module.css
│   │       │       ├── Input
│   │       │       │   └── Input.module.css
│   │       │       ├── Modal
│   │       │       │   ├── Modal.jsx
│   │       │       │   └── Modal.module.css
│   │       │       └── cart
│   │       │           ├── AddressSelector.jsx
│   │       │           └── radio-group.jsx
│   │       ├── hooks
│   │       │   ├── useApi.js
│   │       │   ├── useAuth.js
│   │       │   ├── useCart.js
│   │       │   └── useLocalStorage.js
│   │       ├── pages
│   │       │   ├── admin
│   │       │   │   ├── Category
│   │       │   │   │   ├── Category.jsx
│   │       │   │   │   └── Category.module.css
│   │       │   │   ├── Chat
│   │       │   │   │   ├── AdminChat.jsx
│   │       │   │   │   └── AdminChat.module.css
│   │       │   │   ├── Contacts
│   │       │   │   │   ├── Contact.module.css
│   │       │   │   │   ├── Contact.modulo.css
│   │       │   │   │   ├── Contacts.jsx
│   │       │   │   │   └── index.js
│   │       │   │   ├── Dashboard
│   │       │   │   │   ├── Dashboard.jsx
│   │       │   │   │   └── Dashboard.module.css
│   │       │   │   ├── Orders
│   │       │   │   │   ├── Orders.jsx
│   │       │   │   │   └── Orders.module.css
│   │       │   │   ├── Products
│   │       │   │   │   ├── Products.jsx
│   │       │   │   │   └── Products.module.css
│   │       │   │   └── Users
│   │       │   │       ├── Users.jsx
│   │       │   │       └── Users.module.css
│   │       │   └── client
│   │       │       ├── Cart
│   │       │       │   ├── CartCheckout.css
│   │       │       │   ├── CartCheckout.jsx
│   │       │       │   └── CartLoading.css
│   │       │       ├── Contact
│   │       │       │   ├── Contact.jsx
│   │       │       │   └── Contact.module.css
│   │       │       ├── Design
│   │       │       │   ├── Design.jsx
│   │       │       │   └── Design.module.css
│   │       │       ├── Home
│   │       │       │   ├── Home.jsx
│   │       │       │   └── Home.module.css
│   │       │       ├── Login
│   │       │       │   ├── AuthPage.css
│   │       │       │   ├── AuthPage.jsx
│   │       │       │   └── OAuth2RedirectHandler.jsx
│   │       │       ├── Order
│   │       │       │   └── Order.jsx
│   │       │       ├── OrderHistory
│   │       │       │   ├── OrderHistory.css
│   │       │       │   └── OrderHistory.jsx
│   │       │       ├── Products
│   │       │       │   ├── ProductDetail.jsx
│   │       │       │   ├── ProductDetail.module.css
│   │       │       │   ├── Products.jsx
│   │       │       │   └── Products.module.css
│   │       │       ├── UserProfile
│   │       │       │   ├── UserProfile.jsx
│   │       │       │   └── UserProfile.module.css
│   │       │       └── VirtualTryOn
│   │       │           ├── VirtualTryOn.css
│   │       │           └── VirtualTryOn.jsx
│   │       ├── routes
│   │       │   ├── guards
│   │       │   │   └── RoleGuard.jsx
│   │       │   ├── PrivateRoute.jsx
│   │       │   ├── adminRoutes.jsx
│   │       │   ├── index.jsx
│   │       │   └── routeConfig.jsx
│   │       ├── services
│   │       │   ├── aiService.js
│   │       │   ├── api.js
│   │       │   ├── authService.js
│   │       │   ├── cartMockData.js
│   │       │   ├── cart_service.js
│   │       │   ├── categoryService.js
│   │       │   ├── chatService.js
│   │       │   ├── contactService.js
│   │       │   ├── dashboardService.js
│   │       │   ├── designService.js
│   │       │   ├── geminiService.js
│   │       │   ├── httpClient.js
│   │       │   ├── orderHistory.js
│   │       │   ├── orderService.js
│   │       │   ├── productService.js
│   │       │   ├── promotionService.js
│   │       │   ├── userReviewService.js
│   │       │   ├── userService.js
│   │       │   ├── user_profile_service.js
│   │       │   └── webSocketService.js
│   │       ├── store
│   │       │   ├── slices
│   │       │   │   ├── aiTryOnSlice.js
│   │       │   │   ├── authSlice.js
│   │       │   │   ├── cartSlice.js
│   │       │   │   ├── designSlice.js
│   │       │   │   ├── productSlice.js
│   │       │   │   └── uiSlice.js
│   │       │   └── store.js
│   │       ├── styles
│   │       │   ├── globals.css
│   │       │   └── variables.css
│   │       ├── types
│   │       │   └── index.js
│   │       ├── utils
│   │       │   ├── auth.js
│   │       │   ├── constants.js
│   │       │   ├── helpers.js
│   │       │   └── validators.js
│   │       ├── App.jsx
│   │       └── main.jsx
│   ├── docs
│   │   └── assignments.md
│   ├── public
│   │   ├── Avatar
│   │   ├── Img
│   │   ├── Product
│   │   └── vite.svg
│   ├── scripts
│   │   └── restore-backups.js
│   ├── src
│   │   ├── assets
│   │   │   ├── avt.png
│   │   │   ├── react.svg
│   │   │   ├── t1.jpg
│   │   │   └── t1.png
│   │   ├── components
│   │   │   ├── CartSync
│   │   │   │   └── CartAuthSync.jsx
│   │   │   ├── ChatWidget
│   │   │   │   ├── ChatWidget.jsx
│   │   │   │   └── ChatWidget.module.css
│   │   │   ├── admin
│   │   │   │   ├── AdminHeader
│   │   │   │   │   ├── AdminHeader.jsx
│   │   │   │   │   ├── AdminHeader.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── AdminLayout
│   │   │   │   │   ├── AdminLayout.jsx
│   │   │   │   │   ├── AdminLayout.module.css
│   │   │   │   │   └── index.js
│   │   │   │   └── AdminSidebar
│   │   │   │       ├── AdminSidebar.jsx
│   │   │   │       ├── AdminSidebar.module.css
│   │   │   │       └── index.js
│   │   │   ├── ai-tryon
│   │   │   │   ├── ImageUploader.css
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   ├── ImageUploader.module.css
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── index.js
│   │   │   ├── common
│   │   │   │   ├── Footer
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Footer.module.css
│   │   │   │   │   └── index.js
│   │   │   │   └── Header
│   │   │   │       ├── Header.jsx
│   │   │   │       ├── Header.module.css
│   │   │   │       └── index.js
│   │   │   ├── dev
│   │   │   │   ├── CartMockHelper.jsx
│   │   │   │   └── index.js
│   │   │   └── ui
│   │   │       ├── Button
│   │   │       │   ├── Button.jsx
│   │   │       │   ├── Button.module.css
│   │   │       │   └── index.js
│   │   │       ├── Input
│   │   │       │   ├── Input.jsx
│   │   │       │   ├── Input.module.css
│   │   │       │   └── index.js
│   │   │       ├── Modal
│   │   │       │   ├── Modal.jsx
│   │   │       │   ├── Modal.module.css
│   │   │       │   └── index.js
│   │   │       └── cart
│   │   │           ├── AddressSelector.jsx
│   │   │           ├── PaymentQR.jsx
│   │   │           ├── button.jsx
│   │   │           ├── card.jsx
│   │   │           ├── checkbox.jsx
│   │   │           ├── input.jsx
│   │   │           ├── label.jsx
│   │   │           ├── radio-group.jsx
│   │   │           └── separator.jsx
│   │   ├── data
│   │   │   ├── 1a.png
│   │   │   ├── 2a.png
│   │   │   ├── 3a.png
│   │   │   ├── 5a.png
│   │   │   ├── 7a.png
│   │   │   └── Data.sql
│   │   ├── hooks
│   │   │   ├── useApi.js
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useLocalStorage.js
│   │   ├── lib
│   │   │   ├── Product
│   │   │   └── utils.ts
│   │   ├── pages
│   │   │   ├── admin
│   │   │   │   ├── Category
│   │   │   │   │   ├── Category.jsx
│   │   │   │   │   ├── Category.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Chat
│   │   │   │   │   ├── AdminChat.jsx
│   │   │   │   │   ├── AdminChat.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Contacts
│   │   │   │   │   ├── Contact.module.css
│   │   │   │   │   ├── Contact.modulo.css
│   │   │   │   │   ├── Contacts.jsx
│   │   │   │   │   └── index.js
│   │   │   │   ├── Dashboard
│   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   ├── Dashboard.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Orders
│   │   │   │   │   ├── Orders.jsx
│   │   │   │   │   ├── Orders.module.css
│   │   │   │   │   └── index.js
│   │   │   │   ├── Products
│   │   │   │   │   ├── Products.jsx
│   │   │   │   │   ├── Products.module.css
│   │   │   │   │   └── index.js
│   │   │   │   └── Users
│   │   │   │       ├── Users.jsx
│   │   │   │       ├── Users.module.css
│   │   │   │       └── index.js
│   │   │   └── client
│   │   │       ├── Cart
│   │   │       │   ├── CartCheckout.css
│   │   │       │   ├── CartCheckout.jsx
│   │   │       │   ├── CartLoading.css
│   │   │       │   ├── Fututure_cart.md
│   │   │       │   └── index.js
│   │   │       ├── Contact
│   │   │       │   ├── Contact.jsx
│   │   │       │   ├── Contact.module.css
│   │   │       │   └── index.js
│   │   │       ├── Design
│   │   │       │   ├── Design.jsx
│   │   │       │   ├── Design.module.css
│   │   │       │   └── index.js
│   │   │       ├── Home
│   │   │       │   ├── Home.jsx
│   │   │       │   ├── Home.module.css
│   │   │       │   └── index.js
│   │   │       ├── Login
│   │   │       │   ├── AuthPage.css
│   │   │       │   ├── AuthPage.jsx
│   │   │       │   ├── OAuth2RedirectHandler.jsx
│   │   │       │   └── index.js
│   │   │       ├── Order
│   │   │       │   ├── Order.css
│   │   │       │   ├── Order.jsx
│   │   │       │   ├── QR.jsx
│   │   │       │   ├── index.js
│   │   │       │   └── z7203852465749_428537538c6e2e66b0bb1b06cc41ffdb.jpg
│   │   │       ├── OrderHistory
│   │   │       │   ├── OrderHistory.css
│   │   │       │   ├── OrderHistory.jsx
│   │   │       │   └── index.js
│   │   │       ├── Products
│   │   │       │   ├── ProductDetail.jsx
│   │   │       │   ├── ProductDetail.module.css
│   │   │       │   ├── Products.jsx
│   │   │       │   ├── Products.module.css
│   │   │       │   ├── index.detail.js
│   │   │       │   └── index.js
│   │   │       ├── UserProfile
│   │   │       │   ├── UserProfile.jsx
│   │   │       │   ├── UserProfile.module.css
│   │   │       │   └── index.js
│   │   │       └── VirtualTryOn
│   │   │           ├── VirtualTryOn.css
│   │   │           ├── VirtualTryOn.jsx
│   │   │           ├── index.js
│   │   │           └── try on old.txt
│   │   ├── routes
│   │   │   ├── guards
│   │   │   │   ├── AuthGuard.jsx
│   │   │   │   ├── GuestGuard.jsx
│   │   │   │   └── RoleGuard.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── PublicRoute.jsx
│   │   │   ├── adminRoutes.jsx
│   │   │   ├── index.jsx
│   │   │   └── routeConfig.jsx
│   │   ├── services
│   │   │   ├── aiService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── cartMockData.js
│   │   │   ├── cart_service.js
│   │   │   ├── categoryService.js
│   │   │   ├── chatService.js
│   │   │   ├── contactService.js
│   │   │   ├── dashboardService.js
│   │   │   ├── designService.js
│   │   │   ├── geminiService.js
│   │   │   ├── httpClient.js
│   │   │   ├── mockProducts.js
│   │   │   ├── orderHistory.js
│   │   │   ├── orderService.js
│   │   │   ├── productService.js
│   │   │   ├── promotionService.js
│   │   │   ├── userReviewService.js
│   │   │   ├── userService.js
│   │   │   ├── user_profile_service.js
│   │   │   └── webSocketService.js
│   │   ├── store
│   │   │   ├── slices
│   │   │   │   ├── aiTryOnSlice.js
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── cartSlice.js
│   │   │   │   ├── designSlice.js
│   │   │   │   ├── productSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   └── store.js
│   │   ├── styles
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   ├── types
│   │   │   └── index.js
│   │   ├── utils
│   │   │   ├── auth.js
│   │   │   ├── constants.js
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── .hintrc
│   ├── README.md
│   ├── env.example
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── virtual-try-on
│   ├── .venv
│   ├── .venv1
│   ├── Try on
│   ├── ao.jpg
│   ├── ao2.jpg
│   ├── ao3.jpg
│   ├── app.py
│   ├── model.jpg
├── data.sql
