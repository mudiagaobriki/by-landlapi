const mailjet = require('node-mailjet');
const fs = require('fs');
const path = require('path');

// // Initialize Mailjet client
// const mailjetClient = mailjet.apiConnect(
//     process.env.MAILJET_API_KEY,
//     process.env.MAILJET_SECRET_KEY
// );

// Initialize Mailjet client with the corrected syntax
const mailjetClient = new mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY
});

// Email templates
const emailTemplates = {
    // Receipt email template
    receipt: (transaction, land, buyer, seller, agent, receiptNumber) => ({
        subject: `Land Transaction Receipt - ${receiptNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Transaction Receipt</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header h2 { margin: 10px 0 0 0; font-size: 18px; font-weight: normal; opacity: 0.9; }
          .content { padding: 30px; }
          .receipt-info { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; margin: 25px 0; border-radius: 10px; border-left: 5px solid #2c5530; }
          .receipt-info h3 { margin: 0 0 15px 0; color: #2c5530; font-size: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
          .info-item { padding: 10px 0; }
          .info-label { font-weight: bold; color: #555; }
          .info-value { color: #333; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 25px 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          th, td { padding: 15px; text-align: left; border-bottom: 1px solid #eee; }
          th { background: linear-gradient(135deg, #f8f9fa, #e9ecef); color: #2c5530; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { font-size: 15px; }
          .amount { font-weight: bold; font-size: 18px; color: #2c5530; }
          .total-row { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; }
          .total-row td { border-bottom: none; font-weight: bold; font-size: 16px; }
          .footer { background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #eee; }
          .footer p { margin: 5px 0; }
          .footer .main-text { font-weight: bold; color: #2c5530; }
          .footer .sub-text { font-size: 14px; color: #666; }
          .status-badge { display: inline-block; padding: 8px 15px; border-radius: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
          .status-completed { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          @media (max-width: 600px) {
            .info-grid { grid-template-columns: 1fr; }
            .container { margin: 0; }
            th, td { padding: 10px; font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>BAYELSA STATE LAND MANAGEMENT SYSTEM</h1>
            <h2>OFFICIAL TRANSACTION RECEIPT</h2>
          </div>
          
          <div class="content">
            <div class="receipt-info">
              <h3>Receipt Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Receipt Number:</div>
                  <div class="info-value">${receiptNumber}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Transaction ID:</div>
                  <div class="info-value">${transaction.transactionId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Date Issued:</div>
                  <div class="info-value">${new Date().toLocaleDateString('en-NG', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Transaction Type:</div>
                  <div class="info-value">Land ${transaction.transactionType.toUpperCase()}</div>
                </div>
              </div>
              <div style="margin-top: 15px;">
                <span class="status-badge status-${transaction.status === 'completed' ? 'completed' : 'pending'}">
                  ${transaction.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            
            <h3 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">Land Details</h3>
            <table>
              <tr><th>Land ID</th><td>${land.landId}</td></tr>
              <tr><th>Property Title</th><td>${land.title}</td></tr>
              <tr><th>Location</th><td>${land.location.address}, ${land.location.ward}, ${land.location.lga} LGA</td></tr>
              <tr><th>Area</th><td>${land.area.toLocaleString()} square meters</td></tr>
              <tr><th>Land Use</th><td>${land.landUse.charAt(0).toUpperCase() + land.landUse.slice(1)}</td></tr>
              <tr><th>Certificate of Occupancy</th><td>${land.cOfO.number || 'Not Available'}</td></tr>
            </table>
            
            <h3 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">Transaction Parties</h3>
            <table>
              <tr><th>Buyer</th><td>${buyer.firstName} ${buyer.lastName}<br><small>${buyer.email}</small></td></tr>
              <tr><th>Seller</th><td>${seller.firstName} ${seller.lastName}<br><small>${seller.email}</small></td></tr>
              ${agent ? `<tr><th>Real Estate Agent</th><td>${agent.firstName} ${agent.lastName}<br><small>${agent.agencyName}</small></td></tr>` : ''}
              ${transaction.paymentReference ? `<tr><th>Payment Reference</th><td>${transaction.paymentReference}</td></tr>` : ''}
            </table>
            
            <h3 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">Financial Breakdown</h3>
            <table>
              <tr><th>Property Sale Amount</th><td class="amount">₦${transaction.amount.toLocaleString()}</td></tr>
              ${agent ? `<tr><th>Agency Commission (10%)</th><td>₦${transaction.agencyFee.toLocaleString()}</td></tr>` : ''}
              <tr><th>Government Revenue (5%)</th><td>₦${transaction.governmentRevenue.toLocaleString()}</td></tr>
              <tr><th>Platform Processing Fee (1%)</th><td>₦${transaction.platformFee.toLocaleString()}</td></tr>
              <tr class="total-row">
                <td>TOTAL TRANSACTION VALUE</td>
                <td class="amount">₦${(transaction.amount + (transaction.agencyFee || 0) + transaction.governmentRevenue + transaction.platformFee).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div class="footer">
            <p class="main-text">This is an official receipt from the Bayelsa State Land Management System</p>
            <p class="sub-text">Digitally generated and electronically signed</p>
            <p class="sub-text">For inquiries: info@bayelsalands.gov.ng | +234-XXX-XXXX-XXX</p>
            <p class="sub-text">Generated on ${new Date().toLocaleString('en-NG')}</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Certificate of Occupancy notification
    certificateIssued: (owner, land, cOfONumber) => ({
        subject: `Certificate of Occupancy Issued - ${cOfONumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .certificate-info { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 20px; margin: 20px 0; border-radius: 10px; border-left: 5px solid #2c5530; }
          .highlight { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Certificate of Occupancy Issued</h1>
          </div>
          <div class="content">
            <p>Dear ${owner.firstName} ${owner.lastName},</p>
            <p>Congratulations! Your Certificate of Occupancy has been successfully issued for your land property.</p>
            
            <div class="certificate-info">
              <h3>Certificate Details</h3>
              <p><strong>C of O Number:</strong> ${cOfONumber}</p>
              <p><strong>Land ID:</strong> ${land.landId}</p>
              <p><strong>Property Title:</strong> ${land.title}</p>
              <p><strong>Location:</strong> ${land.location.address}, ${land.location.ward}, ${land.location.lga}</p>
              <p><strong>Area:</strong> ${land.area.toLocaleString()} square meters</p>
              <p><strong>Land Use:</strong> ${land.landUse}</p>
              <p><strong>Issue Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Valid Until:</strong> ${new Date(Date.now() + 99 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>

            <div class="highlight">
              <h4>Important Information:</h4>
              <p><strong>Annual Tax:</strong> ₦${(land.area * 100).toLocaleString()}</p>
              <p><strong>Annual Ground Rent:</strong> ₦10,000</p>
            </div>

            <p>Please log in to the platform to download your official certificate. Keep this information safe for your records.</p>
            <p>Thank you for using the Bayelsa State Land Management System.</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Tax reminder template
    taxReminder: (owner, land, yearsOwed, totalOwed) => ({
        subject: `Tax Payment Reminder - ${land.landId}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background-color: #d32f2f; color: white; padding: 20px; text-align: center; }
          .content { padding: 25px; }
          .warning { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #ffc107; }
          .amount-due { background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #dc3545; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Tax Payment Reminder</h2>
          </div>
          <div class="content">
            <p>Dear ${owner.firstName} ${owner.lastName},</p>
            <p>This is a reminder that you have outstanding tax payments for your land property:</p>
            
            <div class="warning">
              <h3>Property Details</h3>
              <p><strong>Land ID:</strong> ${land.landId}</p>
              <p><strong>Title:</strong> ${land.title}</p>
              <p><strong>Location:</strong> ${land.location.address}</p>
              <p><strong>C of O Number:</strong> ${land.cOfO.number || 'Not Available'}</p>
            </div>

            <div class="amount-due">
              <h3>Outstanding Payments</h3>
              <p><strong>Annual Tax:</strong> ₦${land.taxInfo.annualTax.toLocaleString()}</p>
              <p><strong>Ground Rent:</strong> ₦${land.taxInfo.groundRent.toLocaleString()}</p>
              <p><strong>Years Owed:</strong> ${yearsOwed}</p>
              <p><strong>Total Amount Due:</strong> ₦${totalOwed.toLocaleString()}</p>
            </div>

            <p>Please log in to the platform to make your payment or contact our office for assistance.</p>
            <p><strong>Warning:</strong> Failure to pay may result in penalties or legal action.</p>
            
            <div class="footer" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p><strong>Contact Information:</strong></p>
              <p>Email: tax@bayelsalands.gov.ng</p>
              <p>Phone: +234-XXX-XXXX-XXX</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Agent notification template
    agentNotification: (agent, land, salePrice) => ({
        subject: 'New Property Listing Assignment',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .property-info { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; }
          .commission { background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Property Assignment</h2>
          </div>
          <div class="content">
            <p>Dear ${agent.firstName} ${agent.lastName},</p>
            <p>You have been assigned to handle the sale of the following property:</p>
            
            <div class="property-info">
              <h3>Property Details</h3>
              <p><strong>Land ID:</strong> ${land.landId}</p>
              <p><strong>Title:</strong> ${land.title}</p>
              <p><strong>Location:</strong> ${land.location.address}</p>
              <p><strong>Area:</strong> ${land.area.toLocaleString()} sq. meters</p>
              <p><strong>Sale Price:</strong> ₦${salePrice.toLocaleString()}</p>
            </div>

            <div class="commission">
              <h4>Your Commission</h4>
              <p><strong>Commission Rate:</strong> 10%</p>
              <p><strong>Expected Commission:</strong> ₦${(salePrice * 0.10).toLocaleString()}</p>
            </div>

            <p>Please log in to the platform to view full details and start marketing this property.</p>
            <p>Best regards,<br>Bayelsa Land Management System</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Verification completion notification
    verificationComplete: (requester, verification) => ({
        subject: `Land Verification Completed - ${verification.metadata.referenceNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .verification-info { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; }
          .status-badge { display: inline-block; padding: 8px 15px; border-radius: 25px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .status-verified { background: #d4edda; color: #155724; }
          .status-caution { background: #fff3cd; color: #856404; }
          .status-failed { background: #f8d7da; color: #721c24; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Land Verification Completed</h2>
          </div>
          <div class="content">
            <p>Dear ${requester.firstName} ${requester.lastName},</p>
            <p>Your land verification request has been completed. Here are the results:</p>
            
            <div class="verification-info">
              <h3>Verification Details</h3>
              <p><strong>Reference Number:</strong> ${verification.metadata.referenceNumber}</p>
              <p><strong>Land ID:</strong> ${verification.landId}</p>
              <p><strong>Verification Type:</strong> ${verification.requestType.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Purpose:</strong> ${verification.purpose}</p>
              <p><strong>Completed On:</strong> ${new Date(verification.completedAt).toLocaleDateString()}</p>
              <br>
              <p><strong>Overall Status:</strong> 
                <span class="status-badge status-${verification.results.overallStatus === 'verified' ? 'verified' : verification.results.overallStatus === 'verified_with_caution' ? 'caution' : 'failed'}">
                  ${verification.results.overallStatus.replace('_', ' ').toUpperCase()}
                </span>
              </p>
              <p><strong>Confidence Level:</strong> ${verification.results.confidenceLevel.toUpperCase()}</p>
              <p><strong>Verification Score:</strong> ${verification.results.verificationScore}/100</p>
            </div>

            ${verification.results.recommendations && verification.results.recommendations.length > 0 ? `
            <div class="verification-info">
              <h4>Recommendations:</h4>
              <ul>
                ${verification.results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            <p>Please log in to the platform to download your complete verification report.</p>
            <p>Thank you for using the Bayelsa State Land Management System.</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Incident update notification
    incidentUpdate: (user, incident) => ({
        subject: `Incident Update - ${incident.metadata.incidentNumber}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .incident-info { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; }
          .status-badge { display: inline-block; padding: 8px 15px; border-radius: 25px; font-size: 12px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Incident Status Update</h2>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>There has been an update to your incident report:</p>
            
            <div class="incident-info">
              <h3>Incident Details</h3>
              <p><strong>Incident Number:</strong> ${incident.metadata.incidentNumber}</p>
              <p><strong>Type:</strong> ${incident.incidentType.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Title:</strong> ${incident.title}</p>
              <p><strong>Current Status:</strong> 
                <span class="status-badge">${incident.status.replace('_', ' ').toUpperCase()}</span>
              </p>
              <p><strong>Priority:</strong> ${incident.priority.toUpperCase()}</p>
            </div>

            <p>Please log in to the platform to view the complete details and any updates.</p>
            <p>We appreciate your patience as we work to resolve this matter.</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Welcome email template
    welcome: (user) => ({
        subject: 'Welcome to Bayelsa Land Management System',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .feature-box { background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2c5530; }
          .cta-button { display: inline-block; padding: 12px 24px; background: #2c5530; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Bayelsa Land Management System</h1>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Welcome to the Bayelsa State Land Management System! Your account has been successfully created.</p>
            
            <div class="feature-box">
              <h3>Account Information</h3>
              <p><strong>User ID:</strong> ${user.userId}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Role:</strong> ${user.role.toUpperCase()}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3>What you can do:</h3>
            <div class="feature-box">
              <h4>🏡 Manage Properties</h4>
              <p>Register, update, and track your land properties with digital certificates.</p>
            </div>
            
            <div class="feature-box">
              <h4>💼 Secure Transactions</h4>
              <p>Conduct verified land transactions with built-in fraud protection.</p>
            </div>
            
            <div class="feature-box">
              <h4>📋 Tax Management</h4>
              <p>Keep track of tax obligations and make payments easily online.</p>
            </div>
            
            <div class="feature-box">
              <h4>🔍 Land Verification</h4>
              <p>Request professional verification services for due diligence.</p>
            </div>

            <p>To get started, please verify your email address and complete your profile setup.</p>
            <a href="${process.env.FRONTEND_URL}/login" class="cta-button">Login to Your Account</a>
            
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
            <p>Thank you for choosing Bayelsa Land Management System!</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Password reset email
    passwordReset: (user, resetToken) => ({
        subject: 'Password Reset Request - Bayelsa Land Management System',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .reset-box { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center; }
          .reset-button { display: inline-block; padding: 15px 30px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .warning { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 5px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Password Reset Request</h2>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>We received a request to reset your password for your Bayelsa Land Management System account.</p>
            
            <div class="reset-box">
              <h3>Reset Your Password</h3>
              <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
              <a href="${process.env.FRONTEND_URL}/reset-password?token=${resetToken}" class="reset-button">Reset Password</a>
            </div>

            <div class="warning">
              <h4>Security Notice</h4>
              <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>For security reasons, this link will expire in 1 hour.</p>
            </div>

            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 14px;">${process.env.FRONTEND_URL}/reset-password?token=${resetToken}</p>
            
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // Account verification email
    accountVerification: (user, verificationToken) => ({
        subject: 'Verify Your Account - Bayelsa Land Management System',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .verification-box { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: center; }
          .verify-button { display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .info-box { background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 5px solid #17a2b8; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Verify Your Email Address</h2>
          </div>
          <div class="content">
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Thank you for registering with the Bayelsa Land Management System! To complete your account setup, please verify your email address.</p>
            
            <div class="verification-box">
              <h3>Verify Your Account</h3>
              <p>Click the button below to verify your email address and activate your account.</p>
              <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" class="verify-button">Verify Email Address</a>
            </div>

            <div class="info-box">
              <h4>Account Information</h4>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>Role:</strong> ${user.role.toUpperCase()}</p>
              <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <p>If you're having trouble with the button above, copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 14px;">${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}</p>
            
            <p>If you did not create this account, please ignore this email.</p>
            <p>Welcome to the future of land management in Bayelsa State!</p>
          </div>
        </div>
      </body>
      </html>
    `
    }),

    // General notification template
    general: (subject, message, recipient = 'User') => ({
        subject: subject,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #2c5530, #4a7c59); color: white; padding: 25px; text-align: center; }
          .content { padding: 25px; }
          .message { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; border-left: 5px solid #2c5530; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Bayelsa Land Management System</h2>
            <h3>${subject}</h3>
          </div>
          <div class="content">
            <p>Dear ${recipient},</p>
            <div class="message">
              ${message}
            </div>
          </div>
          <div class="footer">
            <p>This is an automated notification from Bayelsa Land Management System</p>
            <p>For support: info@bayelsalands.gov.ng | +234-XXX-XXXX-XXX</p>
          </div>
        </div>
      </body>
      </html>
    `
    })
};

// Main email sending service
const sendEmail = async (to, templateName, templateData = {}, attachments = null) => {
    try {
        if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_SECRET_KEY) {
            throw new Error('Mailjet credentials not configured');
        }

        let emailContent;

        if (emailTemplates[templateName]) {
            emailContent = emailTemplates[templateName](...Object.values(templateData));
        } else {
            throw new Error(`Template ${templateName} not found`);
        }

        const emailData = {
            Messages: [{
                From: {
                    Email: process.env.FROM_EMAIL || 'noreply@bayelsalands.gov.ng',
                    Name: process.env.FROM_NAME || 'Bayelsa Land Management System'
                },
                To: [{
                    Email: to,
                    Name: to.split('@')[0]
                }],
                Subject: emailContent.subject,
                HTMLPart: emailContent.html
            }]
        };

        // Add attachments if provided
        if (attachments && attachments.length > 0) {
            emailData.Messages[0].Attachments = attachments.map(attachment => {
                if (typeof attachment === 'string') {
                    // If attachment is a file path
                    const filePath = path.isAbsolute(attachment) ? attachment : path.join('uploads', attachment);
                    if (fs.existsSync(filePath)) {
                        const fileContent = fs.readFileSync(filePath);
                        return {
                            ContentType: getContentType(filePath),
                            Filename: path.basename(filePath),
                            Base64Content: fileContent.toString('base64')
                        };
                    }
                } else if (attachment.content && attachment.filename) {
                    // If attachment is an object with content and filename
                    return {
                        ContentType: attachment.contentType || 'application/octet-stream',
                        Filename: attachment.filename,
                        Base64Content: attachment.content
                    };
                }
                return null;
            }).filter(Boolean);
        }

        const result = await mailjetClient.post('send', { version: 'v3.1' }).request(emailData);

        return {
            success: true,
            messageId: result.body.Messages[0].To[0].MessageID,
            status: result.body.Messages[0].Status
        };

    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Bulk email sending service
const sendBulkEmail = async (recipients, templateName, templateData = {}) => {
    try {
        const results = await Promise.allSettled(
            recipients.map(recipient => sendEmail(recipient, templateName, templateData))
        );

        const successful = results.filter(result => result.status === 'fulfilled' && result.value.success).length;
        const failed = results.filter(result => result.status === 'rejected' || !result.value.success).length;

        return {
            total: recipients.length,
            successful,
            failed,
            results: results
        };
    } catch (error) {
        console.error('Bulk email error:', error);
        throw error;
    }
};

// Email queue for better performance (simple implementation)
const emailQueue = [];
let isProcessingQueue = false;

const addToQueue = (emailData) => {
    emailQueue.push(emailData);
    processQueue();
};

const processQueue = async () => {
    if (isProcessingQueue || emailQueue.length === 0) return;

    isProcessingQueue = true;

    while (emailQueue.length > 0) {
        const emailData = emailQueue.shift();
        try {
            await sendEmail(emailData.to, emailData.templateName, emailData.templateData, emailData.attachments);
            console.log(`Email sent successfully to ${emailData.to}`);
        } catch (error) {
            console.error(`Failed to send email to ${emailData.to}:`, error);
        }

        // Small delay to avoid overwhelming the email service
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    isProcessingQueue = false;
};

// Helper function to get content type
const getContentType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const contentTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.txt': 'text/plain',
        '.gif': 'image/gif',
        '.bmp': 'image/bmp',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel'
    };
    return contentTypes[ext] || 'application/octet-stream';
};

// Email validation helper
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Email service object with all methods
const emailService = {
    // Send transaction receipt
    sendReceipt: (to, transaction, land, buyer, seller, agent, receiptNumber, pdfPath = null) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        const attachments = pdfPath ? [pdfPath] : null;
        return sendEmail(to, 'receipt', { transaction, land, buyer, seller, agent, receiptNumber }, attachments);
    },

    // Send C of O notification
    sendCertificateNotification: (to, owner, land, cOfONumber) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'certificateIssued', { owner, land, cOfONumber });
    },

    // Send tax reminder
    sendTaxReminder: (to, owner, land, yearsOwed, totalOwed) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'taxReminder', { owner, land, yearsOwed, totalOwed });
    },

    // Send agent notification
    sendAgentNotification: (to, agent, land, salePrice) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'agentNotification', { agent, land, salePrice });
    },

    // Send verification completion notification
    sendVerificationComplete: (to, requester, verification) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'verificationComplete', { requester, verification });
    },

    // Send incident update
    sendIncidentUpdate: (to, user, incident) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'incidentUpdate', { user, incident });
    },

    // Send welcome email
    sendWelcomeEmail: (to, user) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'welcome', { user });
    },

    // Send password reset
    sendPasswordReset: (to, user, resetToken) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'passwordReset', { user, resetToken });
    },

    // Send account verification
    sendAccountVerification: (to, user, verificationToken) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'accountVerification', { user, verificationToken });
    },

    // Send general notification
    sendNotification: (to, subject, message, recipient = 'User') => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        return sendEmail(to, 'general', { subject, message, recipient });
    },

    // Send bulk notifications
    sendBulkNotifications: (recipients, subject, message) => {
        const validEmails = recipients.filter(email => validateEmail(email));
        if (validEmails.length === 0) {
            throw new Error('No valid email addresses provided');
        }
        return sendBulkEmail(validEmails, 'general', { subject, message, recipient: 'User' });
    },

    // Queue email for later processing
    queueEmail: (to, templateName, templateData = {}, attachments = null) => {
        if (!validateEmail(to)) {
            throw new Error('Invalid email address');
        }
        addToQueue({ to, templateName, templateData, attachments });
    },

    // Get queue status
    getQueueStatus: () => ({
        queueLength: emailQueue.length,
        isProcessing: isProcessingQueue
    }),

    // Test email configuration
    testEmailConfig: async () => {
        try {
            const testResult = await sendEmail(
                process.env.TEST_EMAIL || 'test@bayelsalands.gov.ng',
                'general',
                {
                    subject: 'Email Configuration Test',
                    message: 'This is a test email to verify the email service configuration.',
                    recipient: 'Administrator'
                }
            );
            return testResult;
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

module.exports = emailService;