import "../public/styles/abc.css";
import "../public/styles/main.css";
import "../public/styles/service.css";
import { API_URL } from "@/lib/constants";
import { cookies } from "next/headers";
import LogoutButton from "./logout-button";

export default async function BaotaoService() {
  let user = null;

  try {
    const cookieStore = await cookies();
    const tokenUser = cookieStore.get("tokenUser")?.value;

    if (tokenUser) {
      const res = await fetch(`${API_URL}/user/info`, {
        headers: {
          Cookie: `tokenUser=${tokenUser}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        user = data.data.user;
      }
    }
  } catch (err) {
    console.error("Failed to fetch user info:", err);
  }

  const hour = new Date().getHours();
  let partOfDay = "";
  if (hour >= 5 && hour <= 12) {
    partOfDay = "Morning";
  } else if (hour >= 13 && hour <= 17) {
    partOfDay = "Afternoon";
  } else {
    partOfDay = "Evening";
  }

  return (
    <div className="screen-outer clearfix">
      <div className="main" role="main">

        <div className="core J_Core">
          <div className="business-entry-container">
            <div
              className="tbpc-row row-base"
              style={{
                marginLeft: "-8px",
                marginRight: "-8px",
                maxWidth: 1616,
                marginBottom: 16,
              }}
            >
              <div className="tbpc-col tbpc-col-30 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <div
                    className="business-entry-title-card-top"
                    href="#"
                    data-spm="d1"
                  >
                    <div className="business-entry-title-card-top-image" />
                  </div>
                  <div className="business-entry-item-card-content-container">
                    <a
                      className="business-entry-item-card-content"
                      href="/categories/furniture"
                      target="_blank"
                      data-spm="d1_1"
                      style={{ marginLeft: 0 }}
                    >
                      <div className="business-entry-item-card-content-container-image">
                        <img src="https://img.alicdn.com/bao/upload/O1CN01t2MfWo1fHoBJ52wED_!!6000000003982-2-yinhe.png_360x360q90.jpg" />
                        <div className="business-entry-item-card-content-container-image-mask" />
                      </div>
                      <div
                        className="business-entry-item-card-content-coin"
                        style={{ marginTop: 8, bottom: 0 }}
                      >
                        <span className="business-entry-item-card-content-coin-title">
                          $
                        </span>
                        <span>4419.15</span>
                      </div>
                    </a>
                    <a
                      className="business-entry-item-card-content"
                      href="/categories/kitchen"
                      target="_blank"
                      data-spm="d1_2"
                      style={{ marginLeft: 8 }}
                    >
                      <div className="business-entry-item-card-content-container-image">
                        <img src="https://img.alicdn.com/bao/upload/O1CN01Gc3Xvz1J3gOcJgFlA_!!6000000000973-2-yinhe.png_360x360q90.jpg" />
                        <div className="business-entry-item-card-content-container-image-mask" />
                      </div>
                      <div
                        className="business-entry-item-card-content-coin"
                        style={{ marginTop: 8, bottom: 0 }}
                      >
                        <span className="business-entry-item-card-content-coin-title">
                          $
                        </span>
                        <span>186</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="tbpc-col tbpc-col-30 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <div>
                    <div
                      tabIndex={-1}
                      style={{ width: "100%", display: "inline-block" }}
                    >
                      <div
                        className="home-ad-banner-item"
                        data-spm="d4"
                        style={{
                          backgroundImage:
                            'url("https://img.alicdn.com/imgextra/i1/O1CN01bFJoSi1hIqMukl0Ps_!!6000000004255-2-tps-1040-384.png")',
                          height: 158,
                        }}
                      >
                        <div
                          className="home-ad-banner-item-content-container"
                          style={{ color: "rgb(255, 255, 255)" }}
                        >
                          <div className="home-ad-banner-item-title-top">
                            Reliable{" "}
                          </div>
                          <div className="home-ad-banner-item-title-middle">
                            Caring{" "}
                          </div>
                          <div className="home-ad-banner-item-subtitle">
                            High-quality products
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tbpc-row row-base"
              style={{
                marginLeft: "-8px",
                marginRight: "-8px",
                maxWidth: 1616,
              }}
            >
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-bbs-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <div
                    className="business-entry-item-card"
                    data-spm="yingxiao"
                    style={{ backgroundColor: "rgb(247, 247, 247)" }}
                  >
                    <a
                      className="business-entry-title-card-top"
                      href="/categories/laptops"
                      target="_blank"
                      data-spm="d3"
                    >
                      <div className="business-entry-title-card-top-title-container">
                        <div className="business-entry-title-card-top-title-rtl">
                          <div
                            className="business-entry-title-card-top-title"
                            style={{
                              color: "var(--tbpc-primary-color, #1f1f1f)",
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="business-entry-title-card-top-image" />
                    </a>
                    <div className="business-entry-item-card-content-container">
                      <a
                        className="business-entry-item-card-content"
                        href="/categories/furniture"
                        target="_blank"
                        data-spm="d3_1"
                        style={{ marginLeft: 0 }}
                      >
                        <div className="business-entry-item-card-content-container-image">
                          <img src="https://img.alicdn.com/bao/upload/O1CN01tfOIaq1LNUWpergeH_!!6000000001287-2-yinhe.png_360x360q90.jpg" />
                          <div className="business-entry-item-card-content-container-image-mask" />
                        </div>
                        <div
                          className="business-entry-item-card-content-coin"
                          style={{ marginTop: 8, bottom: 0 }}
                        >
                          <span className="business-entry-item-card-content-coin-title">
                            $
                          </span>
                          <span>769</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <a
                    className="business-entry-title-card-top"
                    href="/categories/laptops"
                    target="_blank"
                    data-spm="d3"
                  >
                    <div className="business-entry-title-card-top-title-container">
                      <div className="business-entry-title-card-top-title-rtl">
                        <div
                          className="business-entry-title-card-top-title"
                          style={{
                            color: "var(--tbpc-primary-color, #1f1f1f)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="business-entry-title-card-top-image" />
                  </a>
                  <div className="business-entry-item-card-content-container">
                    <a
                      className="business-entry-item-card-content"
                      href="/categories/laptops"
                      target="_blank"
                      data-spm="d3_1"
                      style={{ marginLeft: 0 }}
                    >
                      <div className="business-entry-item-card-content-container-image">
                        <img src="https://img.alicdn.com/bao/upload/O1CN01PmAr4G1hzRB2R1WLw_!!6000000004348-0-yinhe.jpg_360x360q90.jpg" />
                        <div className="business-entry-item-card-content-container-image-mask" />
                      </div>
                      <div
                        className="business-entry-item-card-content-coin"
                        style={{ marginTop: 8, bottom: 0 }}
                      >
                        <span className="business-entry-item-card-content-coin-title">
                          $
                        </span>
                        <span>9119.05</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <a
                    className="business-entry-title-card-top"
                    href="/categories/laptops"
                    target="_blank"
                    data-spm="d4"
                  >
                    <div className="business-entry-title-card-top-title-container">
                      <div className="business-entry-title-card-top-title-rtl">
                        <div
                          className="business-entry-title-card-top-title"
                          style={{ color: "rgb(41, 189, 0)" }}
                        ></div>
                        <div className="business-entry-title-card-top-title-tag-left"></div>
                      </div>
                    </div>
                    <div className="business-entry-title-card-top-image" />
                  </a>
                  <div className="business-entry-item-card-content-container">
                    <a
                      className="business-entry-item-card-content"
                      href="/categories/phones"
                      target="_blank"
                      data-spm="d4_1"
                      style={{ marginLeft: 0 }}
                    >
                      <div className="business-entry-item-card-content-container-image">
                        <img src="https://img.alicdn.com/bao/upload/O1CN01DaVkaa1ymvhpaxijC_!!6000000006622-2-yinhe.png_360x360q90.jpg" />
                        <div className="business-entry-item-card-content-container-image-mask" />
                      </div>
                      <div
                        className="business-entry-item-card-content-coin"
                        style={{ marginTop: 8, bottom: 0 }}
                      >
                        <span className="business-entry-item-card-content-coin-title">
                          $
                        </span>
                        <span>458</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className="tbpc-col tbpc-col-15 business-entry-col tbpc-col tbpc-col-horizon-8 business-entry-col">
                <div
                  className="business-entry-item-card"
                  data-spm="yingxiao"
                  style={{ backgroundColor: "rgb(247, 247, 247)" }}
                >
                  <a
                    className="business-entry-title-card-top"
                    href="/categories/furniture "
                    target="_blank"
                    data-spm="d5"
                  >
                    <div className="business-entry-title-card-top-title-container">
                      <div className="business-entry-title-card-top-title-rtl">
                        <div
                          className="business-entry-title-card-top-title"
                          style={{
                            color: "var(--tbpc-primary-color, #1f1f1f)",
                          }}
                        ></div>
                      </div>
                      <div className="business-entry-title-card-top-title-tag"></div>
                    </div>
                    <div className="business-entry-title-card-top-image" />
                  </a>
                  <div className="business-entry-item-card-content-container">
                    <a
                      className="business-entry-item-card-content"
                      href="/categories/furniture"
                      target="_blank"
                      data-spm="d5_1"
                      style={{ marginLeft: 0 }}
                    >
                      <div className="business-entry-item-card-content-container-image">
                        <img src="https://img.alicdn.com/imgextra/i2/O1CN01M48lzi22WDl6Alcjz_!!6000000007127-2-tps-800-800.png_360x360q90.jpg" />
                        <div className="business-entry-item-card-content-container-image-mask" />
                      </div>
                      <div
                        className="business-entry-item-card-content-coin"
                        style={{ marginTop: 8, bottom: 0 }}
                      >
                        <span className="business-entry-item-card-content-coin-title">
                          $
                        </span>
                        <span>636.65</span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
