import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Blob "mo:core/Blob";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type BookId = Nat;

  type BookV1 = {
    id : BookId;
    title : Text;
    subtitle : Text;
    description : Text;
    coverUrl : Text;
    amazonLink : Text;
    formats : [Text];
    genres : [Text];
    publishedDate : Text;
    authorNotes : Text;
    lookInsideText : Text;
    featured : Bool;
  };

  type Book = {
    id : BookId;
    title : Text;
    subtitle : Text;
    description : Text;
    coverUrl : Text;
    amazonEbookLink : Text;
    amazonPaperbackLink : Text;
    formats : [Text];
    genres : [Text];
    publishedDate : Text;
    authorNotes : Text;
    lookInsideText : Text;
    featured : Bool;
  };

  type ReviewId = Nat;

  type Review = {
    id : ReviewId;
    bookId : BookId;
    reviewerName : Text;
    rating : Nat;
    reviewText : Text;
    reviewDate : Text;
  };

  type BlogPostId = Nat;

  type BlogPost = {
    id : BlogPostId;
    title : Text;
    excerpt : Text;
    content : Text;
    publishedDate : Text;
    readTime : Nat;
    tags : [Text];
    published : Bool;
  };

  type Subscriber = {
    email : Text;
    subscribedAt : Text;
  };

  type ContactId = Nat;

  type ContactSubmission = {
    id : ContactId;
    name : Text;
    email : Text;
    message : Text;
    inquiryType : Text;
    submittedAt : Text;
  };

  type ChatbotEntryId = Nat;

  type ChatbotEntry = {
    id : ChatbotEntryId;
    question : Text;
    answer : Text;
  };

  // ── Comparison helpers (defined early so they can be used anywhere) ──

  func compareBooks(book1 : Book, book2 : Book) : Order.Order {
    switch (Text.compare(book1.title, book2.title)) {
      case (#equal) { Nat.compare(book1.id, book2.id) };
      case (order) { order };
    };
  };

  func compareReviews(review1 : Review, review2 : Review) : Order.Order {
    Text.compare(review1.reviewDate, review2.reviewDate);
  };

  func compareBlogPosts(post1 : BlogPost, post2 : BlogPost) : Order.Order {
    Text.compare(post2.publishedDate, post1.publishedDate);
  };

  func compareChatbotEntries(entry1 : ChatbotEntry, entry2 : ChatbotEntry) : Order.Order {
    Text.compare(entry1.question, entry2.question);
  };

  stable var nextBookId = 1;
  stable var nextReviewId = 1;
  stable var nextBlogPostId = 1;
  stable var nextContactId = 1;
  stable var nextChatbotId = 1;
  stable var adminPassword = "admin123";
  stable var realBooksSeedVersion = 0;

  let books = Map.empty<BookId, BookV1>();
  let booksV2 = Map.empty<BookId, Book>();
  let reviews = Map.empty<ReviewId, Review>();
  let blogPosts = Map.empty<BlogPostId, BlogPost>();
  let subscribers = Map.empty<Text, Subscriber>();
  let contacts = Map.empty<ContactId, ContactSubmission>();
  let pageVisits = Map.empty<Text, Nat>();
  let chatbotKnowledge = Map.empty<ChatbotEntryId, ChatbotEntry>();

  func seedRealBooksIfNeeded() {
    if (realBooksSeedVersion >= 1) return;

    let alreadyHasLongClimb = booksV2.values().toArray().any(func(b) {
      b.title == "The Long Climb"
    });
    if (not alreadyHasLongClimb) {
      let longClimb : Book = {
        id = nextBookId;
        title = "The Long Climb";
        subtitle = "A Journey of Resilience";
        description = "A powerful story of perseverance, growth, and the human spirit's capacity to rise above every obstacle. Follow one person's extraordinary journey through struggle and self-discovery, proving that every step forward — no matter how small — is a victory worth celebrating.";
        coverUrl = "/assets/generated/book-the-long-climb.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Motivational", "Drama", "Literary Fiction"];
        publishedDate = "2024-01-01";
        authorNotes = "This book is close to my heart — written for everyone who has ever had to climb their own mountain.";
        lookInsideText = "Chapter 1: The first step is always the hardest. But it is also the most important...";
        featured = true;
      };
      booksV2.add(nextBookId, longClimb);
      nextBookId += 1;
    };

    let alreadyHasEmber = booksV2.values().toArray().any(func(b) {
      b.title == "The Ember Prophecy"
    });
    if (not alreadyHasEmber) {
      let emberProphecy : Book = {
        id = nextBookId;
        title = "The Ember Prophecy";
        subtitle = "Flames of Destiny";
        description = "An epic tale of fate, fire, and a prophecy that has haunted generations. When the chosen one awakens to their destiny, the world as they know it will never be the same. A gripping blend of fantasy and emotional depth that keeps readers turning pages.";
        coverUrl = "/assets/generated/book-the-ember-prophecy.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Fantasy", "Adventure", "Drama"];
        publishedDate = "2023-06-15";
        authorNotes = "The Ember Prophecy was born from my fascination with destiny and the choices we make when fate calls.";
        lookInsideText = "Prologue: In the age before memory, it was written in flame...";
        featured = true;
      };
      booksV2.add(nextBookId, emberProphecy);
      nextBookId += 1;
    };

    let alreadyHasLetter = booksV2.values().toArray().any(func(b) {
      b.title == "The Letter in the Rain"
    });
    if (not alreadyHasLetter) {
      let letterInRain : Book = {
        id = nextBookId;
        title = "The Letter in the Rain";
        subtitle = "Words That Found Their Way Home";
        description = "A heartfelt romance about a letter lost and found, and the two souls it connects across time and circumstance. Tender, emotional, and beautifully written — this story reminds us that love always finds a way, even through the storm.";
        coverUrl = "/assets/generated/book-the-letter-in-the-rain.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Romance", "Drama", "Literary Fiction"];
        publishedDate = "2022-11-10";
        authorNotes = "I wrote this book thinking about all the things we wish we had said — and all the letters never sent.";
        lookInsideText = "Dear Stranger, By the time you read this, the rain will have stopped...";
        featured = false;
      };
      booksV2.add(nextBookId, letterInRain);
      nextBookId += 1;
    };

    realBooksSeedVersion := 1;
  };

  system func postupgrade() {
    for ((id, b) in books.entries()) {
      if (not booksV2.containsKey(id)) {
        let migrated : Book = {
          id = b.id;
          title = b.title;
          subtitle = b.subtitle;
          description = b.description;
          coverUrl = b.coverUrl;
          amazonEbookLink = b.amazonLink;
          amazonPaperbackLink = "";
          formats = b.formats;
          genres = b.genres;
          publishedDate = b.publishedDate;
          authorNotes = b.authorNotes;
          lookInsideText = b.lookInsideText;
          featured = b.featured;
        };
        booksV2.add(id, migrated);
        if (b.id >= nextBookId) {
          nextBookId := b.id + 1;
        };
      };
    };
    seedRealBooksIfNeeded();
  };

  public shared func createBook(book : Book) : async BookId {
    let newBook : Book = {
      book with
      id = nextBookId;
    };
    booksV2.add(nextBookId, newBook);
    nextBookId += 1;
    newBook.id;
  };

  public shared func updateBook(id : BookId, book : Book) : async () {
    if (not booksV2.containsKey(id)) {
      Runtime.trap("Book not found");
    };
    let updatedBook : Book = {
      book with
      id;
    };
    booksV2.add(id, updatedBook);
  };

  public shared func deleteBook(id : BookId) : async () {
    if (not booksV2.containsKey(id)) {
      Runtime.trap("Book not found");
    };
    booksV2.remove(id);
  };

  public query func getBook(id : BookId) : async Book {
    switch (booksV2.get(id)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) { book };
    };
  };

  public query func getAllBooks() : async [Book] {
    booksV2.values().toArray().sort(compareBooks);
  };

  public shared func addReview(review : Review) : async ReviewId {
    if (not booksV2.containsKey(review.bookId)) {
      Runtime.trap("Book not found for review");
    };
    let newReview : Review = {
      review with
      id = nextReviewId;
    };
    reviews.add(nextReviewId, newReview);
    nextReviewId += 1;
    newReview.id;
  };

  public query func getReviewsForBook(bookId : BookId) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.bookId == bookId }).sort(compareReviews);
  };

  public shared func createBlogPost(post : BlogPost) : async BlogPostId {
    let newPost : BlogPost = {
      post with
      id = nextBlogPostId;
    };
    blogPosts.add(nextBlogPostId, newPost);
    nextBlogPostId += 1;
    newPost.id;
  };

  public shared func updateBlogPost(id : BlogPostId, post : BlogPost) : async () {
    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Blog post not found");
    };
    let updatedPost : BlogPost = {
      post with
      id;
    };
    blogPosts.add(id, updatedPost);
  };

  public shared func deleteBlogPost(id : BlogPostId) : async () {
    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Blog post not found");
    };
    blogPosts.remove(id);
  };

  public query func getBlogPost(id : BlogPostId) : async BlogPost {
    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?post) { post };
    };
  };

  public query func getPublishedBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().filter(func(p) { p.published }).sort(compareBlogPosts);
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(compareBlogPosts);
  };

  public shared func subscribeToNewsletter(email : Text) : async () {
    if (subscribers.containsKey(email)) {
      Runtime.trap("Already subscribed");
    };
    let newSubscriber : Subscriber = {
      email;
      subscribedAt = Time.now().toText();
    };
    subscribers.add(email, newSubscriber);
  };

  public query func getAllSubscribers() : async [Subscriber] {
    subscribers.values().toArray();
  };

  public shared func submitContactForm(submission : ContactSubmission) : async ContactId {
    let newSubmission : ContactSubmission = {
      submission with
      id = nextContactId;
    };
    contacts.add(nextContactId, newSubmission);
    nextContactId += 1;
    newSubmission.id;
  };

  public query func getAllContactSubmissions() : async [ContactSubmission] {
    contacts.values().toArray();
  };

  public shared func recordPageVisit(pageName : Text) : async () {
    let currentCount = switch (pageVisits.get(pageName)) {
      case (null) { 0 };
      case (?count) { count };
    };
    pageVisits.add(pageName, currentCount + 1);
  };

  public query func getPageVisits(pageName : Text) : async Nat {
    switch (pageVisits.get(pageName)) {
      case (null) { 0 };
      case (?count) { count };
    };
  };

  public query func getAllPageVisits() : async [(Text, Nat)] {
    pageVisits.entries().toArray();
  };

  public query func getAllChatbotEntries() : async [ChatbotEntry] {
    chatbotKnowledge.values().toArray().sort(compareChatbotEntries);
  };

  public shared func addChatbotEntry(entry : ChatbotEntry) : async ChatbotEntryId {
    let newEntry : ChatbotEntry = {
      entry with
      id = nextChatbotId;
    };
    chatbotKnowledge.add(nextChatbotId, newEntry);
    nextChatbotId += 1;
    newEntry.id;
  };

  public query func verifyAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };

  public shared func changeAdminPassword(oldPassword : Text, newPassword : Text) : async Bool {
    if (oldPassword == adminPassword) {
      adminPassword := newPassword;
      true;
    } else {
      false;
    };
  };

  public shared func resetAdminPasswordToDefault() : async () {
    adminPassword := "admin123";
  };

  func countGenreOverlap(book : Book, targetGenres : [Text]) : Nat {
    var count = 0;
    for (genre in targetGenres.values()) {
      if (book.genres.any(func(g) { g == genre })) {
        count += 1;
      };
    };
    count;
  };

  public query func getRelatedBooks(bookId : BookId) : async [Book] {
    switch (booksV2.get(bookId)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) {
        let targetGenres = book.genres;
        booksV2.values().toArray()
          .filter(func(b) { b.id != bookId })
          .sort(func(b1, b2) {
            let overlap1 = countGenreOverlap(b1, targetGenres);
            let overlap2 = countGenreOverlap(b2, targetGenres);
            switch (Nat.compare(overlap2, overlap1)) {
              case (#equal) { compareBooks(b1, b2) };
              case (order) { order };
            };
          });
      };
    };
  };

  public shared func seedInitialData() : async () {

    let book1 : Book = {
      id = nextBookId;
      title = "Antonyms of a Mirage";
      subtitle = "A Literary Psychological Exploration";
      description = "A journey through the complexities of perception and reality.";
      coverUrl = "https://example.com/covers/antonyms.jpg";
      amazonEbookLink = "";
      amazonPaperbackLink = "";
      formats = ["eBook", "Paperback"];
      genres = ["Psychological", "Literary Fiction"];
      publishedDate = "2022-01-15";
      authorNotes = "This book explores the boundaries of consciousness.";
      lookInsideText = "Chapter 1: The Illusion...";
      featured = true;
    };
    booksV2.add(nextBookId, book1);
    nextBookId += 1;

    let book2 : Book = {
      id = nextBookId;
      title = "Echoes of Silence";
      subtitle = "A Meditation on Loss";
      description = "An intimate exploration of grief and healing.";
      coverUrl = "https://example.com/covers/echoes.jpg";
      amazonEbookLink = "";
      amazonPaperbackLink = "";
      formats = ["eBook", "Paperback", "Hardcover"];
      genres = ["Literary Fiction", "Drama"];
      publishedDate = "2021-06-20";
      authorNotes = "Written during a period of personal reflection.";
      lookInsideText = "Prologue: The quiet after...";
      featured = false;
    };
    booksV2.add(nextBookId, book2);
    nextBookId += 1;

    let book3 : Book = {
      id = nextBookId;
      title = "The Fractured Mind";
      subtitle = "Psychological Thriller";
      description = "A gripping tale of identity and madness.";
      coverUrl = "https://example.com/covers/fractured.jpg";
      amazonEbookLink = "";
      amazonPaperbackLink = "";
      formats = ["eBook", "Paperback"];
      genres = ["Psychological", "Thriller"];
      publishedDate = "2023-03-10";
      authorNotes = "My most intense work to date.";
      lookInsideText = "Part One: The first crack...";
      featured = true;
    };
    booksV2.add(nextBookId, book3);
    nextBookId += 1;

    let book4 : Book = {
      id = nextBookId;
      title = "Whispers in the Dark";
      subtitle = "Stories of the Unseen";
      description = "A collection of short psychological fiction.";
      coverUrl = "https://example.com/covers/whispers.jpg";
      amazonEbookLink = "";
      amazonPaperbackLink = "";
      formats = ["eBook"];
      genres = ["Literary Fiction", "Short Stories"];
      publishedDate = "2020-11-05";
      authorNotes = "Each story explores a different facet of the human psyche.";
      lookInsideText = "Story 1: The Voice...";
      featured = false;
    };
    booksV2.add(nextBookId, book4);
    nextBookId += 1;

    let book5 : Book = {
      id = nextBookId;
      title = "Beyond the Veil";
      subtitle = "A Journey Within";
      description = "An introspective novel about self-discovery.";
      coverUrl = "https://example.com/covers/veil.jpg";
      amazonEbookLink = "";
      amazonPaperbackLink = "";
      formats = ["eBook", "Paperback", "Hardcover"];
      genres = ["Literary Fiction", "Psychological"];
      publishedDate = "2024-01-18";
      authorNotes = "My latest exploration of consciousness.";
      lookInsideText = "Introduction: The search begins...";
      featured = true;
    };
    booksV2.add(nextBookId, book5);
    nextBookId += 1;

    let post1 : BlogPost = {
      id = nextBlogPostId;
      title = "On Writing Psychological Fiction";
      excerpt = "Exploring the depths of the human mind through storytelling.";
      content = "Full content about psychological fiction writing...";
      publishedDate = "2024-02-01";
      readTime = 5;
      tags = ["writing", "psychology"];
      published = true;
    };
    blogPosts.add(nextBlogPostId, post1);
    nextBlogPostId += 1;

    let post2 : BlogPost = {
      id = nextBlogPostId;
      title = "The Creative Process";
      excerpt = "How I develop characters and plot.";
      content = "Full content about creative process...";
      publishedDate = "2024-01-15";
      readTime = 7;
      tags = ["writing", "creativity"];
      published = true;
    };
    blogPosts.add(nextBlogPostId, post2);
    nextBlogPostId += 1;

    let post3 : BlogPost = {
      id = nextBlogPostId;
      title = "Literary Influences";
      excerpt = "Authors who shaped my writing style.";
      content = "Full content about literary influences...";
      publishedDate = "2023-12-10";
      readTime = 6;
      tags = ["literature", "influences"];
      published = true;
    };
    blogPosts.add(nextBlogPostId, post3);
    nextBlogPostId += 1;

    let post4 : BlogPost = {
      id = nextBlogPostId;
      title = "Upcoming Projects";
      excerpt = "A sneak peek at what's coming next.";
      content = "Full content about upcoming projects...";
      publishedDate = "2024-03-01";
      readTime = 4;
      tags = ["news", "upcoming"];
      published = true;
    };
    blogPosts.add(nextBlogPostId, post4);
    nextBlogPostId += 1;

    let qa1 : ChatbotEntry = {
      id = nextChatbotId;
      question = "Who is O. Chiddarwar?";
      answer = "O. Chiddarwar is an author specializing in psychological and literary fiction.";
    };
    chatbotKnowledge.add(nextChatbotId, qa1);
    nextChatbotId += 1;

    let qa2 : ChatbotEntry = {
      id = nextChatbotId;
      question = "What genres does O. Chiddarwar write?";
      answer = "O. Chiddarwar writes psychological fiction, literary fiction, and thrillers.";
    };
    chatbotKnowledge.add(nextChatbotId, qa2);
    nextChatbotId += 1;

    let qa3 : ChatbotEntry = {
      id = nextChatbotId;
      question = "How many books has O. Chiddarwar published?";
      answer = "O. Chiddarwar has published several books including The Long Climb, The Ember Prophecy, and The Letter in the Rain.";
    };
    chatbotKnowledge.add(nextChatbotId, qa3);
    nextChatbotId += 1;

    let qa4 : ChatbotEntry = {
      id = nextChatbotId;
      question = "What is the latest book?";
      answer = "The latest book is 'The Long Climb: A Journey of Resilience', published in 2024.";
    };
    chatbotKnowledge.add(nextChatbotId, qa4);
    nextChatbotId += 1;

    let qa5 : ChatbotEntry = {
      id = nextChatbotId;
      question = "Where can I buy the books?";
      answer = "All books are available on Amazon in Kindle eBook and Paperback formats.";
    };
    chatbotKnowledge.add(nextChatbotId, qa5);
    nextChatbotId += 1;

    let qa6 : ChatbotEntry = {
      id = nextChatbotId;
      question = "Does O. Chiddarwar have a newsletter?";
      answer = "Yes! You can subscribe to the newsletter to receive updates about new releases and exclusive content.";
    };
    chatbotKnowledge.add(nextChatbotId, qa6);
    nextChatbotId += 1;

    let qa7 : ChatbotEntry = {
      id = nextChatbotId;
      question = "How can I contact O. Chiddarwar?";
      answer = "You can use the contact form on this website or email mystoryova@gmail.com.";
    };
    chatbotKnowledge.add(nextChatbotId, qa7);
    nextChatbotId += 1;

    let qa8 : ChatbotEntry = {
      id = nextChatbotId;
      question = "What inspired O. Chiddarwar to write?";
      answer = "O. Chiddarwar is inspired by human emotions, relationships, and the power of storytelling to connect people across different experiences.";
    };
    chatbotKnowledge.add(nextChatbotId, qa8);
    nextChatbotId += 1;

    let review1 : Review = {
      id = nextReviewId;
      bookId = 1;
      reviewerName = "Sarah M.";
      rating = 5;
      reviewText = "A masterpiece of psychological fiction. Couldn't put it down!";
      reviewDate = "2022-02-10";
    };
    reviews.add(nextReviewId, review1);
    nextReviewId += 1;

    let review2 : Review = {
      id = nextReviewId;
      bookId = 1;
      reviewerName = "John D.";
      rating = 4;
      reviewText = "Thought-provoking and beautifully written.";
      reviewDate = "2022-03-15";
    };
    reviews.add(nextReviewId, review2);
    nextReviewId += 1;

    let review3 : Review = {
      id = nextReviewId;
      bookId = 3;
      reviewerName = "Emily R.";
      rating = 5;
      reviewText = "The most intense psychological thriller I've read in years!";
      reviewDate = "2023-04-20";
    };
    reviews.add(nextReviewId, review3);
    nextReviewId += 1;
  };

};
