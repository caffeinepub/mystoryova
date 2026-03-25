import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    name: string;
    email: string;
}
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
    amazonEbookLink: string;
    amazonPaperbackLink: string;
    publishedDate: string;
    lookInsideText: string;
    authorNotes: string;
    description: string;
    genres: Array<string>;
    coverUrl: string;
    formats: Array<string>;
    subtitle: string;
}
export interface ChatbotEntry {
    id: ChatbotEntryId;
    question: string;
    answer: string;
}
export type BlogPostId = bigint;
export interface Subscriber {
    subscribedAt: string;
    email: string;
}
export type ReviewId = bigint;
export type BookId = bigint;
export type ContactId = bigint;
export interface Review {
    id: ReviewId;
    reviewDate: string;
    bookId: BookId;
    reviewText: string;
    reviewerName: string;
    rating: bigint;
}
export type ChatbotEntryId = bigint;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addChatbotEntry(entry: ChatbotEntry): Promise<ChatbotEntryId>;
    addReview(review: Review): Promise<ReviewId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(post: BlogPost): Promise<BlogPostId>;
    createBook(book: Book): Promise<BookId>;
    deleteBlogPost(id: BlogPostId): Promise<void>;
    deleteBook(id: BookId): Promise<void>;
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
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordPageVisit(pageName: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    seedInitialData(): Promise<void>;
    submitContactForm(submission: ContactSubmission): Promise<ContactId>;
    subscribeToNewsletter(email: string): Promise<void>;
    updateBlogPost(id: BlogPostId, post: BlogPost): Promise<void>;
    updateBook(id: BookId, book: Book): Promise<void>;
}
