import { Html, Head, Main, NextScript } from "next/document";
import { SHOPIFY_API_KEY } from "@/config/env";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="shopify-api-key" content={SHOPIFY_API_KEY} />
        <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
      </Head>
      <body>
        <img id="ms-img-lcp" className="ms-img-lcp" src="/images/lcp.png?v=1" />
        <script
          id="ms-script-lcp"
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(() => {
                let elImgLcp = document.getElementById('ms-img-lcp');
                if(elImgLcp){
                  elImgLcp.setAttribute("style", "display: block !important");
                }
                let elScriptLcp = document.querySelector("script[id='ms-script-lcp']");
                if(elScriptLcp){
                  elScriptLcp.remove();
                }
              }, 100);
          `,
          }}
        ></script>

        <Main />

        <div id="modal-root"></div>

        <NextScript />
      </body>
    </Html>
  );
}
