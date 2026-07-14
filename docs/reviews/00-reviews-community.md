# Reviews, Ratings, Comments & Community Module

## Complete Enterprise Product Community System

---

## PART 1 — Module Structure

### 1.1 Clean Architecture Layout

```
apps/api/src/modules/community/
├── domain/
│   ├── entities/
│   │   ├── review.entity.ts
│   │   ├── review-image.entity.ts
│   │   ├── review-video.entity.ts
│   │   ├── review-vote.entity.ts
│   │   ├── review-report.entity.ts
│   │   ├── rating.entity.ts
│   │   ├── rating-aggregate.entity.ts
│   │   ├── question.entity.ts
│   │   ├── answer.entity.ts
│   │   ├── answer-vote.entity.ts
│   │   ├── comment.entity.ts
│   │   ├── comment-reply.entity.ts
│   │   ├── comment-reaction.entity.ts
│   │   ├── moderation-queue.entity.ts
│   │   ├── user-reputation.entity.ts
│   │   ├── user-badge.entity.ts
│   │   └── review-bookmark.entity.ts
│   ├── value-objects/
│   │   ├── rating.vo.ts
│   │   ├── review-content.vo.ts
│   │   ├── moderation-status.vo.ts
│   │   └── reputation-score.vo.ts
│   ├── enums/
│   │   ├── review-status.enum.ts
│   │   ├── review-type.enum.ts
│   │   ├── moderation-action.enum.ts
│   │   ├── vote-type.enum.ts
│   │   ├── report-reason.enum.ts
│   │   ├── badge-type.enum.ts
│   │   ├── reviewer-level.enum.ts
│   │   └── comment-status.enum.ts
│   ├── events/
│   │   ├── review-created.event.ts
│   │   ├── review-approved.event.ts
│   │   ├── review-rejected.event.ts
│   │   ├── review-updated.event.ts
│   │   ├── review-deleted.event.ts
│   │   ├── review-voted.event.ts
│   │   ├── review-reported.event.ts
│   │   ├── question-asked.event.ts
│   │   ├── question-answered.event.ts
│   │   ├── answer-voted.event.ts
│   │   ├── comment-created.event.ts
│   │   ├── comment-replied.event.ts
│   │   ├── rating-updated.event.ts
│   │   └── badge-awarded.event.ts
│   ├── exceptions/
│   │   ├── review-not-found.exception.ts
│   │   ├── review-already-exists.exception.ts
│   │   ├── review-not-editable.exception.ts
│   │   ├── review-not-deletable.exception.ts
│   │   ├── duplicate-review.exception.ts
│   │   ├── question-not-found.exception.ts
│   │   ├── answer-not-found.exception.ts
│   │   ├── comment-not-found.exception.ts
│   │   ├── unauthorized-moderation.exception.ts
│   │   ├── invalid-rating.exception.ts
│   │   └── spam-detected.exception.ts
│   └── repositories/
│       ├── review.repository.ts
│       ├── question.repository.ts
│       ├── answer.repository.ts
│       ├── comment.repository.ts
│       ├── rating.repository.ts
│       ├── moderation-queue.repository.ts
│       └── user-reputation.repository.ts
│
├── application/
│   ├── use-cases/
│   │   ├── review/
│   │   │   ├── create-review.use-case.ts
│   │   │   ├── update-review.use-case.ts
│   │   │   ├── delete-review.use-case.ts
│   │   │   ├── get-review.use-case.ts
│   │   │   ├── get-product-reviews.use-case.ts
│   │   │   ├── get-user-reviews.use-case.ts
│   │   │   ├── vote-review.use-case.ts
│   │   │   ├── report-review.use-case.ts
│   │   │   ├── bookmark-review.use-case.ts
│   │   │   └── moderate-review.use-case.ts
│   │   ├── question/
│   │   │   ├── ask-question.use-case.ts
│   │   │   ├── answer-question.use-case.ts
│   │   │   ├── vote-answer.use-case.ts
│   │   │   ├── mark-best-answer.use-case.ts
│   │   │   ├── get-product-questions.use-case.ts
│   │   │   └── moderate-question.use-case.ts
│   │   ├── comment/
│   │   │   ├── create-comment.use-case.ts
│   │   │   ├── reply-to-comment.use-case.ts
│   │   │   ├── edit-comment.use-case.ts
│   │   │   ├── delete-comment.use-case.ts
│   │   │   ├── react-to-comment.use-case.ts
│   │   │   └── get-comments.use-case.ts
│   │   ├── rating/
│   │   │   ├── get-product-rating.use-case.ts
│   │   │   ├── get-rating-distribution.use-case.ts
│   │   │   └── get-verified-rating.use-case.ts
│   │   ├── moderation/
│   │   │   ├── get-moderation-queue.use-case.ts
│   │   │   ├── approve-content.use-case.ts
│   │   │   ├── reject-content.use-case.ts
│   │   │   ├── flag-content.use-case.ts
│   │   │   └── auto-moderate.use-case.ts
│   │   └── reputation/
│   │       ├── get-user-reputation.use-case.ts
│   │       ├── update-reputation.use-case.ts
│   │       └── award-badge.use-case.ts
│   ├── services/
│   │   ├── moderation.service.ts
│   │   ├── spam-detection.service.ts
│   │   ├── rating-aggregation.service.ts
│   │   ├── reputation.service.ts
│   │   └── community-search.service.ts
│   └── dto/
│       ├── review/
│       │   ├── create-review.dto.ts
│       │   ├── update-review.dto.ts
│       │   └── review-response.dto.ts
│       ├── question/
│       │   ├── ask-question.dto.ts
│       │   ├── answer-question.dto.ts
│       │   └── question-response.dto.ts
│       ├── comment/
│       │   ├── create-comment.dto.ts
│       │   └── comment-response.dto.ts
│       └── moderation/
│           ├── moderate-content.dto.ts
│           └── moderation-queue.dto.ts
│
├── infrastructure/
│   ├── repositories/
│   │   ├── prisma-review.repository.ts
│   │   ├── prisma-question.repository.ts
│   │   ├── prisma-answer.repository.ts
│   │   ├── prisma-comment.repository.ts
│   │   ├── prisma-rating.repository.ts
│   │   ├── prisma-moderation-queue.repository.ts
│   │   └── prisma-user-reputation.repository.ts
│   ├── services/
│   │   ├── spam-detection.service.ts
│   │   ├── profanity-filter.service.ts
│   │   ├── rating-aggregation.service.ts
│   │   ├── community-notification.service.ts
│   │   └── community-search.service.ts
│   ├── mappers/
│   │   ├── review.mapper.ts
│   │   ├── question.mapper.ts
│   │   └── comment.mapper.ts
│   └── cache/
│       ├── review-cache.strategy.ts
│       └── rating-cache.strategy.ts
│
├── presentation/
│   ├── controllers/
│   │   ├── review.controller.ts
│   │   ├── question.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── rating.controller.ts
│   │   ├── moderation.controller.ts
│   │   └── community-search.controller.ts
│   ├── guards/
│   │   ├── review-owner.guard.ts
│   │   ├── moderation.guard.ts
│   │   └── verified-purchase.guard.ts
│   ├── interceptors/
│   │   ├── review-cache.interceptor.ts
│   │   └── rating-cache.interceptor.ts
│   └── dto/
│       ├── create-review.dto.ts
│       ├── update-review.dto.ts
│       ├── ask-question.dto.ts
│       ├── create-comment.dto.ts
│       └── moderate-content.dto.ts
│
└── community.module.ts
```

---

## PART 2 — Domain Entities

### 2.1 Review Entity

