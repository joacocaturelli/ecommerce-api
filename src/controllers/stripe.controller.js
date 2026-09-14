import stripe from "../config/stripe.js";
import { env } from "../config/env.js";
import {
  handleCheckoutSessionCompleted,
  handleCheckoutSessionCancelled,
} from "../services/stripe.service.js";

export const stripeWebhook = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.log("Error verificando webhook de Stripe:", error.message);
    return next(error);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      }

      case "checkout.session.expired": {
        await handleCheckoutSessionCancelled(event.data.object);
        break;
      }

      default: {
        break;
      }
    }

    return res.json({
      ok: true,
      content: {
        type: event.type,
      },
    });
  } catch (error) {
    console.log("Error procesando evento de Stripe:", error.message);
    return next(error);
  }
};
