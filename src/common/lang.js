// 🔥 导航栏选中效果逻辑
function initNavActive() {
  // 获取当前页面文件名
  const currentPage =
    window.location.pathname.split("/").pop().split(".")[0] || "index";
  const navLinks = document.querySelectorAll(".nav-link");

  // 给当前页对应导航项加active
  navLinks.forEach((link) => {
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }

    // 点击切换active
    link.addEventListener("click", function (e) {
      // 移动端折叠菜单
      const navbarCollapse = document.getElementById("nav");
      if (navbarCollapse.classList.contains("show")) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }

      // 移除所有active
      navLinks.forEach((l) => l.classList.remove("active"));
      // 给当前点击项加active
      this.classList.add("active");
    });
  });
}

// 语言切换逻辑
function initLang() {
  const text = document.getElementById("langText");
  const elements = document.querySelectorAll("[key]");
  const items = document.querySelectorAll(".lang-item");
  const saved = localStorage.getItem("lang") || currentLang;

  items.forEach((el) => {
    el.onclick = () => {
      const l = el.dataset.lang;
      text.textContent =
        l === "zh" ? "中文" : l === "en" ? "English" : "Español";
      elements.forEach((e) => {
        const key = e.getAttribute("key");
        if (lang[l][key]) setHtmlWithoutFlash(e, lang[l][key]);
      });
      localStorage.setItem("lang", l);
      currentLang = l;
      renderProductList();
      toggleFAQ();
      renderAfterSale();
      productDetailPage();
      corepro();
    };
    if (el.dataset.lang === saved) el.click();
  });
}

// 核心产品
function corepro() {
  let ele = "";
  const coreproContEle = document.getElementById("coreproCont");
  if (!coreproContEle) return;
  coreproContEle.innerHTML = "";
  [productList[1], productList[3], productList[5]].forEach((item, index) => {
    ele += `<div class="col-md-4">
          <div class="card card-hover h-100">
            <div style="background: url(${item.image});background-position: center;
    background-size: cover;
    height: 250px;
    width: 100%;
    background-repeat: no-repeat;"></div>
            <div class="card-body text-left">
              <h5 class="text-line-clamp-1">${item.name[currentLang]}</h5>
              <a href="products.html" class="btn btn-sm btn-main mt-2" key="detail">${item.btnText[currentLang]}</a>
            </div>
          </div>
        </div>`;
  });
  coreproContEle.innerHTML = ele;
}

// 常见问题
function toggleFAQ() {
  // 常见问题
  const faqAccordionEle = document.getElementById("faqAccordion");
  if (!faqAccordionEle) return;
  faqAccordionEle.innerHTML = ""; // 先清空
  questionList[currentLang].forEach((item, index) => {
    const faqItem = document.createElement("div");
    faqItem.className =
      "accordion-item mb-3 border rounded shadow-sm overflow-hidden";
    faqItem.innerHTML = `
        <h5 class="accordion-header">
          <button class="accordion-button collapsed fw-semibold" type="button" data-bs-toggle="collapse" data-bs-target="#q${index + 1}">
            ${item.question}
          </button>
        </h5>
        <div id="q${index + 1}" class="accordion-collapse collapse" data-bs-parent="#faqAccordion">
          <div class="accordion-body text-muted">
            ${item.answer}
          </div>
        </div>
      `;
    faqAccordionEle.appendChild(faqItem);
  });
}

function toggleComponeyInfo() {
  // 切换标签样式
  const tabs = document.querySelectorAll(".list-group-item");
  const contents = document.querySelectorAll(".about-desc");

  if (!tabs.length || !contents.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 移除所有 active
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      // 当前添加 active
      tab.classList.add("active");
      const target = tab.dataset.target;
      document
        .querySelector(`.about-desc[key="${target}"]`)
        .classList.add("active");
    });
  });
}

// 产品列表
function renderProductList() {
  const container = document.getElementById("productListContainer");
  if (!container) return;

  let html = "";
  productList.forEach((item) => {
    html += `
      <div class="col-md-6 col-lg-4">
          <div class="card card-hover h-100 overflow-hidden">
            <div class="row g-0 h-100">
              <div class="col-5 h-100" style="background-image: url(${item.image}); background-size: cover; background-position: center;">
              </div>
              <div class="col-7 p-3" style="position: relative; min-height: 200px;">
                <h5 class="w-100 text-overflow-ellipsis" title="${item.name[currentLang]}">${item.name[currentLang]}</h5>
                <p class="small text-muted mb-1 text-line-clamp" title="${item.desc[currentLang]}">${item.desc[currentLang]}</p>
                <a class="btn btn-sm btn-main mt-2" style="position: absolute; bottom: 1rem; right: 1rem;" href="productDetail.html?pid=${item.id}">${item.btnText[currentLang]}</a>
              </div>
            </div>
          </div>
        </div>
    `;
  });

  container.innerHTML = html;
}

// 售后保障
function renderAfterSale() {
  const afterServiceEl = document.getElementById("afterService");
  if (!afterServiceEl) return;
  let afterServiceHtml = "";
  afterSalesInfo[currentLang].forEach((item) => {
    afterServiceHtml += `  <div class="after-item">
                                    <div class="after-icon"><i class="iconfont ${item.icon}" style="font-size: 32px;"></i></div>
                                    <div class="after-text">
                                      <h3>${item.title}</h3>
                                      <p>${item.desc}</p>
                                    </div>
                                  </div>`;
  });
  afterServiceEl.innerHTML = afterServiceHtml;
}

