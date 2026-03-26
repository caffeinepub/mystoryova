import { Link } from "@tanstack/react-router";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 2026
        </p>
      </div>

      <div className="space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Acceptance of Terms
          </h2>
          <p>
            By accessing or using Mystoryova, you agree to be bound by these
            Terms and Conditions. If you do not agree with any part of these
            terms, please do not use this website. These terms apply to all
            visitors, readers, and anyone who accesses or uses the site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Use of This Site
          </h2>
          <p className="mb-4">
            You agree to use this site only for lawful purposes. You must not:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>
              Use the site in any way that violates applicable local, national,
              or international laws.
            </li>
            <li>
              Transmit any unsolicited or unauthorised advertising or
              promotional material.
            </li>
            <li>
              Attempt to gain unauthorised access to any part of the site or its
              backend systems.
            </li>
            <li>
              Submit false, misleading, or defamatory content through any form
              or review feature.
            </li>
            <li>
              Engage in any conduct that restricts or inhibits anyone&apos;s use
              of the site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Intellectual Property
          </h2>
          <p>
            All content on this website — including but not limited to text,
            book descriptions, blog posts, images, graphics, logos, and the
            "Mystoryova" brand name — is the intellectual property of O.
            Chiddarwar and Mystoryova unless otherwise stated. This content is
            protected by copyright and other applicable intellectual property
            laws.
          </p>
          <p className="mt-4">
            You may not reproduce, distribute, modify, transmit, or use any
            content from this site for commercial purposes without prior written
            permission from O. Chiddarwar. Personal, non-commercial use (such as
            sharing a link) is permitted.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Store Purchases
          </h2>
          <p className="mb-4">
            Products purchased directly from the Mystoryova Store (audiobooks
            and merchandise) are subject to the following:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>
              All prices are listed in USD and are inclusive of applicable taxes
              where noted.
            </li>
            <li>
              Payments are processed securely by Stripe. By completing a
              purchase you also agree to Stripe&apos;s Terms of Service.
            </li>
            <li>
              Physical merchandise orders are non-cancellable once production
              has begun (typically within 24 hours of payment).
            </li>
            <li>
              Digital products (audiobooks) are non-refundable once access has
              been granted, except in cases of technical failure.
            </li>
          </ul>
          <p className="mt-4">
            For return and refund eligibility, please refer to our{" "}
            <Link
              to="/return-policy"
              className="text-primary hover:underline font-medium"
            >
              Return Policy
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Book Purchases (Amazon)
          </h2>
          <p>
            Books featured on this site are also sold through Amazon. When you
            click an Amazon purchase link, you are redirected to Amazon&apos;s
            website and your transaction is governed by Amazon&apos;s own terms
            and conditions. Mystoryova is not a party to any such transaction
            and accepts no responsibility for purchases, refunds, delivery, or
            any issues arising from third-party transactions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            User Reviews
          </h2>
          <p>
            By submitting a review on any book page, you grant Mystoryova a
            non-exclusive, royalty-free, perpetual licence to display your
            review on this website. You represent that your review is your
            original work and does not infringe any third-party rights. We
            reserve the right to moderate, edit, or remove any review that we
            determine to be inappropriate, offensive, defamatory, or in
            violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Disclaimer of Warranties
          </h2>
          <p>
            This website is provided on an "as is" and "as available" basis
            without any warranties of any kind, either express or implied. We do
            not warrant that the site will be uninterrupted, error-free, or free
            of viruses or other harmful components. We reserve the right to
            modify or discontinue the site at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, O. Chiddarwar and Mystoryova
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of this
            website or its content, even if advised of the possibility of such
            damages.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Changes to These Terms
          </h2>
          <p>
            We reserve the right to update or modify these Terms and Conditions
            at any time. Changes will be posted on this page with an updated
            "Last updated" date. Your continued use of the site following any
            changes constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Contact Us
          </h2>
          <p>
            If you have any questions about these Terms and Conditions, please
            reach out to us at:
          </p>
          <p className="mt-3">
            <a
              href="mailto:mystoryova@gmail.com"
              className="text-primary hover:underline font-medium"
            >
              mystoryova@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
