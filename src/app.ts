import { MongoClient } from 'mongodb';

async function main() {
	const dbName = process.argv[2];
	const desiredText = process.argv[3].toLowerCase();
	const client = await new MongoClient('mongodb://localhost:27017').connect();
	try {
		const db = client.db(dbName);
		const collections = await db.collections();
		for (const collectionInfo of collections) {
			const collection = db.collection(collectionInfo.collectionName);
			for (
				const documents = collection.find({});
				await documents.hasNext();
			) {
				const document = await documents.next();
				const text = JSON.stringify(document).toLowerCase();
				if (text.includes(desiredText)) {
					console.log(`Found in ${collectionInfo.collectionName}`);
					console.log(document);
				}
			}
		}
	} finally {
		await client.close();
	}
}

main();