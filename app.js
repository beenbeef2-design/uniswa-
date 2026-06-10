// UniSwap App Logic

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize State
  let products = [];
  let chats = [];
  let wishlist = [];

  const currentUser = {
    id: "user_current",
    name: "나",
    school: "snu", // Seoul National University
    rating: 5.0,
    verified: true
  };

  let activeTab = "browse";
  let selectedCategory = "all";
  let selectedSchool = "all";
  let schoolToggleOnlyMySchool = false;
  let searchQuery = "";
  let sortBy = "newest";
  let activeChatId = null;
  let selectedProductForDetail = null;
  let uploadedImageBase64 = null; // Store base64 data for custom upload

  // Load from mockData or localStorage
  function loadState() {
    const localProducts = localStorage.getItem("uniswap_products");
    const localChats = localStorage.getItem("uniswap_chats");
    const localWishlist = localStorage.getItem("uniswap_wishlist");

    if (localProducts) {
      products = JSON.parse(localProducts);
    } else {
      products = [...window.UniSwapData.INITIAL_PRODUCTS];
      localStorage.setItem("uniswap_products", JSON.stringify(products));
    }

    if (localChats) {
      chats = JSON.parse(localChats);
    } else {
      chats = [...window.UniSwapData.INITIAL_CHATS];
      localStorage.setItem("uniswap_chats", JSON.stringify(chats));
    }

    if (localWishlist) {
      wishlist = JSON.parse(localWishlist);
    } else {
      wishlist = [];
      localStorage.setItem("uniswap_wishlist", JSON.stringify(wishlist));
    }
  }

  function saveState() {
    localStorage.setItem("uniswap_products", JSON.stringify(products));
    localStorage.setItem("uniswap_chats", JSON.stringify(chats));
    localStorage.setItem("uniswap_wishlist", JSON.stringify(wishlist));
  }

  // Helper formatting functions
  function formatPrice(num) {
    return num.toLocaleString() + "원";
  }

  function getSchoolName(schoolId) {
    const school = window.UniSwapData.UNIVERSITIES.find(u => u.id === schoolId);
    return school ? school.name : "기타 대학교";
  }

  // 2. DOM Elements
  const viewSections = {
    browse: document.getElementById("view-browse"),
    sell: document.getElementById("view-sell"),
    chat: document.getElementById("view-chat"),
    wishlist: document.getElementById("view-wishlist"),
    profile: document.getElementById("view-profile")
  };

  const navItems = document.querySelectorAll(".nav-item");
  const schoolSelect = document.getElementById("school-select");
  const navSearchInput = document.getElementById("nav-search-input");
  const categoryContainer = document.getElementById("category-container");
  const productsGrid = document.getElementById("products-grid");
  const resultsCount = document.getElementById("results-count");
  const schoolToggleBtn = document.getElementById("school-toggle-btn");
  const sortSelect = document.getElementById("sort-select");

  // Detail Modal Elements
  const detailModal = document.getElementById("detail-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalImg = document.getElementById("modal-img");
  const modalSchoolBadge = document.getElementById("modal-school-badge");
  const modalCategoryBadge = document.getElementById("modal-category-badge");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalCondition = document.getElementById("modal-condition");
  const modalSellerAvatar = document.getElementById("modal-seller-avatar");
  const modalSellerName = document.getElementById("modal-seller-name");
  const modalSellerRating = document.getElementById("modal-seller-rating");
  const modalDescription = document.getElementById("modal-description");
  const modalChatBtn = document.getElementById("modal-chat-btn");
  const modalLikeBtn = document.getElementById("modal-like-btn");

  // Sell Form Elements
  const sellForm = document.getElementById("sell-form");
  const sellCategorySelect = document.getElementById("sell-category");
  const sellSchoolSelect = document.getElementById("sell-school");
  const fileDragArea = document.getElementById("file-drag-area");
  const fileInput = document.getElementById("file-input");
  const filePreviewContainer = document.getElementById("file-preview-container");
  const conditionOptions = document.querySelectorAll(".condition-option");
  let selectedCondition = "S급 (새상품급)"; // default

  // Chat Elements
  const chatRoomsList = document.getElementById("chat-rooms-list");
  const chatMainWindow = document.getElementById("chat-main-window");
  const chatEmptyState = document.getElementById("chat-empty-state");
  const chatPartnerName = document.getElementById("chat-partner-name");
  const chatPartnerSchool = document.getElementById("chat-partner-school");
  const chatProductBar = document.getElementById("chat-product-bar");
  const chatProductImg = document.getElementById("chat-product-img");
  const chatProductTitle = document.getElementById("chat-product-title");
  const chatProductPrice = document.getElementById("chat-product-price");
  const chatMessagesContainer = document.getElementById("chat-messages-container");
  const chatInputForm = document.getElementById("chat-input-form");
  const chatInputField = document.getElementById("chat-input-field");

  // Wishlist Elements
  const wishlistGrid = document.getElementById("wishlist-grid");
  const wishlistEmpty = document.getElementById("wishlist-empty");

  // Profile Elements
  const profileListedGrid = document.getElementById("profile-listed-grid");
  const profileItemsCount = document.getElementById("profile-items-count");
  const profileLikesCount = document.getElementById("profile-likes-count");

  // 3. Navigation
  function switchTab(tabId) {
    activeTab = tabId;
    navItems.forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    Object.keys(viewSections).forEach(key => {
      if (key === tabId) {
        viewSections[key].classList.add("active");
      } else {
        viewSections[key].classList.remove("active");
      }
    });

    if (tabId === "browse") {
      renderProducts();
    } else if (tabId === "chat") {
      renderChatSidebar();
      if (activeChatId) {
        loadChatRoom(activeChatId);
      } else {
        chatMainWindow.style.display = "none";
        chatEmptyState.style.display = "flex";
      }
    } else if (tabId === "wishlist") {
      renderWishlist();
    } else if (tabId === "profile") {
      renderProfile();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      switchTab(item.dataset.tab);
    });
  });

  // 4. Populate Filtering dropdowns
  function populateDropdowns() {
    // Navbar School
    schoolSelect.innerHTML = `<option value="all">전체 대학교</option>`;
    window.UniSwapData.UNIVERSITIES.forEach(u => {
      schoolSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });

    // Sell Form School
    sellSchoolSelect.innerHTML = "";
    window.UniSwapData.UNIVERSITIES.forEach(u => {
      sellSchoolSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });

    // Sell Form Category
    sellCategorySelect.innerHTML = "";
    window.UniSwapData.CATEGORIES.forEach(c => {
      if (c.id !== "all") {
        sellCategorySelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
      }
    });
  }

  // 5. Render Categories Bar
  function renderCategoriesBar() {
    categoryContainer.innerHTML = "";
    window.UniSwapData.CATEGORIES.forEach(c => {
      const activeClass = selectedCategory === c.id ? "active" : "";
      categoryContainer.innerHTML += `
        <button class="category-btn ${activeClass}" data-id="${c.id}">
          <i data-lucide="${c.icon}"></i>
          <span>${c.name}</span>
        </button>
      `;
    });
    lucide.createIcons();

    // Click Events
    document.querySelectorAll(".category-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedCategory = btn.dataset.id;
        renderCategoriesBar();
        renderProducts();
      });
    });
  }

  // 6. Render Product Grid
  function renderProducts() {
    let filtered = [...products];

    // Category Filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // School Filter
    if (schoolToggleOnlyMySchool) {
      filtered = filtered.filter(p => p.school === currentUser.school);
    } else if (selectedSchool !== "all") {
      filtered = filtered.filter(p => p.school === selectedSchool);
    }

    // Search Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort Products
    if (sortBy === "newest") {
      // Assuming initial order or newer IDs first (pre-pended items go to beginning)
      // Since we prepend uploaded products, index order matches newest first.
    } else if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
    }

    resultsCount.textContent = `총 ${filtered.length}개 상품`;

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i data-lucide="info" style="font-size: 2.5rem; display: block; margin: 0 auto 1rem; color: var(--text-muted);"></i>
          <p style="font-weight: 600;">등록된 상품이 없습니다.</p>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">검색어나 대학 필터를 조정해보세요.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    productsGrid.innerHTML = "";
    filtered.forEach(p => {
      const isLiked = wishlist.includes(p.id) ? "liked" : "";
      const isMySchool = p.school === currentUser.school;
      const schoolBadgeStyle = isMySchool ? 'style="background: var(--success);"' : '';
      const formattedPrice = formatPrice(p.price);

      productsGrid.innerHTML += `
        <div class="product-card glass" data-id="${p.id}">
          <div class="card-img-wrapper">
            <img src="${p.image}" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60'">
            <div class="card-badge">${p.condition}</div>
            <div class="card-school-badge" ${schoolBadgeStyle}>${getSchoolName(p.school)}</div>
            <button class="card-like-btn ${isLiked}" data-id="${p.id}">
              <i data-lucide="heart" style="fill: ${isLiked ? 'currentColor' : 'none'}"></i>
            </button>
          </div>
          <div class="card-content">
            <h3 class="card-title">${p.title}</h3>
            <div class="card-price-row">
              <span class="card-price">${formattedPrice}</span>
              <span class="card-condition">${p.timeAgo}</span>
            </div>
            <div class="card-footer">
              <span class="card-seller-info">
                <i data-lucide="check-circle-2"></i> ${p.seller}
              </span>
              <div class="card-stats">
                <span><i data-lucide="eye" style="width: 12px; height: 12px;"></i> ${p.views}</span>
                <span><i data-lucide="heart" style="width: 12px; height: 12px;"></i> ${p.likes}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    lucide.createIcons();

    // Attach card click event
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        // Prevent opening if like button clicked
        if (e.target.closest(".card-like-btn")) return;
        openProductDetails(card.dataset.id);
      });
    });

    // Attach like button click event
    document.querySelectorAll(".card-like-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLikeProduct(btn.dataset.id);
      });
    });
  }

  // 7. Product Details Dialog
  function openProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    selectedProductForDetail = product;
    // Increment view count once per click
    product.views += 1;
    saveState();

    modalImg.src = product.image;
    modalImg.onerror = () => {
      modalImg.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
    };

    modalSchoolBadge.textContent = getSchoolName(product.school);
    if (product.school === currentUser.school) {
      modalSchoolBadge.style.background = "var(--success)";
    } else {
      modalSchoolBadge.style.background = "var(--primary)";
    }

    // Category mapping
    const categoryObj = window.UniSwapData.CATEGORIES.find(c => c.id === product.category);
    modalCategoryBadge.textContent = categoryObj ? categoryObj.name : "일반";

    modalTitle.textContent = product.title;
    modalPrice.textContent = formatPrice(product.price);
    modalCondition.textContent = product.condition;

    // Seller Info
    modalSellerAvatar.textContent = product.seller.substring(0, 2);
    modalSellerName.textContent = product.seller;
    modalSellerRating.textContent = `★ ${product.sellerRating.toFixed(1)}`;

    modalDescription.textContent = product.description;

    // Wishlist status in Modal
    const isLiked = wishlist.includes(product.id);
    if (isLiked) {
      modalLikeBtn.classList.add("liked");
      modalLikeBtn.querySelector("i").setAttribute("fill", "currentColor");
    } else {
      modalLikeBtn.classList.remove("liked");
      modalLikeBtn.querySelector("i").setAttribute("fill", "none");
    }

    detailModal.classList.add("active");
    lucide.createIcons();
  }

  function closeProductDetails() {
    detailModal.classList.remove("active");
    selectedProductForDetail = null;
    renderProducts(); // Update view count in browse grid
  }

  modalCloseBtn.addEventListener("click", closeProductDetails);
  detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) closeProductDetails();
  });

  // Modal actions
  modalLikeBtn.addEventListener("click", () => {
    if (selectedProductForDetail) {
      const isLiked = toggleLikeProduct(selectedProductForDetail.id);
      if (isLiked) {
        modalLikeBtn.classList.add("liked");
        modalLikeBtn.querySelector("i").setAttribute("fill", "currentColor");
      } else {
        modalLikeBtn.classList.remove("liked");
        modalLikeBtn.querySelector("i").setAttribute("fill", "none");
      }
      lucide.createIcons();
    }
  });

  modalChatBtn.addEventListener("click", () => {
    if (selectedProductForDetail) {
      closeProductDetails();
      startChatWithSeller(selectedProductForDetail);
    }
  });

  // 8. Wishlist Controller
  function toggleLikeProduct(productId) {
    const idx = wishlist.indexOf(productId);
    const product = products.find(p => p.id === productId);
    let liked = false;

    if (idx > -1) {
      wishlist.splice(idx, 1);
      if (product && product.likes > 0) product.likes--;
    } else {
      wishlist.push(productId);
      if (product) product.likes++;
      liked = true;
    }

    saveState();
    renderProducts();
    return liked;
  }

  function renderWishlist() {
    const likedProducts = products.filter(p => wishlist.includes(p.id));

    if (likedProducts.length === 0) {
      wishlistGrid.style.display = "none";
      wishlistEmpty.style.display = "flex";
      return;
    }

    wishlistGrid.style.display = "grid";
    wishlistEmpty.style.display = "none";

    wishlistGrid.innerHTML = "";
    likedProducts.forEach(p => {
      const formattedPrice = formatPrice(p.price);
      wishlistGrid.innerHTML += `
        <div class="product-card glass" data-id="${p.id}">
          <div class="card-img-wrapper">
            <img src="${p.image}" alt="${p.title}">
            <div class="card-badge">${p.condition}</div>
            <div class="card-school-badge">${getSchoolName(p.school)}</div>
            <button class="card-like-btn liked" data-id="${p.id}">
              <i data-lucide="heart" style="fill: currentColor"></i>
            </button>
          </div>
          <div class="card-content">
            <h3 class="card-title">${p.title}</h3>
            <div class="card-price-row">
              <span class="card-price">${formattedPrice}</span>
              <span class="card-condition">${p.timeAgo}</span>
            </div>
            <div class="card-footer">
              <span class="card-seller-info">
                <i data-lucide="check-circle-2"></i> ${p.seller}
              </span>
              <div class="card-stats">
                <span><i data-lucide="eye" style="width: 12px; height: 12px;"></i> ${p.views}</span>
                <span><i data-lucide="heart" style="width: 12px; height: 12px;"></i> ${p.likes}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    lucide.createIcons();

    // Click handlers
    wishlistGrid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".card-like-btn")) return;
        openProductDetails(card.dataset.id);
      });
    });

    wishlistGrid.querySelectorAll(".card-like-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLikeProduct(btn.dataset.id);
        renderWishlist(); // dynamic refresh
      });
    });
  }

  // Wishlist Empty State Button
  document.getElementById("wishlist-empty-btn").addEventListener("click", () => {
    switchTab("browse");
  });

  // 9. Sell / Upload Manager
  // Select Condition options
  conditionOptions.forEach(opt => {
    opt.addEventListener("click", () => {
      conditionOptions.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");
      selectedCondition = opt.dataset.val;
    });
  });

  // Image Upload Handling (Drag & Drop + File selection)
  fileDragArea.addEventListener("click", () => fileInput.click());

  fileDragArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    fileDragArea.classList.add("dragover");
  });

  fileDragArea.addEventListener("dragleave", () => {
    fileDragArea.classList.remove("dragover");
  });

  fileDragArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileDragArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  });

  function handleImageFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 등록할 수 있습니다.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageBase64 = e.target.result;
      showPreview(uploadedImageBase64);
    };
    reader.readAsDataURL(file);
  }

  function showPreview(base64Str) {
    filePreviewContainer.style.display = "grid";
    filePreviewContainer.innerHTML = `
      <div class="file-preview-item">
        <img src="${base64Str}">
        <button type="button" class="remove-img-btn" id="remove-img-btn">×</button>
      </div>
    `;
    document.getElementById("remove-img-btn").addEventListener("click", () => {
      uploadedImageBase64 = null;
      filePreviewContainer.style.display = "none";
      filePreviewContainer.innerHTML = "";
      fileInput.value = "";
    });
  }

  sellForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("sell-title").value.trim();
    const priceVal = parseInt(document.getElementById("sell-price").value, 10);
    const category = sellCategorySelect.value;
    const school = sellSchoolSelect.value;
    const description = document.getElementById("sell-description").value.trim();

    if (!title || isNaN(priceVal) || !description) {
      alert("필수 항목들을 바르게 채워주세요.");
      return;
    }

    // Default Images based on Category if no uploaded image
    let imageSrc = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
    if (uploadedImageBase64) {
      imageSrc = uploadedImageBase64;
    } else {
      // Pick generic default images
      if (category === "electronics") {
        imageSrc = "assets/headphones.png";
      } else if (category === "books") {
        imageSrc = "assets/college_textbook.png";
      } else if (category === "fashion") {
        imageSrc = "assets/varsity_jacket.png";
      }
    }

    const newProduct = {
      id: "prod_" + Date.now(),
      title: title,
      price: priceVal,
      description: description,
      category: category,
      condition: selectedCondition,
      school: school,
      views: 0,
      likes: 0,
      chatCount: 0,
      image: imageSrc,
      seller: currentUser.name,
      sellerRating: currentUser.rating,
      timeAgo: "방금 전",
      verified: currentUser.verified
    };

    // Add to state & persist
    products.unshift(newProduct);
    saveState();

    // Reset Form & Upload vars
    sellForm.reset();
    uploadedImageBase64 = null;
    filePreviewContainer.style.display = "none";
    filePreviewContainer.innerHTML = "";
    selectedCondition = "S급 (새상품급)";
    conditionOptions.forEach((o, i) => {
      if (i === 0) o.classList.add("active");
      else o.classList.remove("active");
    });

    alert("상품 등록이 완료되었습니다!");
    switchTab("browse");
  });

  // 10. Chat Controller
  function startChatWithSeller(product) {
    // Check if chat already exists for this product
    let existingChat = chats.find(c => c.productId === product.id && c.sellerName === product.seller);

    if (!existingChat) {
      const initialMsgs = [
        { sender: "buyer", text: `안녕하세요! '${product.title}' 상품 아직 판매 중인가요? 거래 원합니다.`, time: "방금 전" }
      ];

      // Dynamic custom replies based on product
      const botResponses = [
        `안녕하세요! 네 아직 거래 가능합니다. 직거래 희망하시나요?`,
        `주로 대학교 중앙도서관 근처나 학생회관 건물에서 교내 직거래를 합니다. 몇 시쯤 편하세요?`,
        `네 좋습니다. 그때 오셔서 상태 확인해보시고 기분 좋게 계좌송금 해주시면 됩니다~`
      ];

      existingChat = {
        chatId: "chat_" + Date.now(),
        productId: product.id,
        sellerName: product.seller,
        buyerName: currentUser.name,
        lastMessage: initialMsgs[0].text,
        lastTime: "방금 전",
        unread: false,
        messages: initialMsgs,
        botResponses: botResponses
      };

      // Add to chat list
      chats.unshift(existingChat);
      saveState();
    }

    activeChatId = existingChat.chatId;
    switchTab("chat");
  }

  function renderChatSidebar() {
    chatRoomsList.innerHTML = "";

    if (chats.length === 0) {
      chatRoomsList.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 0.85rem;">참여 중인 채팅방이 없습니다.</p>
        </div>
      `;
      return;
    }

    chats.forEach(c => {
      const isSelected = c.chatId === activeChatId ? "active" : "";
      const unreadBadge = c.unread ? `<div class="room-unread-badge"></div>` : "";
      const partnerName = c.sellerName === currentUser.name ? c.buyerName : c.sellerName;
      const avatarText = partnerName.substring(0, 2);

      chatRoomsList.innerHTML += `
        <div class="chat-room-item ${isSelected}" data-id="${c.chatId}">
          <div class="room-avatar">${avatarText}</div>
          <div class="room-details">
            <div class="room-header-row">
              <span class="room-name">${partnerName}</span>
              <span class="room-time">${c.lastTime}</span>
            </div>
            <div class="room-body-row">
              <span class="room-last-msg">${c.lastMessage}</span>
              ${unreadBadge}
            </div>
          </div>
        </div>
      `;
    });

    // Sidebar items click
    document.querySelectorAll(".chat-room-item").forEach(item => {
      item.addEventListener("click", () => {
        activeChatId = item.dataset.id;
        renderChatSidebar();
        loadChatRoom(activeChatId);
      });
    });
  }

  function loadChatRoom(chatId) {
    const chat = chats.find(c => c.chatId === chatId);
    if (!chat) return;

    // Clear unread flag
    chat.unread = false;
    saveState();

    chatEmptyState.style.display = "none";
    chatMainWindow.style.display = "flex";

    // Set Header partner info
    const partnerName = chat.sellerName === currentUser.name ? chat.buyerName : chat.sellerName;
    chatPartnerName.textContent = partnerName;

    // Show university for partner. Since this is simulation, match seller's school.
    const product = products.find(p => p.id === chat.productId);
    const partnerSchool = product ? getSchoolName(product.school) : "서울대학교";
    chatPartnerSchool.textContent = partnerSchool;

    // Set Product mini bar
    if (product) {
      chatProductBar.style.display = "flex";
      chatProductImg.src = product.image;
      chatProductImg.onerror = () => {
        chatProductImg.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=60";
      };
      chatProductTitle.textContent = product.title;
      chatProductPrice.textContent = formatPrice(product.price);

      // Make product bar clickable to open details modal
      chatProductBar.onclick = () => openProductDetails(product.id);
    } else {
      chatProductBar.style.display = "none";
    }

    // Render Messages log
    renderMessageLog(chat);
  }

  function renderMessageLog(chat) {
    chatMessagesContainer.innerHTML = "";
    chat.messages.forEach(msg => {
      const isMe = msg.sender === "buyer"; // 'buyer' represents current user '나' in this context
      const alignClass = isMe ? "me" : "other";

      chatMessagesContainer.innerHTML += `
        <div class="chat-bubble-wrapper ${alignClass}">
          <div class="chat-bubble">${msg.text}</div>
          <div class="chat-bubble-time">${msg.time}</div>
        </div>
      `;
    });

    // Scroll to bottom
    chatMessagesContainer.scrollTo({
      top: chatMessagesContainer.scrollHeight,
      behavior: "smooth"
    });
  }

  // Send message
  chatInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInputField.value.trim();
    if (!text || !activeChatId) return;

    const chat = chats.find(c => c.chatId === activeChatId);
    if (!chat) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append my message
    const myMsg = { sender: "buyer", text: text, time: currentTimeStr };
    chat.messages.push(myMsg);
    chat.lastMessage = text;
    chat.lastTime = currentTimeStr;

    chatInputField.value = "";
    saveState();
    renderMessageLog(chat);
    renderChatSidebar();

    // Trigger bot reply if responses remain
    if (chat.botResponses && chat.botResponses.length > 0) {
      setTimeout(() => {
        const botText = chat.botResponses.shift();
        const botMsg = { sender: "seller", text: botText, time: currentTimeStr };
        chat.messages.push(botMsg);
        chat.lastMessage = botText;
        chat.lastTime = currentTimeStr;
        chat.unread = true; // Mark unread for sidebar visual highlight

        saveState();
        // If we are still active in this room, it clears unread right away
        if (activeChatId === chat.chatId) {
          chat.unread = false;
          saveState();
          renderMessageLog(chat);
        }
        renderChatSidebar();
      }, 1500); // 1.5s delay
    }
  });

  // 11. Profile Page Manager
  function renderProfile() {
    // Listed by me (products where seller === "나")
    const myProducts = products.filter(p => p.seller === currentUser.name);

    profileItemsCount.textContent = myProducts.length;
    profileLikesCount.textContent = wishlist.length;

    if (myProducts.length === 0) {
      profileListedGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i data-lucide="package-open" style="font-size: 2.5rem; display: block; margin: 0 auto 1rem; color: var(--text-muted);"></i>
          <p style="font-size: 0.9rem;">등록하신 판매 상품이 없습니다.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    profileListedGrid.innerHTML = "";
    myProducts.forEach(p => {
      const formattedPrice = formatPrice(p.price);
      profileListedGrid.innerHTML += `
        <div class="product-card glass" data-id="${p.id}">
          <div class="card-img-wrapper">
            <img src="${p.image}" alt="${p.title}">
            <div class="card-badge">${p.condition}</div>
            <div class="card-school-badge">${getSchoolName(p.school)}</div>
            <button class="card-like-btn" data-id="${p.id}">
              <i data-lucide="heart"></i>
            </button>
          </div>
          <div class="card-content">
            <h3 class="card-title">${p.title}</h3>
            <div class="card-price-row">
              <span class="card-price">${formattedPrice}</span>
              <span class="card-condition">${p.timeAgo}</span>
            </div>
            <div class="card-footer">
              <span class="card-seller-info">
                <i data-lucide="check-circle-2"></i> ${p.seller}
              </span>
              <div class="card-stats">
                <span><i data-lucide="eye" style="width: 12px; height: 12px;"></i> ${p.views}</span>
                <span><i data-lucide="heart" style="width: 12px; height: 12px;"></i> ${p.likes}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    lucide.createIcons();

    // Click handler for profile card items
    profileListedGrid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => openProductDetails(card.dataset.id));
    });
  }

  // 12. Search & General Event Listeners
  navSearchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  schoolSelect.addEventListener("change", (e) => {
    selectedSchool = e.target.value;
    schoolToggleOnlyMySchool = false; // Reset toggle if user changes dropdown
    schoolToggleBtn.classList.remove("active");
    renderProducts();
  });

  schoolToggleBtn.addEventListener("click", () => {
    schoolToggleOnlyMySchool = !schoolToggleOnlyMySchool;
    schoolToggleBtn.classList.toggle("active");
    // Sync dropdown UI
    if (schoolToggleOnlyMySchool) {
      schoolSelect.value = currentUser.school;
      selectedSchool = currentUser.school;
    } else {
      schoolSelect.value = "all";
      selectedSchool = "all";
    }
    renderProducts();
  });

  sortSelect.addEventListener("change", (e) => {
    sortBy = e.target.value;
    renderProducts();
  });

  // Sell Button on navigation triggers 'sell' tab
  document.getElementById("nav-sell-btn").addEventListener("click", () => {
    switchTab("sell");
  });

  // App Initialization
  loadState();
  populateDropdowns();
  renderCategoriesBar();
  switchTab("browse");
});
