
const { exportToPleadingPdf } = require( './dist/court/PleadingExporter.js');

async function run() {
    await exportToPleadingPdf(
        'EXAMPLE/Docs/Complaint.SecondAmendment/Complaint.2nd.12.md',
        'EXAMPLE/Docs/Complaint.SecondAmendment/Complaint.2nd.12.pdf'
    );
    console.log("Done.");
}
run().catch(console.error);
