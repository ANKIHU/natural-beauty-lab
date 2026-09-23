import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div>
            <div className="foot-brand">Nature&apos;s Beauty Lab</div>
            <p className="foot-tag">
              Nature knows what to do. We just have to help it along. Every formula begins in a family kitchen and ends on your shelf.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link href="/shop">All products</Link>
            <Link href="/shop?cat=Cleansers">Cleansers</Link>
            <Link href="/shop?cat=Masks">Masks</Link>
            <Link href="/shop?cat=Oils+%26+Serums">Oils &amp; serums</Link>
            <Link href="/shop?cat=Body">Body</Link>
          </div>
          <div>
            <h4>The Lab</h4>
            <Link href="/about">Our story</Link>
            <Link href="/shop">Bestsellers</Link>
            <Link href="/about">Fresh formulations</Link>
          </div>
          <div>
            <h4>Help</h4>
            <Link href="/about">Shipping &amp; returns</Link>
            <Link href="/about">Ingredient glossary</Link>
            <Link href="/about">Contact us</Link>
          </div>
        </div>
        <div className="fine">
          <span>&copy; {new Date().getFullYear()} Nature&apos;s Beauty Lab</span>
          <span>Small-batch · Cruelty-free · No sulfates or parabens</span>
        </div>
      </div>
    </footer>
  );
}
