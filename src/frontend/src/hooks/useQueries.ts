import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  BlogPostId,
  Book,
  BookId,
  ContactSubmission,
  Review,
} from "../backend";
import { useActor } from "./useActor";

export function useGetAllBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBooks();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

export function useGetBook(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book | null>({
    queryKey: ["book", id],
    queryFn: async () => {
      if (!actor) return null;
      let bookBigId: bigint;
      try {
        bookBigId = BigInt(id);
      } catch {
        return null;
      }
      return actor.getBook(bookBigId);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetRelatedBooks(bookId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["relatedBooks", bookId],
    queryFn: async () => {
      if (!actor) return [];
      let relBigId: bigint;
      try {
        relBigId = BigInt(bookId);
      } catch {
        return [];
      }
      return actor.getRelatedBooks(relBigId);
    },
    enabled: !!actor && !isFetching && !!bookId,
  });
}

export function useGetReviewsForBook(bookId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", bookId],
    queryFn: async () => {
      if (!actor) return [];
      let revBigId: bigint;
      try {
        revBigId = BigInt(bookId);
      } catch {
        return [];
      }
      return actor.getReviewsForBook(revBigId);
    },
    enabled: !!actor && !isFetching && !!bookId,
  });
}

export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["publishedBlogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublishedBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["allBlogPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBlogPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", id],
    queryFn: async () => {
      if (!actor) return null;
      let blogBigId: bigint;
      try {
        blogBigId = BigInt(id);
      } catch {
        return null;
      }
      return actor.getBlogPost(blogBigId);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useGetAllSubscribers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSubscribers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllContactSubmissions() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContactSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPageVisits() {
  const { actor, isFetching } = useActor();
  return useQuery<[string, bigint][]>({
    queryKey: ["pageVisits"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPageVisits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllChatbotEntries() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["chatbotEntries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllChatbotEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeToNewsletter(email);
    },
  });
}

export function useSubmitContactForm() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (submission: ContactSubmission) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContactForm(submission);
    },
  });
}

export function useRecordPageVisit() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (pageName: string) => {
      if (!actor) return;
      return actor.recordPageVisit(pageName);
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error("Not connected");
      return actor.addReview(review);
    },
    onSuccess: (_, review) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", String(review.bookId)],
      });
    },
  });
}

export function useSeedInitialData() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) return;
      return actor.seedInitialData();
    },
  });
}

export function useCreateBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (book: Book) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBook(book);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useUpdateBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, book }: { id: BookId; book: Book }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBook(id, book);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useDeleteBook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BookId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBook(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["books"] }),
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBlogPost(post);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] }),
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, post }: { id: BlogPostId; post: BlogPost }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBlogPost(id, post);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] }),
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: BlogPostId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBlogPost(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allBlogPosts"] }),
  });
}
