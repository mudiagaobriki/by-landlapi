const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// PDF Generation Service
class PDFService {
    // Generate transaction receipt PDF
    static async generateReceiptPDF(transaction, land, buyer, seller, agent, receiptNumber) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4',
                    info: {
                        Title: `Transaction Receipt - ${receiptNumber}`,
                        Author: 'Bayelsa State Land Management System',
                        Subject: 'Land Transaction Receipt',
                        Keywords: 'land, transaction, receipt, bayelsa'
                    }
                });

                const filename = `receipt-${receiptNumber}.pdf`;
                const filepath = path.join('uploads', 'receipts', filename);

                // Ensure directory exists
                const dir = path.dirname(filepath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                doc.pipe(fs.createWriteStream(filepath));

                // Header with logo space and title
                doc.fontSize(24)
                    .fillColor('#2c5530')
                    .text('BAYELSA STATE GOVERNMENT', { align: 'center' });

                doc.fontSize(20)
                    .text('LAND MANAGEMENT SYSTEM', { align: 'center' })
                    .moveDown(0.5);

                doc.fontSize(18)
                    .fillColor('#666')
                    .text('OFFICIAL TRANSACTION RECEIPT', { align: 'center' })
                    .moveDown(1);

                // Receipt information box
                const startY = doc.y;
                doc.rect(50, startY, 495, 100)
                    .fillAndStroke('#f8f9fa', '#2c5530');

                doc.fillColor('#2c5530')
                    .fontSize(16)
                    .text('RECEIPT INFORMATION', 60, startY + 10);

                doc.fillColor('black')
                    .fontSize(12);

                // Two column layout for receipt info
                const leftCol = 60;
                const rightCol = 300;
                let currentY = startY + 35;

                doc.text(`Receipt Number: ${receiptNumber}`, leftCol, currentY);
                doc.text(`Date: ${new Date().toLocaleDateString('en-NG')}`, rightCol, currentY);

                currentY += 20;
                doc.text(`Transaction ID: ${transaction.transactionId}`, leftCol, currentY);
                doc.text(`Type: Land ${transaction.transactionType.toUpperCase()}`, rightCol, currentY);

                currentY += 20;
                doc.text(`Status: ${transaction.status.replace('_', ' ').toUpperCase()}`, leftCol, currentY);

                doc.y = startY + 110;
                doc.moveDown(1);

                // Land Details Section
                this.addSection(doc, 'LAND DETAILS');

                const landDetails = [
                    ['Land ID', land.landId],
                    ['Property Title', land.title],
                    ['Location', `${land.location.address}, ${land.location.ward}, ${land.location.lga} LGA`],
                    ['Area', `${land.area.toLocaleString()} square meters`],
                    ['Land Use', land.landUse.charAt(0).toUpperCase() + land.landUse.slice(1)],
                    ['Certificate of Occupancy', land.cOfO.number],
                    ['Coordinates', `${land.location.coordinates.latitude}, ${land.location.coordinates.longitude}`]
                ];

                this.addTable(doc, landDetails);

                // Transaction Parties Section
                this.addSection(doc, 'TRANSACTION PARTIES');

                const parties = [
                    ['Buyer', `${buyer.firstName} ${buyer.lastName}`, buyer.email],
                    ['Seller', `${seller.firstName} ${seller.lastName}`, seller.email]
                ];

                if (agent) {
                    parties.push(['Agent', `${agent.firstName} ${agent.lastName}`, `${agent.agencyName} - ${agent.email}`]);
                }

                parties.forEach(([role, name, contact]) => {
                    doc.fontSize(12)
                        .fillColor('#2c5530')
                        .text(`${role}:`, 60, doc.y);
                    doc.fillColor('black')
                        .text(`${name}`, 120, doc.y - 12);
                    doc.fontSize(10)
                        .fillColor('#666')
                        .text(contact, 120, doc.y)
                        .moveDown(0.5);
                    doc.fontSize(12).fillColor('black');
                });

                doc.moveDown(1);

                // Financial Breakdown Section
                this.addSection(doc, 'FINANCIAL BREAKDOWN');

                const financialData = [
                    ['Property Sale Amount', `₦${transaction.amount.toLocaleString()}`]
                ];

                if (agent && transaction.agencyFee > 0) {
                    financialData.push(['Agency Commission (10%)', `₦${transaction.agencyFee.toLocaleString()}`]);
                }

                financialData.push(
                    ['Government Revenue (5%)', `₦${transaction.governmentRevenue.toLocaleString()}`],
                    ['Platform Processing Fee (1%)', `₦${transaction.platformFee.toLocaleString()}`]
                );

                // Add financial table
                const tableStart = doc.y;
                const tableWidth = 495;
                const rowHeight = 25;
                let currentRow = 0;

                // Table header
                doc.rect(50, tableStart, tableWidth, rowHeight)
                    .fillAndStroke('#2c5530', '#2c5530');

                doc.fillColor('white')
                    .fontSize(12)
                    .text('DESCRIPTION', 60, tableStart + 8);
                doc.text('AMOUNT', 400, tableStart + 8);

                // Table rows
                financialData.forEach(([description, amount]) => {
                    currentRow++;
                    const rowY = tableStart + (currentRow * rowHeight);

                    doc.rect(50, rowY, tableWidth, rowHeight)
                        .stroke('#ddd');

                    doc.fillColor('black')
                        .fontSize(11)
                        .text(description, 60, rowY + 8);
                    doc.text(amount, 400, rowY + 8);
                });

                // Total row
                const totalAmount = transaction.amount + (transaction.agencyFee || 0) +
                    transaction.governmentRevenue + transaction.platformFee;

                currentRow++;
                const totalRowY = tableStart + (currentRow * rowHeight);

                doc.rect(50, totalRowY, tableWidth, rowHeight)
                    .fillAndStroke('#2c5530', '#2c5530');

                doc.fillColor('white')
                    .fontSize(14)
                    .font('Helvetica-Bold')
                    .text('TOTAL TRANSACTION VALUE', 60, totalRowY + 6);
                doc.text(`₦${totalAmount.toLocaleString()}`, 400, totalRowY + 6);

                doc.font('Helvetica').fillColor('black');
                doc.y = totalRowY + rowHeight + 20;

                // Payment Information
                if (transaction.paymentReference) {
                    doc.moveDown(1);
                    this.addSection(doc, 'PAYMENT INFORMATION');
                    doc.fontSize(11)
                        .text(`Payment Method: ${transaction.paymentMethod.replace('_', ' ').toUpperCase()}`)
                        .text(`Payment Reference: ${transaction.paymentReference}`)
                        .text(`Payment Date: ${transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString('en-NG') : 'Pending'}`);
                }

                // Footer
                doc.moveDown(2);

                // Signature section
                const signatureY = doc.y;
                doc.fontSize(10)
                    .text('Authorized Signature:', 60, signatureY);
                doc.text('Date:', 300, signatureY);

                // Draw signature lines
                doc.moveTo(60, signatureY + 30)
                    .lineTo(200, signatureY + 30)
                    .stroke();

                doc.moveTo(300, signatureY + 30)
                    .lineTo(440, signatureY + 30)
                    .stroke();

                // Official footer
                doc.y = signatureY + 50;
                doc.fontSize(8)
                    .fillColor('#666')
                    .text('This is an official receipt from the Bayelsa State Land Management System', { align: 'center' })
                    .text('Digitally generated and authenticated', { align: 'center' })
                    .text(`Generated on: ${new Date().toLocaleString('en-NG')}`, { align: 'center' })
                    .moveDown(0.5)
                    .text('For inquiries: info@bayelsalands.gov.ng | +234-XXX-XXXX-XXX', { align: 'center' })
                    .text('Plot 123, Government House Road, Yenagoa, Bayelsa State', { align: 'center' });

                doc.end();

                doc.on('end', () => {
                    resolve(filename);
                });

                doc.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Generate Certificate of Occupancy PDF
    static async generateCertificatePDF(land, owner) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4',
                    info: {
                        Title: `Certificate of Occupancy - ${land.cOfO.number}`,
                        Author: 'Bayelsa State Government',
                        Subject: 'Certificate of Occupancy',
                        Keywords: 'certificate, occupancy, land, bayelsa'
                    }
                });

                const filename = `certificate-${land.cOfO.number}.pdf`;
                const filepath = path.join('uploads', 'documents', filename);

                // Ensure directory exists
                const dir = path.dirname(filepath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                doc.pipe(fs.createWriteStream(filepath));

                // Header with coat of arms space
                doc.fontSize(20)
                    .fillColor('#2c5530')
                    .text('FEDERAL REPUBLIC OF NIGERIA', { align: 'center' });

                doc.fontSize(18)
                    .text('BAYELSA STATE GOVERNMENT', { align: 'center' })
                    .moveDown(0.5);

                doc.fontSize(24)
                    .font('Helvetica-Bold')
                    .text('CERTIFICATE OF OCCUPANCY', { align: 'center' })
                    .moveDown(1);

                doc.font('Helvetica')
                    .fontSize(14)
                    .fillColor('black');

                // Certificate details
                const certDetails = [
                    ['Certificate Number:', land.cOfO.number],
                    ['Land ID:', land.landId],
                    ['Issue Date:', new Date(land.cOfO.issueDate).toLocaleDateString('en-NG')],
                    ['Expiry Date:', new Date(land.cOfO.expiryDate).toLocaleDateString('en-NG')]
                ];

                certDetails.forEach(([label, value]) => {
                    doc.text(`${label} ${value}`, { continued: false })
                        .moveDown(0.3);
                });

                doc.moveDown(1);

                // Land and Owner Information
                doc.fontSize(16)
                    .fillColor('#2c5530')
                    .text('LAND AND OWNER INFORMATION')
                    .moveDown(0.5);

                doc.fontSize(12)
                    .fillColor('black')
                    .text(`This certifies that ${owner.firstName} ${owner.lastName}`)
                    .text(`is granted the right to occupy the following described land:`)
                    .moveDown(0.5);

                const landInfo = [
                    ['Title:', land.title],
                    ['Location:', `${land.location.address}, ${land.location.ward}, ${land.location.lga} LGA`],
                    ['Area:', `${land.area.toLocaleString()} square meters`],
                    ['Land Use:', land.landUse.charAt(0).toUpperCase() + land.landUse.slice(1)],
                    ['Coordinates:', `Latitude: ${land.location.coordinates.latitude}, Longitude: ${land.location.coordinates.longitude}`]
                ];

                landInfo.forEach(([label, value]) => {
                    doc.text(`${label} ${value}`)
                        .moveDown(0.3);
                });

                doc.moveDown(1);

                // Terms and Conditions
                doc.fontSize(14)
                    .fillColor('#2c5530')
                    .text('TERMS AND CONDITIONS')
                    .moveDown(0.5);

                const terms = [
                    '1. This certificate grants the holder the right to occupy the land for the period specified.',
                    '2. The holder shall pay annual ground rent and land tax as prescribed by law.',
                    '3. The land shall be used only for the purpose specified in this certificate.',
                    '4. Any unauthorized transfer or subdivision requires government consent.',
                    '5. Failure to comply with terms may result in revocation of this certificate.',
                    '6. This certificate is subject to all applicable laws of Bayelsa State.'
                ];

                doc.fontSize(10);
                terms.forEach(term => {
                    doc.text(term)
                        .moveDown(0.2);
                });

                // Signature section
                doc.moveDown(2);

                const signY = doc.y;
                doc.fontSize(12)
                    .text('Commissioner for Land and Housing', 60, signY)
                    .text('Date:', 350, signY);

                // Signature lines
                doc.moveTo(60, signY + 40)
                    .lineTo(250, signY + 40)
                    .stroke();

                doc.moveTo(350, signY + 40)
                    .lineTo(490, signY + 40)
                    .stroke();

                // Official seal
                doc.fontSize(10)
                    .text('OFFICIAL SEAL', 350, signY + 50, { align: 'center', width: 140 });

                doc.rect(350, signY + 65, 140, 60)
                    .stroke();

                doc.end();

                doc.on('end', () => {
                    resolve(filename);
                });

                doc.on('error', (error) => {
                    reject(error);
                });

            } catch (error) {
                reject(error);
            }
        });
    }

    // Helper method to add section headers
    static addSection(doc, title) {
        doc.moveDown(1);
        doc.fontSize(14)
            .fillColor('#2c5530')
            .text(title);

        // Underline
        const titleWidth = doc.widthOfString(title);
        doc.moveTo(60, doc.y + 2)
            .lineTo(60 + titleWidth, doc.y + 2)
            .strokeColor('#2c5530')
            .lineWidth(2)
            .stroke();

        doc.moveDown(0.8)
            .fontSize(11)
            .fillColor('black');
    }

    // Helper method to add simple tables
    static addTable(doc, data, options = {}) {
        const startY = doc.y;
        const colWidth = options.colWidth || 247;
        const rowHeight = options.rowHeight || 20;

        data.forEach(([label, value], index) => {
            const rowY = startY + (index * rowHeight);

            // Alternate row colors
            if (index % 2 === 0) {
                doc.rect(50, rowY, 495, rowHeight)
                    .fillAndStroke('#f8f9fa', '#eee');
            } else {
                doc.rect(50, rowY, 495, rowHeight)
                    .stroke('#eee');
            }

            doc.fillColor('#555')
                .fontSize(11)
                .text(label, 60, rowY + 6, { width: colWidth - 20 });

            doc.fillColor('black')
                .text(value, 60 + colWidth, rowY + 6, { width: colWidth - 20 });
        });

        doc.y = startY + (data.length * rowHeight) + 10;
    }

    // Generate tax assessment PDF
    static async generateTaxAssessmentPDF(land, owner, taxInfo) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({ margin: 50 });
                const filename = `tax-assessment-${land.landId}-${Date.now()}.pdf`;
                const filepath = path.join('uploads', 'documents', filename);

                doc.pipe(fs.createWriteStream(filepath));

                // Header
                doc.fontSize(20)
                    .text('BAYELSA STATE GOVERNMENT', { align: 'center' })
                    .fontSize(16)
                    .text('TAX ASSESSMENT NOTICE', { align: 'center' })
                    .moveDown(1);

                // Property and owner details
                doc.fontSize(12);
                const details = [
                    ['Land ID:', land.landId],
                    ['Owner:', `${owner.firstName} ${owner.lastName}`],
                    ['Property:', land.title],
                    ['Location:', `${land.location.address}, ${land.location.lga}`],
                    ['Area:', `${land.area.toLocaleString()} sq. meters`]
                ];

                this.addTable(doc, details);

                // Tax breakdown
                doc.moveDown(1);
                this.addSection(doc, 'TAX BREAKDOWN');

                const currentYear = new Date().getFullYear();
                const yearsOwed = taxInfo.yearsOwed || 1;

                const taxBreakdown = [
                    ['Annual Land Tax:', `₦${land.taxInfo.annualTax.toLocaleString()}`],
                    ['Annual Ground Rent:', `₦${land.taxInfo.groundRent.toLocaleString()}`],
                    ['Years Owed:', yearsOwed.toString()],
                    ['Total Amount Due:', `₦${taxInfo.totalOwed.toLocaleString()}`]
                ];

                this.addTable(doc, taxBreakdown);

                // Payment instructions
                doc.moveDown(1);
                doc.text('Please settle this assessment within 30 days to avoid penalties.');

                doc.end();

                doc.on('end', () => resolve(filename));
                doc.on('error', reject);

            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = PDFService;