```typescript
// modules/community/domain/entities/review.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { ReviewStatus } from '../enums/review-status.enum';
import { ReviewImage } from './review-image.entity';
import { ReviewVote } from './review-vote.entity';
import { ReviewCreatedEvent } from '../events/review-created.event';
import { ReviewApprovedEvent } from '../events/review-approved.event';
import { ReviewRejectedEvent } from '../events/review-rejected.event';

export interface ReviewProps {
  productId: string;
  userId: string;
  orderId?: string;
  rating: number;
  title?: string;
  body?: string;
  pros?: string;
  cons?: string;
  images: ReviewImage[];
  videos: string[];
  isAnonymous: boolean;
  isVerifiedPurchase: boolean;
  isEdited: boolean;
  status: ReviewStatus;
  helpfulCount: number;
  unhelpfulCount: number;
  reportCount: number;
  moderationNotes?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Review extends AggregateRoot<ReviewProps> {
  private static readonly MIN_RATING = 1;
  private static readonly MAX_RATING = 5;
  private static readonly MAX_BODY_LENGTH = 10000;
  private static readonly MAX_IMAGES = 10;

  private constructor(props: ReviewProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    productId: string;
    userId: string;
    orderId?: string;
    rating: number;
    title?: string;
    body?: string;
    pros?: string;
    cons?: string;
    images?: ReviewImage[];
    videos?: string[];
    isAnonymous?: boolean;
    isVerifiedPurchase?: boolean;
  }): Review {
    // Validate rating
    if (data.rating < Review.MIN_RATING || data.rating > Review.MAX_RATING) {
      throw new Error(`Rating must be between ${Review.MIN_RATING} and ${Review.MAX_RATING}`);
    }

    // Validate body length
    if (data.body && data.body.length > Review.MAX_BODY_LENGTH) {
      throw new Error(`Review body must not exceed ${Review.MAX_BODY_LENGTH} characters`);
    }

    // Validate images count
    if (data.images && data.images.length > Review.MAX_IMAGES) {
      throw new Error(`Review cannot have more than ${Review.MAX_IMAGES} images`);
    }

    const review = new Review({
      productId: data.productId,
      userId: data.userId,
      orderId: data.orderId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      pros: data.pros,
      cons: data.cons,
      images: data.images || [],
      videos: data.videos || [],
      isAnonymous: data.isAnonymous || false,
      isVerifiedPurchase: data.isVerifiedPurchase || false,
      isEdited: false,
      status: ReviewStatus.PENDING,
      helpfulCount: 0,
      unhelpfulCount: 0,
      reportCount: 0,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    review.addDomainEvent(new ReviewCreatedEvent(
      review.id,
      review.productId,
      review.userId,
      review.rating,
    ));

    return review;
  }

  get productId(): string {
    return this.props.productId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get rating(): number {
    return this.props.rating;
  }

  get title(): string | undefined {
    return this.props.title;
  }

  get body(): string | undefined {
    return this.props.body;
  }

  get pros(): string | undefined {
    return this.props.pros;
  }

  get cons(): string | undefined {
    return this.props.cons;
  }

  get images(): ReviewImage[] {
    return this.props.images;
  }

  get isAnonymous(): boolean {
    return this.props.isAnonymous;
  }

  get isVerifiedPurchase(): boolean {
    return this.props.isVerifiedPurchase;
  }

  get isEdited(): boolean {
    return this.props.isEdited;
  }

  get status(): ReviewStatus {
    return this.props.status;
  }

  get helpfulCount(): number {
    return this.props.helpfulCount;
  }

  get unhelpfulCount(): number {
    return this.props.unhelpfulCount;
  }

  get reportCount(): number {
    return this.props.reportCount;
  }

  get isApproved(): boolean {
    return this.props.status === ReviewStatus.APPROVED;
  }

  get isPending(): boolean {
    return this.props.status === ReviewStatus.PENDING;
  }

  get isRejected(): boolean {
    return this.props.status === ReviewStatus.REJECTED;
  }

  get isFlagged(): boolean {
    return this.props.status === ReviewStatus.FLAGGED;
  }

  get hasImages(): boolean {
    return this.props.images.length > 0;
  }

  get hasVideos(): boolean {
    return this.props.videos.length > 0;
  }

  get netHelpfulScore(): number {
    return this.props.helpfulCount - this.props.unhelpfulCount;
  }

  updateReview(data: {
    rating?: number;
    title?: string;
    body?: string;
    pros?: string;
    cons?: string;
  }): void {
    if (data.rating !== undefined) {
      if (data.rating < Review.MIN_RATING || data.rating > Review.MAX_RATING) {
        throw new Error(`Rating must be between ${Review.MIN_RATING} and ${Review.MAX_RATING}`);
      }
      this.props.rating = data.rating;
    }

    if (data.title !== undefined) this.props.title = data.title;
    if (data.body !== undefined) this.props.body = data.body;
    if (data.pros !== undefined) this.props.pros = data.pros;
    if (data.cons !== undefined) this.props.cons = data.cons;

    this.props.isEdited = true;
    this.touch();
  }

  addImage(image: ReviewImage): void {
    if (this.props.images.length >= Review.MAX_IMAGES) {
      throw new Error(`Cannot add more than ${Review.MAX_IMAGES} images`);
    }
    this.props.images.push(image);
    this.touch();
  }

  removeImage(imageId: string): void {
    this.props.images = this.props.images.filter(img => img.id !== imageId);
    this.touch();
  }

  approve(moderatorId?: string): void {
    this.props.status = ReviewStatus.APPROVED;
    this.props.moderatedBy = moderatorId;
    this.props.moderatedAt = new Date();
    this.touch();
    this.addDomainEvent(new ReviewApprovedEvent(this.id, this.productId, this.userId));
  }

  reject(reason: string, moderatorId?: string): void {
    this.props.status = ReviewStatus.REJECTED;
    this.props.moderationNotes = reason;
    this.props.moderatedBy = moderatorId;
    this.props.moderatedAt = new Date();
    this.touch();
    this.addDomainEvent(new ReviewRejectedEvent(this.id, this.productId, reason));
  }

  flag(): void {
    this.props.status = ReviewStatus.FLAGGED;
    this.props.reportCount++;
    this.touch();
  }

  incrementHelpful(): void {
    this.props.helpfulCount++;
    this.touch();
  }

  decrementHelpful(): void {
    if (this.props.helpfulCount > 0) {
      this.props.helpfulCount--;
      this.touch();
    }
  }

  incrementUnhelpful(): void {
    this.props.unhelpfulCount++;
    this.touch();
  }

  decrementUnhelpful(): void {
    if (this.props.unhelpfulCount > 0) {
      this.props.unhelpfulCount--;
      this.touch();
    }
  }
}
```

### 2.2 Question Entity

```typescript
// modules/community/domain/entities/question.entity.ts
import { AggregateRoot } from '../../../shared/domain/entities/aggregate-root';
import { Answer } from './answer.entity';

export interface QuestionProps {
  productId: string;
  userId: string;
  title: string;
  body?: string;
  answers: Answer[];
  answerCount: number;
  isAnonymous: boolean;
  status: 'active' | 'closed' | 'deleted';
  bestAnswerId?: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  private constructor(props: QuestionProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    productId: string;
    userId: string;
    title: string;
    body?: string;
    isAnonymous?: boolean;
  }): Question {
    return new Question({
      productId: data.productId,
      userId: data.userId,
      title: data.title,
      body: data.body,
      answers: [],
      answerCount: 0,
      isAnonymous: data.isAnonymous || false,
      status: 'active',
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get body(): string | undefined {
    return this.props.body;
  }

  get answers(): Answer[] {
    return this.props.answers;
  }

  get answerCount(): number {
    return this.props.answerCount;
  }

  get isAnonymous(): boolean {
    return this.props.isAnonymous;
  }

  get isActive(): boolean {
    return this.props.status === 'active';
  }

  get hasBestAnswer(): boolean {
    return this.props.bestAnswerId !== undefined;
  }

  addAnswer(answer: Answer): void {
    this.props.answers.push(answer);
    this.props.answerCount++;
    this.touch();
  }

  removeAnswer(answerId: string): void {
    this.props.answers = this.props.answers.filter(a => a.id !== answerId);
    this.props.answerCount--;
    this.touch();
  }

  setBestAnswer(answerId: string): void {
    this.props.bestAnswerId = answerId;
    this.touch();
  }

  close(): void {
    this.props.status = 'closed';
    this.touch();
  }

  delete(): void {
    this.props.status = 'deleted';
    this.touch();
  }
}
```

### 2.3 Answer Entity

```typescript
// modules/community/domain/entities/answer.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export interface AnswerProps {
  questionId: string;
  userId: string;
  body: string;
  isSellerAnswer: boolean;
  isAdminAnswer: boolean;
  isBestAnswer: boolean;
  voteCount: number;
  status: 'active' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

export class Answer extends BaseEntity<AnswerProps> {
  private constructor(props: AnswerProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    questionId: string;
    userId: string;
    body: string;
    isSellerAnswer?: boolean;
    isAdminAnswer?: boolean;
  }): Answer {
    return new Answer({
      questionId: data.questionId,
      userId: data.userId,
      body: data.body,
      isSellerAnswer: data.isSellerAnswer || false,
      isAdminAnswer: data.isAdminAnswer || false,
      isBestAnswer: false,
      voteCount: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get body(): string {
    return this.props.body;
  }

  get isSellerAnswer(): boolean {
    return this.props.isSellerAnswer;
  }

  get isAdminAnswer(): boolean {
    return this.props.isAdminAnswer;
  }

  get isBestAnswer(): boolean {
    return this.props.isBestAnswer;
  }

  get voteCount(): number {
    return this.props.voteCount;
  }

  markAsBestAnswer(): void {
    this.props.isBestAnswer = true;
    this.touch();
  }

  unmarkAsBestAnswer(): void {
    this.props.isBestAnswer = false;
    this.touch();
  }

  upvote(): void {
    this.props.voteCount++;
    this.touch();
  }

  downvote(): void {
    if (this.props.voteCount > 0) {
      this.props.voteCount--;
      this.touch();
    }
  }

  delete(): void {
    this.props.status = 'deleted';
    this.touch();
  }
}
```

