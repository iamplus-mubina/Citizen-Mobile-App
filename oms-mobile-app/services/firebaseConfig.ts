/**
 * Firebase Firestore helper — fetches the staging base URL.
 *
 * The Citizen app (staging) reads base_url from the Firestore 'mn' collection.
 * This is the SAME collection the OMS Flutter app uses, so changing base_url
 * in Firebase console immediately affects all staging devices on next launch.
 *
 * Firestore structure:
 *   Collection: mn
 *     └── (document with company_code: "citizen_staging")
 *           ├── base_url: "https://current-demo-api.digitaloms.in"
 *           └── company_code: "citizen_staging"
 *
 * To switch demo client:
 *   Firebase console → Firestore → mn → citizen_staging document → edit base_url → Save.
 *   No rebuild needed. App picks up the new URL on next launch.
 */

import firestore from '@react-native-firebase/firestore';

/** The company_code value that identifies the Citizen staging config document. */
const CITIZEN_STAGING_CODE = 'citizen_staging';

/**
 * Fetches the document from 'mn' collection where company_code == 'citizen_staging'
 * and returns its base_url field value.
 *
 * Returns null if document is not found or on network error.
 */
export async function fetchBaseUrlFromFirebase(): Promise<string | null> {
  try {
    const snapshot = await firestore()
      .collection('mn')
      .where('company_code', '==', CITIZEN_STAGING_CODE)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      const url = (data.base_url as string | undefined)?.trim().replace(/\/+$/, '');
      if (url) {
        console.log('[Firebase] Fetched base_url for citizen_staging:', url);
        return url;
      }
      console.warn('[Firebase] Document found but base_url is empty.');
    } else {
      console.warn(
        '[Firebase] No document found with company_code == "citizen_staging" in mn collection. ' +
        'Please create it in Firebase console.'
      );
    }
  } catch (err: any) {
    console.warn('[Firebase] Failed to fetch base_url from Firestore:', err?.message || err);
  }

  return null;
}
