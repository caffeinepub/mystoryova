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

  // V1 kept for stable-variable backward compatibility with deployed canister
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
  stable var resetPin : Text = "";
  stable var resetPinExpiry : Int = 0;
  stable var realBooksSeedVersion = 0;

  // mo:core/Map is a stable data structure — persists across upgrades automatically.
  // `books` (V1) must be kept to avoid dropping the stable variable from the deployed canister.
  let books = Map.empty<BookId, BookV1>();
  let booksV2 = Map.empty<BookId, Book>();
  let reviews = Map.empty<ReviewId, Review>();
  let blogPosts = Map.empty<BlogPostId, BlogPost>();
  let subscribers = Map.empty<Text, Subscriber>();
  let contacts = Map.empty<ContactId, ContactSubmission>();
  let pageVisits = Map.empty<Text, Nat>();
  let chatbotKnowledge = Map.empty<ChatbotEntryId, ChatbotEntry>();

  func seedRealBooksIfNeeded() {
    // Seed if never seeded OR if booksV2 is empty (guards against any data loss scenario)
    if (realBooksSeedVersion >= 1 and booksV2.size() > 0) return;

    let alreadyHasLongClimb = booksV2.values().toArray().any(func(b) {
      b.title == "The Long Climb"
    });
    if (not alreadyHasLongClimb) {
      let longClimb : Book = {
        id = nextBookId;
        title = "The Long Climb";
        subtitle = "A Journey of Resilience";
        description = "A powerful story of perseverance, growth, and the human spirit's capacity to rise above every obstacle.";
        coverUrl = "/assets/generated/book-the-long-climb.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Motivational", "Drama", "Literary Fiction"];
        publishedDate = "2024-01-01";
        authorNotes = "This book is close to my heart.";
        lookInsideText = "Chapter 1: The first step is always the hardest...";
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
        description = "An epic tale of fate, fire, and a prophecy that has haunted generations.";
        coverUrl = "/assets/generated/book-the-ember-prophecy.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Fantasy", "Adventure", "Drama"];
        publishedDate = "2023-06-15";
        authorNotes = "Born from my fascination with destiny.";
        lookInsideText = "Prologue: In the age before memory...";
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
        description = "A heartfelt romance about a letter lost and found, and the two souls it connects.";
        coverUrl = "/assets/generated/book-the-letter-in-the-rain.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"];
        genres = ["Romance", "Drama", "Literary Fiction"];
        publishedDate = "2022-11-10";
        authorNotes = "Written thinking about all the things we wish we had said.";
        lookInsideText = "Dear Stranger, By the time you read this...";
        featured = false;
      };
      booksV2.add(nextBookId, letterInRain);
      nextBookId += 1;
    };

    realBooksSeedVersion := 1;
  };

  system func postupgrade() {
    // Migrate any V1 books to V2
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
        if (b.id >= nextBookId) { nextBookId := b.id + 1 };
      };
    };
    seedRealBooksIfNeeded();
  };

  public shared func createBook(book : Book) : async BookId {
    let newBook : Book = { book with id = nextBookId };
    booksV2.add(nextBookId, newBook);
    nextBookId += 1;
    newBook.id;
  };

  public shared func updateBook(id : BookId, book : Book) : async () {
    if (not booksV2.containsKey(id)) { Runtime.trap("Book not found") };
    booksV2.add(id, { book with id });
  };

  public shared func deleteBook(id : BookId) : async () {
    if (not booksV2.containsKey(id)) { Runtime.trap("Book not found") };
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
    let newReview : Review = { review with id = nextReviewId };
    reviews.add(nextReviewId, newReview);
    nextReviewId += 1;
    newReview.id;
  };

  public query func getReviewsForBook(bookId : BookId) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.bookId == bookId }).sort(compareReviews);
  };

  public shared func createBlogPost(post : BlogPost) : async BlogPostId {
    let newPost : BlogPost = { post with id = nextBlogPostId };
    blogPosts.add(nextBlogPostId, newPost);
    nextBlogPostId += 1;
    newPost.id;
  };

  public shared func updateBlogPost(id : BlogPostId, post : BlogPost) : async () {
    if (not blogPosts.containsKey(id)) { Runtime.trap("Blog post not found") };
    blogPosts.add(id, { post with id });
  };

  public shared func deleteBlogPost(id : BlogPostId) : async () {
    if (not blogPosts.containsKey(id)) { Runtime.trap("Blog post not found") };
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
    if (subscribers.containsKey(email)) { Runtime.trap("Already subscribed") };
    subscribers.add(email, { email; subscribedAt = Time.now().toText() });
  };

  public query func getAllSubscribers() : async [Subscriber] {
    subscribers.values().toArray();
  };

  public shared func submitContactForm(submission : ContactSubmission) : async ContactId {
    let newSubmission : ContactSubmission = { submission with id = nextContactId };
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
    let newEntry : ChatbotEntry = { entry with id = nextChatbotId };
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

  // Authorized recovery email
  let RECOVERY_EMAIL : Text = "mystoryova@gmail.com";

  // Generate a 6-digit PIN for password recovery (only if correct email supplied)
  public shared func generateResetPin(email : Text) : async ?Text {
    if (email.toLower() != RECOVERY_EMAIL) {
      return null;
    };
    // Simple deterministic PIN from time to avoid Random import
    let t = Int.abs(Time.now());
    let pin = ((t % 900000) + 100000).toText();
    resetPin := pin;
    resetPinExpiry := Time.now() + 600_000_000_000; // 10 minutes
    ?pin;
  };

  // Verify PIN and set new password
  public shared func verifyResetPinAndChangePassword(pin : Text, newPassword : Text) : async Bool {
    if (resetPin == "" or pin != resetPin) { return false };
    if (Time.now() > resetPinExpiry) {
      resetPin := "";
      return false;
    };
    adminPassword := newPassword;
    resetPin := "";
    true;
  };

  func countGenreOverlap(book : Book, targetGenres : [Text]) : Nat {
    var count = 0;
    for (genre in targetGenres.values()) {
      if (book.genres.any(func(g) { g == genre })) { count += 1 };
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
      id = nextBookId; title = "Antonyms of a Mirage";
      subtitle = "A Literary Psychological Exploration";
      description = "A journey through the complexities of perception and reality.";
      coverUrl = "https://example.com/covers/antonyms.jpg";
      amazonEbookLink = ""; amazonPaperbackLink = "";
      formats = ["eBook", "Paperback"]; genres = ["Psychological", "Literary Fiction"];
      publishedDate = "2022-01-15"; authorNotes = "This book explores the boundaries of consciousness.";
      lookInsideText = "Chapter 1: The Illusion..."; featured = true;
    };
    booksV2.add(nextBookId, book1); nextBookId += 1;

    let post1 : BlogPost = {
      id = nextBlogPostId; title = "On Writing Psychological Fiction";
      excerpt = "Exploring the depths of the human mind."; content = "Full content...";
      publishedDate = "2024-02-01"; readTime = 5; tags = ["writing", "psychology"]; published = true;
    };
    blogPosts.add(nextBlogPostId, post1); nextBlogPostId += 1;

    let qa1 : ChatbotEntry = {
      id = nextChatbotId; question = "Who is O. Chiddarwar?";
      answer = "O. Chiddarwar is an author with a passion for storytelling across multiple genres.";
    };
    chatbotKnowledge.add(nextChatbotId, qa1); nextChatbotId += 1;
  };

};