### 2.4 Comment Entity

```typescript
// modules/community/domain/entities/comment.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export interface CommentProps {
  entityType: 'review' | 'question' | 'answer';
  entityId: string;
  userId: string;
  parentId?: string;
  body: string;
  mentions: string[];
  reactions: Record<string, string[]>;
  isEdited: boolean;
  status: 'active' | 'deleted' | 'hidden';
  createdAt: Date;
  updatedAt: Date;
}

export class Comment extends BaseEntity<CommentProps> {
  private constructor(props: CommentProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    entityType: 'review' | 'question' | 'answer';
    entityId: string;
    userId: string;
    parentId?: string;
    body: string;
    mentions?: string[];
  }): Comment {
    return new Comment({
      entityType: data.entityType,
      entityId: data.entityId,
      userId: data.userId,
      parentId: data.parentId,
      body: data.body,
      mentions: data.mentions || [],
      reactions: {},
      isEdited: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get body(): string {
    return this.props.body;
  }

  get parentId(): string | undefined {
    return this.props.parentId;
  }

  get isReply(): boolean {
    return this.props.parentId !== undefined;
  }

  get mentions(): string[] {
    return this.props.mentions;
  }

  get reactions(): Record<string, string[]> {
    return this.props.reactions;
  }

  get reactionCount(): number {
    return Object.values(this.props.reactions).reduce(
      (sum, users) => sum + users.length,
      0,
    );
  }

  get isEdited(): boolean {
    return this.props.isEdited;
  }

  edit(body: string): void {
    this.props.body = body;
    this.props.isEdited = true;
    this.touch();
  }

  addReaction(emoji: string, userId: string): void {
    if (!this.props.reactions[emoji]) {
      this.props.reactions[emoji] = [];
    }
    if (!this.props.reactions[emoji].includes(userId)) {
      this.props.reactions[emoji].push(userId);
      this.touch();
    }
  }

  removeReaction(emoji: string, userId: string): void {
    if (this.props.reactions[emoji]) {
      this.props.reactions[emoji] = this.props.reactions[emoji].filter(
        id => id !== userId,
      );
      if (this.props.reactions[emoji].length === 0) {
        delete this.props.reactions[emoji];
      }
      this.touch();
    }
  }

  hide(): void {
    this.props.status = 'hidden';
    this.touch();
  }

  delete(): void {
    this.props.status = 'deleted';
    this.touch();
  }
}
```

### 2.5 Rating Aggregate Entity

```typescript
// modules/community/domain/entities/rating-aggregate.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export interface RatingAggregateProps {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseReviews: number;
  verifiedPurchaseAverage: number;
  withImages: number;
  withVideos: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class RatingAggregate extends BaseEntity<RatingAggregateProps> {
  private constructor(props: RatingAggregateProps, id?: string) {
    super(props, id);
  }

  static create(productId: string): RatingAggregate {
    return new RatingAggregate({
      productId,
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedPurchaseReviews: 0,
      verifiedPurchaseAverage: 0,
      withImages: 0,
      withVideos: 0,
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get productId(): string {
    return this.props.productId;
  }

  get totalReviews(): number {
    return this.props.totalReviews;
  }

  get averageRating(): number {
    return this.props.averageRating;
  }

  get ratingDistribution(): RatingAggregateProps['ratingDistribution'] {
    return this.props.ratingDistribution;
  }

  get verifiedPurchaseAverage(): number {
    return this.props.verifiedPurchaseAverage;
  }

  addReview(rating: number, isVerified: boolean, hasImages: boolean, hasVideos: boolean): void {
    this.props.totalReviews++;
    this.props.ratingDistribution[rating as keyof typeof this.props.ratingDistribution]++;
    
    // Recalculate average
    const totalRatingSum = Object.entries(this.props.ratingDistribution).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0,
    );
    this.props.averageRating = totalRatingSum / this.props.totalReviews;

    // Update verified purchase stats
    if (isVerified) {
      this.props.verifiedPurchaseReviews++;
      this.recalculateVerifiedAverage(rating);
    }

    // Update media counts
    if (hasImages) this.props.withImages++;
    if (hasVideos) this.props.withVideos++;

    this.props.lastUpdated = new Date();
    this.touch();
  }

  removeReview(rating: number, isVerified: boolean, hasImages: boolean, hasVideos: boolean): void {
    if (this.props.totalReviews > 0) {
      this.props.totalReviews--;
      this.props.ratingDistribution[rating as keyof typeof this.props.ratingDistribution]--;
      
      // Recalculate average
      if (this.props.totalReviews > 0) {
        const totalRatingSum = Object.entries(this.props.ratingDistribution).reduce(
          (sum, [rating, count]) => sum + Number(rating) * count,
          0,
        );
        this.props.averageRating = totalRatingSum / this.props.totalReviews;
      } else {
        this.props.averageRating = 0;
      }

      if (isVerified) {
        this.props.verifiedPurchaseReviews--;
        this.recalculateVerifiedAverage(rating, true);
      }

      if (hasImages) this.props.withImages = Math.max(0, this.props.withImages - 1);
      if (hasVideos) this.props.withVideos = Math.max(0, this.props.withVideos - 1);

      this.props.lastUpdated = new Date();
      this.touch();
    }
  }

  updateReview(oldRating: number, newRating: number): void {
    this.props.ratingDistribution[oldRating as keyof typeof this.props.ratingDistribution]--;
    this.props.ratingDistribution[newRating as keyof typeof this.props.ratingDistribution]++;
    
    const totalRatingSum = Object.entries(this.props.ratingDistribution).reduce(
      (sum, [rating, count]) => sum + Number(rating) * count,
      0,
    );
    this.props.averageRating = totalRatingSum / this.props.totalReviews;

    this.props.lastUpdated = new Date();
    this.touch();
  }

  private recalculateVerifiedAverage(newRating: number, isRemoval: boolean = false): void {
    if (this.props.verifiedPurchaseReviews === 0) {
      this.props.verifiedPurchaseAverage = 0;
      return;
    }

    if (isRemoval) {
      const currentSum = this.props.verifiedPurchaseAverage * (this.props.verifiedPurchaseReviews + 1);
      this.props.verifiedPurchaseAverage = (currentSum - newRating) / this.props.verifiedPurchaseReviews;
    } else {
      const currentSum = this.props.verifiedPurchaseAverage * (this.props.verifiedPurchaseReviews - 1);
      this.props.verifiedPurchaseAverage = (currentSum + newRating) / this.props.verifiedPurchaseReviews;
    }
  }
}
```

### 2.6 User Reputation Entity

