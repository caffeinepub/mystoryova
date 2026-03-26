import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import ChatbotWidget from "./components/ChatbotWidget";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AdminProvider } from "./hooks/useAdmin";
import { CartProvider } from "./hooks/useCart";
import { StoreProvider } from "./hooks/useStore";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import AudiobookDetailPage from "./pages/AudiobookDetailPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogPage from "./pages/BlogPage";
import BookDetailPage from "./pages/BookDetailPage";
import BooksPage from "./pages/BooksPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import MerchDetailPage from "./pages/MerchDetailPage";
import MyLibraryPage from "./pages/MyLibraryPage";
import OrderLookupPage from "./pages/OrderLookupPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import StorePage from "./pages/StorePage";
import TermsPage from "./pages/TermsPage";

function RootLayout() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) localStorage.setItem("affiliateRef", ref);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StoreProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <ChatbotWidget />
            <Toaster />
          </div>
        </CartProvider>
      </StoreProvider>
    </ThemeProvider>
  );
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <div className="glass rounded-2xl p-10 text-center space-y-6 max-w-md w-full border border-primary/20">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-primary mb-2">
              MYSTORYOVA
            </p>
            <h2 className="font-serif text-2xl text-foreground">
              Something Went Wrong
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {error?.message ||
                "An unexpected error occurred. Please try again."}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-5 py-2 rounded-lg border border-white/20 text-sm text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              Go Back
            </button>
            <a
              href="/"
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
            >
              Home
            </a>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
  errorComponent: RootErrorComponent,
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const booksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  component: BooksPage,
});
const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$id",
  component: BookDetailPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: BlogPage,
});
const blogDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogDetailPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <AdminProvider>
      <AdminPage />
    </AdminProvider>
  ),
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const returnPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/return-policy",
  component: ReturnPolicyPage,
});
const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: StorePage,
});
const audiobookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/audiobooks/$id",
  component: AudiobookDetailPage,
});
const merchDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/merch/$id",
  component: MerchDetailPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/cart",
  component: CartPage,
});
const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/success",
  component: OrderSuccessPage,
});
const myLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/library",
  component: MyLibraryPage,
});
const orderLookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/orders",
  component: OrderLookupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  booksRoute,
  bookDetailRoute,
  aboutRoute,
  blogRoute,
  blogDetailRoute,
  contactRoute,
  adminRoute,
  privacyRoute,
  termsRoute,
  returnPolicyRoute,
  storeRoute,
  audiobookDetailRoute,
  merchDetailRoute,
  cartRoute,
  orderSuccessRoute,
  myLibraryRoute,
  orderLookupRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
