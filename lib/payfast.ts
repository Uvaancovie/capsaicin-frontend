// PayFast Hosted Checkout Integration for South Africa
import crypto from 'crypto';

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passphrase?: string;
  sandbox: boolean;
}

export interface PayFastData {
  // Merchant details
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  
  // Customer details
  name_first?: string;
  name_last?: string;
  email_address: string;
  cell_number?: string;
  
  // Transaction details
  m_payment_id: string; // Your unique transaction ID
  amount: string; // Format: "123.45"
  item_name: string;
  item_description?: string;
  
  // Custom fields (optional)
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: string;
  custom_int2?: string;
  custom_int3?: string;
  custom_int4?: string;
  custom_int5?: string;
  
  // Security signature (calculated automatically)
  signature?: string;
}

export class PayFastIntegration {
  private config: PayFastConfig;
  
  constructor(config: PayFastConfig) {
    this.config = config;
  }
  
  /**
   * Generate PayFast payment URL with signed form data
   */
  generatePaymentUrl(data: Omit<PayFastData, 'merchant_id' | 'merchant_key' | 'signature'>): string {
    const paymentData: PayFastData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      ...data
    };
    
    // Generate signature
    paymentData.signature = this.generateSignature(paymentData);
    
    // Remove merchant_key before creating URL (security)
    delete (paymentData as any).merchant_key;
    
    // Create URL parameters
    const params = new URLSearchParams();
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const baseUrl = this.config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
      
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Generate HTML form for auto-submit to PayFast
   */
  generatePaymentForm(data: Omit<PayFastData, 'merchant_id' | 'merchant_key' | 'signature'>): string {
    const paymentData: PayFastData = {
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
      ...data
    };
    
    // Generate signature
    paymentData.signature = this.generateSignature(paymentData);
    
    // Remove merchant_key before creating form (security)
    delete (paymentData as any).merchant_key;
    
    const baseUrl = this.config.sandbox 
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
    
    let formFields = '';
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formFields += `    <input type="hidden" name="${key}" value="${value}" />\n`;
      }
    });
    
    return `
<form id="payfast-form" action="${baseUrl}" method="post">
${formFields}    <button type="submit" class="payfast-button">
      Pay with PayFast
    </button>
</form>

<script>
  // Auto-submit the form
  document.getElementById('payfast-form').submit();
</script>`;
  }
  
  /**
   * Generate MD5 signature for PayFast data
   */
  private generateSignature(data: PayFastData): string {
    // Create parameter string (excluding signature)
    const params: Record<string, string> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'signature' && value !== undefined && value !== null) {
        params[key] = value.toString();
      }
    });
    
    // Sort parameters alphabetically
    const sortedKeys = Object.keys(params).sort();
    const paramString = sortedKeys
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    // Add passphrase if configured
    const stringToHash = this.config.passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(this.config.passphrase)}`
      : paramString;
    
    // Generate MD5 hash
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  }
  
  /**
   * Verify ITN (Instant Transaction Notification) from PayFast
   */
  verifyITN(itnData: Record<string, any>): boolean {
    try {
      const receivedSignature = itnData.signature;
      delete itnData.signature;
      
      const calculatedSignature = this.generateSignature(itnData as PayFastData);
      
      return receivedSignature === calculatedSignature;
    } catch (error) {
      console.error('Error verifying ITN signature:', error);
      return false;
    }
  }
  
  /**
   * Validate payment amount from ITN
   */
  validateAmount(itnAmount: string, expectedAmount: number): boolean {
    const receivedAmount = parseFloat(itnAmount);
    return Math.abs(receivedAmount - expectedAmount) < 0.01; // Allow 1 cent tolerance
  }
}

// Utility functions for easy integration
export const formatAmountForPayFast = (amount: number): string => {
  return amount.toFixed(2);
};

export const generatePaymentId = (prefix = 'ORDER'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Payment status constants
export const PAYFAST_STATUS = {
  COMPLETE: 'COMPLETE',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED'
} as const;

export type PayFastStatus = typeof PAYFAST_STATUS[keyof typeof PAYFAST_STATUS];
