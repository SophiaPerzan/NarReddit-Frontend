import { adminDB } from './admin';

export async function fetchBackgroundVideos(userID: string) {
	const querySnapshot = await adminDB
		.collection('background-videos')
		.where('userID', '==', userID)
		.orderBy('creationDate', 'desc')
		.get();
	return querySnapshot.docs.map((doc) => {
		const data = doc.data();
		data.creationDate = data.creationDate.toDate();
		data.ID = doc.id;
		return data;
	});
}
