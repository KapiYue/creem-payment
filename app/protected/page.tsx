import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PricingCard } from "@/components/pricing-card";
import { OrderList } from "@/components/order-list";
import { SubscriptionStatus } from "@/components/subscription-status";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Subscription Status Section */}
        <div>
          <SubscriptionStatus />
        </div>

        {/* Pricing Section */}
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              productId={process.env.CREEM_SUBSCRIPTION_PRODUCT_ID!}
              productName="Subscription Test"
              price={20}
              type="recurring"
              period="month"
              description="Perfect for ongoing access with monthly billing"
              features={[
                "Monthly billing",
                "Cancel anytime",
                "Full feature access",
                "Priority support"
              ]}
            />
            
            <PricingCard
              productId={process.env.CREEM_LIFETIME_PRODUCT_ID!}
              productName="Lifetime Test"
              price={20}
              type="onetime"
              description="One-time payment for lifetime access"
              features={[
                "One-time payment",
                "Lifetime access",
                "Full feature access",
                "Priority support",
                "No recurring fees"
              ]}
            />
          </div>
        </div>

        {/* Orders Section */}
        <div>
          <OrderList />
        </div>
      </div>
    </div>
  );
}
