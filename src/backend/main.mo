import Int "mo:core/Int";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Stripe "stripe/stripe";



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
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // ============================================================
  // EXISTING TYPES
  // ============================================================

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

  type ChatbotId = Nat;

  type ChatbotEntry = {
    id : ChatbotId;
    question : Text;
    answer : Text;
  };

  // ============================================================
  // E-COMMERCE TYPES
  // ============================================================

  type ProductId = Nat;

  type MerchandiseProduct = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Nat; // in cents (USD)
    imageUrl : Text;
    category : Text;
    printfulProductId : Text; // empty string if not linked
    inStock : Bool;
    featured : Bool;
  };

  type AudioBookId = Nat;

  type AudioBook = {
    id : AudioBookId;
    bookId : Nat; // 0 if standalone
    title : Text;
    description : Text;
    price : Nat; // in cents (USD)
    sampleUrl : Text; // free preview URL
    fullAudioUrl : Text; // only returned to verified purchasers
    duration : Text;
    coverUrl : Text;
    narrator : Text;
  };

  // Safe AudioBook without fullAudioUrl for public consumption
  type AudioBookPublic = {
    id : AudioBookId;
    bookId : Nat;
    title : Text;
    description : Text;
    price : Nat;
    sampleUrl : Text;
    duration : Text;
    coverUrl : Text;
    narrator : Text;
  };

  type OrderId = Nat;

  type OrderItem = {
    productId : Nat;
    productType : Text; // "merch" or "audiobook"
    quantity : Nat;
    price : Nat;
    title : Text;
  };

  type Order = {
    id : OrderId;
    customerEmail : Text;
    customerName : Text;
    items : [OrderItem];
    totalAmount : Nat;
    stripeSessionId : Text;
    status : Text; // "pending" | "paid" | "fulfilled" | "cancelled"
    createdAt : Text;
    printfulOrderId : Text; // empty if not applicable
  };

  type PurchaseId = Nat;

  type PurchasedAudioBook = {
    id : PurchaseId;
    orderId : OrderId;
    customerEmail : Text;
    audiobookId : AudioBookId;
    accessToken : Text;
    createdAt : Text;
  };

  // ============================================================
  // SORT HELPERS
  // ============================================================

  func compareBooks(b1 : Book, b2 : Book) : Order.Order {
    switch (Text.compare(b1.title, b2.title)) {
      case (#equal) { Nat.compare(b1.id, b2.id) };
      case (o) { o };
    };
  };

  func compareReviews(r1 : Review, r2 : Review) : Order.Order {
    Text.compare(r1.reviewDate, r2.reviewDate);
  };

  func compareBlogPosts(p1 : BlogPost, p2 : BlogPost) : Order.Order {
    Text.compare(p2.publishedDate, p1.publishedDate);
  };

  func compareChatbotEntries(e1 : ChatbotEntry, e2 : ChatbotEntry) : Order.Order {
    Text.compare(e1.question, e2.question);
  };

  func compareOrders(o1 : Order, o2 : Order) : Order.Order {
    Text.compare(o2.createdAt, o1.createdAt); // newest first
  };

  func countGenreOverlap(book : Book, targetGenres : [Text]) : Nat {
    var count = 0;
    for (genre in targetGenres.values()) {
      if (book.genres.any(func(g) { g == genre })) { count += 1 };
    };
    count;
  };

  // ============================================================
  // STABLE COUNTERS
  // ============================================================

  stable var nextBookId = 1;
  stable var nextReviewId = 1;
  stable var nextBlogPostId = 1;
  stable var nextContactId = 1;
  stable var nextChatbotId = 1;
  stable var nextProductId = 1;
  stable var nextAudioBookId = 1;
  stable var nextOrderId = 1;
  stable var nextPurchaseId = 1;
  stable var adminPassword = "admin123";
  stable var resetPin : Text = "";
  stable var resetPinExpiry : Int = 0;
  stable var realBooksSeedVersion = 0;
  stable var stripeSecretKey : Text = "";
  stable var stripeAllowedCountries : [Text] = ["US", "GB", "IN", "AU", "CA"];

  // ============================================================
  // STABLE MAPS
  // ============================================================

  let books = Map.empty<BookId, BookV1>(); // V1 kept for compat
  let booksV2 = Map.empty<BookId, Book>();
  let reviews = Map.empty<ReviewId, Review>();
  let blogPosts = Map.empty<BlogPostId, BlogPost>();
  let subscribers = Map.empty<Text, Subscriber>();
  let contacts = Map.empty<ContactId, ContactSubmission>();
  let pageVisits = Map.empty<Text, Nat>();
  let chatbotKnowledge = Map.empty<ChatbotId, ChatbotEntry>();
  let merchandiseProducts = Map.empty<ProductId, MerchandiseProduct>();
  let audioBooks = Map.empty<AudioBookId, AudioBook>();
  let orders = Map.empty<OrderId, Order>();
  let purchasedAudioBooks = Map.empty<PurchaseId, PurchasedAudioBook>();

  // ============================================================
  // BOOK SEEDING
  // ============================================================

  func seedRealBooksIfNeeded() {
    if (realBooksSeedVersion >= 1 and booksV2.size() > 0) return;

    if (not booksV2.values().toArray().any(func(b) { b.title == "The Long Climb" })) {
      booksV2.add(nextBookId, {
        id = nextBookId; title = "The Long Climb"; subtitle = "A Journey of Resilience";
        description = "A powerful story of perseverance, growth, and the human spirit's capacity to rise above every obstacle.";
        coverUrl = "/assets/generated/book-the-long-climb.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"]; genres = ["Motivational", "Drama", "Literary Fiction"];
        publishedDate = "2024-01-01"; authorNotes = "This book is close to my heart.";
        lookInsideText = "Chapter 1: The first step is always the hardest..."; featured = true;
      });
      nextBookId += 1;
    };

    if (not booksV2.values().toArray().any(func(b) { b.title == "The Ember Prophecy" })) {
      booksV2.add(nextBookId, {
        id = nextBookId; title = "The Ember Prophecy"; subtitle = "Flames of Destiny";
        description = "An epic tale of fate, fire, and a prophecy that has haunted generations.";
        coverUrl = "/assets/generated/book-the-ember-prophecy.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"]; genres = ["Fantasy", "Adventure", "Drama"];
        publishedDate = "2023-06-15"; authorNotes = "Born from my fascination with destiny.";
        lookInsideText = "Prologue: In the age before memory..."; featured = true;
      });
      nextBookId += 1;
    };

    if (not booksV2.values().toArray().any(func(b) { b.title == "The Letter in the Rain" })) {
      booksV2.add(nextBookId, {
        id = nextBookId; title = "The Letter in the Rain"; subtitle = "Words That Found Their Way Home";
        description = "A heartfelt romance about a letter lost and found, and the two souls it connects.";
        coverUrl = "/assets/generated/book-the-letter-in-the-rain.dim_400x600.jpg";
        amazonEbookLink = "https://www.amazon.com/author/o.chiddarwar";
        amazonPaperbackLink = "https://www.amazon.com/author/o.chiddarwar";
        formats = ["Kindle", "Paperback"]; genres = ["Romance", "Drama", "Literary Fiction"];
        publishedDate = "2022-11-10"; authorNotes = "Written thinking about all the things we wish we had said.";
        lookInsideText = "Dear Stranger, By the time you read this..."; featured = false;
      });
      nextBookId += 1;
    };

    realBooksSeedVersion := 1;
  };

  system func postupgrade() {
    for ((id, b) in books.entries()) {
      if (not booksV2.containsKey(id)) {
        booksV2.add(id, {
          id = b.id; title = b.title; subtitle = b.subtitle; description = b.description;
          coverUrl = b.coverUrl; amazonEbookLink = b.amazonLink; amazonPaperbackLink = "";
          formats = b.formats; genres = b.genres; publishedDate = b.publishedDate;
          authorNotes = b.authorNotes; lookInsideText = b.lookInsideText; featured = b.featured;
        });
        if (b.id >= nextBookId) { nextBookId := b.id + 1 };
      };
    };
    seedRealBooksIfNeeded();
  };

  // ============================================================
  // BOOKS API
  // ============================================================

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
      case (?b) { b };
    };
  };

  public query func getAllBooks() : async [Book] {
    booksV2.values().toArray().sort(compareBooks);
  };

  public query func getRelatedBooks(bookId : BookId) : async [Book] {
    switch (booksV2.get(bookId)) {
      case (null) { Runtime.trap("Book not found") };
      case (?book) {
        let tg = book.genres;
        booksV2.values().toArray().filter(func(b) { b.id != bookId }).sort(
          func(b1, b2) {
            let o1 = countGenreOverlap(b1, tg);
            let o2 = countGenreOverlap(b2, tg);
            switch (Nat.compare(o2, o1)) {
              case (#equal) { compareBooks(b1, b2) };
              case (o) { o };
            };
          }
        );
      };
    };
  };

  // ============================================================
  // REVIEWS API
  // ============================================================

  public shared func addReview(review : Review) : async ReviewId {
    if (not booksV2.containsKey(review.bookId)) { Runtime.trap("Book not found") };
    let r : Review = { review with id = nextReviewId };
    reviews.add(nextReviewId, r);
    nextReviewId += 1;
    r.id;
  };

  public query func getReviewsForBook(bookId : BookId) : async [Review] {
    reviews.values().toArray().filter(func(r) { r.bookId == bookId }).sort(compareReviews);
  };

  // ============================================================
  // BLOG API
  // ============================================================

  public shared func createBlogPost(post : BlogPost) : async BlogPostId {
    let p : BlogPost = { post with id = nextBlogPostId };
    blogPosts.add(nextBlogPostId, p);
    nextBlogPostId += 1;
    p.id;
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
      case (?p) { p };
    };
  };

  public query func getPublishedBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().filter(func(p) { p.published }).sort(compareBlogPosts);
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray().sort(compareBlogPosts);
  };

  // ============================================================
  // NEWSLETTER API
  // ============================================================

  public shared func subscribeToNewsletter(email : Text) : async () {
    if (subscribers.containsKey(email)) { Runtime.trap("Already subscribed") };
    subscribers.add(email, { email; subscribedAt = Time.now().toText() });
  };

  public query func getAllSubscribers() : async [Subscriber] {
    subscribers.values().toArray();
  };

  // ============================================================
  // CONTACT API
  // ============================================================

  public shared func submitContactForm(submission : ContactSubmission) : async ContactId {
    let s : ContactSubmission = { submission with id = nextContactId };
    contacts.add(nextContactId, s);
    nextContactId += 1;
    s.id;
  };

  public query func getAllContactSubmissions() : async [ContactSubmission] {
    contacts.values().toArray();
  };

  // ============================================================
  // ANALYTICS API
  // ============================================================

  public shared func recordPageVisit(pageName : Text) : async () {
    let c = switch (pageVisits.get(pageName)) {
      case (null) { 0 };
      case (?n) { n };
    };
    pageVisits.add(pageName, c + 1);
  };

  public query func getPageVisits(pageName : Text) : async Nat {
    switch (pageVisits.get(pageName)) {
      case (null) { 0 };
      case (?n) { n };
    };
  };

  public query func getAllPageVisits() : async [(Text, Nat)] {
    pageVisits.entries().toArray();
  };

  // ============================================================
  // CHATBOT API
  // ============================================================

  public query func getAllChatbotEntries() : async [ChatbotEntry] {
    chatbotKnowledge.values().toArray().sort(compareChatbotEntries);
  };

  public shared func addChatbotEntry(entry : ChatbotEntry) : async ChatbotId {
    let e : ChatbotEntry = { entry with id = nextChatbotId };
    chatbotKnowledge.add(nextChatbotId, e);
    nextChatbotId += 1;
    e.id;
  };

  // ============================================================
  // ADMIN PASSWORD API
  // ============================================================

  public query func verifyAdminPassword(password : Text) : async Bool {
    password == adminPassword;
  };

  public shared func changeAdminPassword(oldPassword : Text, newPassword : Text) : async Bool {
    if (oldPassword == adminPassword) {
      adminPassword := newPassword;
      true;
    } else { false };
  };

  let RECOVERY_EMAIL : Text = "mystoryova@gmail.com";

  public shared func generateResetPin(email : Text) : async ?Text {
    if (email.toLower() != RECOVERY_EMAIL) { return null };
    let t = Int.abs(Time.now());
    let pin = ((t % 900_000) + 100_000).toText();
    resetPin := pin;
    resetPinExpiry := Time.now() + 600_000_000_000;
    ?pin;
  };

  public shared func verifyResetPinAndChangePassword(pin : Text, newPassword : Text) : async Bool {
    if (resetPin == "" or pin != resetPin) { return false };
    if (Time.now() > resetPinExpiry) { resetPin := ""; return false };
    adminPassword := newPassword;
    resetPin := "";
    true;
  };

  // ============================================================
  // MERCHANDISE API
  // ============================================================

  public shared func createMerchandiseProduct(product : MerchandiseProduct) : async ProductId {
    let p : MerchandiseProduct = { product with id = nextProductId };
    merchandiseProducts.add(nextProductId, p);
    nextProductId += 1;
    p.id;
  };

  public shared func updateMerchandiseProduct(id : ProductId, product : MerchandiseProduct) : async () {
    if (not merchandiseProducts.containsKey(id)) { Runtime.trap("Product not found") };
    merchandiseProducts.add(id, { product with id });
  };

  public shared func deleteMerchandiseProduct(id : ProductId) : async () {
    if (not merchandiseProducts.containsKey(id)) { Runtime.trap("Product not found") };
    merchandiseProducts.remove(id);
  };

  public query func getMerchandiseProduct(id : ProductId) : async MerchandiseProduct {
    switch (merchandiseProducts.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
  };

  public query func getAllMerchandiseProducts() : async [MerchandiseProduct] {
    merchandiseProducts.values().toArray();
  };

  public query func getFeaturedMerchandiseProducts() : async [MerchandiseProduct] {
    merchandiseProducts.values().toArray().filter(func(p) { p.featured and p.inStock });
  };

  // ============================================================
  // AUDIOBOOK API
  // ============================================================

  public shared func createAudioBook(ab : AudioBook) : async AudioBookId {
    let a : AudioBook = { ab with id = nextAudioBookId };
    audioBooks.add(nextAudioBookId, a);
    nextAudioBookId += 1;
    a.id;
  };

  public shared func updateAudioBook(id : AudioBookId, ab : AudioBook) : async () {
    if (not audioBooks.containsKey(id)) { Runtime.trap("AudioBook not found") };
    audioBooks.add(id, { ab with id });
  };

  public shared func deleteAudioBook(id : AudioBookId) : async () {
    if (not audioBooks.containsKey(id)) { Runtime.trap("AudioBook not found") };
    audioBooks.remove(id);
  };

  // Returns public version (no fullAudioUrl)
  public query func getAudioBook(id : AudioBookId) : async AudioBookPublic {
    switch (audioBooks.get(id)) {
      case (null) { Runtime.trap("AudioBook not found") };
      case (?a) { toPublicAudioBook(a) };
    };
  };

  public query func getAllAudioBooks() : async [AudioBookPublic] {
    audioBooks.values().toArray().map(toPublicAudioBook);
  };

  // Returns public audiobook linked to a specific book
  public query func getAudioBookByBookId(bookId : Nat) : async ?AudioBookPublic {
    let found = audioBooks.values().toArray().filter(func(a) { a.bookId == bookId });
    if (found.size() == 0) { null } else { ?toPublicAudioBook(found[0]) };
  };

  func toPublicAudioBook(a : AudioBook) : AudioBookPublic {
    {
      id = a.id; bookId = a.bookId; title = a.title; description = a.description;
      price = a.price; sampleUrl = a.sampleUrl; duration = a.duration;
      coverUrl = a.coverUrl; narrator = a.narrator;
    };
  };

  // Admin only: get full audiobook with URL (for management)
  public query func getAudioBookAdmin(id : AudioBookId) : async AudioBook {
    switch (audioBooks.get(id)) {
      case (null) { Runtime.trap("AudioBook not found") };
      case (?a) { a };
    };
  };

  // ============================================================
  // ORDER API
  // ============================================================

  public shared func createOrder(order : Order) : async OrderId {
    let o : Order = { order with id = nextOrderId; status = "pending"; createdAt = Time.now().toText() };
    orders.add(nextOrderId, o);
    nextOrderId += 1;
    o.id;
  };

  public shared func updateOrderStatus(id : OrderId, status : Text, printfulOrderId : Text) : async () {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { orders.add(id, { o with status; printfulOrderId }) };
    };
  };

  public query func getOrder(id : OrderId) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) { o };
    };
  };

  public query func getAllOrders() : async [Order] {
    orders.values().toArray().sort(compareOrders);
  };

  public query func getOrdersByEmail(email : Text) : async [Order] {
    orders.values().toArray().filter(func(o) { o.customerEmail == email }).sort(compareOrders);
  };

  // Called after Stripe session confirmed paid — marks order paid and grants audiobook access
  public shared func confirmOrderPayment(orderId : OrderId, stripeSessionId : Text) : async Bool {
    switch (orders.get(orderId)) {
      case (null) { false };
      case (?o) {
        if (o.stripeSessionId != stripeSessionId) { return false };
        orders.add(orderId, { o with status = "paid" });
        // Grant access to any audiobook items
        for (item in o.items.values()) {
          if (item.productType == "audiobook") {
            let token = generateAccessToken(orderId, item.productId);
            let purchase : PurchasedAudioBook = {
              id = nextPurchaseId;
              orderId;
              customerEmail = o.customerEmail;
              audiobookId = item.productId;
              accessToken = token;
              createdAt = Time.now().toText();
            };
            purchasedAudioBooks.add(nextPurchaseId, purchase);
            nextPurchaseId += 1;
          };
        };
        true;
      };
    };
  };

  func generateAccessToken(orderId : OrderId, audiobookId : Nat) : Text {
    let t = Int.abs(Time.now());
    "tok_" # orderId.toText() # "_" # audiobookId.toText() # "_" # (t % 999_999_999).toText();
  };

  // ============================================================
  // AUDIOBOOK ACCESS API
  // ============================================================

  // Verify access and return the full audio URL
  public query func verifyAudiobookAccess(token : Text, audiobookId : AudioBookId) : async ?Text {
    let found = purchasedAudioBooks.values().toArray().filter(func(p) {
      p.accessToken == token and p.audiobookId == audiobookId
    });
    if (found.size() == 0) { return null };
    switch (audioBooks.get(audiobookId)) {
      case (null) { null };
      case (?a) { ?a.fullAudioUrl };
    };
  };

  // Get all purchased audiobooks for an email (public info only)
  public query func getPurchasedAudiobooks(email : Text) : async [AudioBookPublic] {
    let purchases = purchasedAudioBooks.values().toArray().filter(func(p) {
      p.customerEmail == email
    });
    let result = purchases.filterMap(func(p) : ?AudioBookPublic {
      switch (audioBooks.get(p.audiobookId)) {
        case (null) { null };
        case (?a) { ?toPublicAudioBook(a) };
      };
    });
    result;
  };

  // Get access token for an email + audiobook combination (for re-accessing)
  public query func getAudiobookAccessToken(email : Text, audiobookId : AudioBookId) : async ?Text {
    let found = purchasedAudioBooks.values().toArray().filter(func(p) {
      p.customerEmail == email and p.audiobookId == audiobookId
    });
    if (found.size() == 0) { null } else { ?found[0].accessToken };
  };

  // ============================================================
  // STRIPE INTEGRATION
  // ============================================================

  public query func isStripeConfigured() : async Bool {
    stripeSecretKey != "";
  };

  public shared func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    stripeSecretKey := config.secretKey;
    stripeAllowedCountries := config.allowedCountries;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    if (stripeSecretKey == "") { Runtime.trap("Stripe not configured") };
    { secretKey = stripeSecretKey; allowedCountries = stripeAllowedCountries };
  };

  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ============================================================
  // PRINTFUL HTTP OUTCALL
  // ============================================================

  stable var printfulApiKey : Text = "";

  public shared func setPrintfulApiKey(key : Text) : async () {
    printfulApiKey := key;
  };

  public func fulfillPrintfulOrder(orderId : OrderId) : async Text {
    if (printfulApiKey == "") { Runtime.trap("Printful API key not configured") };
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?o) {
        let body = buildPrintfulOrderBody(o);
        let headers = [
          { name = "Authorization"; value = "Bearer " # printfulApiKey },
          { name = "Content-Type"; value = "application/json" },
        ];
        let result = await OutCall.httpPostRequest(
          "https://api.printful.com/orders",
          headers,
          body,
          transform,
        );
        orders.add(orderId, { o with status = "fulfilled"; printfulOrderId = result });
        result;
      };
    };
  };

  func buildPrintfulOrderBody(o : Order) : Text {
    var itemsJson = "";
    var first = true;
    for (item in o.items.values()) {
      if (item.productType == "merch") {
        if (not first) { itemsJson #= "," };
        itemsJson #= "{\"sync_variant_id\":" # item.productId.toText() #
          ",\"quantity\":" # item.quantity.toText() # "}";
        first := false;
      };
    };
    "{\"recipient\":{\"name\":\"" # o.customerName #
      "\",\"email\":\"" # o.customerEmail #
      "\"},\"items\":[" # itemsJson # "]}";
  };

  // ============================================================
  // LEGACY / SEED
  // ============================================================

  public shared func seedInitialData() : async () {
    booksV2.add(nextBookId, {
      id = nextBookId; title = "Antonyms of a Mirage";
      subtitle = "A Literary Psychological Exploration";
      description = "A journey through the complexities of perception and reality.";
      coverUrl = "https://example.com/covers/antonyms.jpg";
      amazonEbookLink = ""; amazonPaperbackLink = "";
      formats = ["eBook", "Paperback"]; genres = ["Psychological", "Literary Fiction"];
      publishedDate = "2022-01-15"; authorNotes = "This book explores the boundaries of consciousness.";
      lookInsideText = "Chapter 1: The Illusion..."; featured = true;
    });
    nextBookId += 1;

    blogPosts.add(nextBlogPostId, {
      id = nextBlogPostId; title = "On Writing Psychological Fiction";
      excerpt = "Exploring the depths of the human mind."; content = "Full content...";
      publishedDate = "2024-02-01"; readTime = 5; tags = ["writing", "psychology"]; published = true;
    });
    nextBlogPostId += 1;

    chatbotKnowledge.add(nextChatbotId, {
      id = nextChatbotId; question = "Who is O. Chiddarwar?";
      answer = "O. Chiddarwar is an author with a passion for storytelling across multiple genres.";
    });
    nextChatbotId += 1;
  };
};
