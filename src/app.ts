import { MongoClient } from 'mongodb';

async function main() {
	const dbName = process.argv[2];
	const desiredText = process.argv[3];
	const lowerCaseDesiredText = desiredText.toLowerCase();
	const client = await new MongoClient('mongodb://localhost:27017').connect();
	try {
		const db = client.db(dbName);
		const collections = await db.collections();
		let totalFinds = 0;
		for (let i = 0; i < collections.length; i++) {
			const collectionInfo = collections[i];
			console.log('Searching collection ' + collectionInfo.collectionName + '[' + i + '/' + collections.length + ']');
			const collection = db.collection(collectionInfo.collectionName);
			for (
				const documents = collection.find({});
				await documents.hasNext();
			) {
				const document = await documents.next();
				const text = JSON.stringify(document);
				const lowerCaseText = JSON.stringify(document).toLowerCase();
				if (lowerCaseText.includes(lowerCaseDesiredText)) {
					console.log(`Found in ${collectionInfo.collectionName} [${document?._id}] ${text.slice(0, 100)}`);
					totalFinds++;
				}
			}
		}
		console.log('Total finds: ' + totalFinds);
	} finally {
		await client.close();
	}
}

main();