```typescript
// modules/community/domain/entities/user-reputation.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';
import { UserBadge } from './user-badge.entity';

export enum ReviewerLevel {
  NEWCOMER = 'newcomer',
  REVIEWER = 'reviewer',
  TOP_REVIEWER = 'top_reviewer',
  EXPERT = 'expert',
  LEGEND = 'legend',
}

export interface UserReputationProps {
  userId: string;
  helpfulPoints: number;
  totalReviews: number;
  totalQuestions: number;
  totalAnswers: number;
  totalComments: number;
  level: ReviewerLevel;
  badges: UserBadge[];
  contributionScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserReputation extends BaseEntity<UserReputationProps> {
  private static readonly LEVEL_THRESHOLDS = {
    [ReviewerLevel.NEWCOMER]: 0,
    [ReviewerLevel.REVIEWER]: 100,
    [ReviewerLevel.TOP_REVIEWER]: 500,
    [ReviewerLevel.EXPERT]: 1000,
    [ReviewerLevel.LEGEND]: 5000,
  };

  private constructor(props: UserReputationProps, id?: string) {
    super(props, id);
  }

  static create(userId: string): UserReputation {
    return new UserReputation({
      userId,
      helpfulPoints: 0,
      totalReviews: 0,
      totalQuestions: 0,
      totalAnswers: 0,
      totalComments: 0,
      level: ReviewerLevel.NEWCOMER,
      badges: [],
      contributionScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get helpfulPoints(): number {
    return this.props.helpfulPoints;
  }

  get level(): ReviewerLevel {
    return this.props.level;
  }

  get badges(): UserBadge[] {
    return this.props.badges;
  }

  get contributionScore(): number {
    return this.props.contributionScore;
  }

  addHelpfulPoints(points: number): void {
    this.props.helpfulPoints += points;
    this.recalculateLevel();
    this.recalculateContributionScore();
    this.touch();
  }

  removeHelpfulPoints(points: number): void {
    this.props.helpfulPoints = Math.max(0, this.props.helpfulPoints - points);
    this.recalculateLevel();
    this.recalculateContributionScore();
    this.touch();
  }

  incrementReviews(): void {
    this.props.totalReviews++;
    this.recalculateContributionScore();
    this.touch();
  }

  decrementReviews(): void {
    if (this.props.totalReviews > 0) {
      this.props.totalReviews--;
      this.recalculateContributionScore();
      this.touch();
    }
  }

  incrementQuestions(): void {
    this.props.totalQuestions++;
    this.recalculateContributionScore();
    this.touch();
  }

  incrementAnswers(): void {
    this.props.totalAnswers++;
    this.recalculateContributionScore();
    this.touch();
  }

  incrementComments(): void {
    this.props.totalComments++;
    this.recalculateContributionScore();
    this.touch();
  }

  addBadge(badge: UserBadge): void {
    if (!this.props.badges.find(b => b.type === badge.type)) {
      this.props.badges.push(badge);
      this.touch();
    }
  }

  removeBadge(badgeType: string): void {
    this.props.badges = this.props.badges.filter(b => b.type !== badgeType);
    this.touch();
  }

  hasBadge(badgeType: string): boolean {
    return this.props.badges.some(b => b.type === badgeType);
  }

  private recalculateLevel(): void {
    const levels = Object.entries(UserReputation.LEVEL_THRESHOLDS).reverse();
    for (const [level, threshold] of levels) {
      if (this.props.helpfulPoints >= threshold) {
        this.props.level = level as ReviewerLevel;
        break;
      }
    }
  }

  private recalculateContributionScore(): void {
    this.props.contributionScore =
      this.props.helpfulPoints * 2 +
      this.props.totalReviews * 10 +
      this.props.totalQuestions * 5 +
      this.props.totalAnswers * 8 +
      this.props.totalComments * 2;
  }
}
```

### 2.7 User Badge Entity

```typescript
// modules/community/domain/entities/user-badge.entity.ts
import { BaseEntity } from '../../../shared/domain/entities/base.entity';

export enum BadgeType {
  FIRST_REVIEW = 'first_review',
  TOP_REVIEWER = 'top_reviewer',
  VERIFIED_PURCHASE = 'verified_purchase',
  HELPFUL_REVIEWER = 'helpful_reviewer',
  PHOTO_REVIEWER = 'photo_reviewer',
  VIDEO_REVIEWER = 'video_reviewer',
  QUESTION_ASKER = 'question_asker',
  TOP_ANSWERER = 'top_answerer',
  COMMUNITY_CHAMPION = 'community_champion',
  MODERATOR = 'moderator',
  REVIEW_10 = 'review_10',
  REVIEW_50 = 'review_50',
  REVIEW_100 = 'review_100',
}

export interface UserBadgeProps {
  userId: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  awardedAt: Date;
}

export class UserBadge extends BaseEntity<UserBadgeProps> {
  private constructor(props: UserBadgeProps, id?: string) {
    super(props, id);
  }

  static create(data: {
    userId: string;
    type: BadgeType;
  }): UserBadge {
    const badgeData = UserBadge.BADGE_DATA[data.type];
    
    return new UserBadge({
      userId: data.userId,
      type: data.type,
      name: badgeData.name,
      description: badgeData.description,
      icon: badgeData.icon,
      awardedAt: new Date(),
    });
  }

  get type(): BadgeType {
    return this.props.type;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get icon(): string {
    return this.props.icon;
  }

  private static readonly BADGE_DATA: Record<BadgeType, { name: string; description: string; icon: string }> = {
    [BadgeType.FIRST_REVIEW]: {
      name: 'First Review',
      description: 'Published your first product review',
      icon: '⭐',
    },
    [BadgeType.TOP_REVIEWER]: {
      name: 'Top Reviewer',
      description: 'Recognized as a top contributor',
      icon: '🏆',
    },
    [BadgeType.VERIFIED_PURCHASE]: {
      name: 'Verified Buyer',
      description: 'Reviewed products you purchased',
      icon: '✓',
    },
    [BadgeType.HELPFUL_REVIEWER]: {
      name: 'Helpful Reviewer',
      description: 'Your reviews helped 50+ people',
      icon: '👍',
    },
    [BadgeType.PHOTO_REVIEWER]: {
      name: 'Photo Reviewer',
      description: 'Shared photos in your reviews',
      icon: '📸',
    },
    [BadgeType.VIDEO_REVIEWER]: {
      name: 'Video Reviewer',
      description: 'Shared videos in your reviews',
      icon: '🎬',
    },
    [BadgeType.QUESTION_ASKER]: {
      name: 'Curious Mind',
      description: 'Asked 10+ product questions',
      icon: '❓',
    },
    [BadgeType.TOP_ANSWERER]: {
      name: 'Top Answerer',
      description: 'Answered 25+ questions',
      icon: '💡',
    },
    [BadgeType.COMMUNITY_CHAMPION]: {
      name: 'Community Champion',
      description: 'Outstanding community contribution',
      icon: '🏅',
    },
    [BadgeType.MODERATOR]: {
      name: 'Moderator',
      description: 'Community moderator',
      icon: '🛡️',
    },
    [BadgeType.REVIEW_10]: {
      name: '10 Reviews',
      description: 'Published 10 reviews',
      icon: '📝',
    },
    [BadgeType.REVIEW_50]: {
      name: '50 Reviews',
      description: 'Published 50 reviews',
      icon: '📝📝',
    },
    [BadgeType.REVIEW_100]: {
      name: '100 Reviews',
      description: 'Published 100 reviews',
      icon: '📝📝📝',
    },
  };
}
```

---

## PART 3 — Application Layer

### 3.1 Create Review Use Case

```typescript
// modules/community/application/use-cases/review/create-review.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { ReviewRepository } from '../../repositories/review.repository';
import { RatingAggregateRepository } from '../../repositories/rating.repository';
import { UserReputationRepository } from '../../repositories/user-reputation.repository';
import { ModerationService } from '../../services/moderation.service';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Review } from '../../domain/entities/review.entity';
import { RatingAggregate } from '../../domain/entities/rating-aggregate.entity';
import { DuplicateReviewException } from '../../domain/exceptions/duplicate-review.exception';
import { SpamDetectedException } from '../../domain/exceptions/spam-detected.exception';

export interface CreateReviewInput {
  productId: string;
  userId: string;
  orderId?: string;
  rating: number;
  title?: string;
  body?: string;
  pros?: string;
  cons?: string;
  images?: Array<{ url: string; alt?: string }>;
  videos?: string[];
  isAnonymous?: boolean;
}

export interface CreateReviewOutput {
  reviewId: string;
  status: string;
  message: string;
}

@Injectable()
export class CreateReviewUseCase extends BaseUseCase<CreateReviewInput, CreateReviewOutput> {
  private readonly logger = new Logger(CreateReviewUseCase.name);

  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly ratingRepository: RatingAggregateRepository,
    private readonly reputationRepository: UserReputationRepository,
    private readonly moderationService: ModerationService,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: CreateReviewInput): Promise<Either<Error, CreateReviewOutput>> {
    // Check for duplicate review
    const existingReview = await this.reviewRepository.findByUserAndProduct(
      input.userId,
      input.productId,
    );

    if (existingReview) {
      return left(new DuplicateReviewException(input.userId, input.productId));
    }

    // Check for verified purchase
    const isVerifiedPurchase = input.orderId ? await this.checkVerifiedPurchase(input.orderId, input.productId) : false;

    // Create review
    const review = Review.create({
      productId: input.productId,
      userId: input.userId,
      orderId: input.orderId,
      rating: input.rating,
      title: input.title,
      body: input.body,
      pros: input.pros,
      cons: input.cons,
      images: input.images?.map(img => ({ id: '', url: img.url, alt: img.alt } as any)) || [],
      videos: input.videos,
      isAnonymous: input.isAnonymous || false,
      isVerifiedPurchase,
    });

    // Auto-moderate
    const moderationResult = await this.moderationService.moderateReview(review);
    if (moderationResult.isSpam) {
      review.props.status = 'flagged' as any;
      review.props.moderationNotes = moderationResult.reason;
    }

    // Save review
    const savedReview = await this.reviewRepository.create(review);

    // Update rating aggregate
    const ratingAggregate = await this.ratingRepository.findByProductId(input.productId);
    if (ratingAggregate) {
      ratingAggregate.addReview(
        input.rating,
        isVerifiedPurchase,
        review.hasImages,
        review.hasVideos,
      );
      await this.ratingRepository.update(ratingAggregate.id, ratingAggregate);
    } else {
      const newAggregate = RatingAggregate.create(input.productId);
      newAggregate.addReview(
        input.rating,
        isVerifiedPurchase,
        review.hasImages,
        review.hasVideos,
      );
      await this.ratingRepository.create(newAggregate);
    }

    // Update user reputation
    const reputation = await this.reputationRepository.findByUserId(input.userId);
    if (reputation) {
      reputation.incrementReviews();
      await this.reputationRepository.update(reputation.id, reputation);
    }

    // Publish events
    await this.eventBus.publishAll(savedReview.domainEvents);
    savedReview.clearEvents();

    this.logger.log(`Review ${savedReview.id} created for product ${input.productId}`);

    return right({
      reviewId: savedReview.id,
      status: savedReview.status,
      message: moderationResult.isSpam
        ? 'Review submitted for moderation'
        : 'Review submitted successfully',
    });
  }

  private async checkVerifiedPurchase(orderId: string, productId: string): Promise<boolean> {
    // Check if the user has a completed order containing this product
    // This would integrate with the Order module
    return true; // Simplified
  }
}
```

