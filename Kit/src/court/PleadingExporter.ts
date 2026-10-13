import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Document, Paragraph, TextRun, Packer, PageNumber, AlignmentType, convertInchesToTwip, Header, Footer } from 'docx';

/**
 * Strips the FreeLawGen.v1 YAML Bird Cage from the document.
 */
function stripYaml(mdText: string): string {
    const match = mdText.match(/^(?:---[\s\S]*?---\n)(.*)$/s);
    return match ? match[1].trim() : mdText.trim();
}

function blockLines(block: string): string[] {
    return block.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

function lineRuns(block: string, bold = false): TextRun[] {
    return block.split('\n').map((line, index) =>
        new TextRun({
            text: line,
            bold,
            font: "Times New Roman",
            size: 24,
            break: index > 0 ? 1 : 0
        })
    );
}

const COURT_CAPTION_LINES = new Set([
    "UNITED STATES DISTRICT COURT",
    "DISTRICT OF OREGON",
    "PORTLAND DIVISION",
    "EUGENE DIVISION",
]);

function isCourtCaption(block: string): boolean {
    const lines = blockLines(block);
    return lines.length > 0 && lines.every(line => COURT_CAPTION_LINES.has(line));
}

function isPartyCaption(block: string): boolean {
    const lines = blockLines(block);
    if (lines.length === 0 || lines.length > 4) return false;
    return lines.every(line =>
        line === "v." ||
        line === "Plaintiff," ||
        line === "Defendant." ||
        line === "Defendants." ||
        (line === line.toUpperCase() && line.endsWith(","))
    );
}

function isJuryDemand(block: string): boolean {
    const lines = blockLines(block);
    if (lines.length === 0 || lines.length > 3) return false;
    return lines.every(line =>
        line === "DEMAND FOR JURY TRIAL" ||
        line === "Jury Trial Demanded" ||
        (line === line.toUpperCase() && line.endsWith("COMPLAINT"))
    );
}

/**
 * Parses FreeLawGen Markdown and generates a US District Court compliant PDF pleading.
 * 
 * Features:
 * - 1-inch margins
 * - Left margin 1-28 line numbers
 * - 12pt Times New Roman
 * - 1.5 spacing for captions and address blocks
 * - 2.0 (Double) spacing for body paragraphs
 * - Forces page breaks on CERTIFICATE OF SERVICE
 */
export async function exportToPleadingPdf(mdPath: string, outPdfPath: string) {
    const mdText = fs.readFileSync(mdPath, 'utf8');
    const bodyText = stripYaml(mdText);
    const footerTitle = bodyText.match(/^#[ \t]+(.+?)[ \t]*\r?$/m)?.[1].trim() ?? "COURT DOCUMENT";

    // Split document into blocks by double newlines
    const blocks = bodyText.split(/\n{2,}/).map(b => b.trim()).filter(b => b);

    const children: Paragraph[] = [];

    for (const block of blocks) {
        // Headers
        if (block.startsWith('#')) {
            const cleanHeader = block.replace(/^#+\s*/, '');
            children.push(
                new Paragraph({
                    children: [new TextRun({ text: cleanHeader, bold: true, font: "Times New Roman", size: 24 })],
                    alignment: AlignmentType.CENTER,
                    spacing: { line: 360 } // 1.5 space
                })
            );
        } 
        // Address Block at the top & Signature Blocks (1.5 Spacing)
        else if (
            /self-represented/i.test(block) ||
            block.startsWith("Respectfully submitted,") ||
            (block.includes("Mailing address:") && block.includes("City, state, ZIP:"))
        ) {
            children.push(
                new Paragraph({
                    children: lineRuns(block),
                    spacing: { line: 360, lineRule: "exact" }, // 1.5 spacing
                    keepLines: true // keep block on same page
                })
            );
        }
        // Caption Blocks (1.5 Spacing & Centered)
        else if (
            isCourtCaption(block) ||
            (block.includes("v.") && block.trim() === "v.") ||
            isPartyCaption(block) ||
            (blockLines(block).length <= 2 && block.includes("Case No."))
        ) {
            children.push(
                new Paragraph({
                    children: lineRuns(block),
                    alignment: AlignmentType.CENTER,
                    spacing: { line: 360, lineRule: "exact" }, // 1.5 Spacing
                    keepLines: true
                })
            );
        }
        // Jury Demand
        else if (isJuryDemand(block)) {
            children.push(
                new Paragraph({
                    children: lineRuns(block, true),
                    alignment: AlignmentType.CENTER,
                    spacing: { line: 360 } // 1.5 space
                })
            );
        } 
        // Page Break sections (Certificate of Service / Notice of Filing)
        else if (
            block === "CERTIFICATE OF SERVICE" ||
            block === "NOTICE OF FILING" ||
            block.startsWith("CERTIFICATE OF SERVICE\n") ||
            block.startsWith("NOTICE OF FILING\n")
        ) {
             children.push(
                new Paragraph({
                    children: lineRuns(block, true),
                    alignment: AlignmentType.CENTER,
                    spacing: { line: 360 },
                    pageBreakBefore: true
                })
            );
        } 
        // Standard Numbered or Text Paragraphs
        else {
            const isNumbered = /^\d+\./.test(block);
            children.push(
                new Paragraph({
                    children: lineRuns(block),
                    spacing: { line: 480 }, // Double space
                    indent: isNumbered ? { firstLine: convertInchesToTwip(0.5) } : undefined
                })
            );
        }
    }

    const doc = new Document({
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: convertInchesToTwip(1),
                        bottom: convertInchesToTwip(1),
                        left: convertInchesToTwip(1),
                        right: convertInchesToTwip(1)
                    }
                },
                lineNumbers: {
                    countBy: 1,
                    restart: "newPage",
                    start: 1
                }
            },
            footers: {
                default: new Footer({
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({ text: `${footerTitle} — Page `, font: "Times New Roman", size: 24 }),
                                new TextRun({ children: [PageNumber.CURRENT], font: "Times New Roman", size: 24 })
                            ]
                        })
                    ]
                })
            },
            children: children
        }]
    });

    // Write temporary docx
    const tempDocxPath = outPdfPath.replace('.pdf', '.docx');
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(tempDocxPath, buffer);
    console.log(`Saved temporary DOCX: ${tempDocxPath}`);
    
    // Convert to PDF via LibreOffice
    const outDir = path.dirname(outPdfPath);
    console.log("Converting to PDF via LibreOffice...");
    try {
        execSync(`libreoffice --headless --convert-to pdf "${tempDocxPath}" --outdir "${outDir}"`);
    } finally {
        // The DOCX is a scratch intermediate, never a deliverable. Remove it whether
        // the conversion succeeded or failed so no orphan .docx lands beside the PDF.
        try { if (fs.existsSync(tempDocxPath)) fs.unlinkSync(tempDocxPath); } catch { /* best-effort */ }
    }
    if (!fs.existsSync(outPdfPath)) {
        // execSync would have thrown on a non-zero exit, but LibreOffice can return 0
        // without writing. Fail loudly instead of reporting success on a missing PDF.
        throw new Error(`LibreOffice did not produce ${outPdfPath}`);
    }
    console.log(`Created PDF: ${outPdfPath}`);
}
