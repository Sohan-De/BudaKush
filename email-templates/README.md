# EmailJS Template Setup Guide (Free Version - 2 Templates)

## 📧 Professional Email Templates for BudaKush CBD

This folder contains email templates optimized for the **free version of EmailJS** (limited to 2 templates):

1. **`template_invoice.html`** - Invoice sent to both customer and admin
2. **`template_order_confirmation_combined.html`** - Combined template for customer confirmation AND admin notification

## 🚀 How to Import Templates into EmailJS

### Step 1: Access EmailJS Dashboard
1. Go to [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
2. Sign in to your account
3. Navigate to "Email Templates" section

### Step 2: Create Templates (Only 2 needed!)

#### Template 1: Invoice Template
1. Click "Create New Template"
2. Choose your email service (Gmail, Outlook, etc.)
3. Set Template ID: `template_invoice`
4. Copy the content from `template_invoice.html`
5. Paste it into the template editor
6. Save the template

#### Template 2: Combined Order Confirmation Template
1. Click "Create New Template"
2. Choose your email service
3. Set Template ID: `template_order_confirmation`
4. Copy the content from `template_order_confirmation_combined.html`
5. Paste it into the template editor
6. Save the template

### Step 3: Configure Email Service
1. Go to "Email Services" section
2. Add your email service (Gmail, Outlook, etc.)
3. Note your Service ID: `service_7suq6i2`

### Step 4: Test the Templates
1. Use the test button in your admin dashboard
2. Or make a test purchase to trigger real emails
3. Verify all variables are working correctly

## 🎨 Template Features

### Design Features:
- ✅ **Responsive design** - Works on all devices
- ✅ **Professional branding** - BudaKush CBD colors and logo
- ✅ **Clean typography** - Easy to read
- ✅ **Color-coded sections** - Different purposes
- ✅ **Mobile-friendly** - Optimized for mobile viewing

### Content Features:
- ✅ **Order details** - Complete order information
- ✅ **Customer information** - Name, email, addresses
- ✅ **Itemized products** - List with quantities and prices
- ✅ **Free samples** - Automatically included
- ✅ **Shipping information** - Method and addresses
- ✅ **Contact information** - Company details

### Smart Template Logic:
- ✅ **Conditional content** - Different content for customer vs admin
- ✅ **Single template** - Handles both customer and admin emails
- ✅ **Dynamic styling** - Adapts based on recipient type

## 🔧 How the Combined Template Works

The `template_order_confirmation_combined.html` uses conditional logic to show different content:

### For Customers (when `customer_email` is present):
- Success celebration message
- Next steps information
- Call-to-action buttons
- Customer-focused footer

### For Admins (when `customer_email` is empty):
- Urgent action required alert
- Customer information section
- Processing instructions
- Admin action buttons
- Billing address (if available)

## 📋 Template Variables

All templates use these EmailJS variables:
- `{{to_name}}` - Recipient name
- `{{to_email}}` - Recipient email(s)
- `{{order_id}}` - Order number
- `{{order_date}}` - Order date
- `{{customer_name}}` - Customer name
- `{{customer_email}}` - Customer email (used for conditional logic)
- `{{total_amount}}` - Order total
- `{{currency}}` - Currency (EUR)
- `{{shipping_method}}` - Shipping method
- `{{items_list}}` - Product list
- `{{shipping_address}}` - Shipping address
- `{{billing_address}}` - Billing address (admin only)
- `{{company_name}}` - Company name
- `{{company_email}}` - Company email
- `{{company_phone}}` - Company phone

## 🔧 Customization Options

### Colors:
- Primary Green: `#2c5530`
- Secondary Green: `#4a7c59`
- Accent Yellow: `#ffd700`
- Background Gray: `#f8f9fa`

### Fonts:
- Primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Responsive fallbacks included

### Layout:
- Max width: 600px
- Centered design
- Mobile-responsive breakpoints

## 📱 Mobile Optimization

All templates are optimized for mobile devices:
- Responsive grid layouts
- Touch-friendly buttons
- Readable font sizes
- Optimized spacing

## 🧪 Testing

### Test Email Endpoint:
```
POST /api/test-email
```

### Test Data Included:
- Sample order with multiple items
- Free sample included
- Complete address information
- Realistic pricing

## 🔒 Security Notes

- Templates use server-side variables only
- No sensitive data in client-side code
- Secure EmailJS API integration
- Private key used server-side only

## 📞 Support

If you need help with:
- Template customization
- EmailJS setup
- Variable configuration
- Testing issues

Contact: [Your support email]

## 🎯 Email Flow (2 Templates)

After a successful payment:

1. **Webhook triggers** (`checkout.session.completed`)
2. **Order is created** in Supabase database
3. **Two emails are sent**:
   - **Invoice email** to both customer and admin (using `template_invoice`)
   - **Order confirmation** to customer + **Admin notification** to admin (using `template_order_confirmation`)

## 💡 Free Version Optimization

This setup is specifically designed for EmailJS free version:
- ✅ **Only 2 templates** needed
- ✅ **Full functionality** maintained
- ✅ **Professional design** for all emails
- ✅ **Conditional content** in one template
- ✅ **Cost-effective** solution

## 🎯 Next Steps

1. ✅ Import both templates
2. ✅ Test with the admin dashboard
3. ✅ Make a test purchase
4. ✅ Verify email delivery
5. ✅ Customize branding if needed
6. ✅ Set up email service monitoring

---

**Note:** These templates are designed specifically for the BudaKush CBD e-commerce application and work perfectly with the free version of EmailJS while maintaining all functionality. 