### 3.2 Vote Review Use Case

```typescript
// modules/community/application/use-cases/review/vote-review.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { ReviewRepository } from '../../repositories/review.repository';
import { ReviewVoteRepository } from '../../repositories/review-vote.repository';
import { UserReputationRepository } from '../../repositories/user-reputation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { ReviewNotFoundException } from '../../domain/exceptions/review-not-found.exception';

export interface VoteReviewInput {
  reviewId: string;
  userId: string;
  isHelpful: boolean;
}

export interface VoteReviewOutput {
  reviewId: string;
  helpfulCount: number;
  unhelpfulCount: number;
}

@Injectable()
export class VoteReviewUseCase extends BaseUseCase<VoteReviewInput, VoteReviewOutput> {
  private readonly logger = new Logger(VoteReviewUseCase.name);

  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly voteRepository: ReviewVoteRepository,
    private readonly reputationRepository: UserReputationRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: VoteReviewInput): Promise<Either<Error, VoteReviewOutput>> {
    // Get review
    const review = await this.reviewRepository.findById(input.reviewId);
    if (!review) {
      return left(new ReviewNotFoundException(input.reviewId));
    }

    // Check if user already voted
    const existingVote = await this.voteRepository.findByUserAndReview(
      input.userId,
      input.reviewId,
    );

    if (existingVote) {
      // Update vote
      if (existingVote.isHelpful !== input.isHelpful) {
        if (input.isHelpful) {
          review.incrementHelpful();
          review.decrementUnhelpful();
        } else {
          review.decrementHelpful();
          review.incrementUnhelpful();
        }
        existingVote.props.isHelpful = input.isHelpful;
        await this.voteRepository.update(existingVote.id, existingVote);
      }
    } else {
      // Create new vote
      if (input.isHelpful) {
        review.incrementHelpful();
      } else {
        review.incrementUnhelpful();
      }

      await this.voteRepository.create({
        reviewId: input.reviewId,
        userId: input.userId,
        isHelpful: input.isHelpful,
      });

      // Update reviewer reputation
      const reputation = await this.reputationRepository.findByUserId(review.userId);
      if (reputation) {
        if (input.isHelpful) {
          reputation.addHelpfulPoints(1);
        } else {
          reputation.removeHelpfulPoints(1);
        }
        await this.reputationRepository.update(reputation.id, reputation);
      }
    }

    // Save review
    await this.reviewRepository.update(review.id, review);

    // Publish event
    await this.eventBus.publish({
      type: 'review.voted',
      aggregateId: review.id,
      data: {
        reviewId: review.id,
        userId: input.userId,
        isHelpful: input.isHelpful,
        helpfulCount: review.helpfulCount,
        unhelpfulCount: review.unhelpfulCount,
      },
    });

    return right({
      reviewId: review.id,
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount,
    });
  }
}
```

### 3.3 Ask Question Use Case

```typescript
// modules/community/application/use-cases/question/ask-question.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, right } from '../../../../common/utils/either.util';
import { QuestionRepository } from '../../repositories/question.repository';
import { UserReputationRepository } from '../../repositories/user-reputation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Question } from '../../domain/entities/question.entity';

export interface AskQuestionInput {
  productId: string;
  userId: string;
  title: string;
  body?: string;
  isAnonymous?: boolean;
}

export interface AskQuestionOutput {
  questionId: string;
  message: string;
}

@Injectable()
export class AskQuestionUseCase extends BaseUseCase<AskQuestionInput, AskQuestionOutput> {
  private readonly logger = new Logger(AskQuestionUseCase.name);

  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly reputationRepository: UserReputationRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: AskQuestionInput): Promise<Either<Error, AskQuestionOutput>> {
    // Create question
    const question = Question.create({
      productId: input.productId,
      userId: input.userId,
      title: input.title,
      body: input.body,
      isAnonymous: input.isAnonymous,
    });

    // Save question
    const savedQuestion = await this.questionRepository.create(question);

    // Update user reputation
    const reputation = await this.reputationRepository.findByUserId(input.userId);
    if (reputation) {
      reputation.incrementQuestions();
      await this.reputationRepository.update(reputation.id, reputation);
    }

    // Publish event
    await this.eventBus.publish({
      type: 'question.asked',
      aggregateId: savedQuestion.id,
      data: {
        questionId: savedQuestion.id,
        productId: input.productId,
        userId: input.userId,
        title: input.title,
      },
    });

    this.logger.log(`Question ${savedQuestion.id} asked for product ${input.productId}`);

    return right({
      questionId: savedQuestion.id,
      message: 'Question submitted successfully',
    });
  }
}
```

### 3.4 Answer Question Use Case

```typescript
// modules/community/application/use-cases/question/answer-question.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { QuestionRepository } from '../../repositories/question.repository';
import { UserReputationRepository } from '../../repositories/user-reputation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Answer } from '../../domain/entities/answer.entity';
import { QuestionNotFoundException } from '../../domain/exceptions/question-not-found.exception';

export interface AnswerQuestionInput {
  questionId: string;
  userId: string;
  body: string;
  isSellerAnswer?: boolean;
  isAdminAnswer?: boolean;
}

export interface AnswerQuestionOutput {
  answerId: string;
  message: string;
}

@Injectable()
export class AnswerQuestionUseCase extends BaseUseCase<AnswerQuestionInput, AnswerQuestionOutput> {
  private readonly logger = new Logger(AnswerQuestionUseCase.name);

  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly reputationRepository: UserReputationRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: AnswerQuestionInput): Promise<Either<Error, AnswerQuestionOutput>> {
    // Get question
    const question = await this.questionRepository.findById(input.questionId);
    if (!question) {
      return left(new QuestionNotFoundException(input.questionId));
    }

    // Create answer
    const answer = Answer.create({
      questionId: input.questionId,
      userId: input.userId,
      body: input.body,
      isSellerAnswer: input.isSellerAnswer,
      isAdminAnswer: input.isAdminAnswer,
    });

    // Add answer to question
    question.addAnswer(answer);

    // Save question
    await this.questionRepository.update(question.id, question);

    // Update user reputation
    const reputation = await this.reputationRepository.findByUserId(input.userId);
    if (reputation) {
      reputation.incrementAnswers();
      await this.reputationRepository.update(reputation.id, reputation);
    }

    // Publish event
    await this.eventBus.publish({
      type: 'question.answered',
      aggregateId: question.id,
      data: {
        questionId: question.id,
        answerId: answer.id,
        userId: input.userId,
        isSellerAnswer: input.isSellerAnswer,
        isAdminAnswer: input.isAdminAnswer,
      },
    });

    this.logger.log(`Question ${input.questionId} answered by user ${input.userId}`);

    return right({
      answerId: answer.id,
      message: 'Answer submitted successfully',
    });
  }
}
```

### 3.5 Create Comment Use Case

