import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, pincode, cartItems, cartTotal } = body;

    if (!customerName || !customerEmail || !cartItems || !cartTotal) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required checkout fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'RESEND_API_KEY is missing in Vercel Environment Variables' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resend = new Resend(apiKey);
    const orderId = 'SS-' + Date.now().toString().slice(-6);
    const sender = 'Somashiva Sacred Store <orders@somashiva.com>';
    const storeEmail = 'somashivaofficial@gmail.com';
    const cleanPhone = String(customerPhone).replace(/\D/g, '').slice(-10);
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format HTML table for items
    const itemsHtml = cartItems.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #33291e; font-family: sans-serif; font-size: 14px; color: #ebd9b8;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #33291e; font-family: sans-serif; font-size: 14px; color: #ebd9b8; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #33291e; font-family: sans-serif; font-size: 14px; color: #ebd9b8; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #33291e; font-family: sans-serif; font-size: 14px; color: #d4af37; font-weight: bold; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    // Admin Fulfillment Manifest
    const storeEmailHtml = `
      <div style="font-family: serif; background-color: #0c0a09; padding: 30px; color: #ebd9b8;">
        <div style="max-width: 650px; margin: 0 auto; background: #1c1917; border: 1px solid #d4af37; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #d4af37; margin: 0 0 5px 0; font-family: serif;">📦 WAREHOUSE DISPATCH MANIFEST 📦</h2>
            <p style="font-family: sans-serif; font-size: 13px; color: #ebd9b8; margin: 0;">Order Reference: <strong>${orderId}</strong> | Timestamp: ${timestamp}</p>
            <div style="margin-top: 10px; display: inline-block; background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-family: sans-serif; font-size: 11px; font-weight: bold;">[PREPAID ACTION REQUIRED] Awaiting UPI Payment Verification</div>
          </div>

          <!-- Section 1: Customer Contact Dossier -->
          <div style="background-color: #0c0a09; border-left: 4px solid #d4af37; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #d4af37; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">1. Customer Contact Dossier</h3>
            <table style="width: 100%; font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #ebd9b8;">
              <tr>
                <td style="font-weight: bold; width: 140px; color: #d4af37;">Full Name:</td>
                <td>${customerName}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #d4af37;">Email Address:</td>
                <td><a href="mailto:${customerEmail}" style="color: #d4af37; text-decoration: underline;">${customerEmail}</a></td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #d4af37;">Phone / WhatsApp:</td>
                <td><a href="https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Namaste ${customerName}, confirming your Somashiva order ${orderId} (₹${cartTotal}). Please find our official UPI details below to complete verification prior to consecration and dispatch.`)}" style="color: #25D366; font-weight: bold; text-decoration: none;">+91 ${cleanPhone} 💬</a></td>
              </tr>
            </table>
          </div>

          <!-- Section 2: Complete Shipping Destination -->
          <div style="background-color: #0c0a09; border-left: 4px solid #d4af37; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #d4af37; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">2. Complete Shipping Destination</h3>
            <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; margin: 0; color: #ebd9b8;">
              <strong>${customerName}</strong><br/>
              ${address}<br/>
              ${city} - ${pincode}<br/>
              India
            </p>
          </div>

          <!-- Section 3: Itemized Packing Table -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #d4af37; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">3. Itemized Packing Manifest</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #0c0a09; border-bottom: 2px solid #d4af37;">
                  <th style="padding: 10px; text-align: left; font-family: sans-serif; font-size: 12px; color: #d4af37;">Item Title</th>
                  <th style="padding: 10px; text-align: center; font-family: sans-serif; font-size: 12px; color: #d4af37;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #d4af37;">Unit Price</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #d4af37;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 14px; color: #ebd9b8;">Grand Total:</td>
                  <td style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 18px; color: #d4af37;">₹${cartTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Section 4: Operational Action Buttons -->
          <div style="text-align: center; border-top: 1px solid #33291e; padding-top: 20px;">
            <a href="mailto:${customerEmail}?subject=Regarding%20Your%20SomaShiva%20Order%20${orderId}" style="display: inline-block; background-color: #d4af37; color: #0c0a09; padding: 12px 24px; border-radius: 8px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; margin-right: 10px; margin-bottom: 10px;">Reply to Customer (Email)</a>
            <a href="https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Namaste ${customerName}, confirming your Somashiva order ${orderId} (₹${cartTotal}). Please find our official UPI details below to complete verification prior to consecration and dispatch.`)}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; margin-bottom: 10px;">Open WhatsApp Chat</a>
          </div>
        </div>
      </div>
    `;

    // Customer Branded Receipt
    const customerEmailHtml = `
      <div style="font-family: serif; background-color: #0c0a09; padding: 30px; color: #ebd9b8;">
        <div style="max-width: 600px; margin: 0 auto; background: #1c1917; border: 1px solid #d4af37; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #33291e; padding-bottom: 15px;">
            <h1 style="color: #d4af37; font-size: 26px; margin-bottom: 5px; font-family: serif;">SomaShiva™ Sacred Offerings</h1>
            <p style="font-family: sans-serif; font-size: 14px; color: #ebd9b8; font-style: italic;">Har Har Mahadev, ${customerName}.</p>
            <div style="margin-top: 10px; display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-family: sans-serif; font-size: 11px; font-weight: bold;">Your consecrated order (${orderId}) is registered under our 100% Prepaid Sanctum Policy. Status: PENDING UPI VERIFICATION.</div>
          </div>

          <div style="background-color: #0c0a09; border-radius: 8px; padding: 15px; margin: 20px 0; font-family: sans-serif; font-size: 14px; border: 1px solid #33291e;">
            <p style="margin: 5px 0; color: #ebd9b8;"><strong>Order Reference ID:</strong> <span style="color: #d4af37; font-weight: bold;">${orderId}</span></p>
            <p style="margin: 5px 0; color: #ebd9b8;"><strong>Shipping Address:</strong> ${address}, ${city} - ${pincode}</p>
          </div>

          <div style="background-color: #2a241e; border: 1px solid #d4af37; border-radius: 8px; padding: 15px; margin: 20px 0; font-family: sans-serif; font-size: 13px; color: #ebd9b8;">
            <p style="margin: 0 0 5px 0; font-weight: bold; color: #d4af37;">🔒 Prepaid Payment & Next Steps:</p>
            <p style="margin: 0 0 12px 0;">Our concierge team will connect with you on WhatsApp (+91 ${cleanPhone}) with your official UPI QR/payment link, or you may initiate instant verification below. Once confirmed, your Airway Bill (AWB) number and live courier tracking link will be transmitted directly to your WhatsApp.</p>
            <div style="text-align: center;">
              <a href="https://wa.me/919180603108?text=${encodeURIComponent(`Namaste Somashiva, I have registered order ${orderId} (₹${cartTotal}). Please share the UPI payment details for verification.`)}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 12px;">Complete UPI Verification on WhatsApp</a>
            </div>
          </div>

          <h3 style="color: #d4af37; font-size: 16px; font-family: serif;">Itemized Receipt:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #0c0a09; border-bottom: 2px solid #d4af37;">
                <th style="padding: 10px; text-align: left; font-family: sans-serif; font-size: 12px; color: #d4af37;">Item</th>
                <th style="padding: 10px; text-align: center; font-family: sans-serif; font-size: 12px; color: #d4af37;">Qty</th>
                <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #d4af37;">Price</th>
                <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #d4af37;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 14px; color: #ebd9b8;">Grand Total:</td>
                <td style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 16px; color: #d4af37;">₹${cartTotal}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 25px; padding: 12px; background-color: #2a1e1e; border: 1px solid #7f1d1d; border-radius: 8px; font-family: sans-serif; font-size: 12px; color: #fca5a5;">
            <p style="margin: 0;"><strong>Sanctum Guarantee:</strong> We provide 100% replacement exclusively for manufacturing defects or transit damage. Kindly record a continuous, uncut unboxing video showing the shipping label and original seal opening, and submit any claim via WhatsApp to +91 9180603108 within 48 hours of delivery.</p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-family: sans-serif; font-size: 13px; color: #ebd9b8; border-top: 1px solid #33291e; padding-top: 20px;">
            <p>Need assistance or wish to confirm UPI payment? Contact us on WhatsApp at <strong>+91 9180603108</strong>.</p>
            <p style="color: #888; font-size: 11px; margin-top: 15px;">© SomaShiva™ Official. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // Send Admin Manifest via Resend
    const storeRes = await resend.emails.send({
      from: sender,
      to: [storeEmail],
      replyTo: customerEmail,
      subject: `[ORDER MANIFEST] ${orderId} - ₹${cartTotal} from ${customerName} [PREPAID PENDING]`,
      html: storeEmailHtml,
    });

    if (storeRes.error) {
      return new Response(JSON.stringify({ success: false, error: storeRes.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Send Customer Receipt via Resend
    const customerRes = await resend.emails.send({
      from: sender,
      to: [customerEmail],
      replyTo: storeEmail,
      subject: `Order Registered: ${orderId} | Somashiva Sacred Store`,
      html: customerEmailHtml,
    });

    if (customerRes.error) {
      return new Response(JSON.stringify({ success: false, error: customerRes.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!storeRes.data?.id || !customerRes.data?.id) {
      return new Response(JSON.stringify({ success: false, error: 'Failed to confirm email dispatch with Resend' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, orderId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
