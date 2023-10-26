export enum UserData {
  NAME = 1,
  EMAIL = 2,
  MOBILE = 3,
  GOOGLE_ID = 4,
  FACEBOOK_ID = 5,
  APPLE_ID = 6,
}

export enum Device {
  ANDROID = 1,
  IOS = 2,
  WEB = 3,
}

export enum UserTypes {
  INDIVIDUAL = 1, // individual
  BULK = 2, // Bulk
  CORPORATE = 3, // CORPORATE
  RETAILER = 4, // RETAILER
  VENUE = 5, // VENUE
}

export enum UserType {
  BROKER = 1,
  CARRIER = 2,
  SUBBROKER = 3,
  SUBCARRIER = 4,
}

export enum SenderType {
  SEEKER = 1,
  PROVIDER = 2,
  ADMIN = 3,
}

export enum AdminRole {
  SUPER_ADMIN = 40001,
  DISPUTE_ADMIN = 80001,
  WALLET_ADMIN = 60001,
  JOB_ADMIN = 70001,
}

export enum ProviderType {
  COMPANY = 1,
  INDIVIDUAL = 2,
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
}

export enum msgType {
  TEXT = 1,
  IMAGE = 2,
  AUDIO = 3,
  VIDEO = 4,
  LOCATION = 5,
  DOCUMENT = 6,
}

export enum UserStoryPrivacyEnum {
  MY_CONTACTS = 1,
  SHARE_ONLY_WITH = 2,
  MY_CONTACTS_EXCEPT = 3,
}

export enum ReadRecipientEnum {
  ON = 1,
  OFF = 2,
}

export enum MessageStatusEnum {
  PENDING = 0,
  SENT = 1,
  DELIVERED = 2,
  READ = 3,
  FAILED = 4,
}