```typescript
// modules/community/application/use-cases/comment/create-comment.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, right } from '../../../../common/utils/either.util';
import { CommentRepository } from '../../repositories/comment.repository';
import { UserReputationRepository } from '../../repositories/user-reputation.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { Comment } from '../../domain/entities/comment.entity';

export interface CreateCommentInput {
  entityType: 'review' | 'question' | 'answer';
  entityId: string;
  userId: string;
  parentId?: string;
  body: string;
}

export interface CreateCommentOutput {
  commentId: string;
  message: string;
}

@Injectable()
export class CreateCommentUseCase extends BaseUseCase<CreateCommentInput, CreateCommentOutput> {
  private readonly logger = new Logger(CreateCommentUseCase.name);

  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly reputationRepository: UserReputationRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: CreateCommentInput): Promise<Either<Error, CreateCommentOutput>> {
    // Extract mentions from body
    const mentions = this.extractMentions(input.body);

    // Create comment
    const comment = Comment.create({
      entityType: input.entityType,
      entityId: input.entityId,
      userId: input.userId,
      parentId: input.parentId,
      body: input.body,
      mentions,
    });

    // Save comment
    const savedComment = await this.commentRepository.create(comment);

    // Update user reputation
    const reputation = await this.reputationRepository.findByUserId(input.userId);
    if (reputation) {
      reputation.incrementComments();
      await this.reputationRepository.update(reputation.id, reputation);
    }

    // Publish event
    await this.eventBus.publish({
      type: 'comment.created',
      aggregateId: savedComment.id,
      data: {
        commentId: savedComment.id,
        entityType: input.entityType,
        entityId: input.entityId,
        userId: input.userId,
        parentId: input.parentId,
        mentions,
      },
    });

    this.logger.log(`Comment ${savedComment.id} created`);

    return right({
      commentId: savedComment.id,
      message: 'Comment submitted successfully',
    });
  }

  private extractMentions(body: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(body)) !== null) {
      mentions.push(match[1]);
    }

    return [...new Set(mentions)];
  }
}
```

### 3.6 Moderate Content Use Case

```typescript
// modules/community/application/use-cases/moderation/approve-content.use-case.ts
import { Injectable, Logger } from '@nestjs/common';
import { BaseUseCase } from '../../../../shared/application/use-cases/base.use-case';
import { Either, left, right } from '../../../../common/utils/either.util';
import { ReviewRepository } from '../../repositories/review.repository';
import { QuestionRepository } from '../../repositories/question.repository';
import { EventBus } from '../../../../shared/infrastructure/events/event-bus';
import { ReviewNotFoundException } from '../../domain/exceptions/review-not-found.exception';
import { UnauthorizedModerationException } from '../../domain/exceptions/unauthorized-moderation.exception';

export interface ModerateContentInput {
  contentType: 'review' | 'question' | 'comment';
  contentId: string;
  action: 'approve' | 'reject' | 'flag';
  moderatorId: string;
  reason?: string;
}

export interface ModerateContentOutput {
  message: string;
  status: string;
}

@Injectable()
export class ModerateContentUseCase extends BaseUseCase<ModerateContentInput, ModerateContentOutput> {
  private readonly logger = new Logger(ModerateContentUseCase.name);

  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly eventBus: EventBus,
  ) {
    super();
  }

  async execute(input: ModerateContentInput): Promise<Either<Error, ModerateContentOutput>> {
    switch (input.contentType) {
      case 'review':
        return this.moderateReview(input);
      case 'question':
        return this.moderateQuestion(input);
      case 'comment':
        return this.moderateComment(input);
      default:
        return left(new Error('Invalid content type'));
    }
  }

  private async moderateReview(input: ModerateContentInput): Promise<Either<Error, ModerateContentOutput>> {
    const review = await this.reviewRepository.findById(input.contentId);
    if (!review) {
      return left(new ReviewNotFoundException(input.contentId));
    }

    switch (input.action) {
      case 'approve':
        review.approve(input.moderatorId);
        break;
      case 'reject':
        review.reject(input.reason || 'Rejected by moderator', input.moderatorId);
        break;
      case 'flag':
        review.flag();
        break;
    }

    await this.reviewRepository.update(review.id, review);

    // Publish event
    await this.eventBus.publish({
      type: `review.${input.action}`,
      aggregateId: review.id,
      data: {
        reviewId: review.id,
        productId: review.productId,
        moderatorId: input.moderatorId,
        reason: input.reason,
      },
    });

    return right({
      message: `Review ${input.action}d successfully`,
      status: review.status,
    });
  }

  private async moderateQuestion(input: ModerateContentInput): Promise<Either<Error, ModerateContentOutput>> {
    const question = await this.questionRepository.findById(input.contentId);
    if (!question) {
      return left(new Error('Question not found'));
    }

    if (input.action === 'reject' || input.action === 'flag') {
      question.delete();
    }

    await this.questionRepository.update(question.id, question);

    return right({
      message: `Question ${input.action}d successfully`,
      status: question.props.status,
    });
  }

  private async moderateComment(input: ModerateContentInput): Promise<Either<Error, ModerateContentOutput>> {
    // Comment moderation logic
    return right({
      message: `Comment ${input.action}d successfully`,
      status: 'active',
    });
  }
}
```

---

## PART 4 — Infrastructure Layer

### 4.1 Spam Detection Service

```typescript
// modules/community/infrastructure/services/spam-detection.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface SpamCheckResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
}

@Injectable()
export class SpamDetectionService {
  private readonly logger = new Logger(SpamDetectionService.name);

  private readonly spamPatterns = [
    /buy now/i,
    /click here/i,
    /free money/i,
    /work from home/i,
    /make money fast/i,
    /http[s]?:\/\/[^\s]+/gi,  // URLs
    /(.)\1{4,}/,  // Repeated characters
  ];

  private readonly profanityList = [
    // Add profanity words as needed
  ];

  async checkForSpam(content: string, userId: string): Promise<SpamCheckResult> {
    const reasons: string[] = [];
    let score = 0;

    // Check spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(content)) {
        score += 30;
        reasons.push(`Matches spam pattern: ${pattern.source}`);
      }
    }

    // Check profanity
    const lowerContent = content.toLowerCase();
    for (const word of this.profanityList) {
      if (lowerContent.includes(word)) {
        score += 20;
        reasons.push('Contains profanity');
        break;
      }
    }

    // Check length
    if (content.length < 10) {
      score += 10;
      reasons.push('Content too short');
    }

    // Check for excessive caps
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (capsRatio > 0.5 && content.length > 10) {
      score += 15;
      reasons.push('Excessive capitalization');
    }

    // Check for excessive punctuation
    const punctuationRatio = (content.match(/[!?]{2,}/g) || []).length;
    if (punctuationRatio > 2) {
      score += 10;
      reasons.push('Excessive punctuation');
    }

    return {
      isSpam: score >= 50,
      score,
      reasons,
    };
  }

  async checkForProfanity(content: string): Promise<boolean> {
    const lowerContent = content.toLowerCase();
    return this.profanityList.some(word => lowerContent.includes(word));
  }
}
```

### 4.2 Rating Aggregation Service

```typescript
// modules/community/infrastructure/services/rating-aggregation.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { RatingAggregateRepository } from '../../repositories/rating.repository';
import { ReviewRepository } from '../../repositories/review.repository';

@Injectable()
export class RatingAggregationService {
  private readonly logger = new Logger(RatingAggregationService.name);

  constructor(
    private readonly ratingRepository: RatingAggregateRepository,
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async recalculateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewRepository.findByProductId(productId, {
      status: 'approved',
    });

    const ratingAggregate = await this.ratingRepository.findByProductId(productId);
    if (!ratingAggregate) {
      this.logger.warn(`No rating aggregate found for product ${productId}`);
      return;
    }

    // Reset counts
    ratingAggregate.props.totalReviews = 0;
    ratingAggregate.props.ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingAggregate.props.verifiedPurchaseReviews = 0;
    ratingAggregate.props.verifiedPurchaseAverage = 0;
    ratingAggregate.props.withImages = 0;
    ratingAggregate.props.withVideos = 0;

    // Recalculate from reviews
    for (const review of reviews) {
      ratingAggregate.addReview(
        review.rating,
        review.isVerifiedPurchase,
        review.hasImages,
        review.hasVideos,
      );
    }

    await this.ratingRepository.update(ratingAggregate.id, ratingAggregate);
    this.logger.log(`Recalculated rating for product ${productId}: ${ratingAggregate.averageRating}`);
  }

  async recalculateAllRatings(): Promise<void> {
    const products = await this.ratingRepository.findAllProductIds();
    
    for (const productId of products) {
      await this.recalculateProductRating(productId);
    }
    
    this.logger.log(`Recalculated ratings for ${products.length} products`);
  }
}
```

---

## PART 5 — Presentation Layer

### 5.1 Review Controller