// 产品详情页
function productDetailPage() {
  // render
  const isGo = window.location.href.includes("productDetail.html");
  if (!isGo) return;
  const urlParams = new URLSearchParams(window.location.search);
  const pid = urlParams.get("pid");
  const productData = productList.find((p) => p.id === pid);

  if (!pid || !productData) {
    // 没有pid参数，返回产品列表页
    window.history.back();
    return;
  }
  let thumbs = document.querySelectorAll(".thumb-item");
  const mainEle = document.getElementById("mainShow");
  // Render product details
  // 标题
  const proTitle = productData.name[currentLang] || productData.name["zh"];
  // 图片视频
  const imageAry = productData.imageAry;
  // 产品详情描述
  const productDetailDesc =
    productData.productDetailDesc[currentLang] ||
    productData.productDetailDesc["zh"];
  // 核心卖点
  const coreSellingPoints =
    productData.coreSellingPoints[currentLang] ||
    productData.coreSellingPoints["zh"];
  // 包装清单
  const packListData = packList[currentLang] || packList["zh"];
  // 规格参数
  const productSpecifications =
    productData.productSpecifications[currentLang] ||
    productData.productSpecifications["zh"];

  const titleEl = document.getElementById("productDetailTitle");
  const thumbListEl = document.getElementById("thumbList");
  const descEl = document.getElementById("productDetailDesc");
  const coreSellingPointsEl = document.getElementById("coreSellingPoints");
  const productSpecificationsEl = document.getElementById(
    "productSpecifications",
  );
  const packListEl = document.getElementById("packList");

  titleEl.textContent = proTitle;

  mainEle.innerHTML = "";
  // 图片list
  let thumbHtml = "";
  imageAry.forEach((item, index) => {
    if (item.type === "image") {
      thumbHtml += `<img class="thumb-item ${index === 0 ? "active" : ""}" data-type="image" src="${item.url}">`;
      if (index === 0) mainEle.appendChild(createImageEle(item.url));
    } else if (item.type === "video") {
      thumbHtml += `<video class="thumb-item ${index === 0 ? "active" : ""}" data-type="video" muted loop playsinline>
                            <source src="${item.url}" type="video/mp4">
                          </video>`;
      if (index === 0) mainEle.appendChild(createVideoEle(item.url));
    }
  });
  thumbListEl.innerHTML = thumbHtml;
  // thumbListEl.style.height = `${Math.min(imageAry.length * 100, 400)}px`; // 根据图片数量调整预览区高度，最多显示4张

  descEl.innerHTML = productDetailDesc;

  let coreSellingHtml = "";
  coreSellingPoints.forEach((point) => {
    coreSellingHtml += `<div class="point">
                                <h3>${point.title}</h3>
                                <p>${point.desc}</p>
                              </div>`;
  });
  coreSellingPointsEl.innerHTML = coreSellingHtml;

  let specHtml = "";
  productSpecifications.forEach((spec) => {
    specHtml += `<tr><th>${spec.title}</th><td>${spec.desc}</td></tr>`;
  });
  productSpecificationsEl.innerHTML = specHtml;

  let packHtml = "";
  packListData.forEach((item) => {
    packHtml += `<li>${item.title}</li>`;
  });
  packListEl.innerHTML = packHtml;

  thumbs = document.querySelectorAll(".thumb-item");

  thumbs.forEach((el) => {
    el.addEventListener("click", () => {
      thumbs.forEach((i) => i.classList.remove("active"));
      el.classList.add("active");
      mainEle.innerHTML = "";

      const type = el.dataset.type;
      if (type === "image") {
        mainEle.appendChild(createImageEle(el.src));
      } else {
        mainEle.appendChild(createVideoEle(el.querySelector("source").src));
      }
    });
  });

  // 定制化
  const customProduct = productData.customProduct;
  if (!customProduct) return;
  let ele = "";

  const customProductData = customProduct[currentLang];
  const customContainer = document.getElementById("customContainer");
  const customProductUlEle = document.getElementById("customProductUl");
  customProductUlEle.innerHTML = "";
  customProductData.forEach((item, index) => {
    ele += `<div class="customProductLi" style="width: 100%; margin-bottom:2rem;">
          <h3>${item.title}</h3>
          <div class="customProductLi" style="width: 100%;display: flex; flex-wrap: wrap; gap:10px;">`;

    item.list.forEach((itemInner, indexInner) => {
      ele += `
            <a href="${itemInner.url}" class="img-box">
              <image src="${itemInner.img}"></image>
              <div class="btn">${itemInner.btn}</div>
            </a>
          `;
    });

    ele += "</div></div>";
  });

  customProductUlEle.innerHTML = ele;
  customContainer.style.display = "block";
}

function createImageEle(src) {
  const img = document.createElement("img");
  img.src = src;
  return img;
}

function createVideoEle(src) {
  const video = document.createElement("video");
  video.controls = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.style.maxWidth = "100%";
  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";
  video.appendChild(source);
  return video;
}

function setHtmlWithoutFlash(el, html) {
  if (!hasHtmlTags(html)) el.textContent = html;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  el.replaceChildren(...temp.childNodes);
}

function hasHtmlTags(str) {
  const doc = new DOMParser().parseFromString(str, "text/html");
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}

// 页面加载完成后初始化
window.onload = function () {
  initLang();
  toggleComponeyInfo();
  initNavActive();
  renderProductList();
  productDetailPage();
  corepro();
};
