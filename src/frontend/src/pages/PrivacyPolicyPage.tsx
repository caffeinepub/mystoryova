export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: March 2026
        </p>
      </div>

      <div className="space-y-10 text-foreground/90 leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Introduction
          </h2>
          <p>
            Welcome to Mystoryova, the official website of O. Chiddarwar. Your
            privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect information when you visit and interact
            with mystoryova.com. By using this site, you agree to the practices
            described here.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Information We Collect
          </h2>
          <p className="mb-4">
            We collect limited personal information only when you voluntarily
            provide it. This may include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>
              <strong className="text-foreground">Newsletter Signup:</strong>{" "}
              Your name and email address when you subscribe to our newsletter.
            </li>
            <li>
              <strong className="text-foreground">Contact Form:</strong> Your
              name, email address, and any message content you submit through
              the contact form.
            </li>
            <li>
              <strong className="text-foreground">Reader Reviews:</strong> Your
              name and any review content you submit on book pages.
            </li>
            <li>
              <strong className="text-foreground">
                Cookies &amp; Usage Data:
              </strong>{" "}
              Basic analytics data such as pages visited, time spent on site,
              and device/browser information may be collected automatically to
              help us improve the site.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-foreground/80 pl-2">
            <li>
              Send newsletters and updates about new books, blog posts, and
              announcements.
            </li>
            <li>
              Respond to your inquiries submitted through the contact form.
            </li>
            <li>
              Display your reviews on book pages (with your consent at time of
              submission).
            </li>
            <li>
              Analyse site usage to improve performance and user experience.
            </li>
            <li>Maintain the security and integrity of our platform.</li>
          </ul>
          <p className="mt-4">
            We do not sell, rent, or share your personal information with third
            parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Third-Party Links
          </h2>
          <p>
            This site contains links to third-party services including Amazon
            (for book purchases) and social media platforms such as Instagram
            and Facebook. When you click these links, you leave Mystoryova and
            are subject to those platforms&apos; own privacy policies. We are
            not responsible for the privacy practices or content of external
            sites. We encourage you to review the privacy policies of any
            third-party service you use.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Data Security
          </h2>
          <p>
            We take reasonable technical and administrative measures to protect
            your personal information from unauthorised access, disclosure, or
            loss. Mystoryova is hosted on the Internet Computer blockchain
            platform, which provides strong cryptographic security by design.
            However, no online transmission is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Children's Privacy
          </h2>
          <p>
            This website is not directed at children under the age of 13. We do
            not knowingly collect personal information from children. If you
            believe a child has provided us with personal information, please
            contact us and we will take steps to remove it.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal reasons. Any updates will be
            posted on this page with a revised "Last updated" date. Your
            continued use of the site after any changes constitutes your
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-semibold text-primary mb-4">
            Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            how your data is handled, please contact us at:
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
