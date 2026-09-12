import stripe from "../config/stripe.js";
import { env } from "../config/env.js";
import { Selector } from "../utils/errors.utils.js";
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
    return next(Selector.BAD_ERROR);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const result = await handleCheckoutSessionCompleted(event.data.object);

        if (!result.ok) {
          return next(Selector.BAD_ERROR);
        }

        break;
      }

      case "checkout.session.expired": {
        const result = await handleCheckoutSessionCancelled(event.data.object);

        if (!result.ok) {
          return next(Selector.BAD_ERROR);
        }

        break;
      }

      default: {
        break;
      }
    }
  } catch (error) {
    console.log("Error procesando evento de Stripe:", error.message);
    return next(Selector.BAD_ERROR);
  }

  return res.json({
    ok: true,
    content: {
      type: event.type,
    },
  });
};
