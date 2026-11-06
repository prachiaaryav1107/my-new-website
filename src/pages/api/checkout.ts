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

    // Format HTML table for items
    const itemsHtml = cartItems.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #4A3B2C; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 14px; color: #7A5212; font-weight: bold; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `).join('');

    // Store Notification Email HTML
    const storeEmailHtml = `
      <div style="font-family: serif; background-color: #FAF7F2; padding: 30px; color: #4A3B2C;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E6CA65; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <h2 style="color: #7A5212; margin-top: 0; text-align: center;">🙏 [NEW ORDER] ${orderId} 🙏</h2>
          <p style="font-size: 14px; text-align: center; color: #996515;">Order received from <strong>${customerName}</strong></p>
          
          <hr style="border: none; border-top: 1px solid #E6CA65; margin: 20px 0;" />
          
          <h3 style="color: #7A5212; font-size: 16px;">Customer Details:</h3>
          <ul style="font-family: sans-serif; font-size: 14px; line-height: 1.6; padding-left: 20px;">
            <li><strong>Name:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            <li><strong>Phone / WhatsApp:</strong> ${customerPhone}</li>
            <li><strong>Delivery Address:</strong> ${address}, ${city} - ${pincode}</li>
          </ul>

          <h3 style="color: #7A5212; font-size: 16px; margin-top: 25px;">Itemized Order Bill:</h3>
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
                <td colspan="3" style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 14px;">Total Amount:</td>
                <td style="padding: 15px; text-align: right; font-family: sans-serif; font-weight: bold; font-size: 16px; color: #7A5212;">₹${cartTotal}</td>
              </tr>
            </tfoot>
          </table>
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
          </div>

          <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6;">Your order has been successfully placed and is currently being sanctified and prepared for express sacred dispatch. Here is your official order confirmation and tax invoice:</p>
          
          <div style="background-color: #FAF7F2; border-radius: 8px; padding: 15px; margin: 20px 0; font-family: sans-serif; font-size: 14px;">
            <p style="margin: 5px 0;"><strong>Order Reference ID:</strong> <span style="color: #7A5212; font-weight: bold;">${orderId}</span></p>
            <p style="margin: 5px 0;"><strong>Shipping Address:</strong> ${address}, ${city} - ${pincode}</p>
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

          <div style="margin-top: 30px; text-align: center; font-family: sans-serif; font-size: 13px; color: #8B5E14; border-top: 1px solid #E6CA65; pt: 20px;">
            <p>Need assistance or wish to track via WhatsApp? Contact us at <strong>+91 9180603108</strong>.</p>
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
          from: 'SomaShiva Orders <onboarding@resend.dev>',
          to: ['somashivaofficial@gmail.com'],
          subject: `[NEW ORDER] ${orderId} - ${customerName} (₹${cartTotal})`,
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
          from: 'SomaShiva Sacred Offerings <onboarding@resend.dev>',
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
