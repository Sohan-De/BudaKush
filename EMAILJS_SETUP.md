# EmailJS Setup for Invoice Emails

## Overview
This application uses EmailJS to send automatic invoice emails to both customers and admins after successful payments.

## EmailJS Configuration
- **Public Key**: `UNnI11xfOtUdwlioy`
- **Private Key**: `o_x09hyRU6dG4zaUGndHv`
- **Service ID**: `service_7suq6i2`

## Required Email Templates

You need to create the following templates in your EmailJS account:

### 1. Invoice Template (`template_invoice`)
**Purpose**: Sends invoice to both customer and admin

**Variables Available**:
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer and admin emails (comma-separated)
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{total_amount}}` - Total amount
- `{{currency}}` - Currency (EUR)
- `{{shipping_method}}` - Shipping method
- `{{items_list}}` - List of items with quantities and prices
- `{{shipping_address}}` - Shipping address
- `{{billing_address}}` - Billing address
- `{{company_name}}` - Company name (BudaKush CBD)
- `{{company_email}}` - Company email
- `{{company_phone}}` - Company phone

### 2. Order Confirmation Template (`template_order_confirmation`)
**Purpose**: Sends order confirmation to customer only

**Variables Available**:
- `{{to_name}}` - Customer name
- `{{to_email}}` - Customer email
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{total_amount}}` - Total amount
- `{{currency}}` - Currency (EUR)
- `{{shipping_method}}` - Shipping method
- `{{items_list}}` - List of items with quantities and prices
- `{{shipping_address}}` - Shipping address
- `{{company_name}}` - Company name (BudaKush CBD)
- `{{company_email}}` - Company email
- `{{company_phone}}` - Company phone

### 3. Admin Notification Template (`template_admin_notification`)
**Purpose**: Sends notification to admin only

**Variables Available**:
- `{{to_name}}` - Admin
- `{{to_email}}` - Admin email
- `{{order_id}}` - Order ID
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_email}}` - Customer email
- `{{total_amount}}` - Total amount
- `{{currency}}` - Currency (EUR)
- `{{shipping_method}}` - Shipping method
- `{{items_list}}` - List of items with quantities and prices
- `{{shipping_address}}` - Shipping address
- `{{billing_address}}` - Billing address
- `{{company_name}}` - Company name (BudaKush CBD)

## Template Setup Instructions

1. **Log into EmailJS Dashboard**
   - Go to https://dashboard.emailjs.com/
   - Sign in with your account

2. **Create Email Templates**
   - Go to "Email Templates" section
   - Click "Create New Template"
   - Choose your email service (Gmail, Outlook, etc.)

3. **Template Design**
   - Use the visual template editor for better design
   - Add variables using `{{variable_name}}` format
   - Design professional invoice layout with:
     - Company logo and branding
     - Order details section
     - Items list
     - Pricing breakdown
     - Shipping and billing addresses
     - Contact information

4. **Template IDs**
   - Save templates with these exact IDs:
     - `template_invoice`
     - `template_order_confirmation`
     - `template_admin_notification`

## Testing

You can test the email functionality using the test endpoint:
```
POST /api/test-email
```

This will send a test invoice email with sample data.

## Email Flow

After a successful payment:

1. **Webhook triggers** (`checkout.session.completed`)
2. **Order is created** in Supabase database
3. **Three emails are sent**:
   - Invoice email to both customer and admin
   - Order confirmation to customer only
   - Admin notification to admin only

## Important Notes

- **Free samples** are automatically included in the items list
- **Shipping costs** are calculated based on order total and method
- **Promo codes** are applied and reflected in the total amount
- **Addresses** are formatted for display in emails
- **Currency** is displayed in EUR format

## Troubleshooting

If emails are not sending:

1. **Check EmailJS credentials** in the service
2. **Verify template IDs** match exactly
3. **Check webhook logs** for error messages
4. **Test with the test endpoint** first
5. **Verify EmailJS service** is active and configured

## Security

- Private key is used server-side only
- Emails are sent via secure EmailJS API
- No sensitive data is exposed in client-side code 