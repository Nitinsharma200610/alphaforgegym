import Stripe from "stripe";
import { config } from "dotenv";
config();
export const allowedEvents = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "invoice.payment_succeeded",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

export const failedPayments = ["invoice.payment_failed"];
export const successfulPayments = ["invoice.paid"];

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(stripeKey);

export const createCustomer = async (data) => {
  return await stripe.customers.create({
    email: data.email,
    name: data.name,
    payment_method: data.payment_method || undefined,
    address: data.address,
    invoice_settings: {
      default_payment_method: data.payment_method || undefined,
    },
  });
};
export const updateCustomer = async (customerId, data) => {
  return await stripe.customers.update(customerId, {
    email: data.email,
    name: data.name,
    address: data.address,
  });
};

export const updateDefaultPaymentMethod = async (
  customer,
  default_payment_method,
) =>
  await stripe.customers.update(customer, {
    invoice_settings: { default_payment_method },
  });
export const getCustomer = async (customerId) =>
  await stripe.customers.retrieve(customerId);

export const listPaymentMethods = async (customer) =>
  await stripe.paymentMethods.list({ customer, type: "card" });
export const createPaymentMethod = async (data) =>
  await stripe.paymentMethods.create({ type: "card", ...data });
export const attachPaymentMethodToCustomer = async (paymentMethod, customer) =>
  await stripe.paymentMethods.attach(paymentMethod, { customer });
export const detachPaymentMethodFromCustomer = async (id) =>
  await stripe.paymentMethods.detach(id);
export const getPaymentMethodById = async (id) =>
  await stripe.paymentMethods.retrieve(id);
export const createProduct = async (data) => {
  let productData = { ...data };
  const product = await stripe.products.create({
    name: data.name,
  });


  if (product && product.id) {
    const price = await stripe.prices.create({
      unit_amount: Number(data.price) * 100,
      currency: "inr",
      recurring: {
        interval: data.interval,
        interval_count: Number(data.validity || 1),
      },
      product: product.id,
    });
    if (price && price.id) {
      productData = {
        ...data,
        planId: price.product,
        priceId: price.id,
      };
      return productData;
    } else {
      return price;
    }
  }
  return data;
};

export const updateProduct = async (id, data) => {
  await stripe.products.update(id, { name: data.name });
};

export const deleteProduct = async (productData) => {
  let data;
  if (productData && productData.priceId) {
    const price = await stripe.prices.update(productData.priceId, {
      active: false,
    });
  }
  if (productData && productData.planId) {
    const product = await stripe.products.update(productData.planId, {
      active: false,
    });
    data = product;
  }
  return data;
};

export const createSubscription = async (subscriptionData) => {
  let sub = {
    customer: subscriptionData.customer,
    items: [{ price: subscriptionData.price }],
  };
  if (subscriptionData.coupon) {
    sub["discounts"] = [{ coupon: subscriptionData.coupon }];
  }
  return await stripe.subscriptions.create({
    ...sub,
    expand: ["default_payment_method", "latest_invoice"],
  });
};
export const getSubscriptionById = async (id) =>
  await stripe.subscriptions.retrieve(id, {
    expand: ["default_payment_method", "latest_invoice"],
  });

export const listSubscriptions = async (rest, items = []) => {
  const subscriptions = [];
  let { data, has_more } = await stripe.subscriptions.list({
    status: "active",
    limit: 100,
    ...rest,
  });
  subscriptions.push(...data);
  if (has_more) {
    await listSubscriptions(rest, items);
  }
  return subscriptions;
};
export const cancelSubscriptionAtPeriodEnd = async (id) =>
  await stripe.subscriptions.update(id, { cancel_at_period_end: true });
export const cancelSubscription = async (id) =>
  await stripe.subscriptions.cancel(id);

export const listInvoices = async (customer) => {
  const invoices = [];
  let { data, has_more } = await stripe.invoices.list({
    customer,
    limit: 100,
    expand: [
      "data.customer.invoice_settings.default_payment_method",
      "data.payment_intent",
      "data.payment_intent.payment_method",
    ],
  });
  invoices.push(...data);
  if (has_more) {
    await listInvoices(customer);
  }
  return invoices;
};
export const listCharges = async (customer) => {
  const charges = [];
  let { data, has_more } = await stripe.charges.list({
    customer,
    limit: 100,
    expand: [
      "data.customer.invoice_settings.default_payment_method",
      "data.payment_intent",
      "data.payment_intent.payment_method",
    ],
  });
  charges.push(...data);
  if (has_more) {
    await listCharges(customer);
  }
  return charges;
};

export const getInvoice = async (id) => await stripe.invoices.retrieve(id);
export const payInvoice = async (id) => await stripe.invoices.pay(id);
export const createCheckoutSession = async (data) => {
  return await stripe.checkout.sessions.create({
    customer: data.customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: data.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${data.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${data.cancelUrl}`,
  });
};