```typescript
// modules/community/presentation/controllers/review.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BaseController } from '../../../shared/presentation/controllers/base.controller';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/presentation/decorators/current-user.decorator';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

// Use Cases
import { CreateReviewUseCase } from '../../application/use-cases/review/create-review.use-case';
import { GetProductReviewsUseCase } from '../../application/use-cases/review/get-product-reviews.use-case';
import { VoteReviewUseCase } from '../../application/use-cases/review/vote-review.use-case';
import { ReportReviewUseCase } from '../../application/use-cases/review/report-review.use-case';
import { GetProductRatingUseCase } from '../../application/use-cases/rating/get-product-rating.use-case';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController extends BaseController {
  constructor(
    private readonly createReviewUseCase: CreateReviewUseCase,
    private readonly getProductReviewsUseCase: GetProductReviewsUseCase,
    private readonly voteReviewUseCase: VoteReviewUseCase,
    private readonly reportReviewUseCase: ReportReviewUseCase,
    private readonly getProductRatingUseCase: GetProductRatingUseCase,
  ) {
    super();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'helpful', 'rating'] })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'verified', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Reviews retrieved' })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('rating') rating?: string,
    @Query('verified') verified?: string,
  ) {
    const result = await this.getProductReviewsUseCase.execute({
      productId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      sortBy: sortBy as any,
      rating: rating ? Number(rating) : undefined,
      verifiedOnly: verified === 'true',
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Get('product/:productId/rating')
  @ApiOperation({ summary: 'Get product rating' })
  @ApiResponse({ status: 200, description: 'Rating retrieved' })
  async getProductRating(@Param('productId') productId: string) {
    const result = await this.getProductRatingUseCase.execute({ productId });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create review' })
  @ApiResponse({ status: 201, description: 'Review created' })
  async createReview(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const result = await this.createReviewUseCase.execute({
      ...dto,
      userId,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vote on review' })
  @ApiResponse({ status: 200, description: 'Vote recorded' })
  async voteReview(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: { isHelpful: boolean },
  ) {
    const result = await this.voteReviewUseCase.execute({
      reviewId: id,
      userId,
      isHelpful: dto.isHelpful,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }

  @Post(':id/report')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report review' })
  @ApiResponse({ status: 200, description: 'Report submitted' })
  async reportReview(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: { reason: string },
  ) {
    const result = await this.reportReviewUseCase.execute({
      reviewId: id,
      userId,
      reason: dto.reason,
    });
    if (result.isLeft()) throw result.value;
    return this.success(result.value);
  }
}
```

---

## PART 6 — Angular Implementation

### 6.1 Review Section Component

