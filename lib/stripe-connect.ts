export interface PaymentSplit {
  vendorAmount: number // 90% of order total
  platformAmount: number // 10% of order total
  driverAmount: number // Flat fee
  totalAmount: number
}

export interface StripeConnectAccount {
  id: string
  userId: string
  accountId: string
  accountType: "vendor" | "driver"
  isActive: boolean
  payoutsEnabled: boolean
  chargesEnabled: boolean
}

// Calculate payment split based on order total and delivery fee
export function calculatePaymentSplit(orderTotal: number, deliveryFee = 3.0): PaymentSplit {
  const vendorAmount = Math.round(orderTotal * 0.9 * 100) / 100 // 90% to vendor
  const platformAmount = Math.round(orderTotal * 0.1 * 100) / 100 // 10% to platform
  const driverAmount = deliveryFee // Flat delivery fee to driver

  return {
    vendorAmount,
    platformAmount,
    driverAmount,
    totalAmount: orderTotal + deliveryFee,
  }
}

// Create Stripe Connect account for vendor or driver
export async function createStripeConnectAccount(
  userId: string,
  accountType: "vendor" | "driver",
  businessInfo: {
    email: string
    businessName?: string
    firstName: string
    lastName: string
    phone: string
    address: {
      line1: string
      city: string
      state: string
      postal_code: string
      country: string
    }
  },
): Promise<StripeConnectAccount> {
  try {
    // In a real implementation, this would call Stripe API
    // const account = await stripe.accounts.create({
    //   type: 'express',
    //   country: 'US',
    //   email: businessInfo.email,
    //   business_type: accountType === 'vendor' ? 'company' : 'individual',
    //   company: accountType === 'vendor' ? {
    //     name: businessInfo.businessName,
    //     phone: businessInfo.phone,
    //     address: businessInfo.address
    //   } : undefined,
    //   individual: {
    //     first_name: businessInfo.firstName,
    //     last_name: businessInfo.lastName,
    //     email: businessInfo.email,
    //     phone: businessInfo.phone,
    //     address: businessInfo.address
    //   }
    // })

    // Simulate API response
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockAccount: StripeConnectAccount = {
      id: `connect_${Date.now()}`,
      userId,
      accountId: `acct_${Math.random().toString(36).substr(2, 9)}`,
      accountType,
      isActive: false, // Requires onboarding completion
      payoutsEnabled: false,
      chargesEnabled: false,
    }

    return mockAccount
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error)
    throw new Error("Failed to create payment account")
  }
}

// Generate onboarding link for Stripe Connect account
export async function createAccountOnboardingLink(accountId: string, returnUrl: string): Promise<string> {
  try {
    // In a real implementation:
    // const accountLink = await stripe.accountLinks.create({
    //   account: accountId,
    //   refresh_url: `${returnUrl}?refresh=true`,
    //   return_url: returnUrl,
    //   type: 'account_onboarding',
    // })
    // return accountLink.url

    // Simulate onboarding URL
    await new Promise((resolve) => setTimeout(resolve, 500))
    return `https://connect.stripe.com/setup/e/${accountId}?return_url=${encodeURIComponent(returnUrl)}`
  } catch (error) {
    console.error("Error creating onboarding link:", error)
    throw new Error("Failed to create onboarding link")
  }
}

// Process payment with automatic splitting
export async function processPaymentWithSplit(
  paymentMethodId: string,
  orderTotal: number,
  vendorAccountId: string,
  driverAccountId: string,
  orderId: string,
): Promise<{
  paymentIntentId: string
  splits: PaymentSplit
}> {
  try {
    const splits = calculatePaymentSplit(orderTotal)

    // In a real implementation:
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(splits.totalAmount * 100), // Convert to cents
    //   currency: 'usd',
    //   payment_method: paymentMethodId,
    //   confirm: true,
    //   transfer_group: orderId,
    //   application_fee_amount: Math.round(splits.platformAmount * 100),
    //   on_behalf_of: vendorAccountId,
    // })

    // // Transfer to vendor (90% minus platform fee)
    // await stripe.transfers.create({
    //   amount: Math.round(splits.vendorAmount * 100),
    //   currency: 'usd',
    //   destination: vendorAccountId,
    //   transfer_group: orderId,
    // })

    // // Transfer to driver (flat delivery fee)
    // await stripe.transfers.create({
    //   amount: Math.round(splits.driverAmount * 100),
    //   currency: 'usd',
    //   destination: driverAccountId,
    //   transfer_group: orderId,
    // })

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return {
      paymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
      splits,
    }
  } catch (error) {
    console.error("Error processing payment:", error)
    throw new Error("Payment processing failed")
  }
}

// Get account status and capabilities
export async function getAccountStatus(accountId: string): Promise<{
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requiresAction: boolean
  actionUrl?: string
}> {
  try {
    // In a real implementation:
    // const account = await stripe.accounts.retrieve(accountId)
    // return {
    //   chargesEnabled: account.charges_enabled,
    //   payoutsEnabled: account.payouts_enabled,
    //   requiresAction: !account.details_submitted,
    //   actionUrl: account.details_submitted ? undefined : await createAccountOnboardingLink(accountId, returnUrl)
    // }

    // Simulate account status
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      chargesEnabled: true,
      payoutsEnabled: true,
      requiresAction: false,
    }
  } catch (error) {
    console.error("Error getting account status:", error)
    throw new Error("Failed to get account status")
  }
}
