import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { LeadQuoteData, LeadRecord, QuoteLine } from "./api";

function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function computeTotals(quote: LeadQuoteData): {
  subtotal: number;
  tax: number;
  discount: number;
  grand: number;
} {
  const subtotal = quote.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const discount = Math.min(quote.discountAmount ?? 0, subtotal);
  const afterDiscount = Math.max(0, subtotal - discount);
  const taxPct = quote.taxPercent ?? 0;
  const tax = afterDiscount * (taxPct / 100);
  const grand = afterDiscount + tax;
  return { subtotal, tax, discount, grand };
}

/** Branded quotation PDF — EnergyMart.pk CRM layout (no template file exists in legacy enerymart.pk repo). */
const COMPANY = {
  name: "EnergyMart.pk",
  tagline: "Solar & renewable energy solutions",
  address: "Pakistan",
  web: "www.energymart.pk",
};

export function downloadLeadQuotePdf(opts: {
  lead: LeadRecord;
  quote: LeadQuoteData;
  preparedByName?: string;
}): void {
  const { lead, quote, preparedByName } = opts;
  const { subtotal, tax, discount, grand } = computeTotals(quote);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentW = pageW - margin * 2;

  const orange: [number, number, number] = [249, 115, 22];
  const slate: [number, number, number] = [15, 23, 42];

  doc.setFillColor(...orange);
  doc.rect(0, 0, pageW, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(COMPANY.name, margin, 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(COMPANY.tagline, margin, 20);
  doc.text(`${COMPANY.address} · ${COMPANY.web}`, margin, 26);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("QUOTATION", pageW - margin, 16, { align: "right" });

  doc.setTextColor(...slate);
  let y = 40;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Reference: LEAD-${lead.id}`, margin, y);
  doc.text(`Issue date: ${new Date(lead.updatedAt).toLocaleDateString("en-PK")}`, pageW - margin, y, {
    align: "right",
  });
  y += 5;
  if (quote.validUntil) {
    doc.text(`Valid until: ${quote.validUntil}`, margin, y);
    y += 5;
  }

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Bill to", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(lead.name, margin, y);
  y += 4;
  doc.text(`Phone: ${lead.contact}`, margin, y);
  y += 4;
  doc.text(`Location: ${lead.location}`, margin, y);
  y += 4;
  doc.text(`Interest: ${lead.productInterest}`, margin, y);
  y += 8;

  const lineToRow = (l: QuoteLine, idx: number) => {
    const code =
      l.productId != null && l.productId > 0 ? `SKU-${l.productId}` : "—";
    return [
      String(idx + 1),
      code,
      l.description,
      String(l.quantity),
      formatMoney(l.unitPrice),
      formatMoney(l.quantity * l.unitPrice),
    ];
  };

  const body = quote.lines.map((l, i) => lineToRow(l, i));

  autoTable(doc, {
    startY: y,
    head: [["#", "Item ref.", "Description", "Qty", "Unit (PKR)", "Amount (PKR)"]],
    body,
    theme: "plain",
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 2,
    },
    styles: { fontSize: 8, cellPadding: 1.5, textColor: slate },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 22 },
      2: { cellWidth: contentW - 10 - 22 - 16 - 28 - 28 },
      3: { cellWidth: 16, halign: "center" },
      4: { cellWidth: 28, halign: "right" },
      5: { cellWidth: 28, halign: "right", fontStyle: "bold" },
    },
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `EnergyMart.pk · Quotation LEAD-${lead.id}`,
          pageW / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: "center" },
        );
      }
    },
  });

  const docExt = doc as jsPDF & { lastAutoTable?: { finalY: number } };
  const finalY = docExt.lastAutoTable?.finalY ?? y + 50;
  let ty = finalY + 10;

  doc.setDrawColor(226, 232, 240);
  doc.rect(pageW - margin - 72, ty - 4, 72, 32, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...slate);
  doc.text(`Subtotal`, pageW - margin - 68, ty);
  doc.text(`PKR ${formatMoney(subtotal)}`, pageW - margin - 4, ty, { align: "right" });
  ty += 5;
  if (discount > 0) {
    doc.text(`Discount`, pageW - margin - 68, ty);
    doc.text(`−PKR ${formatMoney(discount)}`, pageW - margin - 4, ty, { align: "right" });
    ty += 5;
  }
  if ((quote.taxPercent ?? 0) > 0) {
    doc.text(`Tax (${quote.taxPercent}%)`, pageW - margin - 68, ty);
    doc.text(`PKR ${formatMoney(tax)}`, pageW - margin - 4, ty, { align: "right" });
    ty += 5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Total due`, pageW - margin - 68, ty + 1);
  doc.setTextColor(234, 88, 12);
  doc.text(`PKR ${formatMoney(grand)}`, pageW - margin - 4, ty + 1, { align: "right" });
  doc.setTextColor(...slate);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  ty += 12;

  if (quote.notes?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.text("Quote notes", margin, ty);
    ty += 4;
    doc.setFont("helvetica", "normal");
    const split = doc.splitTextToSize(quote.notes, contentW);
    doc.text(split, margin, ty);
    ty += 4 + split.length * 3.8;
  }

  if (lead.notes?.trim()) {
    doc.setFont("helvetica", "bold");
    doc.text("Lead / site notes", margin, ty);
    ty += 4;
    doc.setFont("helvetica", "normal");
    const split = doc.splitTextToSize(lead.notes, contentW);
    doc.text(split, margin, ty);
    ty += 4 + split.length * 3.8;
  }

  ty += 4;
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const terms =
    "Prices are indicative and subject to site survey, stock availability, and DISCO / net-metering requirements. " +
    "Installation timelines and warranties are as per manufacturer and EnergyMart.pk policy.";
  doc.text(doc.splitTextToSize(terms, contentW), margin, ty);
  ty += 12;

  doc.text(
    preparedByName
      ? `Prepared by: ${preparedByName} · ${COMPANY.name}`
      : `Prepared by: Sales · ${COMPANY.name}`,
    margin,
    Math.min(ty, 275),
  );

  doc.save(`EnergyMart-Quote-LEAD-${lead.id}.pdf`);
}
