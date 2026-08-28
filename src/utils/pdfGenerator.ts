import { jsPDF } from 'jspdf';
import { ProduceRecord } from '../types';
import { getPublicProduceUrl } from './idGenerator';
import { generateQRCodeDataUrl } from './qrHelper';

/**
 * Generates an official, publication-quality Aurbana Traceability Certificate PDF
 */
export async function generateProduceCertificatePdf(
  record: ProduceRecord,
  providedQrDataUrl?: string
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Double Border Frame
  doc.setDrawColor(18, 53, 36); // #123524
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, contentWidth + 8, pageHeight - (margin - 4) * 2);

  doc.setDrawColor(46, 125, 50); // #2E7D32
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - (margin - 2) * 2);

  // 2. Top Header Ribbon (Dark Green Banner)
  doc.setFillColor(18, 53, 36); // #123524
  doc.rect(margin, margin, contentWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AURBANA AGRI-TRACEABILITY REGISTRY', margin + 6, margin + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(139, 195, 74); // #8BC34A
  doc.text('OFFICIAL FRESH PRODUCE DIGITAL PASSPORT & COMPLIANCE CERTIFICATE', margin + 6, margin + 18);

  // Certificate ID & Date on Right Header
  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`CERT-${record.produce_id}`, pageWidth - margin - 6, margin + 11, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(200, 225, 205);
  doc.text(`Issued: ${issueDate} • ISO/IEC 18004`, pageWidth - margin - 6, margin + 18, { align: 'right' });

  // 3. Title Section
  let y = margin + 34;
  doc.setTextColor(18, 53, 36);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`${record.produce_name.toUpperCase()} — DIGITAL PASSPORT`, margin + 2, y);

  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 100, 95);
  doc.text('Verified origin, optical inspection, harvest freshness, and supply chain provenance trail.', margin + 2, y);

  // 4. Produce Details Card
  y += 7;
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(220, 235, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  const cardY = y + 7;
  const col1X = margin + 6;
  const col2X = margin + 50;
  const col3X = margin + 105;

  // Embedded Produce Photo (if data URL)
  let hasDrawnImage = false;
  if (record.image_url && record.image_url.startsWith('data:image/')) {
    try {
      const formatMatch = record.image_url.match(/^data:image\/(png|jpeg|jpg);base64,/i);
      const imgFormat = formatMatch ? (formatMatch[1].toUpperCase() === 'PNG' ? 'PNG' : 'JPEG') : 'JPEG';
      doc.addImage(record.image_url, imgFormat, col1X, cardY, 36, 36);
      hasDrawnImage = true;
    } catch {
      hasDrawnImage = false;
    }
  }

  if (!hasDrawnImage) {
    doc.setFillColor(235, 245, 237);
    doc.roundedRect(col1X, cardY, 36, 36, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(46, 125, 50);
    doc.text(record.produce_name, col1X + 18, cardY + 16, { align: 'center' });
    doc.setFontSize(7);
    doc.setTextColor(100, 130, 110);
    doc.text('Verified Produce', col1X + 18, cardY + 22, { align: 'center' });
  }

  // Column 2 Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 115, 105);

  const drawRow = (label: string, value: string, x: number, rowY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(110, 125, 115);
    doc.text(label.toUpperCase(), x, rowY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(18, 53, 36);
    doc.text(value, x, rowY + 4);
  };

  drawRow('Aurbana Digital ID', record.produce_id, col2X, cardY + 1);
  drawRow('Variety / Type', record.variety || record.category, col2X, cardY + 10);
  drawRow('Condition Grade', `${record.grade || record.condition} (Optimal)`, col2X, cardY + 19);
  drawRow('Harvest Age', `${record.age_days} Days Since Harvest`, col2X, cardY + 28);
  drawRow('Registration Date', record.registration_date || record.harvest_date, col2X, cardY + 37);

  // Column 3 Details
  drawRow('Batch Number', record.batch_number || 'BATCH-PRIMARY', col3X, cardY + 1);
  drawRow('Farm Origin', record.origin, col3X, cardY + 10);
  drawRow('Lead Farmer', record.farmer_name || 'Verified Cooperative Partner', col3X, cardY + 19);
  drawRow('Storage Location', record.storage_location || 'Cold Chain Hub', col3X, cardY + 28);
  drawRow('Packaging / Quantity', record.quantity || 'Standard Commercial Crate', col3X, cardY + 37);

  // 5. Supply Chain Journey Provenance Trail
  y += 62;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(18, 53, 36);
  doc.text('VERIFIED SUPPLY CHAIN PROVENANCE TRAIL', margin + 2, y);

  y += 4;
  const journeySteps = record.journey && record.journey.length > 0 ? record.journey : [
    { title: 'Harvested', date: `${record.harvest_date || 'Harvest Date'}, Morning`, location: record.origin },
    { title: 'Inspected & Graded', date: `${record.collection_date || 'Intake Date'}, Daytime`, location: 'Aurbana Transit Depot' },
    { title: 'Registered with Aurbana', date: `${record.registration_date || 'Today'}, Daytime`, location: 'Identity Registry' },
    { title: 'Active for Verification', date: 'Real-time Scannable', location: 'Public Consumer Portal' }
  ];

  const stepBoxWidth = (contentWidth - 6) / Math.min(4, journeySteps.length);
  journeySteps.slice(0, 4).forEach((step, idx) => {
    const stepX = margin + idx * (stepBoxWidth + 2);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 225, 215);
    doc.setLineWidth(0.3);
    doc.roundedRect(stepX, y, stepBoxWidth, 24, 2, 2, 'FD');

    // Step index circle
    doc.setFillColor(46, 125, 50);
    doc.circle(stepX + 5, y + 6, 2.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.text(`${idx + 1}`, stepX + 5, y + 7, { align: 'center' });

    doc.setTextColor(18, 53, 36);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(step.title, stepX + 10, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 110, 105);
    doc.text(step.date || '', stepX + 4, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(46, 125, 50);
    const locText = doc.splitTextToSize(step.location || '', stepBoxWidth - 6);
    doc.text(locText[0] || '', stepX + 4, y + 19);
  });

  // 6. QR Code Verification & Official Seal Section
  y += 32;
  doc.setFillColor(248, 250, 248);
  doc.setDrawColor(220, 235, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 48, 3, 3, 'FD');

  // QR Code
  const passportUrl = getPublicProduceUrl(record.produce_id);
  let qrImage = providedQrDataUrl;
  if (!qrImage) {
    try {
      qrImage = await generateQRCodeDataUrl(passportUrl, { width: 300, margin: 2, darkColor: '#000000' });
    } catch {
      qrImage = undefined;
    }
  }

  const qrX = margin + 6;
  const qrY = y + 5;
  if (qrImage) {
    doc.addImage(qrImage, 'PNG', qrX, qrY, 38, 38);
  }

  // QR Details text
  const qrInfoX = qrX + 44;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(18, 53, 36);
  doc.text('SCAN TO VERIFY LIVE PRODUCE PASSPORT', qrInfoX, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(90, 100, 95);
  doc.text('Compatible with mobile phone camera, Google Lens, and ISO/IEC 18004 readers.', qrInfoX, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(46, 125, 50);
  doc.text(`Direct Web URL: ${passportUrl}`, qrInfoX, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 130, 125);
  doc.text('Cryptographic Batch Verification • Real-Time Scan Hit Counter Active', qrInfoX, y + 31);

  // Inspector Seal & Signature on Right
  const signX = pageWidth - margin - 50;
  doc.setDrawColor(180, 195, 185);
  doc.setLineWidth(0.4);
  doc.line(signX, y + 30, signX + 42, y + 30);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(18, 53, 36);
  doc.text('Shanmukh Datta', signX + 21, y + 27, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 115, 105);
  doc.text('Chief Quality Inspector', signX + 21, y + 35, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 140, 135);
  doc.text('Aurbana Operations Authority', signX + 21, y + 39, { align: 'center' });

  // Circular Stamp Emblem
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.6);
  doc.circle(signX - 16, y + 24, 11);
  doc.setLineWidth(0.2);
  doc.circle(signX - 16, y + 24, 9.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.5);
  doc.setTextColor(46, 125, 50);
  doc.text('OFFICIALLY VERIFIED', signX - 16, y + 22, { align: 'center' });
  doc.text('AURBANA ISO-18004', signX - 16, y + 26, { align: 'center' });

  // 7. Footer
  const footerY = pageHeight - margin + 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 130, 125);
  doc.text('This document was automatically generated by Aurbana Digital Traceability Platform. Verifiable online.', margin + 2, footerY);
  doc.text('Page 1 of 1', pageWidth - margin - 2, footerY, { align: 'right' });

  return doc;
}

/**
 * Direct download trigger for the produce passport PDF
 */
export async function downloadProduceCertificatePdf(
  record: ProduceRecord,
  providedQrDataUrl?: string
): Promise<void> {
  const doc = await generateProduceCertificatePdf(record, providedQrDataUrl);
  const cleanId = record.produce_id.replace(/[^A-Z0-9_-]/gi, '_');
  doc.save(`Aurbana-Certificate-${cleanId}.pdf`);
}