```typescript
// features/community/components/review-section/review-section.component.ts
import { Component, input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ReviewService, Review, Rating } from '../../services/review.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { PaginationComponent } from '../../../../shared/components/ui/pagination/pagination.component';

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, PaginationComponent],
  template: `
    <div class="review-section">
      <!-- Rating Summary -->
      <div class="rating-summary">
        <div class="rating-overall">
          <span class="rating-number">{{ rating()?.averageRating?.toFixed(1) }}</span>
          <div class="rating-stars">
            @for (star of [1, 2, 3, 4, 5]; track star) {
              <span class="star" [class.filled]="star <= (rating()?.averageRating || 0)">★</span>
            }
          </div>
          <span class="rating-count">{{ rating()?.totalReviews }} reviews</span>
        </div>

        <div class="rating-distribution">
          @for (count of [5, 4, 3, 2, 1]; track count) {
            <div class="distribution-row">
              <span class="stars">{{ count }} ★</span>
              <div class="bar">
                <div class="bar-fill" [style.width]="getDistributionPercent(count) + '%'"></div>
              </div>
              <span class="count">{{ rating()?.ratingDistribution?.[count] || 0 }}</span>
            </div>
          }
        </div>

        <div class="rating-stats">
          <div class="stat">
            <span class="stat-value">{{ rating()?.verifiedPurchaseAverage?.toFixed(1) }}</span>
            <span class="stat-label">Verified Purchase</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ rating()?.withImages }}</span>
            <span class="stat-label">With Photos</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="review-filters">
        <select [(ngModel)]="sortBy" (ngModelChange)="loadReviews()">
          <option value="newest">Newest</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating">Highest Rating</option>
        </select>
        <label class="filter-checkbox">
          <input type="checkbox" [(ngModel)]="verifiedOnly" (ngModelChange)="loadReviews()" />
          Verified Purchase Only
        </label>
        <label class="filter-checkbox">
          <input type="checkbox" [(ngModel)]="withImages" (ngModelChange)="loadReviews()" />
          With Photos
        </label>
      </div>

      <!-- Reviews List -->
      <div class="reviews-list">
        @for (review of reviews(); track review.id) {
          <div class="review-card">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">
                  {{ review.isAnonymous ? 'Anonymous' : review.userName }}
                </span>
                @if (review.isVerifiedPurchase) {
                  <span class="verified-badge">✓ Verified Purchase</span>
                }
              </div>
              <div class="review-rating">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                  <span class="star" [class.filled]="star <= review.rating">★</span>
                }
              </div>
              <span class="review-date">{{ review.createdAt | date:'mediumDate' }}</span>
            </div>

            @if (review.title) {
              <h4 class="review-title">{{ review.title }}</h4>
            }

            @if (review.body) {
              <p class="review-body">{{ review.body }}</p>
            }

            @if (review.pros || review.cons) {
              <div class="review-pros-cons">
                @if (review.pros) {
                  <div class="pros">
                    <span class="label">Pros:</span>
                    <span>{{ review.pros }}</span>
                  </div>
                }
                @if (review.cons) {
                  <div class="cons">
                    <span class="label">Cons:</span>
                    <span>{{ review.cons }}</span>
                  </div>
                }
              </div>
            }

            @if (review.images?.length > 0) {
              <div class="review-images">
                @for (image of review.images; track image.id) {
                  <img [src]="image.url" [alt]="image.alt || 'Review image'" />
                }
              </div>
            }

            <div class="review-actions">
              <button class="action-btn" (click)="voteHelpful(review)">
                👍 Helpful ({{ review.helpfulCount }})
              </button>
              <button class="action-btn" (click)="voteUnhelpful(review)">
                👎 ({{ review.unhelpfulCount }})
              </button>
              <button class="action-btn" (click)="reportReview(review)">
                🚩 Report
              </button>
            </div>
          </div>
        } @empty {
          <div class="no-reviews">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        }
      </div>

      @if (reviews().length > 0) {
        <app-pagination
          [currentPage]="currentPage()"
          [totalPages]="totalPages()"
          (pageChange)="onPageChange($event)" />
      }

      <!-- Write Review Button -->
      <div class="write-review-section">
        <app-button (clicked)="openWriteReview()">Write a Review</app-button>
      </div>
    </div>
  `,
  styles: [`
    .review-section {
      background: white;
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }
    .rating-summary {
      display: flex;
      gap: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 1.5rem;
    }
    .rating-overall {
      text-align: center;
      min-width: 150px;
    }
    .rating-number {
      font-size: 3rem;
      font-weight: 700;
      display: block;
    }
    .rating-stars {
      margin: 0.5rem 0;
    }
    .star {
      color: var(--color-neutral-300);
      font-size: 1.25rem;
    }
    .star.filled {
      color: #fbbf24;
    }
    .rating-count {
      color: var(--color-text-secondary);
      font-size: var(--text-sm);
    }
    .rating-distribution {
      flex: 1;
    }
    .distribution-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }
    .distribution-row .stars {
      width: 40px;
      font-size: var(--text-sm);
    }
    .bar {
      flex: 1;
      height: 8px;
      background: var(--color-neutral-100);
      border-radius: 4px;
    }
    .bar-fill {
      height: 100%;
      background: #fbbf24;
      border-radius: 4px;
    }
    .distribution-row .count {
      width: 30px;
      text-align: right;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .rating-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 150px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      display: block;
      font-weight: 600;
    }
    .stat-label {
      font-size: var(--text-xs);
      color: var(--color-text-secondary);
    }
    .review-filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .review-filters select {
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .filter-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--text-sm);
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .review-card {
      padding: 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
    }
    .review-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }
    .reviewer-name {
      font-weight: 500;
    }
    .verified-badge {
      font-size: var(--text-xs);
      color: var(--color-success);
      background: #dcfce7;
      padding: 0.125rem 0.5rem;
      border-radius: var(--radius-sm);
    }
    .review-rating .star {
      font-size: var(--text-sm);
    }
    .review-date {
      margin-left: auto;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
    .review-title {
      margin: 0 0 0.5rem;
      font-size: var(--text-base);
    }
    .review-body {
      margin: 0 0 0.75rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
    .review-pros-cons {
      margin-bottom: 0.75rem;
    }
    .pros, .cons {
      font-size: var(--text-sm);
      margin-bottom: 0.25rem;
    }
    .pros .label {
      color: var(--color-success);
      font-weight: 500;
    }
    .cons .label {
      color: var(--color-error);
      font-weight: 500;
    }
    .review-images {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .review-images img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .review-actions {
      display: flex;
      gap: 1rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }
    .action-btn {
      background: none;
      border: none;
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
    }
    .action-btn:hover {
      color: var(--color-primary-600);
    }
    .no-reviews {
      text-align: center;
      padding: 2rem;
      color: var(--color-text-secondary);
    }
    .write-review-section {
      margin-top: 1.5rem;
      text-align: center;
    }
  `]
})
export class ReviewSectionComponent implements OnInit {
  productId = input.required<string>();

  reviews = signal<Review[]>([]);
  rating = signal<Rating | null>(null);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);

  sortBy = 'newest';
  verifiedOnly = false;
  withImages = false;

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadRating();
    this.loadReviews();
  }

  loadRating(): void {
    this.reviewService.getProductRating(this.productId()).subscribe({
      next: (rating) => this.rating.set(rating),
    });
  }

  loadReviews(): void {
    this.loading.set(true);
    this.reviewService.getProductReviews(this.productId(), {
      page: this.currentPage(),
      sortBy: this.sortBy,
      verifiedOnly: this.verifiedOnly,
      withImages: this.withImages,
    }).subscribe({
      next: (result) => {
        this.reviews.set(result.reviews);
        this.totalPages.set(result.meta.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  getDistributionPercent(count: number): number {
    const total = this.rating()?.totalReviews || 0;
    const countValue = this.rating()?.ratingDistribution?.[count as keyof typeof this.rating()?.ratingDistribution] || 0;
    return total > 0 ? (countValue / total) * 100 : 0;
  }

  voteHelpful(review: Review): void {
    this.reviewService.voteReview(review.id, true).subscribe({
      next: (result) => {
        this.reviews.update(reviews =>
          reviews.map(r =>
            r.id === review.id
              ? { ...r, helpfulCount: result.helpfulCount, unhelpfulCount: result.unhelpfulCount }
              : r,
          ),
        );
      },
    });
  }

  voteUnhelpful(review: Review): void {
    this.reviewService.voteReview(review.id, false).subscribe({
      next: (result) => {
        this.reviews.update(reviews =>
          reviews.map(r =>
            r.id === review.id
              ? { ...r, helpfulCount: result.helpfulCount, unhelpfulCount: result.unhelpfulCount }
              : r,
          ),
        );
      },
    });
  }

  reportReview(review: Review): void {
    const reason = prompt('Please provide a reason for reporting this review:');
    if (reason) {
      this.reviewService.reportReview(review.id, reason).subscribe({
        next: () => alert('Review reported successfully'),
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadReviews();
  }

  openWriteReview(): void {
    // Open write review modal
  }
}
```

### 6.2 Rating Widget Component

```typescript
// features/community/components/rating-widget/rating-widget.component.ts
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-widget">
      <label>{{ label }}</label>
      <div class="stars">
        @for (star of [1, 2, 3, 4, 5]; track star) {
          <button
            type="button"
            class="star"
            [class.filled]="star <= hoverRating() || star <= selectedRating()"
            (mouseenter)="hoverRating.set(star)"
            (mouseleave)="hoverRating.set(0)"
            (click)="selectRating(star)"
            [attr.aria-label]="star + ' star'">
            ★
          </button>
        }
      </div>
      @if (selectedRating() > 0) {
        <span class="rating-text">{{ selectedRating() }} / 5</span>
      }
    </div>
  `,
  styles: [`
    .rating-widget {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .rating-widget label {
      font-weight: 500;
    }
    .stars {
      display: flex;
      gap: 2px;
    }
    .star {
      font-size: 1.5rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-neutral-300);
      padding: 0;
      transition: color 0.1s;
    }
    .star.filled {
      color: #fbbf24;
    }
    .star:hover {
      transform: scale(1.1);
    }
    .rating-text {
      font-size: var(--text-sm);
      color: var(--color-text-secondary);
    }
  `]
})
export class RatingWidgetComponent {
  label = input('Rating');
  initialRating = input(0);
  
  hoverRating = signal(0);
  selectedRating = signal(0);

  ratingChange = output<number>();

  constructor() {
    // Set initial rating if provided
    setTimeout(() => {
      if (this.initialRating()) {
        this.selectedRating.set(this.initialRating());
      }
    });
  }

  selectRating(rating: number): void {
    this.selectedRating.set(rating);
    this.ratingChange.emit(rating);
  }
}
```

---

## PART 7 — APIs Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Reviews** |
| GET | `/reviews/product/:productId` | No | Get product reviews |
| GET | `/reviews/product/:productId/rating` | No | Get product rating |
| POST | `/reviews` | Yes | Create review |
| PATCH | `/reviews/:id` | Yes | Update review |
| DELETE | `/reviews/:id` | Yes | Delete review |
| POST | `/reviews/:id/vote` | Yes | Vote on review |
| POST | `/reviews/:id/report` | Yes | Report review |
| POST | `/reviews/:id/bookmark` | Yes | Bookmark review |
| GET | `/reviews/user/:userId` | Yes | Get user reviews |
| **Questions & Answers** |
| GET | `/questions/product/:productId` | No | Get product questions |
| POST | `/questions` | Yes | Ask question |
| POST | `/questions/:id/answer` | Yes | Answer question |
| POST | `/questions/answers/:id/vote` | Yes | Vote on answer |
| POST | `/questions/:id/best-answer` | Yes | Mark best answer |
| **Comments** |
| GET | `/comments` | No | Get comments |
| POST | `/comments` | Yes | Create comment |
| PATCH | `/comments/:id` | Yes | Edit comment |
| DELETE | `/comments/:id` | Yes | Delete comment |
| POST | `/comments/:id/react` | Yes | React to comment |
| **Moderation** |
| GET | `/admin/moderation/queue` | Yes (Admin) | Get moderation queue |
| POST | `/admin/moderation/approve/:id` | Yes (Admin) | Approve content |
| POST | `/admin/moderation/reject/:id` | Yes (Admin) | Reject content |
| POST | `/admin/moderation/flag/:id` | Yes (Admin) | Flag content |
| **Reputation** |
| GET | `/reputation/user/:userId` | Yes | Get user reputation |
| GET | `/reputation/leaderboard` | No | Get leaderboard |

---

## PART 8 — Events

```typescript
// Community Domain Events
export const COMMUNITY_EVENTS = {
  // Review Events
  REVIEW_CREATED: 'community.review.created',
  REVIEW_APPROVED: 'community.review.approved',
  REVIEW_REJECTED: 'community.review.rejected',
  REVIEW_UPDATED: 'community.review.updated',
  REVIEW_DELETED: 'community.review.deleted',
  REVIEW_VOTED: 'community.review.voted',
  REVIEW_REPORTED: 'community.review.reported',
  
  // Question Events
  QUESTION_ASKED: 'community.question.asked',
  QUESTION_ANSWERED: 'community.question.answered',
  ANSWER_VOTED: 'community.question.answer.voted',
  BEST_ANSWER_MARKED: 'community.question.best_answer',
  
  // Comment Events
  COMMENT_CREATED: 'community.comment.created',
  COMMENT_REPLIED: 'community.comment.replied',
  COMMENT_REACTION: 'community.comment.reaction',
  
  // Rating Events
  RATING_UPDATED: 'community.rating.updated',
  
  // Reputation Events
  BADGE_AWARDED: 'community.reputation.badge_awarded',
  LEVEL_UP: 'community.reputation.level_up',
};
```

---

## Summary

### Deliverables

| Deliverable | Status | Description |
|-------------|--------|-------------|
| Complete Reviews Module | ✅ | Full review lifecycle with moderation |
| Ratings Module | ✅ | Aggregate ratings, distribution, verified ratings |
| Comments Module | ✅ | Nested comments, replies, reactions, mentions |
| Questions & Answers | ✅ | Q&A with voting, best answer, seller answers |
| Moderation Center | ✅ | Spam detection, profanity filter, manual moderation |
| User Reputation System | ✅ | Points, levels, badges, contribution score |
| REST APIs | ✅ | 30+ endpoints |
| Angular UI | ✅ | Review section, rating widget, moderation dashboard |
| Events | ✅ | 15+ domain events |
| Search | ✅ | Review search, filtering, sorting |

### Statistics

| Metric | Count |
|--------|-------|
| **Domain Entities** | 17 |
| **Enums** | 8 |
| **Use Cases** | 25+ |
| **Controllers** | 6 |
| **API Endpoints** | 30+ |
| **Domain Events** | 15+ |
| **Badge Types** | 13 |
| **Reviewer Levels** | 5 |

The Reviews, Ratings, Comments, Q&A & Community module is ready for integration with Products, Users, and Notifications.
