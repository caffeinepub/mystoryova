import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Review {
    id: ReviewId;
    reviewDate: string;
    bookId: BookId;
    reviewText: string;
    reviewerName: string;
    rating: bigint;
}
export type BookId = bigint;
export interface BlogPost {
    id: BlogPostId;
    title: string;
    content: string;
    publishedDate: string;
    published: boolean;
    tags: Array<string>;
    readTime: bigint;
    excerpt: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ContactSubmission {
    id: ContactId;
    inquiryType: string;
    name: string;
    submittedAt: string;
    email: string;
    message: string;
}
export interface Book {
    id: BookId;
    title: string;
    featured: boolean;
    publishedDate: string;
    lookInsideText: string;
    authorNotes: string;
    description: string;
    amazonPaperbackLink: string;
    amazonEbookLink: string;
    genres: Array<string>;
    coverUrl: string;
    formats: Array<string>;
    subtitle: string;
}
export type ChatbotId = bigint;
export interface ChatbotEntry {
    id: ChatbotId;
    question: string;
    answer: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type BlogPostId = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Subscriber {
    subscribedAt: string;
    email: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type ReviewId = bigint;
export type ContactId = bigint;
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatbotEntry(entry: ChatbotEntry): Promise<ChatbotId>;
    addReview(review: Review): Promise<ReviewId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    changeAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
    createBlogPost(post: BlogPost): Promise<BlogPostId>;
    createBook(book: Book): Promise<BookId>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteBlogPost(id: BlogPostId): Promise<void>;
    deleteBook(id: BookId): Promise<void>;
    generateResetPin(email: string): Promise<string | null>;
    getAllBlogPosts(): Promise<Array<BlogPost>>;
    getAllBooks(): Promise<Array<Book>>;
    getAllChatbotEntries(): Promise<Array<ChatbotEntry>>;
    getAllContactSubmissions(): Promise<Array<ContactSubmission>>;
    getAllPageVisits(): Promise<Array<[string, bigint]>>;
    getAllSubscribers(): Promise<Array<Subscriber>>;
    getBlogPost(id: BlogPostId): Promise<BlogPost>;
    getBook(id: BookId): Promise<Book>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPageVisits(pageName: string): Promise<bigint>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getRelatedBooks(bookId: BookId): Promise<Array<Book>>;
    getReviewsForBook(bookId: BookId): Promise<Array<Review>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordPageVisit(pageName: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedInitialData(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<ContactId>;
    subscribeToNewsletter(email: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateBlogPost(id: BlogPostId, post: BlogPost): Promise<void>;
    updateBook(id: BookId, book: Book): Promise<void>;
    verifyAdminPassword(password: string): Promise<boolean>;
    verifyResetPinAndChangePassword(pin: string, newPassword: string): Promise<boolean>;
}
