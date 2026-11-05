// EmailJS configuration for client-side usage
const EMAILJS_PUBLIC_KEY = 'UNnI11xfOtUdwlioy';
const EMAILJS_SERVICE_ID = 'service_7suq6i2';

export interface InvoiceEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  adminEmail: string;
  orderDate: string;
  totalAmount: number;
  currency: string;
  shippingMethod: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  freeSample?: {
    name: string;
    image: string;
  } | null;
}

/**
 * Send email using EmailJS client-side SDK
 * This function should be called from the client-side
 */
export const sendEmailJSClient = async (templateId: string, templateParams: Record<string, string>): Promise<void> => {
  // Dynamically import EmailJS to avoid SSR issues
  const emailjs = await import('@emailjs/browser');
  
  console.log(`Sending EmailJS request to template: ${templateId}`);
  console.log('Template params:', templateParams);
  console.log('EmailJS Service ID:', EMAILJS_SERVICE_ID);
  console.log('EmailJS Public Key:', EMAILJS_PUBLIC_KEY);
  
  try {
    console.log('Initializing EmailJS...');
    emailjs.init(EMAILJS_PUBLIC_KEY);
    
    console.log('Sending email...');
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
    
    console.log('EmailJS success response:', result);
  } catch (error) {
    console.error('EmailJS error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

/**
 * Send invoice email to both customer and admin
 */
export const sendInvoiceEmail = async (emailData: InvoiceEmailData): Promise<void> => {
  try {
    // Calculate subtotal (products only) and delivery charge
    const subtotal = emailData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = emailData.totalAmount - subtotal;
    
    console.log('Invoice calculations:', {
      subtotal: subtotal.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      totalAmount: emailData.totalAmount.toFixed(2)
    });
    
    // Format items for email template
    const itemsList = emailData.items.map(item => 
      `${item.name} - Quantité: ${item.quantity} - Prix: ${item.price.toFixed(2)}€`
    ).join('\n');

    // Add free sample if exists
    const itemsWithSample = emailData.freeSample 
      ? itemsList + `\n\nÉCHANTILLON GRATUIT: ${emailData.freeSample.name}`
      : itemsList;

    // Format addresses
    const shippingAddressFormatted = `${emailData.shippingAddress.name}\n${emailData.shippingAddress.street}\n${emailData.shippingAddress.city} ${emailData.shippingAddress.postalCode}\n${emailData.shippingAddress.country}`;
    
    const billingAddressFormatted = `${emailData.billingAddress.name}\n${emailData.billingAddress.street}\n${emailData.billingAddress.city} ${emailData.billingAddress.postalCode}\n${emailData.billingAddress.country}`;

    // Create detailed items list with subtotal and delivery charge
    const detailedItemsList = `${itemsWithSample}\n\n---\nSous-total (produits): ${subtotal.toFixed(2)}€\nFrais de livraison: ${deliveryCharge.toFixed(2)}€\n---\nTOTAL: ${emailData.totalAmount.toFixed(2)}€`;

    // Template parameters for EmailJS
    const templateParams = {
      to_name: emailData.customerName,
      to_email: `${emailData.customerEmail}, ${emailData.adminEmail}`,
      order_id: emailData.orderId,
      order_date: emailData.orderDate,
      customer_name: emailData.customerName,
      total_amount: emailData.totalAmount.toFixed(2),
      currency: emailData.currency.toUpperCase(),
      shipping_method: emailData.shippingMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      items_list: detailedItemsList,
      shipping_address: shippingAddressFormatted,
      billing_address: billingAddressFormatted,
      company_name: 'BudaKush CBD',
      company_email: '',
      company_phone: '+33 6 35 14 40 89'
    };

    // Send email using EmailJS client-side SDK
    await sendEmailJSClient('template_invoice', templateParams);
    console.log('Invoice email sent successfully');
  } catch (error) {
    console.error('Error sending invoice email:', error);
    throw error;
  }
};

/**
 * Send order confirmation email to customer and admin notification
 */
export const sendOrderConfirmationEmail = async (emailData: InvoiceEmailData): Promise<void> => {
  try {
    console.log('=== SENDING ORDER CONFIRMATION EMAILS ===');
    
    // Calculate subtotal (products only) and delivery charge
    const subtotal = emailData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = emailData.totalAmount - subtotal;
    
    console.log('Order calculations:', {
      subtotal: subtotal.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      totalAmount: emailData.totalAmount.toFixed(2)
    });
    
    // Format items for email template
    const itemsList = emailData.items.map(item => 
      `${item.name} - Quantité: ${item.quantity} - Prix: ${item.price.toFixed(2)}€`
    ).join('\n');

    // Add free sample if exists
    const itemsWithSample = emailData.freeSample 
      ? itemsList + `\n\nÉCHANTILLON GRATUIT: ${emailData.freeSample.name}`
      : itemsList;

    // Format addresses
    const shippingAddressFormatted = `${emailData.shippingAddress.name}\n${emailData.shippingAddress.street}\n${emailData.shippingAddress.city} ${emailData.shippingAddress.postalCode}\n${emailData.shippingAddress.country}`;
    
    const billingAddressFormatted = `${emailData.billingAddress.name}\n${emailData.billingAddress.street}\n${emailData.billingAddress.city} ${emailData.billingAddress.postalCode}\n${emailData.billingAddress.country}`;

    // Create detailed items list with subtotal and delivery charge
    const detailedItemsList = `${itemsWithSample}\n\n---\nSous-total (produits): ${subtotal.toFixed(2)}€\nFrais de livraison: ${deliveryCharge.toFixed(2)}€\n---\nTOTAL: ${emailData.totalAmount.toFixed(2)}€`;

    // Send customer confirmation email using proper template variables
    console.log('Sending customer confirmation email...');
    const customerTemplateParams = {
      to_name: emailData.customerName,
      to_email: emailData.customerEmail,
      order_id: emailData.orderId,
      order_date: emailData.orderDate,
      customer_name: emailData.customerName,
      total_amount: emailData.totalAmount.toFixed(2),
      currency: emailData.currency.toUpperCase(),
      shipping_method: emailData.shippingMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      items_list: detailedItemsList,
      shipping_address: shippingAddressFormatted,
      billing_address: billingAddressFormatted,
      company_name: 'BudaKush CBD',
      company_email: '',
      company_phone: '+33 6 35 14 40 89'
    };

    await sendEmailJSClient('template_invoice', customerTemplateParams);
    console.log('Customer confirmation email sent successfully');

    // Send admin notification email using proper template variables
    console.log('Sending admin notification email...');
    const adminTemplateParams = {
      to_name: 'Admin',
      to_email: emailData.adminEmail,
      order_id: emailData.orderId,
      order_date: emailData.orderDate,
      customer_name: emailData.customerName,
      total_amount: emailData.totalAmount.toFixed(2),
      currency: emailData.currency.toUpperCase(),
      shipping_method: emailData.shippingMethod.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      items_list: detailedItemsList,
      shipping_address: shippingAddressFormatted,
      billing_address: billingAddressFormatted,
      company_name: 'BudaKush CBD',
      company_email: '',
      company_phone: '+33 6 35 14 40 89'
    };

    await sendEmailJSClient('template_invoice', adminTemplateParams);
    console.log('Admin notification email sent successfully');
    
    console.log('=== ALL ORDER CONFIRMATION EMAILS SENT SUCCESSFULLY ===');
  } catch (error) {
    console.error('Error sending order confirmation emails:', error);
    throw error;
  }
}; 