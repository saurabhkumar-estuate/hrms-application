package com.hrms.util;

import com.hrms.model.Employee;
import com.hrms.model.Payroll;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Locale;

@Component
public class PayslipPdfGenerator {

    private static final BaseColor PRIMARY_COLOR = new BaseColor(37, 99, 235);
    private static final BaseColor HEADER_BG = new BaseColor(30, 41, 59);
    private static final BaseColor ROW_BG = new BaseColor(248, 250, 252);
    private static final BaseColor WHITE = BaseColor.WHITE;

    public byte[] generatePayslip(Payroll payroll) {
        try {
            Document document = new Document(PageSize.A4, 36, 36, 54, 36);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            document.open();

            Employee employee = payroll.getEmployee();
            String monthName = Month.of(payroll.getMonth())
                    .getDisplayName(TextStyle.FULL, Locale.ENGLISH);

            // ---- Company Header ----
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[]{3f, 1f});

            PdfPCell companyCell = new PdfPCell();
            companyCell.setBorder(Rectangle.NO_BORDER);
            companyCell.setBackgroundColor(HEADER_BG);
            companyCell.setPadding(12);

            Font companyFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, WHITE);
            Font taglineFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new BaseColor(148, 163, 184));

            Paragraph companyName = new Paragraph("HRMS Company", companyFont);
            Paragraph tagline = new Paragraph("Human Resource Management System", taglineFont);
            companyCell.addElement(companyName);
            companyCell.addElement(tagline);

            PdfPCell payslipLabelCell = new PdfPCell();
            payslipLabelCell.setBorder(Rectangle.NO_BORDER);
            payslipLabelCell.setBackgroundColor(HEADER_BG);
            payslipLabelCell.setPadding(12);
            payslipLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            payslipLabelCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            Font payslipFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, WHITE);
            Font periodFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new BaseColor(148, 163, 184));

            Paragraph payslipTitle = new Paragraph("PAYSLIP", payslipFont);
            payslipTitle.setAlignment(Element.ALIGN_RIGHT);
            Paragraph period = new Paragraph(monthName + " " + payroll.getYear(), periodFont);
            period.setAlignment(Element.ALIGN_RIGHT);

            payslipLabelCell.addElement(payslipTitle);
            payslipLabelCell.addElement(period);

            headerTable.addCell(companyCell);
            headerTable.addCell(payslipLabelCell);
            document.add(headerTable);
            document.add(Chunk.NEWLINE);

            // ---- Employee Details ----
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, PRIMARY_COLOR);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new BaseColor(100, 116, 139));
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.BLACK);

            Paragraph empHeader = new Paragraph("Employee Information", sectionFont);
            document.add(empHeader);
            document.add(new LineSeparator(1f, 100f, PRIMARY_COLOR, Element.ALIGN_CENTER, -5));
            document.add(Chunk.NEWLINE);

            PdfPTable empTable = new PdfPTable(4);
            empTable.setWidthPercentage(100);
            empTable.setSpacingBefore(5);
            empTable.setSpacingAfter(10);

            addEmployeeRow(empTable, "Employee Name",
                    employee.getFirstName() + " " + employee.getLastName(),
                    "Employee Code", employee.getEmployeeCode(), labelFont, valueFont);
            addEmployeeRow(empTable, "Department", employee.getDepartment(),
                    "Designation", employee.getDesignation(), labelFont, valueFont);
            addEmployeeRow(empTable, "Email", employee.getEmail(),
                    "PAN Number", employee.getPanNumber() != null ? employee.getPanNumber() : "N/A",
                    labelFont, valueFont);
            addEmployeeRow(empTable, "Bank Account",
                    employee.getBankAccount() != null ? employee.getBankAccount() : "N/A",
                    "PF Number", employee.getPfNumber() != null ? employee.getPfNumber() : "N/A",
                    labelFont, valueFont);
            addEmployeeRow(empTable, "Pay Period", monthName + " " + payroll.getYear(),
                    "Work Location", employee.getWorkLocation() != null ? employee.getWorkLocation() : "Office",
                    labelFont, valueFont);

            document.add(empTable);

            // ---- Earnings & Deductions ----
            PdfPTable salaryTable = new PdfPTable(2);
            salaryTable.setWidthPercentage(100);
            salaryTable.setSpacingBefore(5);
            salaryTable.setSpacingAfter(10);

            // Earnings column
            PdfPCell earningsHeaderCell = new PdfPCell(new Phrase("EARNINGS", sectionFont));
            earningsHeaderCell.setBackgroundColor(new BaseColor(219, 234, 254));
            earningsHeaderCell.setPadding(6);
            earningsHeaderCell.setBorder(Rectangle.NO_BORDER);

            PdfPCell deductionsHeaderCell = new PdfPCell(new Phrase("DEDUCTIONS", sectionFont));
            deductionsHeaderCell.setBackgroundColor(new BaseColor(254, 226, 226));
            deductionsHeaderCell.setPadding(6);
            deductionsHeaderCell.setBorder(Rectangle.NO_BORDER);

            salaryTable.addCell(earningsHeaderCell);
            salaryTable.addCell(deductionsHeaderCell);

            // Earnings rows
            PdfPCell earningsCell = new PdfPCell();
            earningsCell.setBorder(Rectangle.BOX);
            earningsCell.setPadding(0);

            PdfPTable earningsInner = new PdfPTable(2);
            earningsInner.setWidthPercentage(100);
            addSalaryRow(earningsInner, "Basic Salary", formatAmount(payroll.getBasicSalary()), normalFont, valueFont, false);
            addSalaryRow(earningsInner, "HRA", formatAmount(payroll.getHra()), normalFont, valueFont, true);
            addSalaryRow(earningsInner, "Special Allowance", formatAmount(payroll.getSpecialAllowance()), normalFont, valueFont, false);
            addSalaryRow(earningsInner, "Travel Allowance", formatAmount(payroll.getTravelAllowance()), normalFont, valueFont, true);
            addSalaryRow(earningsInner, "Medical Allowance", formatAmount(payroll.getMedicalAllowance()), normalFont, valueFont, false);
            addSalaryRow(earningsInner, "Performance Bonus", formatAmount(payroll.getPerformanceBonus()), normalFont, valueFont, true);
            earningsCell.addElement(earningsInner);

            PdfPCell deductionsCell = new PdfPCell();
            deductionsCell.setBorder(Rectangle.BOX);
            deductionsCell.setPadding(0);

            PdfPTable deductionsInner = new PdfPTable(2);
            deductionsInner.setWidthPercentage(100);
            addSalaryRow(deductionsInner, "Provident Fund (PF)", formatAmount(payroll.getPf()), normalFont, valueFont, false);
            addSalaryRow(deductionsInner, "ESI", formatAmount(payroll.getEsi()), normalFont, valueFont, true);
            addSalaryRow(deductionsInner, "TDS (Income Tax)", formatAmount(payroll.getTds()), normalFont, valueFont, false);
            addSalaryRow(deductionsInner, "Professional Tax", formatAmount(payroll.getProfessionalTax()), normalFont, valueFont, true);
            deductionsCell.addElement(deductionsInner);

            salaryTable.addCell(earningsCell);
            salaryTable.addCell(deductionsCell);
            document.add(salaryTable);

            // ---- Totals ----
            PdfPTable totalsTable = new PdfPTable(4);
            totalsTable.setWidthPercentage(100);
            totalsTable.setSpacingBefore(5);
            totalsTable.setSpacingAfter(15);

            Font totalLabelFont = FontFactory.getFont(FontFactory.HELVETICA, 9, new BaseColor(71, 85, 105));
            Font totalValueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);
            Font netFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, WHITE);

            addTotalCell(totalsTable, "Gross Earnings", formatAmount(payroll.getGrossSalary()),
                    new BaseColor(219, 234, 254), totalLabelFont, totalValueFont);
            addTotalCell(totalsTable, "Total Deductions", formatAmount(payroll.getTotalDeductions()),
                    new BaseColor(254, 226, 226), totalLabelFont, totalValueFont);
            addTotalCell(totalsTable, "Days Worked", "26", new BaseColor(220, 252, 231), totalLabelFont, totalValueFont);

            PdfPCell netCell = new PdfPCell();
            netCell.setBackgroundColor(HEADER_BG);
            netCell.setPadding(10);
            netCell.setBorder(Rectangle.NO_BORDER);
            Paragraph netLabel = new Paragraph("NET SALARY", FontFactory.getFont(FontFactory.HELVETICA, 8, new BaseColor(148, 163, 184)));
            Paragraph netValue = new Paragraph("₹ " + formatAmount(payroll.getNetSalary()), netFont);
            netCell.addElement(netLabel);
            netCell.addElement(netValue);
            totalsTable.addCell(netCell);

            document.add(totalsTable);

            // ---- Footer ----
            LineSeparator separator = new LineSeparator(1f, 100f, new BaseColor(203, 213, 225), Element.ALIGN_CENTER, -5);
            document.add(separator);
            document.add(Chunk.NEWLINE);

            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA, 8, new BaseColor(148, 163, 184));
            Paragraph footer = new Paragraph(
                    "This is a computer-generated payslip and does not require a signature.\n" +
                    "For any queries, please contact HR department at hr@hrms.com",
                    footerFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate payslip PDF", e);
        }
    }

    private void addEmployeeRow(PdfPTable table, String label1, String value1,
                                 String label2, String value2,
                                 Font labelFont, Font valueFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(label1, labelFont));
        cell1.setBorder(Rectangle.NO_BORDER);
        cell1.setPadding(4);
        cell1.setBackgroundColor(ROW_BG);

        PdfPCell cell2 = new PdfPCell(new Phrase(value1 != null ? value1 : "N/A", valueFont));
        cell2.setBorder(Rectangle.NO_BORDER);
        cell2.setPadding(4);

        PdfPCell cell3 = new PdfPCell(new Phrase(label2, labelFont));
        cell3.setBorder(Rectangle.NO_BORDER);
        cell3.setPadding(4);
        cell3.setBackgroundColor(ROW_BG);

        PdfPCell cell4 = new PdfPCell(new Phrase(value2 != null ? value2 : "N/A", valueFont));
        cell4.setBorder(Rectangle.NO_BORDER);
        cell4.setPadding(4);

        table.addCell(cell1);
        table.addCell(cell2);
        table.addCell(cell3);
        table.addCell(cell4);
    }

    private void addSalaryRow(PdfPTable table, String component, String amount,
                               Font labelFont, Font valueFont, boolean shade) {
        BaseColor bg = shade ? ROW_BG : WHITE;

        PdfPCell labelCell = new PdfPCell(new Phrase(component, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        labelCell.setBackgroundColor(bg);

        PdfPCell amountCell = new PdfPCell(new Phrase("₹ " + amount, valueFont));
        amountCell.setBorder(Rectangle.NO_BORDER);
        amountCell.setPadding(5);
        amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        amountCell.setBackgroundColor(bg);

        table.addCell(labelCell);
        table.addCell(amountCell);
    }

    private void addTotalCell(PdfPTable table, String label, String value,
                               BaseColor bgColor, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bgColor);
        cell.setPadding(10);
        cell.setBorder(Rectangle.NO_BORDER);
        Paragraph lbl = new Paragraph(label, labelFont);
        Paragraph val = new Paragraph("₹ " + value, valueFont);
        cell.addElement(lbl);
        cell.addElement(val);
        table.addCell(cell);
    }

    private String formatAmount(java.math.BigDecimal amount) {
        if (amount == null) return "0.00";
        return String.format("%,.2f", amount);
    }
}
