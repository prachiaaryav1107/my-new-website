import type { APIRoute } from 'astro';

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

    const orderId = `SS-${Date.now().toString().slice(-6)}`;
    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    const sender = 'Somashiva Sacred Store <orders@somashiva.com>';
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format HTML table for items
    const itemsHtml = cartItems.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #7A5212; font-weight: bold; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    // Store Notification Email HTML (Exhaustive Customer Dossier & Dispatch Manifest)
    const storeEmailHtml = `
      <div style="font-family: serif; background-color: #FAF7F2; padding: 30px; color: #4A3B2C;">
        <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border: 1px solid #E6CA65; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center; border-bottom: 2px solid #E6CA65; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #7A5212; margin: 0 0 5px 0;">📦 WAREHOUSE DISPATCH MANIFEST 📦</h2>
            <p style="font-family: sans-serif; font-size: 13px; color: #996515; margin: 0;">Order Reference: <strong>${orderId}</strong> | Timestamp: ${timestamp}</p>
            <div style="margin-top: 10px; display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-family: sans-serif; font-size: 11px; font-weight: bold;">Payment: PENDING (Prepaid UPI / Bank Transfer)</div>
          </div>

          <!-- Section 1: Customer Contact Dossier -->
          <div style="background-color: #FAF7F2; border-left: 4px solid #D4AF37; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #7A5212; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">1. Customer Contact Dossier</h3>
            <table style="width: 100%; font-family: sans-serif; font-size: 14px; line-height: 1.6;">
              <tr>
                <td style="font-weight: bold; width: 130px; color: #8B5E14;">Full Name:</td>
                <td>${customerName}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #8B5E14;">Email Address:</td>
                <td><a href="mailto:${customerEmail}" style="color: #996515; text-decoration: underline;">${customerEmail}</a></td>
              </tr>
              <tr>
                <td style="font-weight: bold; color: #8B5E14;">Phone / WhatsApp:</td>
                <td><a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(customerName)},%20confirming%20your%20Somashiva%20order%20${orderId}" style="color: #25D366; font-weight: bold; text-decoration: none;">${customerPhone} 💬</a></td>
              </tr>
            </table>
          </div>

          <!-- Section 2: Complete Shipping Address -->
          <div style="background-color: #FAF7F2; border-left: 4px solid #D4AF37; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #7A5212; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">2. Complete Shipping Address</h3>
            <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; margin: 0; color: #4A3B2C;">
              <strong>${customerName}</strong><br/>
              ${address}<br/>
              ${city} - ${pincode}<br/>
              India
            </p>
          </div>

          <!-- Section 3: Itemized Packing Table -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #7A5212; font-size: 15px; margin: 0 0 10px 0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">3. Itemized Packing Manifest</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #FAF7F2; border-bottom: 2px solid #E6CA65;">
                  <th style="padding: 10px; text-align: left; font-family: sans-serif; font-size: 12px; color: #7A5212;">Item Title</th>
                  <th style="padding: 10px; text-align: center; font-family: sans-serif; font-size: 12px; color: #7A5212;">Qty</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #7A5212;">Unit Price</th>
                  <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #7A5212;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 14px;">Grand Total:</td>
                  <td style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 18px; color: #7A5212;">₹${cartTotal}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Section 4: Operational Action Buttons -->
          <div style="text-align: center; border-top: 1px solid #E6CA65; padding-top: 20px;">
            <a href="mailto:${customerEmail}?subject=Regarding%20Your%20SomaShiva%20Order%20${orderId}" style="display: inline-block; background-color: #996515; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; margin-right: 10px; margin-bottom: 10px;">Reply to Customer (Email)</a>
            <a href="https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(customerName)},%20confirming%20your%20Somashiva%20order%20${orderId}" style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-decoration: none; margin-bottom: 10px;">Open WhatsApp Chat</a>
          </div>
        </div>
      </div>
    `;

    // Customer Confirmation Email HTML
    const customerEmailHtml = `
      <div style="font-family: serif; background-color: #FAF7F2; padding: 30px; color: #4A3B2C;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E6CA65; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #7A5212; font-size: 26px; margin-bottom: 5px;">SomaShiva™ Sacred Offerings</h1>
            <p style="font-family: sans-serif; font-size: 14px; color: #996515; font-style: italic;">Har Har Mahadev! Thank you for welcoming sacred grace into your sanctuary.</p>
            <div style="margin-top: 10px; display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-family: sans-serif; font-size: 11px; font-weight: bold;">Payment Status: PENDING (Prepaid UPI / Bank Transfer)</div>
          </div>

          <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Your order has been successfully registered and is awaiting UPI verification prior to package consecration and express dispatch. Here is your official order confirmation and tax invoice:</p>
          
          <div style="background-color: #FAF7F2; border-radius: 8px; padding: 15px; margin: 20px 0; font-family: sans-serif; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Order Reference ID:</strong> <span style="color: #7A5212; font-weight: bold;">${orderId}</span></p>
            <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${address}, ${city} - ${pincode}</p>
          </div>

          <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0; font-family: sans-serif; font-size: 13px; color: #78350f;">
            <p style="margin: 0 0 5px 0; font-weight: bold;">📦 Next Steps:</p>
            <p style="margin: 0;">Our sanctum team is preparing your package. Your Airway Bill (AWB) number and live tracking link will be dispatched to your WhatsApp (<strong>+91 ${customerPhone}</strong>) once UPI payment verification is completed.</p>
          </div>

          <h3 style="color: #7A5212; font-size: 16px;">Itemized Receipt:</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #FAF7F2; border-bottom: 2px solid #E6CA65;">
                <th style="padding: 10px; text-align: left; font-family: sans-serif; font-size: 12px; color: #7A5212;">Item</th>
                <th style="padding: 10px; text-align: center; font-family: sans-serif; font-size: 12px; color: #7A5212;">Qty</th>
                <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #7A5212;">Price</th>
                <th style="padding: 10px; text-align: right; font-family: sans-serif; font-size: 12px; color: #7A5212;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 14px;">Grand Total:</td>
                <td style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 16px; color: #7A5212;">₹${cartTotal}</td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top: 25px; padding: 12px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; font-family: sans-serif; font-size: 12px; color: #991b1b;">
            <p style="margin: 0;"><strong>Kindly note:</strong> To safeguard transit integrity, please record a continuous unboxing video when your package arrives to establish validity in the rare event of transit damage.</p>
          </div>

          <div style="margin-top: 30px; text-align: center; font-family: sans-serif; font-size: 13px; color: #8B5E14; border-top: 1px solid #E6CA65; pt: 20px;">
            <p>Need assistance or wish to confirm UPI payment? Contact us on WhatsApp at <strong>+91 9080603108</strong>.</p>
            <p style="color: #555; font-size: 11px; margin-top: 15px;">© SomaShiva™ Official. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    // If Resend API key is configured, send emails via Resend
    if (resresendApiKeyCheck(resendApiKey)) {
      // Send email to store
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: sender,
          to: ['somashivaofficial@gmail.com'],
          replyTo: customerEmail,
          subject: `[ORDER MANIFEST] ${orderId} - ₹${cartTotal} from ${customerName}`,
          html: storeEmailHtml,
        }),
      });

      // Send email to customer
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: sender,
          to: [customerEmail],
          subject: `Order Confirmed: ${orderId} - Somashiva Sacred Offerings`,
          html: customerEmailHtml,
        }),
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

function resresendApiKeyCheck(key: string | undefined): boolean {
  return typeof key === 'string' && key.length > 5;
}
