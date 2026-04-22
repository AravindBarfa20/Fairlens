import { AnimatedLanding } from "@/components/AnimatedLanding";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();
  return <AnimatedLanding userId={userId} />;
}
