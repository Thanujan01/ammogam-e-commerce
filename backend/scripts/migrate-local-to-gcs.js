require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const mongoose = require('mongoose');
const Image = require('../src/models/Product'); // optional update logic if you store image paths in product docs

async function main(){
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) { console.log('No uploads directory'); return; }

  if (!process.env.GCS_BUCKET || !process.env.GCS_KEY_FILE || !process.env.GCS_PROJECT_ID) {
    console.error('GCS env vars missing');
    process.exit(1);
  }
  const storage = new Storage({ keyFilename: process.env.GCS_KEY_FILE, projectId: process.env.GCS_PROJECT_ID });
  const bucket = storage.bucket(process.env.GCS_BUCKET);

  const files = fs.readdirSync(uploadsDir);
  for (const f of files) {
    const localPath = path.join(uploadsDir, f);
    const dest = `uploads/${f}`;
    await bucket.upload(localPath, { destination: dest });
    console.log('Uploaded', f);
    // optionally update DB records here by searching for `/uploads/${f}` occurrences
    // fs.unlinkSync(localPath);
  }
  console.log('Migration complete');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
