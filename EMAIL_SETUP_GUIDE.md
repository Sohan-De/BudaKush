# Email Setup Guide for BudaKush CBD

This guide explains how to set up EmailJS for both client-side and server-side email functionality in your CBD e-commerce application.

## Overview

Your application now supports EmailJS for all email functionality:

1. **Client-side emails (EmailJS SDK)** - Used for admin testing and manual email sending
2. **Server-side emails (EmailJS API)** - Used for automatic order confirmations and webhook emails

## EmailJS Setup

### Step 1: EmailJS Configuration
Your EmailJS is already configured in the code:
- Service ID: `service_7suq6i2`
- Public Key: `UNnI11xfOtUdwlioy`

### Step 2: Email Templates
Make sure you have these templates in your EmailJS account:
- `template_invoice` - For invoice emails
- `template_order_confirmat` - For order confirmations

### Step 3: Verify EmailJS Account
1. Go to [emailjs.com](https://emailjs.com)
2. Log into your account
3. Verify your email service is active
4. Check that your templates exist and are properly configured

## How It Works

### Automatic Order Emails (Server-Side)
When a customer completes a purchase:

1. **Stripe Checkout Flow**: 
   - Customer pays via Stripe Checkout
   - Stripe sends webhook to `/api/webhook`
   - Webhook creates order in database
   - **Server-side email** sent via EmailJS API

2. **Custom Checkout Flow**:
   - Customer pays via custom form
   - Order created in database
   - **Server-side email** sent via EmailJS API

### Admin Testing (Client-Side)
- Admin can test emails from dashboard
- Uses EmailJS client-side SDK
- Works for testing and manual email sending

## Architecture

### Server-Side Email Flow
1. Webhook receives payment confirmation
2. Calls `/api/send-emailjs` route
3. Route makes direct API call to EmailJS
4. EmailJS sends email using your templates

### Client-Side Email Flow
1. Admin clicks test button
2. EmailJS SDK sends email directly
3. Uses same templates as server-side

## Testing

### Test Server-Side Emails
1. Go to Admin Dashboard
2. Click "Test Server Email (EmailJS API)" button
3. Check your email for the test order confirmation

### Test Client-Side Emails
1. Go to Admin Dashboard
2. Click any of the EmailJS test buttons
3. Check your email for test messages

## Troubleshooting

### Server-Side Email Issues
1. **"EmailJS API error"**
   - Check EmailJS account status
   - Verify templates exist
   - Check API quotas

2. **"Failed to send email"**
   - Check server logs for detailed errors
   - Verify webhook URL is accessible
   - Check Stripe webhook configuration

3. **Emails not sending from webhook**
   - Check server logs for errors
   - Verify webhook URL is accessible
   - Check Stripe webhook configuration

### Client-Side Email Issues
1. **EmailJS errors**
   - Verify EmailJS service ID and public key
   - Check browser console for errors
   - Ensure templates exist in EmailJS dashboard

## Email Templates

### Required Templates
- **template_invoice**: Invoice template with order details
- **template_order_confirmat**: Order confirmation template

### Template Variables
Make sure your EmailJS templates include these variables:
- `to_name` - Customer name
- `to_email` - Customer email
- `order_id` - Order ID
- `order_date` - Order date
- `customer_name` - Customer name
- `total_amount` - Order total
- `currency` - Currency (EUR)
- `shipping_method` - Shipping method
- `items_list` - List of items
- `shipping_address` - Shipping address
- `billing_address` - Billing address
- `company_name` - Company name
- `company_email` - Company email
- `company_phone` - Company phone

## Production Deployment

### Vercel/Netlify
1. Deploy your application
2. Test webhook emails with a real purchase
3. Monitor EmailJS usage and quotas

### Local Development
1. Use Stripe CLI to forward webhooks locally:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
2. Test with test payments

## Security Notes

- EmailJS public key can be exposed (it's designed to be public)
- Service ID is also safe to expose
- All sensitive data is handled server-side

## Cost Considerations

- **EmailJS Free Plan**: 200 emails/month
- **EmailJS Paid Plan**: $15/month for 1000 emails
- **EmailJS Pro Plan**: $35/month for 5000 emails

For a small e-commerce site, the free tier should be sufficient.

## API Endpoints

### `/api/send-emailjs`
- **Method**: POST
- **Purpose**: Send emails via EmailJS API (server-side)
- **Used by**: Webhooks, checkout process

### `/api/test-server-email`
- **Method**: POST
- **Purpose**: Test server-side email functionality
- **Used by**: Admin dashboard testing

## Monitoring

### EmailJS Dashboard
- Monitor email delivery rates
- Check API usage and quotas
- View email logs and analytics

### Application Logs
- Check server logs for email errors
- Monitor webhook success/failure rates
- Track order completion rates 