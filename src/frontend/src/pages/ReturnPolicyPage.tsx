import { Link } from "@tanstack/react-router";

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Return Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 2026
        </p>
      </div>

      <div className="space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Overview
          </h2>
          <p>
            At Mystoryova, we want you to be fully satisfied with your purchase.
            This Return Policy explains the conditions under which returns,
            refunds, and exchanges are accepted for products purchased directly
            from our store.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Merchandise Returns
          </h2>
          <p className="mb-4">
            We accept returns on physical merchandise (e.g. T-shirts, hoodies,
            mugs, tote bags, posters) under the following conditions:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>
              Return requests must be submitted within{" "}
              <strong className="text-foreground">14 days</strong> of the
              delivery date.
            </li>
            <li>
              Items must be unused, unwashed, and in their original condition
              with all tags intact.
            </li>
            <li>
              Damaged or defective items are eligible for a full refund or
              replacement — please include a photo when submitting your request.
            </li>
            <li>
              Customised or personalised items are not eligible for return
              unless the item is faulty or incorrect.
            </li>
            <li>
              Return shipping costs are the customer's responsibility unless the
              item was defective or incorrect.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Audiobook Returns
          </h2>
          <p className="mb-4">
            Due to the digital nature of audiobooks, all audiobook sales are
            final once the content has been accessed or downloaded. Refunds may
            be considered in the following circumstances:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>You were charged but did not receive access to the content.</li>
            <li>
              The audiobook file is significantly corrupted or unplayable.
            </li>
            <li>A duplicate charge was made in error for the same purchase.</li>
          </ul>
          <p className="mt-4">
            Refund requests for audiobooks must be submitted within{" "}
            <strong className="text-foreground">7 days</strong> of purchase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            How to Request a Return
          </h2>
          <p className="mb-4">
            To initiate a return or refund, please email us at{" "}
            <a
              href="mailto:mystoryova@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              mystoryova@gmail.com
            </a>{" "}
            with the following information:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>Your full name and email address used at checkout.</li>
            <li>Your order ID (found in your confirmation email).</li>
            <li>The item(s) you wish to return and the reason.</li>
            <li>For damaged goods: a clear photo showing the issue.</li>
          </ul>
          <p className="mt-4">
            We will respond to your request within{" "}
            <strong className="text-foreground">2–3 business days</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Refunds
          </h2>
          <p>
            Once your return is approved, refunds will be processed to your
            original payment method within{" "}
            <strong className="text-foreground">5–10 business days</strong>,
            depending on your bank or card provider. You will receive an email
            confirmation once the refund has been issued.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Books Purchased via Amazon
          </h2>
          <p>
            Physical books and Kindle editions purchased through Amazon are
            governed by Amazon's own return and refund policy. Mystoryova has no
            control over Amazon transactions. Please visit{" "}
            <a
              href="https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Amazon's Returns Policy
            </a>{" "}
            for guidance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Contact
          </h2>
          <p>If you have questions about this policy, please reach out:</p>
          <p className="mt-3">
            <a
              href="mailto:mystoryova@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              mystoryova@gmail.com
            </a>
          </p>
          <p className="mt-3">
            <Link
              to="/contact"
              className="text-primary hover:underline text-sm"
            >
              Or use our Contact Form →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
