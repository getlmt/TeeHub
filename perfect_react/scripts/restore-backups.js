import { promises as fs } from 'fs';
import path from 'path';

const BACKUP_ROOT = path.resolve('comment_backups', 'src');
const SRC_ROOT = path.resolve('src');

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(res));
    else files.push(res);
  }
  return files;
}

async function main() {
  try {
    const backupFiles = await walk(BACKUP_ROOT);
    let restored = 0;
    for (const b of backupFiles) {
      const rel = path.relative(BACKUP_ROOT, b);
      const dest = path.join(SRC_ROOT, rel);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(b, dest);
      restored++;
      console.log('Restored', rel);
    }
    console.log(`Done. Restored ${restored} files from backups.`);
  } catch (err) {
    console.error('Restore failed:', err);
    process.exit(1);
  }
}

main();
