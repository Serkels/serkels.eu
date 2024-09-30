//

export default class PrismaClient {
  get user(): Prisma.UserDelegate<ExtArgs>;
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs>;
}

export type VerificationToken =
  $Result.DefaultSelection<Prisma.$VerificationTokenPayload>;
